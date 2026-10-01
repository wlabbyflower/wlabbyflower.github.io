import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const guides = require("../src/_data/guides");

const outputRoot = path.resolve("src/_generated/i18n/en/guides");
const model = process.env.OPENAI_TRANSLATION_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
const apiKey = process.env.OPENAI_API_KEY || process.env.TRANSLATION_API_KEY;
const baseUrl = (
  process.env.OPENAI_BASE_URL ||
  process.env.OPENAI_API_BASE ||
  process.env.TRANSLATION_BASE_URL ||
  "https://api.openai.com/v1"
).replace(/\/$/, "");
const apiStyle = process.env.OPENAI_TRANSLATION_API_STYLE || "chat";
const maxChunkChars = Number(process.env.I18N_TRANSLATION_CHUNK_CHARS || 4000);
const requireTranslation = process.env.REQUIRE_I18N_TRANSLATION === "true";
const translatorVersion = 3;

if (!apiKey) {
  const message = "OPENAI_API_KEY or TRANSLATION_API_KEY is not set.";
  if (requireTranslation) {
    console.error(`${message} Refusing to build untranslated I18N content.`);
    process.exit(1);
  }
  console.log(`${message} Skipping guide translation.`);
  process.exit(0);
}

console.log(`i18n: using ${apiStyle} API at ${baseUrl} with model ${model}.`);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function generatedPaths(guide) {
  return {
    markdown: path.join(outputRoot, `${guide.id}.md`),
    meta: path.join(outputRoot, `${guide.id}.json`),
  };
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    return null;
  }
}

function splitMarkdown(markdown) {
  const blocks = [];
  let current = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    current.push(line);

    if (!inFence && line.trim() === "") {
      blocks.push(current.join("\n"));
      current = [];
    }
  }

  if (current.length) blocks.push(current.join("\n"));

  const chunks = [];
  let chunk = "";
  for (const block of blocks) {
    if (chunk && chunk.length + block.length > maxChunkChars) {
      chunks.push(chunk.trimEnd());
      chunk = "";
    }
    chunk += block;
  }
  if (chunk.trim()) chunks.push(chunk.trimEnd());
  return chunks;
}

function splitMarkdownAggressively(markdown) {
  const chunks = [];
  let current = [];
  let inFence = false;

  function flush() {
    const value = current.join("\n").trimEnd();
    if (value.trim()) chunks.push(value);
    current = [];
  }

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    current.push(line);

    if (!inFence && line.trim() === "") flush();
    if (!inFence && current.join("\n").length > Math.max(1200, Math.floor(maxChunkChars / 2))) flush();
  }

  flush();
  return chunks;
}

function protectMarkdownSyntax(markdown) {
  const protectedValues = [];
  let protectedMarkdown = markdown;

  function protect(pattern) {
    protectedMarkdown = protectedMarkdown.replace(pattern, (match) => {
      const token = `I18N_KEEP_${protectedValues.length}`;
      protectedValues.push(match);
      return token;
    });
  }

  protect(/```[\s\S]*?```/g);
  protect(/<[^>\n]+>/g);
  protect(/!\[[^\]\n]*\]\([^)]+\)/g);
  protect(/\[[^\]\n]+\]\([^)]+\)/g);
  protect(/https?:\/\/[^\s)]+/g);
  protect(/`[^`\n]+`/g);

  return {
    markdown: protectedMarkdown,
    tokens: protectedValues.map((_, index) => `I18N_KEEP_${index}`),
    restore(translated) {
      for (const token of this.tokens) {
        if (!translated.includes(token)) {
          throw new Error(`Translation output is missing protected Markdown token ${token}.`);
        }
      }

      return protectedValues.reduce(
        (result, value, index) => result.replaceAll(`I18N_KEEP_${index}`, value),
        translated,
      );
    },
  };
}

function repairMarkdownBlocks(markdown) {
  return markdown
    .replace(/([^\n])\n(#{1,6}\s+)/g, "$1\n\n$2")
    .replace(/([^\n])\n(!\[[^\]\n]*\]\([^)]+\))/g, "$1\n\n$2")
    .replace(/([^\n])\n(<img\b[^>\n]*>)/g, "$1\n\n$2")
    .replace(/(<img\b[^>\n]*>)\n([^\n])/g, "$1\n\n$2")
    .replace(/([^\n])\n(<\/?(?:div|section|article|figure|table|ul|ol|li|p|blockquote)\b[^>\n]*>)/g, "$1\n\n$2")
    .replace(/(<\/?(?:div|section|article|figure|table|ul|ol|li|p|blockquote)\b[^>\n]*>)\n([^\n])/g, "$1\n\n$2");
}

function extractOutputText(response) {
  if (typeof response.output_text === "string") return response.output_text;

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("")
    .trim();
}

function translationPrompt() {
  return "You are a precise technical translator. Translate Simplified Chinese Markdown into clear English. Preserve Markdown structure, headings, tables, lists, commands, filenames, front matter-like syntax, product names, and version numbers. Do not change tokens like I18N_KEEP_0; copy them exactly. Do not add commentary. Return only translated Markdown.";
}

function chunkPrompt({ guide, chunk, index, total }) {
  return `Guide: ${guide.id}\nChunk: ${index + 1}/${total}\n\n${chunk}`;
}

async function requestChatTranslation(payload) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: translationPrompt(),
        },
        {
          role: "user",
          content: chunkPrompt(payload),
        },
      ],
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.error?.message || response.statusText;
    throw new Error(`Translation failed for ${payload.guide.id}: ${message}`);
  }

  const translated = body?.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error(`Translation returned empty output for ${payload.guide.id}.`);
  return translated;
}

async function requestResponsesTranslation(payload) {
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: translationPrompt() }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: chunkPrompt(payload) }],
        },
      ],
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.error?.message || response.statusText;
    throw new Error(`Translation failed for ${payload.guide.id}: ${message}`);
  }

  const translated = extractOutputText(body);
  if (!translated) throw new Error(`Translation returned empty output for ${payload.guide.id}.`);
  return translated;
}

async function requestTranslation(payload) {
  if (apiStyle === "responses") return requestResponsesTranslation(payload);
  return requestChatTranslation(payload);
}

async function translateWithRetry(payload) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await requestTranslation(payload);
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
  throw lastError;
}

async function translateChunk({ guide, chunk, index, total }) {
  const protectedChunk = protectMarkdownSyntax(chunk);
  if (!/[A-Za-z\u3400-\u9fff]/.test(protectedChunk.markdown.replace(/I18N_KEEP_\d+/g, ""))) {
    return repairMarkdownBlocks(chunk);
  }
  const translated = await translateWithRetry({
    guide,
    chunk: protectedChunk.markdown,
    index,
    total,
  });
  return repairMarkdownBlocks(protectedChunk.restore(translated));
}

async function translateGuide(guide) {
  const sourceHash = sha256(guide.markdown);
  const paths = generatedPaths(guide);
  const existingMeta = await readJson(paths.meta);

  if (
    existingMeta?.sourceHash === sourceHash &&
    existingMeta?.model === model &&
    existingMeta?.locale === "en" &&
    existingMeta?.baseUrl === baseUrl &&
    existingMeta?.apiStyle === apiStyle &&
    existingMeta?.translatorVersion === translatorVersion
  ) {
    console.log(`i18n: ${guide.id} is up to date.`);
    return;
  }

  const chunks = splitMarkdown(guide.markdown);
  console.log(`i18n: translating ${guide.id} (${chunks.length} chunk${chunks.length === 1 ? "" : "s"}).`);
  const translatedChunks = [];
  for (let index = 0; index < chunks.length; index += 1) {
    try {
      translatedChunks.push(await translateChunk({
        guide,
        chunk: chunks[index],
        index,
        total: chunks.length,
      }));
    } catch (error) {
      if (!/missing protected Markdown token/.test(error.message)) throw error;
      const smallerChunks = splitMarkdownAggressively(chunks[index]);
      console.log(
        `i18n: ${guide.id} chunk ${index + 1} lost protected tokens; retrying as ${smallerChunks.length} smaller chunks.`,
      );
      for (let smallIndex = 0; smallIndex < smallerChunks.length; smallIndex += 1) {
        translatedChunks.push(await translateChunk({
          guide,
          chunk: smallerChunks[smallIndex],
          index: smallIndex,
          total: smallerChunks.length,
        }));
      }
    }
  }

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(paths.markdown, `${translatedChunks.join("\n\n").trim()}\n`);
  await fs.writeFile(
    paths.meta,
    `${JSON.stringify({
      id: guide.id,
      locale: "en",
      model,
      baseUrl,
      apiStyle,
      translatorVersion,
      sourceHash,
      translatedAt: new Date().toISOString(),
    }, null, 2)}\n`,
  );
}

for (const guide of guides) {
  try {
    await translateGuide(guide);
  } catch (error) {
    console.error(error.message);
    if (/^Translation failed for /.test(error.message)) {
      console.error("For OpenAI-compatible services, set OPENAI_BASE_URL and OPENAI_TRANSLATION_MODEL to values supported by that provider.");
    }
    process.exit(1);
  }
}
