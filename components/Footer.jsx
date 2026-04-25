import { DRILL_URL, REPO_URL, VIBEART_URL } from "../lib/gallery";
import { getCopy } from "../lib/i18n";

export default function Footer({ locale = "en" }) {
  const t = getCopy(locale);

  return (
    <footer>
      <span>{t.footerArchive}</span>
      <span>
        {t.footerToolsPrefix} <a href={DRILL_URL}>Drill</a> {t.footerToolsText} <a href={VIBEART_URL}>VibeArt</a>{" "}
        {t.footerToolsSuffix}
      </span>
      <span>
        {t.footerSource} <a href={REPO_URL}>{REPO_URL}</a>
      </span>
    </footer>
  );
}
