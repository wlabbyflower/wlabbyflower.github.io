const guideViews = require("./guideViews");

module.exports = guideViews.map((view) => ({
  ...view,
  locale: "zh",
  sourcePlatform: view.platform,
}));
