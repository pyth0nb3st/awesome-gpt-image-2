import { readFile, writeFile } from "node:fs/promises";
import {
  SITE_URL,
  REPO_URL,
  absoluteUrl,
  buildSeoDescription,
  buildJsonLd,
  cleanTitle,
  displayTags,
  escapeAttribute,
  escapeHtml,
  promptExcerpt,
  tagCounts,
} from "./gallery-utils.mjs";

const data = JSON.parse(await readFile(new URL("../gallery.json", import.meta.url), "utf8"));
const counts = tagCounts(data.images);
const topTags = counts.slice(0, 24);
const heroImage = data.images[0];
const seoDescription = buildSeoDescription(data.images);
const updated = new Date().toISOString().slice(0, 10);

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
    const tagList = tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("\n                ");
    const search = [title, image.caption, image.prompt, ...tags].join(" ").toLowerCase();

    return `        <article class="card" id="prompt-${index + 1}" data-search="${escapeAttribute(search)}" data-tags="${escapeAttribute(tags.join(" "))}">
          <a class="image-link" href="${escapeAttribute(image.path)}" target="_blank" rel="noreferrer" aria-label="Open full image for ${escapeAttribute(title)}">
            <img loading="${index < 3 ? "eager" : "lazy"}" ${index === 0 ? 'fetchpriority="high"' : ""} src="${escapeAttribute(image.path)}" alt="${escapeAttribute(`${title}. Tags: ${tags.join(", ")}.`)}" width="${image.width}" height="${image.height}" />
          </a>
          <div class="content">
            <div class="eyebrow">#${String(index + 1).padStart(2, "0")} · ${escapeHtml(image.createdAt ?? "historical")}</div>
            <h2>${escapeHtml(title)}</h2>
            <p class="caption">${escapeHtml(image.caption)}</p>
            <ul class="tags">
              ${tagList}
            </ul>
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

      .card.is-hidden { display: none; }

      .image-link {
        display: block;
        background: #e9dfca;
        border-bottom: 1px solid var(--ink);
      }

      .image-link img {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 2;
        height: auto;
        object-fit: cover;
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
          <div class="result-count" aria-live="polite"><span id="visible-count">${data.images.length}</span> / ${data.images.length} visible</div>
        </div>
        <div class="tag-cloud" aria-label="Popular tags">
          ${tagCloud}
        </div>
      </section>

      <section id="gallery" class="gallery" aria-label="GPT Image 2 prompt gallery">
${cards}
      </section>

      <footer>
        <span>Built from Codex image-generation session logs. Images, prompts, tags, and metadata are preserved in this repository for static hosting and search indexing.</span>
        <span>GitHub source: <a href="${REPO_URL}">${REPO_URL}</a></span>
        <span>SEO basics included: canonical URL, descriptive image alt text, structured data, sitemap.xml, robots.txt, and prompt text in server-rendered HTML.</span>
      </footer>
    </main>

    <script>
      const search = document.querySelector("#search");
      const cards = [...document.querySelectorAll(".card")];
      const tagButtons = [...document.querySelectorAll(".tag-filter")];
      const visibleCount = document.querySelector("#visible-count");
      let activeTag = "";

      const filterCards = () => {
        const query = search.value.trim().toLowerCase();
        let visible = 0;

        for (const card of cards) {
          const matchesSearch = !query || card.dataset.search.includes(query);
          const matchesTag = !activeTag || card.dataset.tags.split(" ").includes(activeTag);
          const show = matchesSearch && matchesTag;
          card.classList.toggle("is-hidden", !show);
          if (show) visible += 1;
        }

        visibleCount.textContent = String(visible);
      };

      search.addEventListener("input", filterCards);

      for (const button of tagButtons) {
        button.addEventListener("click", () => {
          activeTag = activeTag === button.dataset.tag ? "" : button.dataset.tag;
          for (const item of tagButtons) {
            item.classList.toggle("is-active", item.dataset.tag === activeTag);
          }
          filterCards();
        });
      }
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

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${sitemapImages}
  </url>
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
Gallery JSON: ${SITE_URL}gallery.json
Sitemap: ${SITE_URL}sitemap.xml

The site contains ${data.images.length} generated image examples. Each example includes a repository-local image, full prompt text, dimensions, creation time, and semantic tags for prompt discovery.

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
