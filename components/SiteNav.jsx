import { DRILL_URL, REPO_URL, VIBEART_URL, referralUrl } from "../lib/gallery";
import { getCopy, localizedPath } from "../lib/i18n";
import LanguageSwitch from "./LanguageSwitch";

export default function SiteNav({ locale = "en", path = "/" }) {
  const t = getCopy(locale);

  return (
    <nav className="site-nav" aria-label="Site">
      <a href={localizedPath("/", locale)}>{t.siteName}</a>
      <a href={localizedPath("/prompts/", locale)}>{t.examples}</a>
      <a href={localizedPath("/tags/", locale)}>{t.topics}</a>
      <a href={referralUrl(DRILL_URL, "nav_drill")}>Drill</a>
      <a href={referralUrl(VIBEART_URL, "nav_vibeart")}>VibeArt</a>
      <a href={referralUrl(REPO_URL, "nav_github")}>{t.github}</a>
      <LanguageSwitch locale={locale} path={path} />
    </nav>
  );
}
