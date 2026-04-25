import SiteNav from "../../components/SiteNav";
import { getCopy } from "../../lib/i18n";

const t = getCopy("zh");

export default function ZhNotFound() {
  return (
    <main className="site-shell">
      <SiteNav locale="zh" path="/zh/" />
      <header className="page-header">
        <p className="meta">404</p>
        <h1 className="page-title">{t.notFoundTitle}</h1>
        <p className="lead">{t.notFoundBody}</p>
      </header>
    </main>
  );
}
