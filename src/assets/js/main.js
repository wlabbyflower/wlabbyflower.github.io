(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const baseUrl = body.dataset.baseUrl || "/";
  const locale = body.dataset.locale || "zh";
  let i18n = {};
  try {
    i18n = JSON.parse(body.dataset.i18n || "{}");
  } catch (error) {
    i18n = {};
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function t(key, variables = {}) {
    const value = i18n[key] || key;
    return Object.entries(variables).reduce(
      (result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)),
      value,
    );
  }

  function iconUrl(name) {
    return `${baseUrl.replace(/\/$/, "")}/assets/icons/${name}.svg`;
  }

  function siteUrl(url) {
    if (/^(https?:|mailto:|tel:)/.test(url)) return url;
    return `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fall through to the selection-based method when clipboard permission is denied.
      }
    }

    const previouslyFocused = document.activeElement;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.readOnly = true;
    textArea.setAttribute("aria-hidden", "true");
    textArea.style.position = "fixed";
    textArea.style.inset = "0 auto auto -9999px";
    textArea.style.opacity = "0";
    textArea.style.fontSize = "16px";
    body.appendChild(textArea);
    textArea.focus({ preventScroll: true });
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    textArea.remove();
    previouslyFocused?.focus?.({ preventScroll: true });
    return copied;
  }

  const header = document.querySelector("[data-site-header]");
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    const themeModes = ["auto", "light", "dark"];
    const themeLabels = {
      auto: t("themeAuto"),
      light: t("themeLight"),
      dark: t("themeDark"),
    };

    function updateThemeToggle() {
      const mode = root.dataset.themeMode || "auto";
      themeToggle.setAttribute("aria-label", themeLabels[mode]);
      themeToggle.title = themeLabels[mode];
    }

    updateThemeToggle();
    window.addEventListener("peppapigthemechange", updateThemeToggle);
    themeToggle.addEventListener("click", () => {
      const currentMode = root.dataset.themeMode || "auto";
      const nextMode = themeModes[(themeModes.indexOf(currentMode) + 1) % themeModes.length];
      window.peppaPigTheme?.setMode(nextMode);
    });
  }

  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const menuOpenButton = document.querySelector("[data-menu-open]");
  const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

  function setMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.inert = !open;
    body.classList.toggle("menu-open", open);
    if (open) mobileMenu.querySelector(".mobile-menu__panel a")?.focus();
    else menuOpenButton?.focus();
  }

  menuOpenButton?.addEventListener("click", () => setMenu(true));
  menuCloseButtons.forEach((button) => button.addEventListener("click", () => setMenu(false)));

  const searchDialog = document.querySelector("[data-search-dialog]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");
  const searchStatus = document.querySelector("[data-search-status]");
  let searchItems = null;

  async function loadSearch() {
    if (searchItems) return searchItems;
    const response = await fetch(body.dataset.searchUrl);
    if (!response.ok) throw new Error("Search index could not be loaded");
    searchItems = await response.json();
    return searchItems;
  }

  function normalize(value) {
    return String(value).toLocaleLowerCase(locale === "en" ? "en" : "zh-CN");
  }

  function scoreItem(item, terms) {
    const title = normalize(item.title);
    const platform = normalize(item.platform);
    const summary = normalize(item.summary);
    const text = normalize(item.text);
    let score = 0;

    for (const term of terms) {
      if (!text.includes(term) && !title.includes(term) && !summary.includes(term) && !platform.includes(term)) return 0;
      if (title.includes(term)) score += 8;
      if (title.startsWith(term)) score += 4;
      if (platform.includes(term)) score += 5;
      if (summary.includes(term)) score += 3;
      if (text.includes(term)) score += 1;
    }
    return score;
  }

  function renderSearch(items, query) {
    if (!searchResults || !searchStatus) return;
    const terms = normalize(query).split(/\s+/).filter(Boolean);

    if (!terms.length) {
      searchStatus.textContent = t("searchStart");
      searchResults.innerHTML = "";
      return;
    }

    const matches = items
      .map((item) => ({ item, score: scoreItem(item, terms) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    searchStatus.textContent = matches.length ? t("searchResults", { count: matches.length }) : t("searchNoResults");
    searchResults.innerHTML = matches
      .map(({ item }) => `
        <a class="search-result" href="${escapeHtml(siteUrl(item.url))}">
          <span class="search-result__meta">${escapeHtml(item.platform)} · ${escapeHtml(item.section)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.summary)}</small>
          <img class="icon" src="${iconUrl("chevron-right")}" alt="" width="18" height="18">
        </a>
      `)
      .join("");
  }

  async function openSearch() {
    if (!searchDialog) return;
    searchDialog.showModal();
    body.classList.add("dialog-open");
    searchInput?.focus();
    try {
      await loadSearch();
    } catch (error) {
      if (searchStatus) searchStatus.textContent = t("searchError");
    }
  }

  function closeSearch() {
    searchDialog?.close();
  }

  document.querySelectorAll("[data-search-open]").forEach((button) => button.addEventListener("click", openSearch));
  document.querySelector("[data-search-close]")?.addEventListener("click", closeSearch);
  searchDialog?.addEventListener("close", () => body.classList.remove("dialog-open"));
  searchDialog?.addEventListener("click", (event) => {
    if (event.target === searchDialog) closeSearch();
  });
  searchInput?.addEventListener("input", async (event) => {
    try {
      renderSearch(await loadSearch(), event.target.value);
    } catch (error) {
      if (searchStatus) searchStatus.textContent = t("searchError");
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (searchDialog?.open) closeSearch();
      else openSearch();
    }
  });

  const article = document.querySelector("[data-article-body]");
  if (article) {
    article.querySelectorAll("a[href^='http']").forEach((link) => {
      link.target = "_blank";
      link.rel = "noreferrer";
    });

    article.querySelectorAll("pre").forEach((pre) => {
      const wrapper = document.createElement("div");
      wrapper.className = "code-block";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy";
      button.title = t("copyCode");
      button.setAttribute("aria-label", t("copyCode"));

      const copyIcon = document.createElement("img");
      copyIcon.className = "code-copy__icon";
      copyIcon.src = iconUrl("copy");
      copyIcon.alt = "";
      copyIcon.width = 17;
      copyIcon.height = 17;

      const copyStatus = document.createElement("span");
      copyStatus.className = "sr-only";
      copyStatus.setAttribute("aria-live", "polite");
      button.append(copyIcon, copyStatus);

      let resetCopyState;
      function setCopyState(state, label) {
        window.clearTimeout(resetCopyState);
        button.classList.remove("is-copying", "is-copied", "is-copy-error");
        button.classList.add(`is-${state}`);
        button.title = label;
        button.setAttribute("aria-label", label);
        copyStatus.textContent = label;

        if (state === "copied" || state === "copy-error") {
          resetCopyState = window.setTimeout(() => {
            button.classList.remove("is-copied", "is-copy-error");
            button.title = t("copyCode");
            button.setAttribute("aria-label", t("copyCode"));
            copyIcon.src = iconUrl("copy");
            copyStatus.textContent = "";
          }, 1800);
        }
      }

      button.addEventListener("click", async () => {
        if (button.classList.contains("is-copying")) return;

        const code = (pre.querySelector("code")?.textContent || pre.textContent || "").replace(/\n$/, "");
        setCopyState("copying", t("copying"));
        button.setAttribute("aria-busy", "true");
        const copied = await copyText(code);
        button.removeAttribute("aria-busy");
        copyIcon.src = iconUrl(copied ? "check" : "copy");
        setCopyState(copied ? "copied" : "copy-error", copied ? t("copied") : t("copyFailed"));
      });
      wrapper.appendChild(button);
    });

    const headings = [...article.querySelectorAll("h2[id], h3[id]")];
    const tocTargets = [document.querySelector("[data-toc]"), document.querySelector("[data-toc-mobile]")].filter(Boolean);
    const tocMarkup = headings
      .map((heading) => `<a class="toc-link toc-link--${heading.tagName.toLowerCase()}" href="#${escapeHtml(heading.id)}">${escapeHtml(heading.textContent)}</a>`)
      .join("");
    tocTargets.forEach((target) => {
      target.innerHTML = tocMarkup || `<span class="toc-empty">${escapeHtml(t("tocEmpty"))}</span>`;
    });

    if ("IntersectionObserver" in window && headings.length) {
      const tocLinks = document.querySelectorAll("[data-toc] .toc-link");
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.find((entry) => entry.isIntersecting);
          if (!visible) return;
          tocLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${visible.target.id}`));
        },
        { rootMargin: "-18% 0px -72%", threshold: 0 },
      );
      headings.forEach((heading) => observer.observe(heading));
    }

    const progress = document.querySelector("[data-reading-progress]");
    function updateReadingProgress() {
      if (!progress) return;
      const bounds = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      const current = Math.min(Math.max(-bounds.top, 0), Math.max(total, 1));
      progress.style.transform = `scaleX(${current / Math.max(total, 1)})`;
    }
    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
  }

  const imageDialog = document.querySelector("[data-image-dialog]");
  const imagePreview = document.querySelector("[data-image-preview]");
  document.querySelectorAll(".article-body img:not(.code-copy__icon)").forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", image.alt ? t("enlargeImage", { alt: image.alt }) : t("enlargeImageEmpty"));
    const openImage = () => {
      if (!imageDialog || !imagePreview) return;
      imagePreview.src = image.currentSrc || image.src;
      imagePreview.alt = image.alt || t("imagePreview");
      imageDialog.showModal();
    };
    image.addEventListener("click", openImage);
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage();
      }
    });
  });
  document.querySelector("[data-image-close]")?.addEventListener("click", () => imageDialog?.close());
  imageDialog?.addEventListener("click", (event) => {
    if (event.target === imageDialog) imageDialog.close();
  });

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const revealItems = document.querySelectorAll(".section-heading, .path-item, .recommendation-section__copy, .deployment-link, .client-row, .library-row, .article-header");
    revealItems.forEach((item) => item.classList.add("reveal"));
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const ambientCanvas = document.querySelector("[data-ambient-canvas]");
  if (ambientCanvas) {
    const context = ambientCanvas.getContext("2d");
    const strands = Array.from({ length: 10 }, (_, index) => ({
      phase: index * 0.72,
      offset: (index - 4.5) * 0.038,
      speed: 0.00008 + index * 0.000004,
    }));
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame = 0;
    let palette = {};

    function readCanvasPalette() {
      const styles = getComputedStyle(root);
      palette = {
        line: styles.getPropertyValue("--canvas-line").trim(),
        lineStrong: styles.getPropertyValue("--canvas-line-strong").trim(),
        node: styles.getPropertyValue("--canvas-node").trim(),
      };
    }

    function resizeAmbientCanvas() {
      const bounds = ambientCanvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = Math.max(Math.round(bounds.width), 1);
      canvasHeight = Math.max(Math.round(bounds.height), 1);
      ambientCanvas.width = Math.round(canvasWidth * pixelRatio);
      ambientCanvas.height = Math.round(canvasHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function drawAmbientScene(timestamp = 0) {
      const time = reducedMotion.matches ? 0 : timestamp;
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      strands.forEach((strand, index) => {
        const motion = Math.sin(time * strand.speed + strand.phase) * canvasWidth * 0.018;
        const startX = canvasWidth * (0.58 + strand.offset) + motion;
        const middleX = canvasWidth * (0.76 + strand.offset * 0.45) - motion * 0.5;
        const endX = canvasWidth * (0.9 + strand.offset * 0.2) + motion * 0.25;
        context.lineWidth = index === 4 ? 1.4 : 1;
        context.strokeStyle = index === 4 ? palette.lineStrong : palette.line;
        context.beginPath();
        context.moveTo(startX, -40);
        context.bezierCurveTo(middleX, canvasHeight * 0.22, middleX - canvasWidth * 0.08, canvasHeight * 0.68, endX, canvasHeight + 40);
        context.stroke();
      });

      context.fillStyle = palette.node;
      for (let index = 0; index < 9; index += 1) {
        const progress = (index + 1) / 10;
        const x = canvasWidth * (0.64 + progress * 0.24) + Math.sin(time * 0.0001 + index) * 8;
        const y = canvasHeight * (0.12 + progress * 0.76);
        context.beginPath();
        context.arc(x, y, index === 4 ? 2.4 : 1.5, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion.matches) animationFrame = requestAnimationFrame(drawAmbientScene);
    }

    readCanvasPalette();
    resizeAmbientCanvas();
    drawAmbientScene();
    window.addEventListener("resize", () => {
      resizeAmbientCanvas();
      if (reducedMotion.matches) drawAmbientScene();
    });
    window.addEventListener("peppapigthemechange", () => {
      readCanvasPalette();
      if (reducedMotion.matches) drawAmbientScene();
    });
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(animationFrame);
      if (!document.hidden && !reducedMotion.matches) animationFrame = requestAnimationFrame(drawAmbientScene);
    });
  }
})();
