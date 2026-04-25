import { DRILL_URL, REPO_URL, VIBEART_URL } from "../lib/gallery";
import { getCopy, localizedPath } from "../lib/i18n";
import LanguageSwitch from "./LanguageSwitch";

export default function SiteNav({ locale = "en", path = "/" }) {
  const t = getCopy(locale);

  return (
    <nav className="site-nav" aria-label="Site">
      <a href={localizedPath("/", locale)}>{t.siteName}</a>
      <a href={localizedPath("/prompts/", locale)}>{t.examples}</a>
      <a href={localizedPath("/tags/", locale)}>{t.topics}</a>
      <a href={DRILL_URL}>Drill</a>
      <a href={VIBEART_URL}>VibeArt</a>
      <a href={REPO_URL}>{t.github}</a>
      <LanguageSwitch locale={locale} path={path} />
    </nav>
  );
}
