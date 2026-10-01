class SearchIndex {
  data() {
    return {
      pagination: {
        data: "locales",
        size: 1,
        alias: "localeConfig",
      },
      permalink: (data) => (data.localeConfig.key === "zh" ? "/search-index.json" : "/en/search-index.json"),
      eleventyExcludeFromCollections: true,
    };
  }

  render({ localizedGuides, localizedResources, localeConfig }) {
    const guideItems = localizedGuides
      .filter((guide) => guide.locale === localeConfig.key)
      .filter((guide) => !guide.hidden)
      .map((guide) => ({
        title: guide.title,
        summary: guide.summary,
        platform: guide.platform,
        section: guide.sectionLabel,
        url: guide.url,
        text: guide.searchText,
      }));

    const resourceItems = localizedResources
      .filter((resource) => resource.locale === localeConfig.key)
      .map((resource) => ({
      title: resource.title,
      summary: resource.summary,
      platform: resource.platform,
      section: localeConfig.key === "zh" ? "参考资源" : "Reference resources",
      url: resource.url,
      text: `${resource.title} ${resource.summary}`,
    }));

    return JSON.stringify([...guideItems, ...resourceItems]);
  }
}

module.exports = SearchIndex;
