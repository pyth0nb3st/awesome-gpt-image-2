import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import {
  DRILL_URL,
  REPO_URL,
  SITE_URL,
  VIBEART_URL,
  absoluteUrl,
  cleanTitle,
  displayTags,
  escapeAttribute,
  escapeHtml,
  humanizeTag,
  promptExcerpt,
  promptPagePath,
  tagCounts,
  tagPagePath,
} from "./gallery-utils.mjs";

const data = JSON.parse(await readFile(new URL("../gallery.json", import.meta.url), "utf8"));
const updated = data.run?.timestamp ? data.run.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10);
const tagEntries = tagCounts(data.images).filter(([, count]) => count >= 2);
const indexableTags = new Set(tagEntries.map(([tag]) => tag));

const images = data.images.map((image, index) => ({
  image,
  index,
  title: cleanTitle(image, index),
  tags: displayTags(image),
  pagePath: promptPagePath(image, index),
}));

const byTag = new Map();
for (const entry of images) {
  for (const tag of entry.tags) {
    if (!indexableTags.has(tag)) continue;
    byTag.set(tag, [...(byTag.get(tag) ?? []), entry]);
  }
}

const style = `
      :root {
        color-scheme: light;
        --bg: #f4f0e6;
        --ink: #171512;
        --muted: #655f53;
        --line: #d3c8b5;
        --panel: #fffaf0;
        --accent: #006b5f;
        --accent-2: #a04212;
        --code: #14231f;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background:
          linear-gradient(90deg, rgba(23, 21, 18, 0.045) 1px, transparent 1px),
          linear-gradient(180deg, rgba(23, 21, 18, 0.035) 1px, transparent 1px),
          var(--bg);
        background-size: 34px 34px;
        color: var(--ink);
        font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
        line-height: 1.6;
      }
      a { color: var(--accent); }
      main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 28px 0 46px;
      }
      nav, .meta, .tags, .grid, footer {
        font-family: ui-sans-serif, system-ui, sans-serif;
      }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 26px;
      }
      nav a, .button-link {
        border: 1px solid var(--ink);
        background: var(--panel);
        color: var(--ink);
        padding: 8px 10px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 800;
      }
      h1 {
        max-width: 900px;
        margin: 0;
        font-size: clamp(38px, 7vw, 76px);
        line-height: 0.95;
        letter-spacing: 0;
      }
      h2 {
        margin: 0 0 10px;
        font-size: 24px;
        line-height: 1.1;
      }
      .lead {
        max-width: 820px;
        color: var(--muted);
        font-size: 18px;
      }
      .meta {
        color: var(--muted);
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.7fr);
        gap: 24px;
        align-items: start;
        margin: 24px 0;
      }
      .hero img, .card img {
        display: block;
        width: 100%;
        border: 1px solid var(--ink);
        background: #e9dfca;
      }
      .hero img {
        max-height: 720px;
        object-fit: contain;
      }
      .panel {
        border: 1px solid var(--ink);
        background: var(--panel);
        padding: clamp(16px, 3vw, 24px);
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0;
        margin: 14px 0 0;
        list-style: none;
      }
      .tags a, .tags span {
        display: block;
        border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line));
        border-radius: 999px;
        background: #fdf7ea;
        padding: 5px 9px;
        text-decoration: none;
        font-size: 12px;
        font-weight: 850;
      }
      pre {
        overflow: auto;
        max-height: 520px;
        margin: 0;
        background: var(--code);
        color: #effaf6;
        padding: 16px;
        white-space: pre-wrap;
        word-break: break-word;
        font: 13px/1.55 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }
      .card {
        border: 1px solid var(--ink);
        background: var(--panel);
      }
      .card a {
        color: inherit;
        text-decoration: none;
      }
      .card div {
        padding: 12px;
      }
      .card p {
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 13px;
      }
      footer {
        display: grid;
        gap: 8px;
        margin-top: 30px;
        border-top: 1px solid var(--ink);
        padding-top: 18px;
        color: var(--muted);
        font-size: 13px;
      }
      @media (max-width: 760px) {
        main { width: min(100% - 22px, 1120px); }
        .hero, .grid { grid-template-columns: 1fr; }
      }
`;

const pageShell = ({ title, description, canonical, imageUrl, jsonLd, body }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:180" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Awesome GPT Image 2" />
    <meta property="og:title" content="${escapeAttribute(title)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    ${imageUrl ? `<meta property="og:image" content="${escapeAttribute(imageUrl)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(title)}" />
    <meta name="twitter:description" content="${escapeAttribute(description)}" />
    ${imageUrl ? `<meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />` : ""}
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <style>${style}</style>
  </head>
  <body>
    <main>
      <nav aria-label="Site">
        <a href="${SITE_URL}">Gallery</a>
        <a href="${absoluteUrl("prompts/")}">Prompt pages</a>
        <a href="${absoluteUrl("tags/")}">Tag pages</a>
        <a href="${DRILL_URL}">Drill</a>
        <a href="${VIBEART_URL}">VibeArt</a>
        <a href="${REPO_URL}">GitHub</a>
      </nav>
      ${body}
      <footer>
        <span>Awesome GPT Image 2 preserves generated images, exact prompts, and prompt tags as easy-to-browse static pages.</span>
        <span>Creator tools: <a href="${DRILL_URL}">Drill</a> and <a href="${VIBEART_URL}">VibeArt</a>.</span>
      </footer>
    </main>
  </body>
</html>
`;

const tagLinks = (tags) =>
  tags
    .map((tag) =>
      indexableTags.has(tag)
        ? `<li><a href="${absoluteUrl(tagPagePath(tag))}">${escapeHtml(tag)}</a></li>`
        : `<li><span>${escapeHtml(tag)}</span></li>`,
    )
    .join("\n");

const relatedFor = (entry) => {
  const seen = new Set([entry.pagePath]);
  const related = [];
  for (const tag of entry.tags) {
    for (const candidate of byTag.get(tag) ?? []) {
      if (seen.has(candidate.pagePath)) continue;
      seen.add(candidate.pagePath);
      related.push(candidate);
      if (related.length >= 6) return related;
    }
  }
  for (const candidate of images) {
    if (seen.has(candidate.pagePath)) continue;
    seen.add(candidate.pagePath);
    related.push(candidate);
    if (related.length >= 6) return related;
  }
  return related;
};

const cardGrid = (entries) => `<div class="grid">
${entries
  .map(
    (entry) => `        <article class="card">
          <a href="${absoluteUrl(entry.pagePath)}">
            <img src="${escapeAttribute(absoluteUrl(entry.image.path))}" alt="${escapeAttribute(`${entry.title}. GPT Image 2 prompt example.`)}" loading="lazy" width="${entry.image.width}" height="${entry.image.height}" />
            <div>
              <h2>${escapeHtml(entry.title)}</h2>
              <p>${escapeHtml(promptExcerpt(entry.image.prompt, 130))}</p>
            </div>
          </a>
        </article>`,
  )
  .join("\n")}
      </div>`;

const writeHtml = async (path, html) => {
  const directory = new URL(`../${path}`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), html);
};

await rm(new URL("../prompts/", import.meta.url), { recursive: true, force: true });
await rm(new URL("../tags/", import.meta.url), { recursive: true, force: true });

await writeHtml(
  "prompts/",
  pageShell({
    title: "GPT Image 2 Prompt Pages | Awesome GPT Image 2",
    description: `Browse ${images.length} dedicated GPT Image 2 prompt pages with generated images, tags, exact prompts, and related examples.`,
    canonical: absoluteUrl("prompts/"),
    imageUrl: absoluteUrl(images[0].image.path),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "GPT Image 2 prompt pages",
      url: absoluteUrl("prompts/"),
      numberOfItems: images.length,
    },
    body: `<header>
        <p class="meta">Prompt index · ${images.length} pages · Updated ${escapeHtml(updated)}</p>
        <h1>GPT Image 2 Prompt Pages</h1>
        <p class="lead">Every generated image has its own prompt page with the exact prompt, visual output, tags, and related examples.</p>
      </header>
      ${cardGrid(images)}`,
  }),
);

await writeHtml(
  "tags/",
  pageShell({
    title: "GPT Image 2 Prompt Tags | Awesome GPT Image 2",
    description: `Browse ${tagEntries.length} GPT Image 2 prompt tag collections for UI mockups, product visuals, diagrams, games, storytelling, and evaluation workflows.`,
    canonical: absoluteUrl("tags/"),
    imageUrl: absoluteUrl(images[0].image.path),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "GPT Image 2 prompt tags",
      url: absoluteUrl("tags/"),
      numberOfItems: tagEntries.length,
    },
    body: `<header>
        <p class="meta">Tag index · ${tagEntries.length} collections · Updated ${escapeHtml(updated)}</p>
        <h1>GPT Image 2 Prompt Tags</h1>
        <p class="lead">Use these tag pages to find reusable prompt patterns by output type, workflow, and creative intent.</p>
      </header>
      <section class="panel">
        <ul class="tags">
          ${tagEntries
            .map(([tag, count]) => `<li><a href="${absoluteUrl(tagPagePath(tag))}">${escapeHtml(humanizeTag(tag))} (${count})</a></li>`)
            .join("\n")}
        </ul>
      </section>`,
  }),
);

for (const entry of images) {
  const { image, index, title, tags, pagePath } = entry;
  const canonical = absoluteUrl(pagePath);
  const imageUrl = absoluteUrl(image.path);
  const description = promptExcerpt(
    `${title}. Full GPT Image 2 prompt example with generated image, tags ${tags.join(", ")}, and reusable prompt structure.`,
    158,
  );
  const related = relatedFor(entry);

  await writeHtml(
    pagePath,
    pageShell({
      title: `${title} | GPT Image 2 Prompt Example`,
      description,
      canonical,
      imageUrl,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ImageObject",
          name: title,
          contentUrl: imageUrl,
          thumbnailUrl: imageUrl,
          caption: promptExcerpt(image.prompt, 240),
          keywords: tags.join(", "),
          width: image.width,
          height: image.height,
          encodingFormat: "image/png",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Gallery", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Prompt pages", item: absoluteUrl("prompts/") },
            { "@type": "ListItem", position: 3, name: title, item: canonical },
          ],
        },
      ],
      body: `<header>
        <p class="meta">Prompt example #${String(index + 1).padStart(2, "0")} · ${escapeHtml(image.createdAt ?? updated)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="lead">${escapeHtml(image.caption)}</p>
        <ul class="tags">
          ${tagLinks(tags)}
        </ul>
      </header>
      <section class="hero">
        <img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(`${title}. Tags: ${tags.join(", ")}.`)}" width="${image.width}" height="${image.height}" />
        <div class="panel">
          <p class="meta">Reusable prompt pattern</p>
          <p>This example targets ${escapeHtml(tags.slice(0, 4).join(", ") || "image-generation")} workflows. Use it as a reference for prompt structure, visual constraints, and output review.</p>
          <p>
            <a class="button-link" href="${DRILL_URL}">Explore Drill</a>
            <a class="button-link" href="${VIBEART_URL}">Open VibeArt</a>
          </p>
        </div>
      </section>
      <section class="panel">
        <h2>Full Prompt</h2>
        <pre>${escapeHtml(image.prompt)}</pre>
      </section>
      <section>
        <h2>Related GPT Image 2 Prompt Examples</h2>
        ${cardGrid(related)}
      </section>`,
    }),
  );
}

for (const [tag, count] of tagEntries) {
  const entries = byTag.get(tag) ?? [];
  const label = humanizeTag(tag);
  const canonical = absoluteUrl(tagPagePath(tag));
  const description = `Browse ${count} GPT Image 2 ${label.toLowerCase()} prompt examples with generated images, full prompts, tags, and reusable visual ideas.`;
  const relatedTags = tagEntries
    .filter(([candidate]) => candidate !== tag)
    .slice(0, 12);

  await writeHtml(
    tagPagePath(tag),
    pageShell({
      title: `${label} GPT Image 2 Prompt Examples`,
      description,
      canonical,
      imageUrl: entries[0] ? absoluteUrl(entries[0].image.path) : absoluteUrl(images[0].image.path),
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${label} GPT Image 2 prompt examples`,
        url: canonical,
        description,
        numberOfItems: entries.length,
      },
      body: `<header>
        <p class="meta">Tag collection · ${count} examples · Updated ${escapeHtml(updated)}</p>
        <h1>${escapeHtml(label)} GPT Image 2 Prompt Examples</h1>
        <p class="lead">${escapeHtml(description)}</p>
      </header>
      ${cardGrid(entries)}
      <section class="panel">
        <h2>Related Tag Pages</h2>
        <ul class="tags">
          ${relatedTags
            .map(([relatedTag, relatedCount]) => `<li><a href="${absoluteUrl(tagPagePath(relatedTag))}">${escapeHtml(humanizeTag(relatedTag))} (${relatedCount})</a></li>`)
            .join("\n")}
        </ul>
      </section>`,
    }),
  );
}

console.log(`Rendered ${images.length} prompt pages and ${tagEntries.length} tag pages.`);
