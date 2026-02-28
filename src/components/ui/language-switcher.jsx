"use client";

import { LANG_COOKIE } from "@/lib/language-utils";

export function LanguageSwitcher({ lang = "en" }) {
  const setLang = (nextLang) => {
    if (nextLang === lang) return;
    document.cookie = `${LANG_COOKIE}=${nextLang}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return (
    <div className="ui-glass inline-flex items-center gap-1 rounded-xl p-1 text-xs shadow-sm">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-md px-2 py-1 font-semibold transition ${
          lang === "en"
            ? "ui-button-primary text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ml")}
        className={`rounded-md px-2 py-1 font-semibold transition ${
          lang === "ml"
            ? "ui-button-primary text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        മലയാളം
      </button>
    </div>
  );
}
