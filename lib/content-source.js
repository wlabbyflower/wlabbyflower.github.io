const fs = require("node:fs");
const path = require("node:path");

const siteRoot = path.resolve(__dirname, "..");

function getSourceRepositoryRoot() {
  const configuredPath = process.env.GUIDE_SOURCE_DIR;
  const repositoryRoot = configuredPath
    ? path.resolve(configuredPath)
    : path.resolve(siteRoot, "..", "peppapigconfigurationguide");
  const docsRoot = path.join(repositoryRoot, "docs");

  if (!fs.existsSync(docsRoot)) {
    throw new Error(
      `Guide source not found at ${docsRoot}. Clone wlabbyflower/peppapigconfigurationguide beside this repository or set GUIDE_SOURCE_DIR.`,
    );
  }

  return repositoryRoot;
}

function getSourceDocsRoot() {
  return path.join(getSourceRepositoryRoot(), "docs");
}

module.exports = {
  getSourceDocsRoot,
  getSourceRepositoryRoot,
};
