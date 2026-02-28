"use client";

import Link from "next/link";
import { useState } from "react";
import { pick } from "@/lib/language-utils";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export function TrackIssueClient({ lang }) {
  const [trackId, setTrackId] = useState("");
  const [searchedTrackId, setSearchedTrackId] = useState("");

  const search = (event) => {
    event.preventDefault();
    const normalized = trackId.trim();
    if (!normalized) return;
    setSearchedTrackId(normalized);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,#dbeafe_0%,transparent_32%),radial-gradient(circle_at_92%_0%,#bbf7d0_0%,transparent_30%),linear-gradient(180deg,#f8fbff_0%,#f0fdf4_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl shadow-blue-100/60 backdrop-blur-sm sm:p-9">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800 uppercase">
            {pick(lang, "Citizen Tracking", "പൗര ട്രാക്കിംഗ്")}
          </p>
          <LanguageSwitcher lang={lang} />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {pick(lang, "Track Your Issue", "നിങ്ങളുടെ പ്രശ്നം ട്രാക്ക് ചെയ്യുക")}
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {pick(
            lang,
            "Enter your Track ID to view complaint status, department updates, and current progress.",
            "പരാതിയുടെ നില, വിഭാഗ അപ്ഡേറ്റുകൾ, നിലവിലെ പുരോഗതി എന്നിവ കാണാൻ നിങ്ങളുടെ ട്രാക്ക് ഐഡി നൽകുക.",
          )}
        </p>

        <form onSubmit={search} className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <label htmlFor="track-id" className="text-sm font-semibold text-slate-800">
            {pick(lang, "Track ID", "ട്രാക്ക് ഐഡി")}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="track-id"
              type="text"
              value={trackId}
              onChange={(event) => setTrackId(event.target.value)}
              placeholder={pick(lang, "Example: SPIRS-123456ABCD", "ഉദാഹരണം: SPIRS-123456ABCD")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-700 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-blue-800 hover:to-emerald-800"
            >
              {pick(lang, "Track", "ട്രാക്ക് ചെയ്യുക")}
            </button>
          </div>
        </form>

        {searchedTrackId ? (
          <section className="mt-7 rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                  {pick(lang, "Track ID", "ട്രാക്ക് ഐഡി")}
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {searchedTrackId}
                </p>
              </div>
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                {pick(lang, "In Progress", "നടന്ന് കൊണ്ടിരിക്കുന്നു")}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold text-blue-700 uppercase">
                  {pick(lang, "Department", "വിഭാഗം")}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {pick(lang, "Roads & Infrastructure", "റോഡുകളും അടിസ്ഥാന സൗകര്യങ്ങളും")}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold text-blue-700 uppercase">
                  {pick(lang, "Priority", "പ്രാധാന്യം")}
                </p>
                <p className="mt-1 text-sm text-slate-700">{pick(lang, "High", "ഉയർന്ന")}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold text-blue-700 uppercase">
                  {pick(lang, "Last Update", "അവസാന അപ്ഡേറ്റ്")}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {pick(lang, "Assigned to field team", "ഫീൽഡ് ടീമിന് ചുമതല നൽകി")}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">{pick(lang, "Timeline", "ടൈംലൈൻ")}</h2>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                <li className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                  {pick(lang, "Complaint submitted successfully.", "പരാതി വിജയകരമായി സമർപ്പിച്ചു.")}
                </li>
                <li className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                  {pick(lang, "Issue verified by Panchayath desk.", "പഞ്ചായത്ത് ഡെസ്ക് പ്രശ്നം സ്ഥിരീകരിച്ചു.")}
                </li>
                <li className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                  {pick(lang, "Work order assigned, progress in process.", "വർക്ക് ഓർഡർ നൽകി, പുരോഗതി തുടരുന്നു.")}
                </li>
              </ul>
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            {pick(lang, "Back to Home", "ഹോം പേജിലേക്കു മടങ്ങുക")}
          </Link>
          <Link
            href="/report-issue"
            className="inline-flex rounded-lg bg-gradient-to-r from-emerald-700 to-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-emerald-800 hover:to-cyan-800"
          >
            {pick(lang, "Report New Issue", "പുതിയ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക")}
          </Link>
        </div>
      </section>
    </main>
  );
}
