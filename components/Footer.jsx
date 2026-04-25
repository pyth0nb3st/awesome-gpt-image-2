import { DRILL_URL, REPO_URL, VIBEART_URL, referralUrl } from "../lib/gallery";
import { getCopy } from "../lib/i18n";

export default function Footer({ locale = "en" }) {
  const t = getCopy(locale);

  return (
    <footer>
      <span>{t.footerArchive}</span>
      <span>
        {t.footerToolsPrefix} <a href={referralUrl(DRILL_URL, "footer_drill")}>Drill</a> {t.footerToolsText}{" "}
        <a href={referralUrl(VIBEART_URL, "footer_vibeart")}>VibeArt</a> {t.footerToolsSuffix}
      </span>
      <span>
        {t.footerSource} <a href={referralUrl(REPO_URL, "footer_github")}>{REPO_URL}</a>
      </span>
    </footer>
  );
}
