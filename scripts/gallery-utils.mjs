export const SITE_URL = "https://gptimg2.best/";
export const REPO_URL = "https://github.com/pyth0nb3st/awesome-gpt-image-2";
export const DRILL_URL = "https://drillso.com/";
export const VIBEART_URL = "https://vibeart.app/";

const hiddenTagPattern = /^(batch-|historical-import$|prompt-recovered$|prompt-missing$)/;

const rules = [
  ["ui-mockup", /\b(ui|dashboard|app|interface|screenshot|screen|software|saas|control panel)\b/],
  ["product-mockup", /\b(product[- ]mockup|product shot|product packaging|product concept|product family|product kit|packaging|sku|shelf|can|bottle|box|brand|catalog)\b/],
  ["typography", /\b(typography|poster|multilingual|chinese|japanese|hindi|text-heavy|localized|localization)\b/],
  ["infographic", /\b(infographic|diagram|chart|workflow|arrow|exploded-view|process|pipeline|manual)\b/],
  ["education", /\b(educational|scientific|classroom|learning|explain|museum|curator|exhibit)\b/],
  ["storytelling", /\b(storyboard|comic|manga|character|mascot|narrative|episode|panel)\b/],
  ["game-design", /\b(game|board-game|cards|tokens|dice|play format|puzzle|speedrun|draft|bingo)\b/],
  ["worldbuilding", /\b(worldbuilding|atlas|map|transit|fantasy|city|stamps|field notes)\b/],
  ["interior-design", /\b(interior|apartment|room|facade|building|lighting states)\b/],
  ["photoreal", /\b(photo|photorealistic|natural lighting|street scene|camera angle|lens variation|cinematic)\b/],
  ["evaluation", /\b(evaluation|score|audit|regression|detective|truth table|triage|compare|rank)\b/],
  ["operations", /\b(operations|maintenance|safety|emergency|drill|inspection|readiness|route)\b/],
  ["material-study", /\b(material|fabric|glass|ceramic|metal|woven|plastic|wardrobe|capsule)\b/],
  ["sound-to-scene", /\b(sound|audio|waveform|stage|composer|music)\b/],
  ["lighting-weather", /\b(lighting|weather|rain|season|mood|atmosphere)\b/],
  ["prompt-game", /\b(prompt (relay|recipe|slot|escape|arcade|mutation|remix|telephone)|constraint|variant draft|remix dice|generation play|play formats)\b/],
];

export const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const escapeAttribute = escapeHtml;

export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const absoluteUrl = (path) => new URL(path, SITE_URL).toString();

export const ASSET_BASE_URL = String(process.env.NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL ?? "").replace(/\/+$/, "");

export const assetKey = (path) =>
  String(path)
    .replace(/^\/+/, "")
    .replace(/^assets\//, "");

export const assetUrl = (path) =>
  ASSET_BASE_URL ? `${ASSET_BASE_URL}/${assetKey(path)}` : `/${String(path).replace(/^\/+/, "")}`;

export const absoluteAssetUrl = (path) => (ASSET_BASE_URL ? assetUrl(path) : absoluteUrl(path));

export const imageTimestamp = (image) => {
  const normalized = String(image?.createdAt ?? "").trim().replace(" ", "T");
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const sortImagesByNewest = (images) =>
  [...images]
    .map((image, index) => ({ image, index }))
    .sort((left, right) => imageTimestamp(right.image) - imageTimestamp(left.image) || left.index - right.index)
    .map(({ image }) => image);

export const humanizeTag = (tag) =>
  String(tag)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const imageSlug = (image, index = 0) => {
  const fileName = String(image.path ?? "")
    .split("/")
    .pop()
    ?.replace(/\.[a-z0-9]+$/i, "");
  return slugify(fileName || `${String(index + 1).padStart(3, "0")}-${cleanTitle(image, index)}`);
};

export const promptPagePath = (image, index = 0) => `prompts/${imageSlug(image, index)}/`;

export const tagPagePath = (tag) => `tags/${slugify(tag)}/`;

export const markdownEscape = (value) =>
  String(value).replaceAll("|", "\\|").replaceAll("\r\n", "\n");

export const promptExcerpt = (prompt, length = 170) => {
  const compact = String(prompt).replace(/\s+/g, " ").trim();
  return compact.length > length ? `${compact.slice(0, length - 1).trim()}...` : compact;
};

const collectTextValues = (value, output = []) => {
  if (value == null) {
    return output;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    output.push(String(value));
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectTextValues(item, output);
    }
    return output;
  }

  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      output.push(key);
      collectTextValues(item, output);
    }
  }

  return output;
};

export const searchTextForImage = (image, index = 0) =>
  [
    cleanTitle(image, index),
    ...displayTags(image),
    ...displayTags(image).map(humanizeTag),
    ...collectTextValues(image),
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export const cleanTitle = (image, index) => {
  const raw = String(image.title || `GPT Image prompt example ${index + 1}`).trim();
  const sentence = raw.replace(/^a\s+/i, "").replace(/^an\s+/i, "");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

export const displayTags = (image) => {
  const text = [image.title, image.caption, image.prompt, image.alt, ...(image.tags ?? [])]
    .join(" ")
    .toLowerCase();

  const tags = new Set((image.tags ?? []).filter((tag) => !hiddenTagPattern.test(tag)));

  const useCase = text.match(/use case:\s*([a-z0-9-]+)/)?.[1];
  if (useCase) {
    tags.add(useCase);
  }

  for (const [tag, pattern] of rules) {
    if (pattern.test(text)) {
      tags.add(tag);
    }
  }

  if (tags.size === 0) {
    tags.add("prompt-gallery");
  }

  return [...tags].slice(0, 8).sort();
};

export const primaryTag = (image) => displayTags(image)[0] ?? "prompt-gallery";

export const tagCounts = (images) => {
  const counts = new Map();
  for (const image of images) {
    for (const tag of displayTags(image)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

export const buildSeoDescription = (imagesOrCount) => {
  const count = Array.isArray(imagesOrCount) ? imagesOrCount.length : Number(imagesOrCount);
  const prefix = Number.isFinite(count) && count > 0 ? `${count} ` : "";

  return `Browse ${prefix}GPT Image 2 prompt examples with generated images, reusable tags, image-generation use cases, and prompt text for product mockups, UI, games, diagrams, and storytelling.`;
};

export const buildJsonLd = (data) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Awesome GPT Image 2 Prompts and Use Cases",
  url: SITE_URL,
  description: buildSeoDescription(data.images),
  isPartOf: {
    "@type": "WebSite",
    name: "Awesome GPT Image 2",
    url: SITE_URL,
  },
  mainEntity: {
    "@type": "ImageGallery",
    name: "GPT Image 2 prompt gallery",
    numberOfItems: data.images.length,
    associatedMedia: data.images.slice(0, 100).map((image, index) => ({
      "@type": "ImageObject",
      name: cleanTitle(image, index),
      contentUrl: absoluteAssetUrl(image.path),
      thumbnailUrl: absoluteAssetUrl(image.path),
      caption: promptExcerpt(image.prompt, 240),
      keywords: displayTags(image).join(", "),
      width: image.width,
      height: image.height,
      encodingFormat: "image/png",
    })),
  },
});
