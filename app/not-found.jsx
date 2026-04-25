import SiteNav from "../components/SiteNav";

export default function NotFound() {
  return (
    <main className="site-shell">
      <SiteNav />
      <header className="page-header">
        <p className="meta">404</p>
        <h1 className="page-title">Page Not Found</h1>
        <p className="lead">This prompt page is not in the current static export. Use the gallery or prompt index to find the saved examples.</p>
      </header>
    </main>
  );
}
