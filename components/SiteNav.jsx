import { DRILL_URL, REPO_URL, SITE_URL, VIBEART_URL } from "../lib/gallery";

export default function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site">
      <a href={SITE_URL}>Gallery</a>
      <a href="/prompts/">Prompt pages</a>
      <a href="/tags/">Tag pages</a>
      <a href={DRILL_URL}>Drill</a>
      <a href={VIBEART_URL}>VibeArt</a>
      <a href={REPO_URL}>GitHub</a>
    </nav>
  );
}
