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
const maxChunkChars = Number(process.env.I18N_TRANSLATION_CHUNK_CHARS || 10000);

if (!apiKey) {
  console.log("OPENAI_API_KEY or TRANSLATION_API_KEY is not set; skipping guide translation.");
  process.exit(0);
}

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

function extractOutputText(response) {
  if (typeof response.output_text === "string") return response.output_text;

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("")
    .trim();
}

function translationPrompt() {
  return "You are a precise technical translator. Translate Simplified Chinese Markdown into clear English. Preserve Markdown structure, headings, tables, lists, code fences, inline code, commands, filenames, paths, URLs, image links, HTML, front matter-like syntax, placeholders, product names, and version numbers. Do not add commentary. Return only translated Markdown.";
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

async function translateGuide(guide) {
  const sourceHash = sha256(guide.markdown);
  const paths = generatedPaths(guide);
  const existingMeta = await readJson(paths.meta);

  if (
    existingMeta?.sourceHash === sourceHash &&
    existingMeta?.model === model &&
    existingMeta?.locale === "en" &&
    existingMeta?.baseUrl === baseUrl &&
    existingMeta?.apiStyle === apiStyle
  ) {
    console.log(`i18n: ${guide.id} is up to date.`);
    return;
  }

  const chunks = splitMarkdown(guide.markdown);
  console.log(`i18n: translating ${guide.id} (${chunks.length} chunk${chunks.length === 1 ? "" : "s"}).`);
  const translatedChunks = [];
  for (let index = 0; index < chunks.length; index += 1) {
    translatedChunks.push(await translateWithRetry({
      guide,
      chunk: chunks[index],
      index,
      total: chunks.length,
    }));
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
    console.error("For OpenAI-compatible services, set OPENAI_BASE_URL and OPENAI_TRANSLATION_MODEL to values supported by that provider.");
    process.exit(1);
  }
}
