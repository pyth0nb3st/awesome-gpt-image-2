import { readFile, writeFile } from "node:fs/promises";
import {
  SITE_URL,
  REPO_URL,
  DRILL_URL,
  VIBEART_URL,
  buildSeoDescription,
  cleanTitle,
  displayTags,
  markdownEscape,
  promptExcerpt,
  tagCounts,
} from "./gallery-utils.mjs";

const data = JSON.parse(await readFile(new URL("../gallery.json", import.meta.url), "utf8"));
const counts = tagCounts(data.images);
const seoDescription = buildSeoDescription(data.images);

const tagIndex = counts
  .map(([tag, count]) => `- \`${tag}\` (${count})`)
  .join("\n");

const promptCards = data.images
  .map((image, index) => {
    const title = cleanTitle(image, index);
    const tags = displayTags(image).map((tag) => `\`${tag}\``).join(" ");
    const number = String(index + 1).padStart(3, "0");

    return `### ${number}. ${markdownEscape(title)}

![${markdownEscape(title)}](${image.path})

**Tags:** ${tags}

**Prompt excerpt:** ${markdownEscape(promptExcerpt(image.prompt, 240))}

<details>
<summary>Full prompt</summary>

\`\`\`text
${image.prompt}
\`\`\`

</details>`;
  })
  .join("\n\n");

const readme = `# Awesome GPT Image 2

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f)](${SITE_URL})
[![Images](https://img.shields.io/badge/images-${data.images.length}-0f766e)](${SITE_URL})
[![Prompts](https://img.shields.io/badge/prompts-${data.images.length}-a34716)](${SITE_URL})
[![License](https://img.shields.io/badge/license-research%20archive-lightgrey)](#notes)

> ${seoDescription}

**Live gallery:** ${SITE_URL}  
**Repository:** ${REPO_URL}  
**Creator tools:** [Drill](${DRILL_URL}) · [VibeArt](${VIBEART_URL})

This is an awesome-style archive for GPT Image 2 / GPT Image prompt exploration. It is built for discoverability: every example includes the generated image, reusable tags, dimensions, and the full prompt text in both the static site and this README.

## Contents

- [Why This Exists](#why-this-exists)
- [Popular Tags](#popular-tags)
- [Gallery Features](#gallery-features)
- [Creator Tools](#creator-tools)
- [SEO Landing Pages](#seo-landing-pages)
- [Prompt Gallery](#prompt-gallery)
- [Rebuild](#rebuild)
- [Notes](#notes)

## Why This Exists

Most prompt examples disappear into chat history. This repo turns image-generation experiments into a searchable public reference:

- Browse GPT Image prompt examples by visual output.
- Reuse prompt structures for product mockups, UI concepts, educational diagrams, game assets, and storytelling.
- Compare generated images against their exact prompt text.
- Give search engines and AI assistants crawlable text next to the image assets.

## Popular Tags

${tagIndex}

## Gallery Features

- **Searchable static site:** title, prompt text, captions, and tags are filterable in the browser.
- **SEO-ready HTML:** canonical URL, meta description, Open Graph tags, structured data, robots.txt, and image sitemap.
- **Image SEO:** descriptive filenames, alt text, captions, and full prompt text near every image.
- **Prompt preservation:** prompts are recovered from Codex image-generation session logs and stored in \`gallery.json\`.
- **GitHub Pages ready:** the public site is served from the repository root.
- **Programmatic inner pages:** every image has a dedicated prompt page, and recurring tags have crawlable collection pages.

## Creator Tools

- [Drill](${DRILL_URL}) helps readers drill into dense articles, papers, and technical ideas.
- [VibeArt](${VIBEART_URL}) is an AI visual creation workspace for turning prompts and concepts into usable visual assets.

## SEO Landing Pages

- [Prompt page index](${SITE_URL}prompts/) links to ${data.images.length} individual GPT Image 2 prompt examples.
- [Tag page index](${SITE_URL}tags/) groups examples by visual intent, asset type, and workflow.
- Each generated prompt page includes a unique title, meta description, canonical URL, Open Graph image, image schema, full prompt text, and related internal links.

## Prompt Gallery

${promptCards}

## Rebuild

\`\`\`bash
node scripts/render-gallery.mjs
node scripts/render-readme.mjs
\`\`\`

## Add A New Image

1. Copy the generated image into \`assets/images/\`.
2. Add a record to \`gallery.json\` with \`title\`, \`caption\`, \`path\`, \`width\`, \`height\`, \`tags\`, and \`prompt\`.
3. Run both render scripts.
4. Commit and push.

## Notes

- Images are AI-generated research artifacts.
- Prompts may be revised prompts captured from image generation session logs.
- This is not an official OpenAI repository.
- The public site is optimized for crawlability, but search ranking depends on indexing, backlinks, and external search engine behavior.
`;

await writeFile(new URL("../README.md", import.meta.url), readme);
