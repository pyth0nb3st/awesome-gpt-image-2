# Awesome GPT Image 2

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f)](https://gptimg2.best/)
[![Prompts](https://img.shields.io/badge/prompts-280-a34716)](https://gptimg2.best/prompts/)
[![Assets](https://img.shields.io/badge/assets-Cloudflare%20R2-f38020)](https://gptimg2.best/)
[![License](https://img.shields.io/badge/license-code%20MIT%20%2B%20content%20review-lightgrey)](LICENSE.md)

A static GPT Image 2 prompt gallery published at [gptimg2.best](https://gptimg2.best/). The repository stores the Next.js site, prompt metadata, and thumbnail manifest. Generated binary images are served from Cloudflare R2 instead of being committed to Git.

## What is in this repo

- `gallery.json` - source metadata for all public prompt examples.
- `app/`, `components/`, `lib/`, `scripts/` - the static Next.js gallery.
- `assets/thumbs/manifest.json` - thumbnail path and dimension map used by the site.
- `CNAME` - GitHub Pages custom domain for `gptimg2.best`.

## What is not in this repo

Generated image binaries are intentionally not tracked:

- `assets/images/`
- `assets/thumbs/*.jpg`
- `out/`
- `.next/`

The public site resolves image paths through `NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL`. For production this points at the public Cloudflare R2 asset base, so a metadata path such as `assets/images/example.png` is rendered as an R2 URL like `/images/example.png` under that base.

## Local development

Create a local `.env` with the public asset base and, when uploading, R2 credentials:

```bash
NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL=https://<public-r2-base>
GPTIMG_R2_BUCKET=<bucket-name>
R2_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<access-key-id>
R2_SECRET_ACCESS_KEY=<secret-access-key>
```

Then run:

```bash
npm ci
npm run dev
```

For a static export:

```bash
npm run build
```

When `NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL` is set, `npm run build` does not copy local gallery images into `out/`; the exported pages point to R2.

## Adding new prompt examples

The normal automation flow is:

1. Generate a new GPT Image 2 image.
2. Update the source gallery data.
3. Upload the image and generated thumbnail to R2.
4. Commit only metadata changes, usually `gallery.json` and `assets/thumbs/manifest.json`.
5. Push `main`; GitHub Actions exports the site and publishes `out/` to `gh-pages`.

Do not commit generated binary assets. They are local upload inputs only.

## R2 asset maintenance

If local generated assets exist and need to be uploaded manually:

```bash
npm run upload:r2-assets
```

The upload script reads `assets/images` and `assets/thumbs`, uploads objects with long-lived cache headers, and uses S3 credentials when available. If no local asset files exist, it exits without changing R2.

## Deployment

Deployment is handled by `.github/workflows/pages.yml`:

- Builds the static Next.js export on pushes to `main`.
- Reads `NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL` from GitHub Actions repository variables.
- Publishes `out/` to the `gh-pages` branch.
- Keeps `gptimg2.best` as the GitHub Pages custom domain.

## Repository hygiene

This repository is now metadata-first. Keep it that way:

- Keep `gallery.json` as the canonical public example list.
- Keep `assets/thumbs/manifest.json` tracked because the app imports it at build time.
- Keep generated image binaries out of Git; upload them to R2.
- Keep `.env` local only. Never commit Cloudflare tokens or S3 credentials.

If the remote repository size still needs to be reduced after removing tracked assets from `main`, do that as a separate history rewrite task. Rewriting Git history is intentionally not part of normal gallery publishing.
