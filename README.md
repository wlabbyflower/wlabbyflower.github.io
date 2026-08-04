# 小猪佩奇配置指南站点

这是 `peppapigconfigurationguide` 的 Eleventy 静态前端。教程 Markdown 和下载资源直接读取源仓库，本站仓库只维护页面结构、元数据、样式和构建流程。

## 本地运行

需要 Node.js 22 或更高版本，并将源仓库放在本站仓库的同级目录：

```text
lazycat/
├── githubio-peppapigconfigurationguide/
└── peppapigconfigurationguide/
```

首次使用先准备源仓库及 LFS 文件：

```bash
git clone https://github.com/wlabbyflower/peppapigconfigurationguide.git ../peppapigconfigurationguide
git -C ../peppapigconfigurationguide lfs pull
```

然后启动站点：

```bash
npm install
npm run dev
```

默认访问地址为 `http://localhost:8080/`。

Eleventy 会监听源仓库的 `docs/`。本地修改源 Markdown 后，开发服务器会重新构建。源仓库不在默认同级位置时，设置：

```bash
GUIDE_SOURCE_DIR=/absolute/path/to/peppapigconfigurationguide npm run dev
```

## 构建

```bash
npm run build
```

构建产物输出到 `_site/`。如部署到 GitHub Pages 的项目子路径，可设置：

```bash
PATH_PREFIX=/repository-name/ GUIDE_SOURCE_DIR=../peppapigconfigurationguide npm run build
```

## GitHub Pages

`.github/workflows/deploy.yml` 会在 `main` 分支推送后自动：

1. 检出当前站点仓库。
2. 检出 `wlabbyflower/peppapigconfigurationguide` 的 `main` 分支和 Git LFS 文件。
3. 根据仓库名设置 Pages 路径前缀。
4. 从源仓库构建 Eleventy 站点。
5. 发布 `_site/` 到 GitHub Pages。

在仓库设置中将 Pages 的 Source 设为 **GitHub Actions** 即可。

工作流每 6 小时检查并构建一次最新源文档，也支持 `source-updated` repository dispatch。若站点仓库命名为 `<用户名>.github.io`，会自动使用根路径；其他仓库名会自动使用项目子路径。

## 内容维护

- 教程原文：同级源仓库 `../peppapigconfigurationguide/docs/`
- 页面元数据与固定 URL：`src/_data/guides.js`
- 页面模板：`src/_includes/`
- 样式与交互：`src/assets/`
- 原始脚本、配置、视频与 LPK 会从源仓库 `docs/` 映射到站点的 `/downloads/`。
