import { DRILL_URL, REPO_URL, VIBEART_URL, referralUrl } from "../lib/gallery";
import { getCopy, localizedPath } from "../lib/i18n";
import { GitHubIcon } from "./Icons";
import LanguageSwitch from "./LanguageSwitch";

export default function SiteNav({ locale = "en", path = "/" }) {
  const t = getCopy(locale);

  return (
    <nav className="site-nav" aria-label="Site">
      <a href={localizedPath("/", locale)}>{t.siteName}</a>
      <a href={localizedPath("/prompts/", locale)}>{t.examples}</a>
      <a href={localizedPath("/tags/", locale)}>{t.topics}</a>
      <a href={localizedPath("/lucky/", locale)}>{t.lucky}</a>
      <a className="nav-partner" href={referralUrl(DRILL_URL, "nav_drill")}>Drill</a>
      <a className="nav-partner" href={referralUrl(VIBEART_URL, "nav_vibeart")}>VibeArt</a>
      <a
        className="icon-link"
        href={referralUrl(REPO_URL, "nav_github")}
        aria-label={t.github}
        title={t.github}
      >
        <GitHubIcon />
      </a>
      <LanguageSwitch locale={locale} path={path} />
    </nav>
  );
}
