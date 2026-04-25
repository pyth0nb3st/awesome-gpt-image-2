import { readFile, writeFile } from "node:fs/promises";
import {
  SITE_URL,
  REPO_URL,
  DRILL_URL,
  VIBEART_URL,
  absoluteUrl,
  buildSeoDescription,
  buildJsonLd,
  cleanTitle,
  displayTags,
  escapeAttribute,
  escapeHtml,
  promptPagePath,
  promptExcerpt,
  tagPagePath,
  tagCounts,
} from "./gallery-utils.mjs";

const data = JSON.parse(await readFile(new URL("../gallery.json", import.meta.url), "utf8"));
const counts = tagCounts(data.images);
const indexableTags = new Set(counts.filter(([, count]) => count >= 2).map(([tag]) => tag));
const topTags = counts.slice(0, 24);
const heroImage = data.images[0];
const seoDescription = buildSeoDescription(data.images);
const updated = new Date().toISOString().slice(0, 10);
const INITIAL_IMAGE_COUNT = 12;
const IMAGE_BATCH_SIZE = 12;

const tagCloud = topTags
  .map(
    ([tag, count]) =>
      `<button type="button" class="tag-filter" data-tag="${escapeAttribute(tag)}">${escapeHtml(tag)} <span>${count}</span></button>`,
  )
  .join("\n          ");

const cards = data.images
  .map((image, index) => {
    const title = cleanTitle(image, index);
    const tags = displayTags(image);
    const pagePath = promptPagePath(image, index);
    const tagList = tags
      .map((tag) => {
        const label = escapeHtml(tag);
        return indexableTags.has(tag)
          ? `<li><a href="${escapeAttribute(tagPagePath(tag))}">${label}</a></li>`
          : `<li>${label}</li>`;
      })
      .join("\n                ");
    const search = [title, image.caption, image.prompt, ...tags].join(" ").toLowerCase();

    const imageSource =
      index < INITIAL_IMAGE_COUNT
        ? `src="${escapeAttribute(image.path)}"`
        : `data-src="${escapeAttribute(image.path)}"`;

    return `        <article class="card${index >= INITIAL_IMAGE_COUNT ? " is-deferred" : ""}" id="prompt-${index + 1}" data-search="${escapeAttribute(search)}" data-tags="${escapeAttribute(tags.join(" "))}">
          <a class="image-link" href="${escapeAttribute(image.path)}" data-modal-image data-title="${escapeAttribute(title)}" data-caption="${escapeAttribute(image.caption)}" aria-label="Open image preview for ${escapeAttribute(title)}">
            <img loading="${index < 3 ? "eager" : "lazy"}" ${index === 0 ? 'fetchpriority="high"' : ""} ${imageSource} alt="${escapeAttribute(`${title}. Tags: ${tags.join(", ")}.`)}" width="${image.width}" height="${image.height}" />
          </a>
          <div class="content">
            <div class="eyebrow">#${String(index + 1).padStart(2, "0")} · ${escapeHtml(image.createdAt ?? "historical")}</div>
            <h2><a class="title-link" href="${escapeAttribute(pagePath)}">${escapeHtml(title)}</a></h2>
            <p class="caption">${escapeHtml(image.caption)}</p>
            <ul class="tags">
              ${tagList}
            </ul>
            <a class="detail-link" href="${escapeAttribute(pagePath)}">Open prompt page</a>
            <details>
              <summary>Prompt</summary>
              <pre>${escapeHtml(image.prompt)}</pre>
            </details>
          </div>
        </article>`;
  })
  .join("\n\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Awesome GPT Image 2 Prompts & Use Cases Gallery</title>
    <meta name="description" content="${escapeAttribute(seoDescription)}" />
    <meta name="keywords" content="GPT Image 2 prompts, image generation prompts, AI image gallery, GPT image use cases, product mockup prompts, UI mockup prompts, prompt engineering examples" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:180" />
    <meta name="author" content="pyth0nb3st" />
    <link rel="canonical" href="${SITE_URL}" />
    <link rel="sitemap" type="application/xml" href="sitemap.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Awesome GPT Image 2" />
    <meta property="og:title" content="Awesome GPT Image 2 Prompts & Use Cases" />
    <meta property="og:description" content="${escapeAttribute(seoDescription)}" />
    <meta property="og:url" content="${SITE_URL}" />
    <meta property="og:image" content="${escapeAttribute(absoluteUrl(heroImage.path))}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Awesome GPT Image 2 Prompts & Use Cases" />
    <meta name="twitter:description" content="${escapeAttribute(seoDescription)}" />
    <meta name="twitter:image" content="${escapeAttribute(absoluteUrl(heroImage.path))}" />
    <script type="application/ld+json">${JSON.stringify(buildJsonLd(data))}</script>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f0e6;
        --ink: #171512;
        --muted: #655f53;
        --line: #d3c8b5;
        --panel: #fffaf0;
        --paper: #fdf7ea;
        --accent: #006b5f;
        --accent-2: #a04212;
        --accent-3: #214f9a;
        --code: #14231f;
      }

      * { box-sizing: border-box; }

      html { scroll-behavior: smooth; }

      body {
        margin: 0;
        background:
          linear-gradient(90deg, rgba(23, 21, 18, 0.045) 1px, transparent 1px),
          linear-gradient(180deg, rgba(23, 21, 18, 0.035) 1px, transparent 1px),
          var(--bg);
        background-size: 34px 34px;
        color: var(--ink);
        font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
        line-height: 1.55;
      }

      body.modal-open {
        overflow: hidden;
      }

      a { color: inherit; }

      .skip-link {
        position: absolute;
        left: 12px;
        top: -80px;
        background: var(--ink);
        color: var(--panel);
        padding: 10px 12px;
        z-index: 10;
      }

      .skip-link:focus { top: 12px; }

      main {
        width: min(1240px, calc(100% - 32px));
        margin: 0 auto;
        padding: 42px 0 64px;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(300px, 0.42fr);
        gap: clamp(24px, 5vw, 58px);
        align-items: end;
        padding-bottom: 30px;
        border-bottom: 2px solid var(--ink);
      }

      .kicker {
        display: inline-flex;
        width: fit-content;
        border: 1px solid var(--ink);
        padding: 5px 8px;
        background: var(--panel);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      h1 {
        max-width: 900px;
        margin: 18px 0 0;
        font-size: clamp(42px, 8vw, 104px);
        line-height: 0.88;
        letter-spacing: 0;
      }

      .summary {
        max-width: 780px;
        margin: 22px 0 0;
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 17px;
      }

      .hero-links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
        font-family: ui-sans-serif, system-ui, sans-serif;
      }

      .hero-links a {
        border: 1px solid var(--ink);
        background: var(--panel);
        padding: 8px 10px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 800;
      }

      .repo-strip {
        width: fit-content;
        max-width: 100%;
        margin-top: 12px;
        border-left: 4px solid var(--accent);
        background: var(--panel);
        padding: 9px 12px;
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
        font-weight: 700;
        word-break: break-word;
      }

      .repo-strip a {
        color: var(--accent);
        font-weight: 900;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .stat {
        border: 1px solid var(--ink);
        background: var(--panel);
        padding: 14px;
      }

      .stat strong {
        display: block;
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: clamp(24px, 5vw, 40px);
        line-height: 1;
      }

      .stat span {
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .controls {
        display: grid;
        gap: 16px;
        margin: 28px 0 22px;
        padding-bottom: 22px;
        border-bottom: 1px solid var(--line);
      }

      .search-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        align-items: center;
      }

      input[type="search"] {
        width: 100%;
        border: 1px solid var(--ink);
        background: var(--panel);
        color: var(--ink);
        padding: 13px 14px;
        font: 16px ui-sans-serif, system-ui, sans-serif;
      }

      .result-count {
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
      }

      .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .tag-filter {
        border: 1px solid color-mix(in srgb, var(--accent) 38%, var(--line));
        border-radius: 999px;
        background: var(--paper);
        color: var(--accent);
        cursor: pointer;
        padding: 7px 10px;
        font: 700 12px ui-sans-serif, system-ui, sans-serif;
      }

      .tag-filter span {
        color: var(--muted);
        margin-left: 4px;
      }

      .tag-filter.is-active {
        background: var(--accent);
        color: white;
      }

      .tag-filter.is-active span { color: color-mix(in srgb, white 78%, var(--accent)); }

      .gallery {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .card {
        display: grid;
        align-content: start;
        overflow: hidden;
        border: 1px solid var(--ink);
        background: var(--panel);
      }

      .card.is-hidden,
      .card.is-deferred {
        display: none;
      }

      .image-link {
        display: block;
        background: #e9dfca;
        border-bottom: 1px solid var(--ink);
        cursor: zoom-in;
      }

      .image-link img {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 2;
        height: auto;
        object-fit: cover;
      }

      .image-modal[hidden] {
        display: none;
      }

      .image-modal {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: grid;
        place-items: center;
        padding: clamp(14px, 4vw, 36px);
      }

      .modal-backdrop {
        position: absolute;
        inset: 0;
        border: 0;
        background: rgba(20, 17, 12, 0.78);
        cursor: zoom-out;
      }

      .modal-panel {
        position: relative;
        z-index: 1;
        display: grid;
        gap: 12px;
        width: min(1160px, 100%);
        max-height: calc(100vh - 28px);
        border: 1px solid color-mix(in srgb, var(--paper) 46%, var(--ink));
        background: var(--panel);
        padding: clamp(12px, 2vw, 18px);
        box-shadow: 0 28px 90px rgba(20, 17, 12, 0.45);
      }

      .modal-close {
        justify-self: end;
        border: 1px solid var(--ink);
        background: var(--ink);
        color: var(--panel);
        cursor: pointer;
        padding: 8px 12px;
        font: 900 12px ui-sans-serif, system-ui, sans-serif;
        text-transform: uppercase;
      }

      .modal-figure {
        display: grid;
        gap: 10px;
        min-height: 0;
        margin: 0;
      }

      .modal-figure img {
        display: block;
        width: 100%;
        max-height: min(74vh, 840px);
        object-fit: contain;
        background: #e9dfca;
      }

      .modal-figure figcaption {
        display: grid;
        gap: 3px;
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
      }

      .modal-figure strong {
        color: var(--ink);
        font-size: 15px;
      }

      .content {
        display: grid;
        gap: 10px;
        padding: 16px;
      }

      .eyebrow {
        color: var(--accent-2);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }

      h2 {
        margin: 0;
        font-size: 20px;
        line-height: 1.15;
        letter-spacing: 0;
      }

      .caption {
        margin: 0;
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .tags li {
        border: 1px solid color-mix(in srgb, var(--accent-3) 24%, var(--line));
        border-radius: 999px;
        background: color-mix(in srgb, var(--accent-3) 7%, var(--panel));
        color: var(--accent-3);
        padding: 4px 8px;
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 11px;
        font-weight: 800;
      }

      .tags a,
      .title-link {
        color: inherit;
        text-decoration: none;
      }

      .title-link:hover,
      .tags a:hover {
        text-decoration: underline;
      }

      .detail-link {
        width: fit-content;
        color: var(--accent);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .load-sentinel {
        display: flex;
        justify-content: center;
        margin-top: 24px;
        min-height: 1px;
      }

      .load-more {
        display: none;
        border: 1px solid var(--ink);
        background: var(--ink);
        color: var(--panel);
        cursor: pointer;
        padding: 12px 16px;
        font: 900 13px ui-sans-serif, system-ui, sans-serif;
        text-transform: uppercase;
      }

      .load-more.is-fallback {
        display: inline-block;
      }

      .load-sentinel[hidden] { display: none; }

      details {
        border-top: 1px solid var(--line);
        padding-top: 10px;
      }

      summary {
        color: var(--accent);
        cursor: pointer;
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
        font-weight: 900;
      }

      pre {
        max-height: 230px;
        margin: 10px 0 0;
        overflow: auto;
        border-radius: 0;
        background: var(--code);
        color: #effaf6;
        padding: 12px;
        white-space: pre-wrap;
        word-break: break-word;
        font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }

      footer {
        display: grid;
        gap: 8px;
        margin-top: 34px;
        border-top: 1px solid var(--ink);
        padding-top: 18px;
        color: var(--muted);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 13px;
      }

      @media (max-width: 980px) {
        .hero,
        .gallery {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 680px) {
        main {
          width: min(100% - 20px, 1240px);
          padding-top: 28px;
        }

        .hero,
        .gallery,
        .search-row {
          grid-template-columns: 1fr;
        }

        h1 { font-size: clamp(38px, 16vw, 68px); }

        .result-count { white-space: normal; }
      }
    </style>
  </head>
  <body>
    <a class="skip-link" href="#gallery">Skip to gallery</a>
    <main>
      <header class="hero">
        <div>
          <span class="kicker">Open prompt archive · GitHub Pages</span>
          <h1>Awesome GPT Image 2 Prompts & Use Cases</h1>
          <p class="summary">${escapeHtml(seoDescription)} Every card includes the generated image, searchable tags, and the full prompt text.</p>
          <nav class="hero-links" aria-label="Project links">
            <a href="${DRILL_URL}">Drill</a>
            <a href="${VIBEART_URL}">VibeArt</a>
            <a href="prompts/">Prompt pages</a>
            <a href="tags/">Tag pages</a>
            <a href="${REPO_URL}">GitHub repo</a>
            <a href="gallery.json">Raw gallery JSON</a>
            <a href="sitemap.xml">Sitemap</a>
            <a href="llms.txt">LLMs.txt</a>
          </nav>
          <p class="repo-strip">GitHub source: <a href="${REPO_URL}">${REPO_URL}</a></p>
        </div>
        <div class="stats" aria-label="gallery stats">
          <div class="stat"><strong>${data.images.length}</strong><span>images</span></div>
          <div class="stat"><strong>${counts.length}</strong><span>search tags</span></div>
          <div class="stat"><strong>${data.images.length}</strong><span>prompts</span></div>
          <div class="stat"><strong>${updated}</strong><span>updated</span></div>
        </div>
      </header>

      <section class="controls" aria-label="gallery filters">
        <div class="search-row">
          <input id="search" type="search" placeholder="Search GPT Image prompts, use cases, tags..." autocomplete="off" />
          <div class="result-count" aria-live="polite"><span id="visible-count">${Math.min(INITIAL_IMAGE_COUNT, data.images.length)}</span> / <span id="match-count">${data.images.length}</span> shown</div>
        </div>
        <div class="tag-cloud" aria-label="Popular tags">
          ${tagCloud}
        </div>
      </section>

      <section id="gallery" class="gallery" aria-label="GPT Image 2 prompt gallery">
${cards}
      </section>
      <div class="load-sentinel" id="load-sentinel" aria-hidden="true">
        <button class="load-more" id="load-more" type="button">Load more</button>
      </div>

      <footer>
        <span>Built from Codex image-generation session logs. Images, prompts, tags, and metadata are preserved in this repository for static hosting and search indexing.</span>
        <span>Creator tools: <a href="${DRILL_URL}">Drill</a> for deeper reading workflows and <a href="${VIBEART_URL}">VibeArt</a> for AI visual creation.</span>
        <span>GitHub source: <a href="${REPO_URL}">${REPO_URL}</a></span>
        <span>Shareable pages include canonical URLs, descriptive image alt text, structured data, sitemap.xml, robots.txt, and prompt text in server-rendered HTML.</span>
      </footer>
    </main>
    <div class="image-modal" id="image-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
      <button class="modal-backdrop" type="button" data-modal-close aria-label="Close image preview"></button>
      <div class="modal-panel">
        <button class="modal-close" type="button" data-modal-close>Close</button>
        <figure class="modal-figure">
          <img id="modal-image" alt="" />
          <figcaption>
            <strong id="modal-title"></strong>
            <span id="modal-caption"></span>
          </figcaption>
        </figure>
      </div>
    </div>

    <script>
      const search = document.querySelector("#search");
      const cards = [...document.querySelectorAll(".card")];
      const tagButtons = [...document.querySelectorAll(".tag-filter")];
      const visibleCount = document.querySelector("#visible-count");
      const matchCount = document.querySelector("#match-count");
      const loadSentinel = document.querySelector("#load-sentinel");
      const loadMore = document.querySelector("#load-more");
      const modal = document.querySelector("#image-modal");
      const modalImage = document.querySelector("#modal-image");
      const modalTitle = document.querySelector("#modal-title");
      const modalCaption = document.querySelector("#modal-caption");
      const imageBatchSize = ${IMAGE_BATCH_SIZE};
      let visibleLimit = ${INITIAL_IMAGE_COUNT};
      let activeTag = "";
      let autoLoadQueued = false;
      let lastTrigger = null;

      const hydrateCardImage = (card) => {
        const image = card.querySelector("img[data-src]");
        if (!image) return;

        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      };

      const queueAutoLoadCheck = () => {
        if (autoLoadQueued) return;
        autoLoadQueued = true;
        requestAnimationFrame(() => {
          autoLoadQueued = false;
          maybeAutoLoad();
        });
      };

      const filterCards = () => {
        const query = search.value.trim().toLowerCase();
        const matches = [];

        for (const card of cards) {
          const matchesSearch = !query || card.dataset.search.includes(query);
          const matchesTag = !activeTag || card.dataset.tags.split(" ").includes(activeTag);
          if (matchesSearch && matchesTag) {
            matches.push(card);
          }

          card.classList.add("is-hidden");
          card.classList.remove("is-deferred");
        }

        const visibleCards = matches.slice(0, visibleLimit);
        for (const card of visibleCards) {
          card.classList.remove("is-hidden");
          hydrateCardImage(card);
        }

        const visible = Math.min(visibleLimit, matches.length);
        visibleCount.textContent = String(visible);
        matchCount.textContent = String(matches.length);

        const remaining = matches.length - visible;
        loadSentinel.hidden = remaining <= 0;
        loadMore.textContent = remaining > 0 ? "Load " + Math.min(imageBatchSize, remaining) + " more" : "Load more";
        queueAutoLoadCheck();
      };

      const loadNextBatch = () => {
        if (loadSentinel.hidden) return;
        visibleLimit += imageBatchSize;
        filterCards();
      };

      function maybeAutoLoad() {
        if (loadSentinel.hidden) return;
        const triggerTop = loadSentinel.getBoundingClientRect().top;
        if (triggerTop < window.innerHeight + 900) {
          loadNextBatch();
        }
      }

      const resetAndFilterCards = () => {
        visibleLimit = ${INITIAL_IMAGE_COUNT};
        filterCards();
      };

      search.addEventListener("input", resetAndFilterCards);

      for (const button of tagButtons) {
        button.addEventListener("click", () => {
          activeTag = activeTag === button.dataset.tag ? "" : button.dataset.tag;
          for (const item of tagButtons) {
            item.classList.toggle("is-active", item.dataset.tag === activeTag);
          }
          resetAndFilterCards();
        });
      }

      loadMore.addEventListener("click", loadNextBatch);

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              loadNextBatch();
            }
          },
          { rootMargin: "900px 0px" },
        );
        observer.observe(loadSentinel);
      } else {
        loadMore.classList.add("is-fallback");
      }

      window.addEventListener("scroll", queueAutoLoadCheck, { passive: true });
      window.addEventListener("resize", queueAutoLoadCheck);

      filterCards();

      const closeModal = () => {
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        modalImage.removeAttribute("src");
        if (lastTrigger) {
          lastTrigger.focus();
        }
      };

      for (const link of document.querySelectorAll("[data-modal-image]")) {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          lastTrigger = link;
          modalImage.src = link.href;
          modalImage.alt = link.querySelector("img")?.alt ?? "";
          modalTitle.textContent = link.dataset.title ?? "";
          modalCaption.textContent = link.dataset.caption ?? "";
          modal.hidden = false;
          document.body.classList.add("modal-open");
          modal.querySelector(".modal-close").focus();
        });
      }

      for (const button of document.querySelectorAll("[data-modal-close]")) {
        button.addEventListener("click", closeModal);
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
          closeModal();
        }
      });
    </script>
  </body>
</html>
`;

const sitemapImages = data.images
  .map(
    (image, index) => `    <image:image>
      <image:loc>${escapeHtml(absoluteUrl(image.path))}</image:loc>
      <image:title>${escapeHtml(cleanTitle(image, index))}</image:title>
      <image:caption>${escapeHtml(promptExcerpt(image.prompt, 240))}</image:caption>
    </image:image>`,
  )
  .join("\n");

const promptSitemapUrls = data.images
  .map(
    (image, index) => `  <url>
    <loc>${escapeHtml(absoluteUrl(promptPagePath(image, index)))}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${escapeHtml(absoluteUrl(image.path))}</image:loc>
      <image:title>${escapeHtml(cleanTitle(image, index))}</image:title>
      <image:caption>${escapeHtml(promptExcerpt(image.prompt, 240))}</image:caption>
    </image:image>
  </url>`,
  )
  .join("\n");

const tagSitemapUrls = counts
  .filter(([, count]) => count >= 2)
  .map(
    ([tag]) => `  <url>
    <loc>${escapeHtml(absoluteUrl(tagPagePath(tag)))}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${sitemapImages}
  </url>
  <url>
    <loc>${escapeHtml(absoluteUrl("prompts/"))}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${escapeHtml(absoluteUrl("tags/"))}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${promptSitemapUrls}
${tagSitemapUrls}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}sitemap.xml
`;

const llms = `# Awesome GPT Image 2

${seoDescription}

Primary URL: ${SITE_URL}
Repository: ${REPO_URL}
Creator tools: ${DRILL_URL} and ${VIBEART_URL}
Gallery JSON: ${SITE_URL}gallery.json
Sitemap: ${SITE_URL}sitemap.xml

The site contains ${data.images.length} generated image examples. Each example includes a repository-local image, full prompt text, dimensions, creation time, and semantic tags for prompt discovery.
Dedicated prompt pages: ${data.images.length}
Dedicated tag pages: ${counts.filter(([, count]) => count >= 2).length}

Top tags:
${counts
  .slice(0, 20)
  .map(([tag, count]) => `- ${tag}: ${count}`)
  .join("\n")}
`;

await writeFile(new URL("../index.html", import.meta.url), html);
await writeFile(new URL("../sitemap.xml", import.meta.url), sitemap);
await writeFile(new URL("../robots.txt", import.meta.url), robots);
await writeFile(new URL("../llms.txt", import.meta.url), llms);
