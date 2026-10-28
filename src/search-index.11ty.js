class SearchIndex {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ localizedGuides, localizedResources }) {
    const guideItems = localizedGuides
      .filter((guide) => !guide.hidden)
      .map((guide) => ({
        title: guide.title,
        summary: guide.summary,
        platform: guide.platform,
        section: guide.sectionLabel,
        url: guide.url,
        text: guide.searchText,
      }));

    const resourceItems = localizedResources.map((resource) => ({
      title: resource.title,
      summary: resource.summary,
      platform: resource.platform,
      section: "参考资源",
      url: resource.url,
      text: `${resource.title} ${resource.summary}`,
    }));

    return JSON.stringify([...guideItems, ...resourceItems]);
  }
}

module.exports = SearchIndex;
