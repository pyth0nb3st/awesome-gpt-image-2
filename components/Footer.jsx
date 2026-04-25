import { DRILL_URL, REPO_URL, VIBEART_URL, referralUrl } from "../lib/gallery";
import { getCopy } from "../lib/i18n";

export default function Footer({ locale = "en" }) {
  const t = getCopy(locale);
  const policyUrl = `${REPO_URL}/blob/main/CONTENT_POLICY.md`;

  return (
    <>
      <footer className="site-footer">
        <span>{t.footerArchive}</span>
        <span>{t.footerDisclaimer}</span>
        <span>
          {t.footerToolsPrefix} <a href={referralUrl(DRILL_URL, "footer_drill")}>Drill</a> {t.footerToolsText}{" "}
          <a href={referralUrl(VIBEART_URL, "footer_vibeart")}>VibeArt</a> {t.footerToolsSuffix}
        </span>
        <span>
          {t.footerSource} <a href={referralUrl(REPO_URL, "footer_github")}>{REPO_URL}</a> ·{" "}
          <a href={referralUrl(policyUrl, "footer_policy")}>{t.policy}</a>
        </span>
      </footer>
      <aside className="fixed-disclaimer" aria-label={t.fixedDisclaimerLabel}>
        <span>{t.fixedDisclaimer}</span>
        <nav aria-label={t.fixedDisclaimerLabel}>
          <a href={referralUrl(policyUrl, "fixed_policy")}>{t.policy}</a>
          <a href={referralUrl(REPO_URL, "fixed_github")}>{t.github}</a>
        </nav>
      </aside>
    </>
  );
}
