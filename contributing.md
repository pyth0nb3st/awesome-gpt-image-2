# Contributing

Suggestions and corrections are welcome. Useful contributions include missing attribution, better tags, clearer prompt text, and new examples that add a distinct GPT Image 2 use case.

Before opening a pull request:

- Keep entries useful, specific, and non-duplicative.
- Include the full prompt text and source attribution when available.
- Do not commit generated binary assets; upload them to the configured object bucket.
- Keep `gallery.json` as the canonical source for public examples.
- Keep `assets/thumbs/manifest.json` tracked because the static site imports it at build time.
- Keep local secrets in `.env` only; never commit Cloudflare tokens or S3 credentials.

Generated image binaries are served from Cloudflare R2. Pull requests should usually change metadata, site code, or documentation, not image binaries.
