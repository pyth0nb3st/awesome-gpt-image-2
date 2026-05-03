import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const gallery = JSON.parse(readFileSync(path.join(repoRoot, 'gallery.json'), 'utf8'));
const config = JSON.parse(readFileSync(path.join(repoRoot, 'readme.config.json'), 'utf8'));

const images = Array.isArray(gallery.images) ? gallery.images : [];

function cleanText(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '/')
    .trim();
}

function escapeHtml(value) {
  return cleanText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownText(value) {
  return cleanText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/"/g, '');
}

function truncate(value, maxLength) {
  const text = cleanText(value);
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function slugFromPath(imagePath) {
  return path.basename(String(imagePath || '')).replace(/\.[^.]+$/, '');
}

function numberFromPath(imagePath) {
  const match = String(imagePath || '').match(/(?:^|\/)(\d+)-/);
  return match ? Number(match[1]) : 0;
}

function promptUrl(image) {
  return `${config.siteBaseUrl}/prompts/${slugFromPath(image.path)}/`;
}

function imageAssetUrl(image) {
  const fileName = path.basename(String(image.path || ''));
  if (config.fullList?.useThumbnails) {
    return `${config.assetBaseUrl}/thumbs/${fileName.replace(/\.[^.]+$/, '.jpg')}`;
  }
  return `${config.assetBaseUrl}/images/${fileName}`;
}

function humanTag(tag) {
  return String(tag || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function isExcludedTag(tag, rules = {}) {
  if ((rules.excludeTags || []).includes(tag)) {
    return true;
  }
  return (rules.excludePrefixes || []).some((prefix) => tag.startsWith(prefix));
}

function topicTags(image) {
  const rules = config.topicTags || {};
  return (image.tags || [])
    .filter((tag) => !isExcludedTag(tag, rules))
    .slice(0, config.fullList?.topicCount || 3);
}

function sortedImages() {
  return [...images].sort((a, b) => {
    const numberDelta = numberFromPath(b.path) - numberFromPath(a.path);
    if (numberDelta !== 0) {
      return numberDelta;
    }
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function popularTopics() {
  const counts = new Map();
  const rules = config.popularTopics || {};
  for (const image of images) {
    for (const tag of image.tags || []) {
      if (isExcludedTag(tag, rules)) {
        continue;
      }
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, rules.count || 18);
}

function renderFullList(items) {
  const lines = ['## Full List', ''];
  for (const image of items) {
    const title = markdownText(image.title);
    const caption = markdownText(truncate(image.caption || image.alt || image.title, 180));
    const topics = topicTags(image).map(humanTag).join(', ');
    const topicsText = topics ? `<br>Topics: ${topics}.` : '';
    const alt = escapeHtml(image.alt || title);
    const width = Number(config.fullList?.imageWidth || 180);
    lines.push(`- [${title}](${promptUrl(image)}) - ${caption}${topicsText}<br><img src="${imageAssetUrl(image)}" width="${width}" alt="${alt}">`);
  }
  lines.push('');
  return lines;
}

function renderReadme() {
  const items = sortedImages();
  const lines = [];
  lines.push(`# ${config.title} [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)`);
  lines.push('');
  lines.push(`> ${config.description}`);
  lines.push('');
  lines.push(`This repository tracks ${items.length} generated examples. The README is generated from \`gallery.json\` and \`readme.config.json\`; the live site keeps full prompt text, source attribution, provenance notes, tags, and static detail pages.`);
  lines.push('');
  lines.push('## Contents');
  lines.push('');
  lines.push('- [Start Here](#start-here)');
  lines.push('- [Full List](#full-list)');
  lines.push('- [Popular Topics](#popular-topics)');
  lines.push('- [Creator Tools](#creator-tools)');
  lines.push('- [Maintainer Notes](#maintainer-notes)');
  lines.push('');
  lines.push('## Start Here');
  lines.push('');
  lines.push(`- [Live gallery](${config.siteBaseUrl}/) - Visual homepage for all ${items.length} examples.`);
  lines.push(`- [All prompts](${config.siteBaseUrl}/prompts/) - Complete prompt index with images and prompt text.`);
  lines.push(`- [Tags](${config.siteBaseUrl}/tags/) - Browse by topic, format, and workflow pattern.`);
  lines.push(`- [Lucky prompt](${config.siteBaseUrl}/lucky/) - Open a random GPT Image 2 example.`);
  lines.push(`- [LLM index](${config.siteBaseUrl}/llms.txt) - Compact machine-readable site summary.`);
  lines.push('');

  if (config.fullList?.enabled !== false) {
    lines.push(...renderFullList(items));
  }

  lines.push('## Popular Topics');
  lines.push('');
  for (const [tag, count] of popularTopics()) {
    lines.push(`- [${humanTag(tag)}](${config.siteBaseUrl}/tags/${tag}/) - ${count} examples.`);
  }
  lines.push('');
  lines.push('## Creator Tools');
  lines.push('');
  for (const tool of config.creatorTools || []) {
    lines.push(`- [${cleanText(tool.name)}](${tool.url}) - ${cleanText(tool.description)}`);
  }
  lines.push('');
  lines.push('## Maintainer Notes');
  lines.push('');
  lines.push('Generated image binaries are served from Cloudflare R2 rather than committed to Git. The repository keeps metadata, static-site source, thumbnail dimensions, and deployment workflow files small and reviewable.');
  lines.push('');
  lines.push('Run `npm run generate:readme` after changing `gallery.json` or `readme.config.json`. The GitHub Pages workflow also regenerates README.md and commits it back to `main` when needed.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

writeFileSync(path.join(repoRoot, 'README.md'), renderReadme());
console.log(`Generated README.md with ${images.length} examples.`);
