const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const path = require("node:path");
const { getSourceDocsRoot } = require("./lib/content-source");

const icons = [
  "arrow-right",
  "book-open",
  "check",
  "chevron-left",
  "chevron-right",
  "clipboard",
  "download",
  "external-link",
  "menu",
  "moon",
  "search",
  "sun",
  "sun-moon",
  "x",
];

function slugify(value) {
  const slug = String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u3400-\u9fff-]/g, "")
    .replace(/-+/g, "-");

  if (!slug) return "section";
  return /^\d/.test(slug) ? `section-${slug}` : slug;
}

function normalizeBrandText(value) {
  return String(value)
    .replace(/懒猫微服/g, "cat")
    .replace(/懒猫智慧屏/g, "cat")
    .replace(/微服/g, "cat");
}

function withPathPrefix(value) {
  const pathPrefix = process.env.PATH_PREFIX || "/";
  if (pathPrefix === "/") return value.startsWith("/") ? value : `/${value}`;
  return `${pathPrefix.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}

module.exports = function (eleventyConfig) {
  const sourceDocsRoot = getSourceDocsRoot();
  const guides = require("./src/_data/guides");
  const guideUrlBySource = new Map(guides.map((guide) => [guide.source, guide.url]));
  const markdownLibrary = markdownIt({
    html: true,
    linkify: true,
    typographer: false,
  }).use(markdownItAnchor, {
    slugify,
    tabIndex: false,
  });

  function rewriteGuideUrl(value, environment) {
    if (!value || !environment?.guide) return value;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) return value;
    if (value.startsWith("/")) return withPathPrefix(value);

    const match = value.match(/^([^?#]*)([?#].*)?$/);
    const encodedPath = match?.[1] || value;
    const suffix = match?.[2] || "";
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(encodedPath);
    } catch (error) {
      decodedPath = encodedPath;
    }

    const resolvedSource = path.posix.normalize(
      path.posix.join(path.posix.dirname(environment.guide.source), decodedPath),
    );
    if (resolvedSource.startsWith("../")) return value;

    if (/\.md$/i.test(resolvedSource) && guideUrlBySource.has(resolvedSource)) {
      return `${withPathPrefix(guideUrlBySource.get(resolvedSource))}${suffix}`;
    }

    return `${withPathPrefix(`/downloads/${resolvedSource.replace(/^docs\//, "")}`)}${suffix}`;
  }

  function wrapMarkdownUrlRule(ruleName, attributeName) {
    const defaultRule = markdownLibrary.renderer.rules[ruleName];
    markdownLibrary.renderer.rules[ruleName] = (tokens, index, options, environment, renderer) => {
      const currentValue = tokens[index].attrGet(attributeName);
      if (currentValue) tokens[index].attrSet(attributeName, rewriteGuideUrl(currentValue, environment));
      return defaultRule
        ? defaultRule(tokens, index, options, environment, renderer)
        : renderer.renderToken(tokens, index, options);
    };
  }

  wrapMarkdownUrlRule("link_open", "href");
  wrapMarkdownUrlRule("image", "src");

  eleventyConfig.setLibrary("md", markdownLibrary);
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ [sourceDocsRoot]: "downloads" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/suncalc/suncalc.js": "assets/vendor/suncalc.js",
  });
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  eleventyConfig.addWatchTarget(sourceDocsRoot);

  for (const icon of icons) {
    eleventyConfig.addPassthroughCopy({
      [`node_modules/lucide-static/icons/${icon}.svg`]: `assets/icons/${icon}.svg`,
    });
  }

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("renderGuideMarkdown", (guide) =>
    markdownLibrary.render(guide.markdown, { guide }),
  );
  eleventyConfig.addFilter("guideById", (guides, id) =>
    guides.find((guide) => guide.id === id),
  );
  eleventyConfig.addFilter("stripLeadingHeading", (html) =>
    String(html).replace(/^\s*<h[12][^>]*>[\s\S]*?<\/h[12]>\s*/i, ""),
  );
  eleventyConfig.addTransform("cleanHtml", function (content) {
    if (!/^\s*<!doctype html>/i.test(content)) return content;

    return content
      .replace(/^<!doctype html>/i, "<!DOCTYPE html>")
      .replace(/<img\b([^>]*?)\s*\/>/gi, "<img$1>")
      .replace(/<img\b(?![^>]*\balt=)([^>]*)>/gi, '<img$1 alt="">')
      .replace(/\sstyle="zoom:[^"]*"/gi, "")
      .replace(/>([^<]+)</g, (match, text) => `>${normalizeBrandText(text)}<`)
      .replace(/[ \t]+$/gm, "");
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "11ty.js"],
  };
};
