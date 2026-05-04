import { DRILL_URL, REPO_URL, VIBEART_URL, referralUrl } from "../lib/gallery";
import { getCopy } from "../lib/i18n";
import DisclaimerBehavior from "./DisclaimerBehavior";
import { CloseIcon, GitHubIcon } from "./Icons";

export default function Footer({ locale = "en" }) {
  const t = getCopy(locale);
  const policyUrl = `${REPO_URL}/blob/main/CONTENT_POLICY.md`;

  return (
    <>
      <footer className="site-footer">
        <span>{t.footerArchive}</span>
        <span>{t.footerDisclaimer}</span>
        <span className="footer-row">
          <span>
            {t.footerToolsPrefix} <a href={referralUrl(DRILL_URL, "footer_drill")}>Drill</a> {t.footerToolsText}{" "}
            <a href={referralUrl(VIBEART_URL, "footer_vibeart")}>VibeArt</a> {t.footerToolsSuffix}
          </span>
          <span className="footer-links">
            <a href={referralUrl(policyUrl, "footer_policy")}>{t.policy}</a>
            <a
              className="icon-link"
              href={referralUrl(REPO_URL, "footer_github")}
              aria-label={t.github}
              title={t.github}
            >
              <GitHubIcon />
            </a>
          </span>
        </span>
      </footer>
      <aside className="fixed-disclaimer" aria-label={t.fixedDisclaimerLabel} data-disclaimer>
        <span>{t.fixedDisclaimer}</span>
        <nav aria-label={t.fixedDisclaimerLabel}>
          <a href={referralUrl(policyUrl, "fixed_policy")}>{t.policy}</a>
          <a
            className="icon-link"
            href={referralUrl(REPO_URL, "fixed_github")}
            aria-label={t.github}
            title={t.github}
          >
            <GitHubIcon />
          </a>
          <button type="button" className="disclaimer-dismiss" data-disclaimer-dismiss aria-label={t.dismissDisclaimer}>
            <CloseIcon />
          </button>
        </nav>
      </aside>
      <DisclaimerBehavior />
    </>
  );
}
