# 小猪佩奇配置指南

用 [Eleventy](https://www.11ty.dev/) 生成的静态教程站，收录 cat 内代理部署、局域网代理共享和多平台客户端共存配置。

教程 Markdown、图片、视频与下载资源都来自源仓库 [`wlabbyflower/peppapigconfigurationguide`](https://github.com/wlabbyflower/peppapigconfigurationguide)。本站仓库只维护页面结构、元数据、样式和构建流程，站点仅提供中文版本。

## 环境要求

- Node.js 22 或更高版本
- 源仓库与本仓库放在同一级目录：

```text
lazycat/
├── wlabbyflower.github.io/
└── peppapigconfigurationguide/
```

## 本地运行

首次使用先拉取源仓库及 Git LFS 文件：

```bash
git clone https://github.com/wlabbyflower/peppapigconfigurationguide.git ../peppapigconfigurationguide
git -C ../peppapigconfigurationguide lfs pull
```

安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

默认访问 `http://localhost:8080/`。Eleventy 会监听源仓库的 `docs/`，修改 Markdown 后自动重新构建。

源仓库不在默认位置时，通过环境变量指定：

```bash
GUIDE_SOURCE_DIR=/absolute/path/to/peppapigconfigurationguide npm run dev
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器并监听源文档变更 |
| `npm run build` | 构建到 `_site/` |
| `npm run clean` | 删除 `_site/` |

部署到 GitHub Pages 项目子路径时设置 `PATH_PREFIX`：

```bash
PATH_PREFIX=/repository-name/ npm run build
```

## 目录结构

```text
src/
├── _data/
│   ├── guides.js          指南元数据、源文件路径、下载资源
│   ├── guideViews.js      指南库分类页
│   ├── resources.json     独立参考资源
│   └── i18n.js            界面文案
├── _includes/
│   ├── layouts/           页面骨架与文章布局
│   ├── partials/          首页内容
│   └── components/        图标组件
├── guides/                指南库与文章模板
├── assets/                样式、脚本与图片
└── index.njk              首页
lib/content-source.js      解析源仓库位置
eleventy.config.js         构建配置与 Markdown 渲染
```

源仓库 `docs/` 会整体映射到站点的 `/downloads/`，因此 Markdown 中的附件链接可以直接使用。

## 维护内容

### 新增或调整指南

在 `src/_data/guides.js` 中添加条目，保持 `source` 指向源仓库内的 Markdown 文件：

```js
{
  id: "example-guide",
  source: "docs/03-客户端共存/Android/Example/README.md",
  url: "/guides/clients/android/example/",
  title: "示例配置",
  shortTitle: "示例",
  section: "clients",
  sectionLabel: "代理共存",
  platform: "Android",
  summary: "一句话说明这篇指南解决什么问题。",
  home: true // 可选：显示在首页
}
```

- 隐藏某篇指南：设置 `hidden: true`
- 文章顶部下载按钮：在条目中添加 `resources` 数组
- 指南库分类：在 `src/_data/guideViews.js` 中维护

### 文章内容

文章正文直接读取源仓库 Markdown，标题层级会生成右侧目录，代码块自带复制按钮，图片支持点击放大。本站不复制、不修改源文档。

## 部署

### GitHub Pages

`.github/workflows/deploy.yml` 在以下情况自动构建并发布：

- 推送到 `main`
- 手动触发
- 收到 `source-updated` repository dispatch
- 每周一 08:17（Asia/Shanghai）定时构建

工作流会检出站点仓库与源仓库（含 LFS），根据仓库名自动设置 `PATH_PREFIX`，构建后发布 `_site/`。在仓库设置中将 Pages 的 Source 设为 **GitHub Actions** 即可。

### Netlify PR 预览

`.github/workflows/netlify-preview.yml` 会在 PR 更新时构建站点，并发布预览链接到 PR 评论。需要在仓库 Secrets 中配置：

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`（Netlify 控制台中的 Project ID）

未配置时工作流会跳过 Netlify 部署，不影响构建。
