const locales = [
  {
    key: "zh",
    code: "zh-CN",
    label: "中文",
    switchLabel: "English",
    homeUrl: "/",
    guidesUrl: "/guides/",
  },
  {
    key: "en",
    code: "en",
    label: "English",
    switchLabel: "中文",
    homeUrl: "/en/",
    guidesUrl: "/en/guides/",
  },
];

const translations = {
  zh: {
    siteTitle: "小猪佩奇配置指南",
    shortTitle: "小猪佩奇",
    siteDescription: "cat 代理部署、局域网共享与多平台客户端共存配置指南。",
    navHome: "首页",
    navGuides: "指南",
    navSource: "源码",
    navSearch: "搜索",
    navMenu: "导航",
    navAllGuides: "全部指南",
    navGithubSource: "GitHub 源码",
    languageSwitch: "English",
    skipToContent: "跳到正文",
    footerDescription: "cat 代理部署与客户端共存配置。",
    footerBrowse: "浏览指南",
    footerContribute: "参与维护",
    searchLabel: "搜索配置指南",
    searchPlaceholder: "搜索软件、平台或配置内容",
    searchStart: "输入关键词开始搜索",
    searchResults: "找到 {count} 个相关结果",
    searchNoResults: "没有找到相关内容",
    searchError: "搜索索引加载失败，请刷新页面重试。",
    searchClose: "关闭搜索",
    themeAuto: "主题：自动（北京时间日出日落）",
    themeLight: "主题：浅色",
    themeDark: "主题：深色",
    openMenu: "打开导航",
    closeMenu: "关闭导航",
    closeImage: "关闭图片",
    copyCode: "复制代码",
    copying: "正在复制",
    copied: "已复制",
    copyFailed: "复制失败",
    toc: "本页目录",
    tocAria: "章节目录",
    tocEmpty: "本页没有分节",
    previous: "上一篇",
    next: "下一篇",
    relatedDownloads: "相关下载",
    homeEyebrow: "PeppaPig Configuration Guide",
    homeTitle: "小猪佩奇<br>配置指南",
    homeSummary: "从 cat 内代理部署，到局域网共享与多平台客户端共存。",
    homePrimary: "配置 cat 代理",
    homeCrossPlatform: "cat 与本地 VPN 共存",
    homeSearch: "搜索指南",
    pathEyebrow: "配置路径",
    pathTitle: "从当前任务开始。",
    pathDescription: "部署代理、分享给局域网，或解决已有客户端与 cat 的网络冲突。",
    pathDeploy: "在 cat 内部署代理",
    pathDeploySmall: "PeppaPig 与 Clash 两种方案",
    pathLan: "共享代理到局域网",
    pathLanSmall: "端口分享、转发与连通验证",
    pathClients: "配置客户端共存",
    pathClientsSmall: "跨平台、iOS、Android 与 macOS",
    recommendationEyebrow: "推荐起点",
    recommendationTitle: "先让 cat 代理稳定运行。",
    recommendationDescription: "完成安装、订阅导入与代理模式设置后，再按需要开启局域网共享或配置客户端共存。",
    clientsEyebrow: "客户端共存",
    clientsTitle: "按你正在使用的软件查找。",
    viewAll: "查看全部",
    indexEyebrow: "完整索引",
    indexTitle: "所有配置文件与参考视频都已归档。",
    openLibrary: "打开指南库",
    breadcrumbHome: "首页",
    breadcrumbGuides: "指南",
    libraryEyebrow: "指南库",
    searchBody: "搜索正文",
    categoryPage: "指南分类页面",
    deploySection: "cat 内部署",
    clientsSection: "代理共存",
    resourcesSection: "参考资源",
    crossPlatformSection: "跨平台代理共存",
    crossPlatformPlatforms: "（macOS、Windows、安卓、Linux）",
    notFoundTitle: "这条配置路径不存在。",
    notFoundDescription: "返回指南库，或搜索你正在使用的客户端。",
    browseGuides: "浏览指南",
    guideNavigation: "指南导航",
    allGuides: "全部指南",
    mobileChapterNavigation: "移动端章节目录",
    adjacentGuides: "相邻指南",
    imagePreview: "教程图片预览",
    enlargeImage: "放大图片：{alt}",
    enlargeImageEmpty: "放大图片",
  },
  en: {
    siteTitle: "PeppaPig Configuration Guide",
    shortTitle: "PeppaPig",
    siteDescription: "Guides for cat proxy deployment, LAN sharing, and client coexistence across platforms.",
    navHome: "Home",
    navGuides: "Guides",
    navSource: "Source",
    navSearch: "Search",
    navMenu: "Menu",
    navAllGuides: "All guides",
    navGithubSource: "GitHub source",
    languageSwitch: "中文",
    skipToContent: "Skip to content",
    footerDescription: "cat proxy deployment and client coexistence configuration.",
    footerBrowse: "Browse guides",
    footerContribute: "Contribute",
    searchLabel: "Search configuration guides",
    searchPlaceholder: "Search software, platforms, or configuration",
    searchStart: "Enter a keyword to search",
    searchResults: "{count} related results",
    searchNoResults: "No matching content found",
    searchError: "The search index could not be loaded. Please refresh and try again.",
    searchClose: "Close search",
    themeAuto: "Theme: automatic (Beijing sunrise and sunset)",
    themeLight: "Theme: light",
    themeDark: "Theme: dark",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    closeImage: "Close image",
    copyCode: "Copy code",
    copying: "Copying",
    copied: "Copied",
    copyFailed: "Copy failed",
    toc: "On this page",
    tocAria: "Section navigation",
    tocEmpty: "No sections on this page",
    previous: "Previous",
    next: "Next",
    relatedDownloads: "Related downloads",
    homeEyebrow: "PeppaPig Configuration Guide",
    homeTitle: "PeppaPig<br>Configuration Guide",
    homeSummary: "Deploy a proxy inside cat, share it over your LAN, and keep clients working together.",
    homePrimary: "Configure cat proxy",
    homeCrossPlatform: "cat and local VPN coexistence",
    homeSearch: "Search guides",
    pathEyebrow: "Configuration paths",
    pathTitle: "Start with the task at hand.",
    pathDescription: "Deploy a proxy, share it on your LAN, or resolve conflicts with an existing client and cat.",
    pathDeploy: "Deploy inside cat",
    pathDeploySmall: "PeppaPig and Clash options",
    pathLan: "Share a proxy over the LAN",
    pathLanSmall: "Port sharing, forwarding, and connectivity checks",
    pathClients: "Configure client coexistence",
    pathClientsSmall: "Cross-platform, iOS, Android, and macOS",
    recommendationEyebrow: "Recommended starting point",
    recommendationTitle: "Get the cat proxy running reliably first.",
    recommendationDescription: "Install it, import a subscription, and choose a proxy mode before enabling LAN sharing or client coexistence.",
    clientsEyebrow: "Client coexistence",
    clientsTitle: "Find the software you are using.",
    viewAll: "View all",
    indexEyebrow: "Complete index",
    indexTitle: "All configuration files and reference videos are archived here.",
    openLibrary: "Open guide library",
    breadcrumbHome: "Home",
    breadcrumbGuides: "Guides",
    libraryEyebrow: "Guide library",
    searchBody: "Search guide text",
    categoryPage: "Guide categories",
    deploySection: "Deploy inside cat",
    clientsSection: "Client coexistence",
    resourcesSection: "Reference resources",
    crossPlatformSection: "Cross-platform coexistence",
    crossPlatformPlatforms: "(macOS, Windows, Android, Linux)",
    notFoundTitle: "This configuration path does not exist.",
    notFoundDescription: "Return to the guide library or search for the client you are using.",
    browseGuides: "Browse guides",
    guideNavigation: "Guide navigation",
    allGuides: "All guides",
    mobileChapterNavigation: "Mobile chapter navigation",
    adjacentGuides: "Adjacent guides",
    imagePreview: "Guide image preview",
    enlargeImage: "Enlarge image: {alt}",
    enlargeImageEmpty: "Enlarge image",
  },
};

const guideTranslations = {
  "peppapig-deploy": {
    title: "PeppaPig (v2rayA) deployment",
    shortTitle: "PeppaPig deployment",
    summary: "Install PeppaPig, import a subscription, choose transparent proxy mode, and verify the cat network.",
  },
  "clash-deploy": {
    title: "Clash deployment guide",
    shortTitle: "Clash deployment",
    summary: "Import nodes in cat, enable TUN, and use policy groups to establish the proxy connection.",
  },
  "clash-changelog": {
    title: "Clash deployment changelog",
    shortTitle: "Clash changelog",
    summary: "Historical changes for a deprecated version.",
  },
  "lan-sharing": {
    title: "Build a shared LAN proxy",
    shortTitle: "LAN proxy sharing",
    summary: "Share the cat proxy with devices on the same network through port sharing and forwarding.",
  },
  "clash-verge": {
    title: "Clash Verge coexistence configuration",
    summary: "Add direct-connection rules or a global extension script to avoid conflicts with cat domains.",
  },
  "sing-box": {
    title: "Sing-box 1.12 JSON configuration",
    summary: "Add routing rules, inline rule sets, and a SOCKS outbound so Sing-box coexists with cat.",
  },
  "v2ray-family": {
    title: "v2ray family coexistence configuration",
    shortTitle: "v2ray family",
    summary: "Adjust TUN, strict routing, and basic mode in v2rayN and v2rayA.",
  },
  hiddify: {
    title: "Hiddify coexistence configuration",
    summary: "Enable IPv6, disable strict routing, and verify both external access and cat domains.",
  },
  flclash: {
    title: "FlClash coexistence setup",
    shortTitle: "FlClash",
    summary: "Use override scripts on desktop and Android, and configure application access control.",
  },
  clashmi: {
    title: "ClashMi coexistence setup",
    summary: "Configure ClashMi across Windows, macOS, Linux, Android, and iOS.",
  },
  "ios-shadowrocket": {
    title: "iOS Shadowrocket coexistence configuration",
    shortTitle: "Shadowrocket",
    summary: "Switch Proxy mode and adjust Shadowrocket routing so the proxy and cat access work together.",
  },
  "ios-loon": {
    title: "iOS Loon coexistence configuration",
    summary: "Configure Loon proxy mode, IPv6, and split-routing rules while keeping cat direct.",
  },
  "ios-qx": {
    title: "iOS Quantumult X coexistence configuration",
    summary: "Configure Proxy mode, resource parsers, and routing on both cat and Quantumult X.",
  },
  "ios-stash-quick": {
    title: "iOS Stash Quick configuration",
    shortTitle: "Stash Quick",
    summary: "Quickly configure Stash and cat coexistence.",
  },
  "ios-stash": {
    title: "iOS Stash manual configuration",
    shortTitle: "Stash manual setup",
    summary: "Import a Stash configuration manually and handle cat network modes and routing.",
  },
  "ios-surge": {
    title: "iOS Surge coexistence configuration",
    summary: "Choose between a simplified and module-based configuration, then add subscriptions and policy groups.",
  },
  "macos-qx": {
    title: "macOS Quantumult X coexistence configuration",
    summary: "Use split-routing and compatibility enhancements, and handle QX proxy DNS behavior.",
  },
  "macos-shadowrocket": {
    title: "macOS Shadowrocket coexistence configuration",
    summary: "Edit bypass-proxy settings, TUN excluded routes, and real-IP rules in the default configuration.",
  },
  "macos-surge": {
    title: "macOS Surge coexistence configuration",
    summary: "Import the cat module and decide whether enhanced mode is needed for your IPv6 environment.",
  },
};

const guideViewTranslations = {
  all: {
    label: "All",
    title: "All guides",
    heading: "Find your configuration path.",
    description: "Browse guides for deployment inside cat, LAN sharing, and client coexistence across platforms.",
  },
  cat: {
    label: "cat",
    title: "cat deployment guides",
    heading: "Deploy a proxy inside cat.",
    description: "PeppaPig (v2rayA) and Clash deployment options inside cat.",
  },
  "cross-platform": {
    label: "Cross-platform",
    title: "Cross-platform coexistence guides",
    heading: "Configure cross-platform client coexistence.",
    description: "Keep desktop and mobile proxy clients stable alongside the cat VPN process.",
  },
  ios: {
    label: "iOS",
    title: "iOS coexistence guides",
    heading: "Configure iOS client coexistence.",
    description: "Adjust routing and network modes for iOS proxy clients while retaining cat access.",
  },
  macos: {
    label: "macOS",
    title: "macOS coexistence guides",
    heading: "Configure macOS client coexistence.",
    description: "Handle routing between macOS proxy clients and the cat VPN process.",
  },
};

const sectionTranslations = {
  deploy: "Deploy inside cat",
  clients: "Client coexistence",
};

const platformTranslations = {
  cat: "cat",
  "局域网": "LAN",
  "跨平台": "Cross-platform",
  iOS: "iOS",
  macOS: "macOS",
};

const resourceTranslations = {
  "nekobox-video": {
    title: "NekoBox reference video",
    summary: "Reference configuration video for NekoBox on Android.",
  },
};

function translate(key, locale = "zh", variables = {}) {
  const value = translations[locale]?.[key] || translations.zh[key] || key;
  return Object.entries(variables).reduce(
    (result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)),
    value,
  );
}

function localizeGuide(guide, locale = "zh") {
  if (locale === "zh") return guide;
  return {
    ...guide,
    ...(guideTranslations[guide.id] || {}),
    sourcePlatform: guide.platform,
    sectionLabel: sectionTranslations[guide.section] || guide.sectionLabel,
    platform: platformTranslations[guide.platform] || guide.platform,
    resources: guide.resources?.map((resource) => ({ ...resource })),
  };
}

function localizeGuideView(view, locale = "zh") {
  if (locale === "zh") return view;
  return {
    ...view,
    ...(guideViewTranslations[view.key] || {}),
    sourcePlatform: view.platform,
    platform: platformTranslations[view.platform] || view.platform,
  };
}

function localizeResource(resource, locale = "zh") {
  if (locale === "zh") return resource;
  return {
    ...resource,
    ...(resourceTranslations[resource.id] || {}),
    sourcePlatform: resource.platform,
    platform: platformTranslations[resource.platform] || resource.platform,
  };
}

module.exports = {
  locales,
  translations,
  guideTranslations,
  guideViewTranslations,
  translate,
  localizeGuide,
  localizeGuideView,
  localizeResource,
};
