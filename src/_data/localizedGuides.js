const guides = require("./guides");

module.exports = guides.map((guide) => ({
  ...guide,
  locale: "zh",
  localeCode: "zh-CN",
  sourcePlatform: guide.platform,
}));
