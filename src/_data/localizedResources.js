const resources = require("./resources.json");

module.exports = resources.map((resource) => ({
  ...resource,
  locale: "zh",
  sourcePlatform: resource.platform,
}));
