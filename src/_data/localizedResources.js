const resources = require("./resources.json");
const { locales, localizeResource } = require("./i18n");

module.exports = locales.flatMap((localeConfig) =>
  resources.map((resource) => ({
    ...localizeResource(resource, localeConfig.key),
    locale: localeConfig.key,
  })),
);
