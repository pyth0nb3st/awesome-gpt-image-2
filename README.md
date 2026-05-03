# Awesome GPT Image 2 [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> Curated GPT Image 2 prompt examples for product mockups, UI concepts, diagrams, games, educational visuals, and image-generation workflows.

This list tracks 280 public GPT Image 2 prompt examples. Each example links the generated image, prompt text, source attribution where available, reusable tags, and a dedicated static page.

## Contents

- [Prompt Gallery](#prompt-gallery)
- [Topic Collections](#topic-collections)
- [Featured Examples](#featured-examples)
- [Creator Tools](#creator-tools)
- [Maintainer Workflow](#maintainer-workflow)

## Prompt Gallery

- [Live Gallery](https://gptimg2.best/) - Browse all 280 GPT Image 2 prompt examples with generated images.
- [All Prompts](https://gptimg2.best/prompts/) - Complete index of prompt pages with images, tags, and reusable prompt text.
- [Topic Collections](https://gptimg2.best/tags/) - Prompt examples grouped by visual format, use case, and generation pattern.
- [Random Prompt Picker](https://gptimg2.best/lucky/) - Explore a random example when you want a new prompt direction.
- [LLM Index](https://gptimg2.best/llms.txt) - Compact machine-readable overview for AI search and citation.

## Topic Collections

- [Typography](https://gptimg2.best/tags/typography/) - 87 prompt examples.
- [Product Mockup](https://gptimg2.best/tags/product-mockup/) - 85 prompt examples.
- [Game Design](https://gptimg2.best/tags/game-design/) - 68 prompt examples.
- [Ui Mockup](https://gptimg2.best/tags/ui-mockup/) - 68 prompt examples.
- [Storytelling](https://gptimg2.best/tags/storytelling/) - 55 prompt examples.
- [Infographic](https://gptimg2.best/tags/infographic/) - 45 prompt examples.
- [Lighting Weather](https://gptimg2.best/tags/lighting-weather/) - 36 prompt examples.
- [Photoreal](https://gptimg2.best/tags/photoreal/) - 33 prompt examples.
- [Worldbuilding](https://gptimg2.best/tags/worldbuilding/) - 33 prompt examples.
- [Education](https://gptimg2.best/tags/education/) - 26 prompt examples.
- [Derived Play](https://gptimg2.best/tags/derived-play/) - 24 prompt examples.
- [Interior Design](https://gptimg2.best/tags/interior-design/) - 23 prompt examples.

## Featured Examples

- [GPT Image 2 six-style signature selection poster](https://gptimg2.best/prompts/298-gpt-image-2-six-style-signature-selection-poster/) - 复用李岳在 X 分享的签名设计系统 prompt，重绘一张为“李岳”生成的 6 风格东方签名选择海报。.
- [GPT Image 2 pathetic MS Paint perfume sketch redraw](https://gptimg2.best/prompts/297-gpt-image-2-pathetic-ms-paint-perfume-sketch-redraw/) - 复用 Amira Zairi 在 X 分享的 viral scribbly redraw prompt，按原帖附图重绘一张白底、拙劣鼠绘质感的香水概念草图板。.
- [GPT Image 2 colorful messy doodle puppy portrait](https://gptimg2.best/prompts/295-gpt-image-2-colorful-messy-doodle-puppy-portrait/) - 复用 Berryxia.AI 在 X 分享的彩色潦草小狗线条风 prompt，重绘一张童趣、凌乱、随手乱画感的原创小狗头像。.
- [GPT Image 2 goofy retro yellow cartoon doodle](https://gptimg2.best/prompts/294-gpt-image-2-goofy-retro-yellow-cartoon-doodle/) - 复用 まと｜AI×デザイン 在 X 分享的卡通化 prompt，重绘一张白底、MS Paint 鼠绘质感的原创黄皮复古卡通涂鸦头像。.
- [GPT Image 2 pathetic MS Paint cat redraw](https://gptimg2.best/prompts/293-gpt-image-2-pathetic-ms-paint-cat-redraw/) - 复用 ChatGPT 在 X 分享的 viral scribblification prompt，重绘一张故意笨拙潦草的原创橘猫涂鸦图。.
- [GPT Image 2 whimsical steampunk castle equirectangular panorama](https://gptimg2.best/prompts/292-gpt-image-2-whimsical-steampunk-castle-equirectangular-panorama/) - 复用 Larus Canus 在 X 分享的等矩形全景 prompt，重绘一张可用于 3D 漫游的原创奇想蒸汽朋克行走城堡全景图。.
- [GPT Image 2 Xuanzang westward journey map explainer](https://gptimg2.best/prompts/291-gpt-image-2-xuanzang-westward-journey-map-explainer/) - 复用知识猫图解在 X 分享的历史事件地图解说 prompt，重绘一张《玄奘西行》水彩风历史路线信息图。.
- [GPT Image 2 minimal cherry line illustration](https://gptimg2.best/prompts/289-gpt-image-2-minimal-cherry-line-illustration/) - 复用 Aleena Amir 在 X 分享的极简线稿模板，重绘一张带颜色点缀的樱桃编辑插画。.

## Creator Tools

- [Drill](https://drillso.com/) - Product and prompt workflow tool from the same creator.
- [VibeArt](https://vibeart.app/) - Visual creation tool from the same creator.

## Maintainer Workflow

Generated image binaries are served from Cloudflare R2. The repository stores the Next.js site, prompt metadata, and thumbnail manifest.

Local development:

```bash
npm ci
npm run dev
```

Static export:

```bash
npm run build
```

When `NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL` is set, the export points image URLs at R2 and does not copy local gallery images into `out`.

Manual R2 upload, when local generated assets exist:

```bash
npm run upload:r2-assets
```

Deployment is handled by `.github/workflows/pages.yml`: pushes to `main` build the static export and publish `out` to the `gh-pages` branch with `gptimg2.best` as the custom domain.
