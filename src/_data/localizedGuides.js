const guides = require("./guides");
const fs = require("node:fs");
const path = require("node:path");
const { locales, localizeGuide } = require("./i18n");
const manualGuideTranslations = require("./manualGuideTranslations");

function withLocaleUrl(url, locale) {
  return locale === "zh" ? url : `/en${url}`;
}

function translatedMarkdown(guide, locale) {
  if (locale === "zh") return guide.markdown;
  if (manualGuideTranslations[locale]?.[guide.id]) return manualGuideTranslations[locale][guide.id];
  const translationPath = path.resolve(__dirname, "..", "_generated", "i18n", locale, "guides", `${guide.id}.md`);
  if (!fs.existsSync(translationPath)) return guide.markdown;
  return fs.readFileSync(translationPath, "utf8");
}

module.exports = locales.flatMap((localeConfig) => {
  const localeGuides = guides.map((guide) => ({
    ...localizeGuide(guide, localeConfig.key),
    locale: localeConfig.key,
    localeCode: localeConfig.code,
    markdown: translatedMarkdown(guide, localeConfig.key),
    searchText: translatedMarkdown(guide, localeConfig.key),
    sourcePlatform: guide.platform,
    url: withLocaleUrl(guide.url, localeConfig.key),
  }));
  const visibleGuides = localeGuides.filter((guide) => !guide.hidden);

  return localeGuides.map((guide) => {
    const visibleIndex = visibleGuides.findIndex((item) => item.id === guide.id);
    return {
      ...guide,
      previous: visibleIndex > 0 ? visibleGuides[visibleIndex - 1] : null,
      next:
        visibleIndex >= 0 && visibleIndex < visibleGuides.length - 1
          ? visibleGuides[visibleIndex + 1]
          : null,
    };
  });
});
