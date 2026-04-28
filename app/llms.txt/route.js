import { DRILL_URL, REPO_URL, SITE_URL, VIBEART_URL, buildSeoDescription, galleryEntries, tagEntries } from "../../lib/gallery";

export const dynamic = "force-static";

export function GET() {
  const topTags = tagEntries
    .slice(0, 20)
    .map(([tag, count]) => `- ${tag}: ${count}`)
    .join("\n");

  const body = `# Awesome GPT Image 2

${buildSeoDescription(galleryEntries.length)}

Primary URL: ${SITE_URL}
Repository: ${REPO_URL}
Creator tools: ${DRILL_URL} and ${VIBEART_URL}
Gallery JSON: ${SITE_URL}gallery.json
Sitemap: ${SITE_URL}sitemap.xml

The site contains ${galleryEntries.length} generated image examples. Each example includes a repository-local image, full prompt text, dimensions, creation time, source provenance, and semantic tags for prompt discovery.
Dedicated prompt pages: ${galleryEntries.length}
Dedicated tag pages: ${tagEntries.length}

Top tags:
${topTags}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
