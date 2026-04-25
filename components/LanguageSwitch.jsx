import { alternateLocale, getCopy, localizedPath } from "../lib/i18n";

export default function LanguageSwitch({ locale = "en", path = "/" }) {
  const t = getCopy(locale);
  const nextLocale = alternateLocale(locale);

  return (
    <a className="language-switch" href={localizedPath(path, nextLocale)} hrefLang={nextLocale}>
      {t.switchLanguage}
    </a>
  );
}
