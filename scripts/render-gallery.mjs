import { readFile, writeFile } from "node:fs/promises";

const data = JSON.parse(await readFile(new URL("../gallery.json", import.meta.url), "utf8"));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const tagCloud = [...new Set(data.images.flatMap((image) => image.tags ?? []))]
  .sort()
  .map((tag) => `<button type="button" class="tag-filter" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
  .join("\n          ");

const cards = data.images
  .map((image, index) => {
    const tags = (image.tags ?? []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join("\n                ");
    const search = [image.title, image.caption, image.prompt, ...(image.tags ?? [])].join(" ").toLowerCase();

    return `        <article class="card" data-search="${escapeHtml(search)}" data-tags="${escapeHtml((image.tags ?? []).join(" "))}">
          <a class="image-link" href="${escapeHtml(image.path)}" target="_blank" rel="noreferrer">
            <img loading="lazy" src="${escapeHtml(image.path)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" />
          </a>
          <div class="content">
            <div class="eyebrow">#${String(index + 1).padStart(2, "0")} · ${escapeHtml(image.createdAt ?? "historical")}</div>
            <h2>${escapeHtml(image.title)}</h2>
            <p class="caption">${escapeHtml(image.caption)}</p>
            <ul class="tags">
              ${tags}
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
    <meta name="description" content="A curated gallery of GPT Image 2 prompts, use cases, and generated images." />
    <title>${escapeHtml(data.title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f2e8;
        --ink: #151515;
        --muted: #667085;
        --line: #d8d0bf;
        --panel: #fffdfa;
        --accent: #0f766e;
        --accent-2: #a34716;
        --code: #10201d;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--ink);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.55;
      }

      main {
        width: min(1240px, calc(100% - 32px));
        margin: 0 auto;
        padding: 44px 0 64px;
      }

      header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(260px, 0.35fr);
        gap: 32px;
        align-items: end;
        padding-bottom: 28px;
        border-bottom: 1px solid var(--line);
      }

      h1 {
        max-width: 900px;
        margin: 0;
        font-size: clamp(42px, 7vw, 92px);
        line-height: 0.9;
        letter-spacing: 0;
      }

      .summary {
        max-width: 760px;
        margin: 22px 0 0;
        color: var(--muted);
        font-size: 17px;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .stat {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.58);
        padding: 14px;
      }

      .stat strong {
        display: block;
        font-size: 28px;
        line-height: 1;
      }

      .stat span {
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
      }

      .controls {
        display: grid;
        gap: 16px;
        margin: 26px 0;
      }

      input[type="search"] {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        color: var(--ink);
        padding: 13px 14px;
        font: inherit;
      }

      .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .tag-filter {
        border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--line));
        border-radius: 999px;
        background: transparent;
        color: var(--accent);
        cursor: pointer;
        padding: 6px 10px;
        font: inherit;
        font-size: 12px;
        font-weight: 700;
      }

      .tag-filter.is-active {
        background: var(--accent);
        color: white;
      }

      .gallery {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .card {
        display: grid;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
      }

      .card.is-hidden { display: none; }

      .image-link {
        display: block;
        background: #ebe4d5;
        border-bottom: 1px solid var(--line);
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
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
      }

      h2 {
        margin: 0;
        font-size: 18px;
        line-height: 1.2;
        letter-spacing: 0;
      }

      .caption {
        margin: 0;
        color: var(--muted);
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
        border-radius: 999px;
        background: color-mix(in srgb, var(--accent) 9%, white);
        color: var(--accent);
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 700;
      }

      details {
        border-top: 1px solid var(--line);
        padding-top: 10px;
      }

      summary {
        color: var(--accent);
        cursor: pointer;
        font-size: 13px;
        font-weight: 800;
      }

      pre {
        max-height: 220px;
        margin: 10px 0 0;
        overflow: auto;
        border-radius: 8px;
        background: var(--code);
        color: #effaf6;
        padding: 12px;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 12px;
        line-height: 1.5;
      }

      footer {
        margin-top: 32px;
        color: var(--muted);
        font-size: 13px;
      }

      @media (max-width: 980px) {
        header,
        .gallery {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 680px) {
        main {
          width: min(100% - 20px, 1240px);
          padding-top: 28px;
        }

        header,
        .gallery {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>${escapeHtml(data.title)}</h1>
          <p class="summary">${escapeHtml(data.summary)}</p>
        </div>
        <div class="stats" aria-label="gallery stats">
          <div class="stat"><strong>${data.images.length}</strong><span>images</span></div>
          <div class="stat"><strong>${new Set(data.images.flatMap((image) => image.tags ?? [])).size}</strong><span>tags</span></div>
          <div class="stat"><strong>${data.images.length}</strong><span>prompts</span></div>
          <div class="stat"><strong>Pages</strong><span>ready</span></div>
        </div>
      </header>

      <section class="controls" aria-label="gallery filters">
        <input id="search" type="search" placeholder="Search prompts, titles, tags..." autocomplete="off" />
        <div class="tag-cloud">
          ${tagCloud}
        </div>
      </section>

      <section class="gallery" aria-label="generated image gallery">
${cards}
      </section>

      <footer>
        Built from local Codex image-generation session logs. Prompts and image files are preserved in this repository for static hosting.
      </footer>
    </main>

    <script>
      const search = document.querySelector("#search");
      const cards = [...document.querySelectorAll(".card")];
      const tagButtons = [...document.querySelectorAll(".tag-filter")];
      let activeTag = "";

      const filterCards = () => {
        const query = search.value.trim().toLowerCase();
        for (const card of cards) {
          const matchesSearch = !query || card.dataset.search.includes(query);
          const matchesTag = !activeTag || card.dataset.tags.split(" ").includes(activeTag);
          card.classList.toggle("is-hidden", !(matchesSearch && matchesTag));
        }
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

await writeFile(new URL("../index.html", import.meta.url), html);
