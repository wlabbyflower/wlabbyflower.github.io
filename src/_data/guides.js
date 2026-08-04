const fs = require("node:fs");
const path = require("node:path");
const { getSourceRepositoryRoot } = require("../../lib/content-source");

const guideDefinitions = [
  {
    id: "peppapig-deploy",
    source: "docs/01-微服内代理部署/PeppaPigConfigurationGuide/PeppaPigConfigurationGuide.md",
    url: "/guides/deploy/peppapig/",
    title: "PeppaPig (v2rayA)部署",
    shortTitle: "PeppaPig 部署",
    section: "deploy",
    sectionLabel: "cat 内部署",
    platform: "懒猫微服",
    summary: "安装 PeppaPig、导入订阅、选择透明代理方式并验证 cat 网络。",
    featured: true,
    stripLeadingHeading: true,
    resources: [
      {
        label: "下载 PeppaPig.lpk",
        type: "LPK",
        url: "/downloads/01-微服内代理部署/PeppaPigConfigurationGuide/PeppaPig.lpk"
      }
    ]
  },
  {
    id: "clash-deploy",
    source: "docs/01-微服内代理部署/PeppaPigConfigurationGuide/clash部署教程.md",
    url: "/guides/deploy/clash/",
    title: "Clash部署教程",
    shortTitle: "Clash 部署",
    section: "deploy",
    sectionLabel: "cat 内部署",
    platform: "懒猫微服",
    summary: "在 cat 中导入节点、开启 TUN，并使用策略组完成代理连接。",
    featured: true,
    stripLeadingHeading: true
  },
  {
    id: "clash-changelog",
    source: "docs/01-微服内代理部署/PeppaPigConfigurationGuide/clash部署教程-更新日志.md",
    url: "/guides/deploy/clash/changelog/",
    title: "Clash 部署教程更新日志",
    shortTitle: "Clash 更新日志",
    section: "deploy",
    sectionLabel: "cat 内部署",
    platform: "懒猫微服",
    summary: "已废弃版本的历史变更记录。",
    hidden: true,
    stripLeadingHeading: true
  },
  {
    id: "lan-sharing",
    source: "docs/02-局域网代理共享/构建内网代理方法：配置代理为微服所在局域网可访问.md",
    url: "/guides/lan/port-sharing/",
    title: "构建局域网共享代理",
    shortTitle: "局域网共享代理",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "局域网",
    summary: "通过端口分享与局域网端口转发，让同一网络内的设备复用微服代理。",
    featured: true,
    stripLeadingHeading: true
  },
  {
    id: "clash-verge",
    source: "docs/03-客户端共存/cross-platform/clash/clashverge.md",
    url: "/guides/clients/clash-verge/",
    title: "Clash Verge 共存配置",
    shortTitle: "Clash Verge",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "跨平台",
    summary: "为 Clash 系客户端添加直连规则或全局扩展脚本，避免微服域名冲突。",
    home: true
  },
  {
    id: "sing-box",
    source: "docs/03-客户端共存/cross-platform/singbox/singbox.json配置.md",
    url: "/guides/clients/sing-box/",
    title: "Sing-box 1.12 JSON 配置",
    shortTitle: "Sing-box",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "跨平台",
    summary: "添加路由规则、内联规则集与 SOCKS 出站，让 Sing-box 与微服共存。",
    home: true,
    resources: [
      {
        label: "下载示例 JSON",
        type: "JSON",
        url: "/downloads/03-客户端共存/cross-platform/singbox/singbox示例.json"
      }
    ]
  },
  {
    id: "v2ray-family",
    source: "docs/03-客户端共存/cross-platform/v2ray系列/v2ray系列.md",
    url: "/guides/clients/v2ray/",
    title: "v2ray 系列共存配置",
    shortTitle: "v2ray 系列",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "跨平台",
    summary: "调整 v2rayN 与 v2rayA 的 TUN、严格路由和基础模式。"
  },
  {
    id: "hiddify",
    source: "docs/03-客户端共存/cross-platform/Hiddify/Hiddify.md",
    url: "/guides/clients/hiddify/",
    title: "Hiddify 共存配置",
    shortTitle: "Hiddify",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "跨平台",
    summary: "启用 IPv6、关闭严格路由，并验证外网与微服域名同时可用。",
    home: true,
    stripLeadingHeading: true
  },
  {
    id: "flclash",
    source: "docs/03-客户端共存/cross-platform/Flclash/Flclash.md",
    url: "/guides/clients/flclash/",
    title: "FlClash 共存方案",
    shortTitle: "FlClash",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "跨平台",
    summary: "在桌面与 Android 端使用覆写脚本，并配置应用访问控制。",
    home: true,
    stripLeadingHeading: true,
    resources: [
      {
        label: "下载覆写脚本",
        type: "JS",
        url: "/downloads/03-客户端共存/cross-platform/Flclash/flclash_script.js"
      }
    ]
  },
  {
    id: "clashmi",
    source: "docs/03-客户端共存/cross-platform/ClashMi/ClashMi.md",
    url: "/guides/clients/clashmi/",
    title: "ClashMi 共存方案",
    shortTitle: "ClashMi",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "跨平台",
    summary: "覆盖 Windows、macOS、Linux、Android 与 iOS 的 ClashMi 配置流程。",
    stripLeadingHeading: true,
    resources: [
      {
        label: "下载覆写脚本",
        type: "JS",
        url: "/downloads/03-客户端共存/cross-platform/ClashMi/clashmi_script.js"
      }
    ]
  },
  {
    id: "ios-shadowrocket",
    source: "docs/03-客户端共存/iOS/iOS小火箭配置/iOS端小火箭与cat配置共存.md",
    url: "/guides/clients/ios/shadowrocket/",
    title: "iOS 小火箭共存配置",
    shortTitle: "小火箭",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "iOS",
    summary: "切换 Proxy 模式并调整小火箭路由，让代理与微服访问同时生效。",
    home: true,
    stripLeadingHeading: true,
    resources: [
      {
        label: "基础配置视频",
        type: "MP4",
        url: "/downloads/03-客户端共存/iOS/iOS小火箭配置/iOS-小火箭.mp4"
      },
      {
        label: "域名访问视频",
        type: "MP4",
        url: "/downloads/03-客户端共存/iOS/iOS小火箭配置/小火箭开启后可以域名访问.mp4"
      }
    ]
  },
  {
    id: "ios-loon",
    source: "docs/03-客户端共存/iOS/ios端Loon/Loon配置共存教程.md",
    url: "/guides/clients/ios/loon/",
    title: "iOS Loon 共存配置",
    shortTitle: "Loon",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "iOS",
    summary: "配置 Loon 的代理模式、IPv6 与分流规则，保持微服直连。",
    stripLeadingHeading: true
  },
  {
    id: "ios-qx",
    source: "docs/03-客户端共存/iOS/iOSqx配置/iOSqx.md",
    url: "/guides/clients/ios/quantumult-x/",
    title: "iOS Quantumult X 共存配置",
    shortTitle: "Quantumult X",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "iOS",
    summary: "从微服与 QX 两侧完成 Proxy 模式、资源解析器和路由配置。"
  },
  {
    id: "ios-stash-quick",
    source: "docs/03-客户端共存/iOS/iOSstash配置/iOSQuickStash.md",
    url: "/guides/clients/ios/stash-quick/",
    title: "iOS Stash Quick 配置",
    shortTitle: "Stash Quick",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "iOS",
    summary: "使用 Quick 配置快速完成 Stash 与懒猫微服共存。",
    stripLeadingHeading: true
  },
  {
    id: "ios-stash",
    source: "docs/03-客户端共存/iOS/iOSstash配置/iOS端stash与cat配置共存.md",
    url: "/guides/clients/ios/stash/",
    title: "iOS Stash 手动配置",
    shortTitle: "Stash 手动配置",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "iOS",
    summary: "手动导入 Stash 配置，并处理微服网络模式与路由。",
    stripLeadingHeading: true,
    resources: [
      {
        label: "下载 Stash 配置",
        type: "STASH",
        url: "/downloads/03-客户端共存/iOS/iOSstash配置/lzc.stash"
      },
      {
        label: "查看配置视频",
        type: "MP4",
        url: "/downloads/03-客户端共存/iOS/iOSstash配置/stash.mp4"
      }
    ]
  },
  {
    id: "ios-surge",
    source: "docs/03-客户端共存/iOS/iOSsurge配置/README.md",
    url: "/guides/clients/ios/surge/",
    title: "iOS Surge 共存配置",
    shortTitle: "Surge",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "iOS",
    summary: "在懒人配置与模块配置之间选择，并补充订阅与策略组。",
    home: true,
    resources: [
      {
        label: "下载 Surge 配置",
        type: "CONF",
        url: "/downloads/03-客户端共存/iOS/iOSsurge配置/Surge.conf"
      },
      {
        label: "下载 Surge 模块",
        type: "MODULE",
        url: "/downloads/03-客户端共存/iOS/iOSsurge配置/Lazycat_ios.sgmodule"
      }
    ]
  },
  {
    id: "macos-qx",
    source: "docs/03-客户端共存/macOS/macos端QX配置/macos端QX配置.md",
    url: "/guides/clients/macos/quantumult-x/",
    title: "macOS Quantumult X 共存配置",
    shortTitle: "Quantumult X",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "macOS",
    summary: "使用规则分流与兼容性增强，并处理 QX 代理 DNS 的情况。"
  },
  {
    id: "macos-shadowrocket",
    source: "docs/03-客户端共存/macOS/macos端shadowrocket（小火箭）/shadowrocket.md",
    url: "/guides/clients/macos/shadowrocket/",
    title: "macOS Shadowrocket 共存配置",
    shortTitle: "Shadowrocket",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "macOS",
    summary: "编辑默认配置中的跳过代理、TUN 排除路由和真实 IP 规则。",
    stripLeadingHeading: true
  },
  {
    id: "macos-surge",
    source: "docs/03-客户端共存/macOS/macos端surge/surge.md",
    url: "/guides/clients/macos/surge/",
    title: "macOS Surge 共存配置",
    shortTitle: "Surge",
    section: "clients",
    sectionLabel: "代理共存",
    platform: "macOS",
    summary: "导入微服模块，根据 IPv6 环境决定是否启用增强模式。",
    stripLeadingHeading: true,
    resources: [
      {
        label: "下载 Surge 模块",
        type: "MODULE",
        url: "/downloads/03-客户端共存/macOS/macos端surge/Lazycat.sgmodule"
      }
    ]
  }
];

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeBrandText(value) {
  return String(value)
    .replace(/懒猫微服/g, "cat")
    .replace(/懒猫智慧屏/g, "cat")
    .replace(/微服/g, "cat");
}

const sourceRepositoryRoot = getSourceRepositoryRoot();
const normalizedGuides = guideDefinitions.map((guide) => ({
  ...guide,
  title: normalizeBrandText(guide.title),
  shortTitle: normalizeBrandText(guide.shortTitle),
  sectionLabel: normalizeBrandText(guide.sectionLabel),
  platform: normalizeBrandText(guide.platform),
  summary: normalizeBrandText(guide.summary),
  resources: guide.resources?.map((resource) => ({
    ...resource,
    label: normalizeBrandText(resource.label),
  })),
}));
const visibleGuides = normalizedGuides.filter((guide) => !guide.hidden);

module.exports = normalizedGuides.map((guide) => {
  const markdownPath = path.join(sourceRepositoryRoot, ...guide.source.split("/"));
  const markdown = fs.readFileSync(markdownPath, "utf8");
  const visibleIndex = visibleGuides.findIndex((item) => item.id === guide.id);

  return {
    ...guide,
    markdown,
    displayIndex: visibleIndex >= 0 ? visibleIndex + 1 : null,
    searchText: normalizeBrandText(stripMarkdown(markdown)),
    previous: visibleIndex > 0 ? visibleGuides[visibleIndex - 1] : null,
    next:
      visibleIndex >= 0 && visibleIndex < visibleGuides.length - 1
        ? visibleGuides[visibleIndex + 1]
        : null,
  };
});
