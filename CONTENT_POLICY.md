# Content And Source Policy

This repository is a public research archive for GPT Image 2 prompt experiments.

## Source Tracking

Every gallery item must declare provenance in `gallery.json`.

- Use `provenance.status: "original_generated"` only when the prompt and concept are original to this project.
- Use `provenance.status: "external_attributed"` when any external prompt, article, image, repository, gallery, or other reference materially shaped the result.
- Use `provenance.status: "needs_review"` for legacy records or any item whose source status is not clear enough to license broadly.
- Do not publish an externally inspired item if the source URL, author or publisher, license or permission status, access date, and usage role cannot be recorded.

External sources must use this shape:

```json
{
  "title": "Source title",
  "url": "https://example.com/source",
  "authorOrPublisher": "Author or publisher",
  "license": "License name or permission note",
  "accessedAt": "YYYY-MM-DD",
  "usedAs": "inspiration | reference | prompt_pattern | quote"
}
```

## Safer Reuse Rules

- Prefer original prompt structures instead of copying third-party prompts.
- Do not copy substantial prompt text unless the source license or permission clearly allows it.
- Attribute inspiration even when it is not copied verbatim.
- Avoid real brands, trademarks, celebrity likenesses, copyrighted characters, and living-artist style imitation.
- Keep generated product, brand, character, place, and dataset details fictional unless explicit rights are known.
- Remove or mark as `needs_review` when provenance is uncertain.

## Safety Constraints

Gallery items must avoid:

- Political persuasion, elections, parties, public political figures, or propaganda.
- Harmful, illegal, or operationally dangerous instructions.
- Sexual, nude, or explicit content.
- Graphic violence, gore, torture, or dismemberment.

Run the policy check before publishing:

```bash
npm run validate:gallery
```
