# Awesome GPT Image 2

A public gallery of playful GPT Image experiments: prompts, outputs, use-case patterns, and reusable image-generation ideas.

This repository is built from local Codex image-generation sessions. Each gallery card keeps the generated image and the prompt that produced it, so the repo works as both a visual archive and a prompt notebook.

**Live site:** https://pyth0nb3st.github.io/awesome-gpt-image-2/

## Gallery

- **77 generated images**
- **77 recovered prompts**
- Static site ready for **GitHub Pages**
- Images are stored in `assets/images/`
- Metadata lives in `gallery.json`

Open `index.html` locally, or use the GitHub Pages URL once Pages finishes deploying.

## What Is Inside

The collection focuses on playful GPT Image use cases:

- Visual research boards
- Fictional product systems
- Prompt-driven game mechanics
- UI fiction and speculative interfaces
- Multilingual poster and layout tests
- Storyboard and continuity experiments
- Educational diagrams and infographics
- Worldbuilding artifacts, maps, labels, and props

## Repo Structure

```text
.
├── index.html                 # Static gallery page
├── gallery.json               # Image metadata, prompts, tags, dimensions
├── assets/images/             # Generated image files used by the public site
└── scripts/render-gallery.mjs # Rebuilds index.html from gallery.json
```

## Rebuild

```bash
node scripts/render-gallery.mjs
```

## Add A New Image

1. Copy the generated image into `assets/images/`.
2. Add a record to `gallery.json` with `title`, `caption`, `path`, `width`, `height`, `tags`, and `prompt`.
3. Run `node scripts/render-gallery.mjs`.
4. Commit and push.

## Notes

- Images are AI-generated and should be treated as design research artifacts.
- Prompts may be revised prompts captured from image generation session logs.
- This is not an official OpenAI repository.
