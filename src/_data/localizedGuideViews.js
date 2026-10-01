const guideViews = require("./guideViews");
const { locales, localizeGuideView } = require("./i18n");

module.exports = locales.flatMap((localeConfig) =>
  guideViews.map((view) => ({
    ...localizeGuideView(view, localeConfig.key),
    locale: localeConfig.key,
    sourcePlatform: view.platform,
    url: localeConfig.key === "zh" ? view.url : `/en${view.url}`,
  })),
);
