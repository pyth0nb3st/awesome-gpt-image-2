import { DRILL_URL, REPO_URL, VIBEART_URL } from "../lib/gallery";

export default function Footer() {
  return (
    <footer>
      <span>
        Built from Codex image-generation session logs. Images, prompts, tags, and metadata are preserved for static hosting
        and search indexing.
      </span>
      <span>
        Creator tools: <a href={DRILL_URL}>Drill</a> for deeper reading workflows and <a href={VIBEART_URL}>VibeArt</a> for AI
        visual creation.
      </span>
      <span>
        GitHub source: <a href={REPO_URL}>{REPO_URL}</a>
      </span>
    </footer>
  );
}
