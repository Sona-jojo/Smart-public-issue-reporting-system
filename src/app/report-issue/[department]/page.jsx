import Link from "next/link";
import { notFound } from "next/navigation";
import { DepartmentSubIssueForm } from "@/components/report-issue/department-subissue-form";
import { DepartmentIcon } from "@/components/report-issue/icons";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getDepartmentBySlug } from "@/lib/report-issue-data";
import { getServerLang } from "@/lib/language";
import { pick } from "@/lib/language-utils";

export default async function ReportIssueSubIssuePage({ params }) {
  const lang = await getServerLang();
  const { department } = await params;
  const selectedDepartment = getDepartmentBySlug(department);

  if (!selectedDepartment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,#dbeafe_0%,transparent_32%),radial-gradient(circle_at_90%_0%,#bbf7d0_0%,transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f0fdf4_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-blue-100 bg-white/90 p-5 shadow-xl shadow-blue-100/60 backdrop-blur-sm sm:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3">
            <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800 uppercase">
              {pick(lang, "Step 2 of 3", "3 ലെ ഘട്ടം 2")}
            </p>
            <LanguageSwitcher lang={lang} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <DepartmentIcon code={selectedDepartment.icon} />
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {pick(lang, selectedDepartment.name, selectedDepartment.nameMl ?? selectedDepartment.name)}
            </h1>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            {pick(lang, "Select a sub-issue and submit your complaint details.", "ഉപവിഭാഗ പ്രശ്നം തിരഞ്ഞെടുത്ത് പരാതി വിവരങ്ങൾ സമർപ്പിക്കുക.")}
          </p>
        </div>

        <DepartmentSubIssueForm department={selectedDepartment} lang={lang} />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/report-issue"
            className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            {pick(lang, "Back to Departments", "വിഭാഗങ്ങളിലേക്കു മടങ്ങുക")}
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            {pick(lang, "Back to Home", "ഹോം പേജിലേക്കു മടങ്ങുക")}
          </Link>
        </div>
      </section>
    </main>
  );
}
