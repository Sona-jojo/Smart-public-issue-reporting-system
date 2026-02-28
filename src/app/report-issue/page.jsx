import Link from "next/link";
import { DepartmentIcon } from "@/components/report-issue/icons";
import { REPORT_DEPARTMENTS } from "@/lib/report-issue-data";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getServerLang } from "@/lib/language";
import { pick } from "@/lib/language-utils";

export default async function ReportIssueDepartmentPage() {
  const lang = await getServerLang();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#dbeafe_0%,transparent_32%),radial-gradient(circle_at_90%_0%,#bbf7d0_0%,transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f0fdf4_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-blue-100 bg-white/90 p-5 shadow-xl shadow-blue-100/60 backdrop-blur-sm sm:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800 uppercase">
              {pick(lang, "Step 1 of 3", "3 ലെ ഘട്ടം 1")}
            </p>
            <LanguageSwitcher lang={lang} />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {pick(lang, "Select Category", "വിഭാഗം തിരഞ്ഞെടുക്കുക")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {pick(lang, "Choose the category that best matches your complaint.", "നിങ്ങളുടെ പരാതിയോട് ഏറ്റവും അനുയോജ്യമായ വിഭാഗം തിരഞ്ഞെടുക്കുക.")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_DEPARTMENTS.map((department) => (
            <Link
              key={department.slug}
              href={`/report-issue/${department.slug}`}
              className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-emerald-50/70 p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/50"
            >
              <div className="mb-3">
                <DepartmentIcon code={department.icon} />
              </div>
              <h2 className="text-base font-semibold text-slate-900 transition group-hover:text-blue-900">
                {pick(lang, department.name, department.nameMl ?? department.name)}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {pick(
                  lang,
                  `${department.issues.length} issue options`,
                  `${department.issues.length} പ്രശ്ന ഓപ്ഷനുകൾ`,
                )}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          {pick(lang, "Back to Home", "ഹോം പേജിലേക്കു മടങ്ങുക")}
        </Link>
      </section>
    </main>
  );
}
