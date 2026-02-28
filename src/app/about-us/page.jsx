import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getServerLang } from "@/lib/language";
import { pick } from "@/lib/language-utils";

export default async function AboutUsPage() {
  const lang = await getServerLang();
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,#dbeafe_0%,transparent_32%),radial-gradient(circle_at_92%_0%,#bbf7d0_0%,transparent_30%),linear-gradient(180deg,#f8fbff_0%,#f0fdf4_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl shadow-blue-100/60 backdrop-blur-sm sm:p-9">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800 uppercase">
            {pick(lang, "Public Digital Service", "പൊതു ഡിജിറ്റൽ സേവനം")}
          </p>
          <LanguageSwitcher lang={lang} />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {pick(lang, "About Smart Public Issue Reporting System", "സ്മാർട്ട് പൊതു പ്രശ്ന റിപ്പോർട്ടിംഗ് സിസ്റ്റത്തെക്കുറിച്ച്")}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          {pick(
            lang,
            "This platform helps citizens report local public issues and monitor progress transparently. It connects citizens and Panchayath officials through a clear, structured, and accountable issue-resolution process.",
            "ഈ പ്ലാറ്റ്ഫോം പൗരന്മാർക്ക് പ്രാദേശിക പൊതുപ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യാനും പുരോഗതി സുതാര്യമായി നിരീക്ഷിക്കാനും സഹായിക്കുന്നു. വ്യക്തവും ക്രമബദ്ധവും ഉത്തരവാദിത്തമുള്ള പ്രശ്നപരിഹാര പ്രക്രിയയിലൂടെ പൗരന്മാരെയും പഞ്ചായത്ത് ഉദ്യോഗസ്ഥരെയും ഇത് ബന്ധിപ്പിക്കുന്നു.",
          )}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">{pick(lang, "Transparency", "സുതാര്യത")}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {pick(lang, "Track issue status from submission to closure.", "സമർപ്പണത്തിൽ നിന്ന് പരിഹാരത്തോളം സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യാം.")}
            </p>
          </article>
          <article className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">{pick(lang, "Accessibility", "ലഭ്യത")}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {pick(lang, "Citizen-friendly service with simple forms and clear navigation.", "ലളിതമായ ഫോമുകളും വ്യക്തമായ നാവിഗേഷനും ഉള്ള പൗരസൗഹൃദ സേവനം.")}
            </p>
          </article>
          <article className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">{pick(lang, "Accountability", "ഉത്തരവാദിത്തം")}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {pick(lang, "Department-based workflows improve official follow-up and closure.", "ഡിപ്പാർട്ട്മെന്റ് അധിഷ്ഠിത പ്രവാഹം ഔദ്യോഗിക ഫോളോ-അപ്പും പരിഹാരവും മെച്ചപ്പെടുത്തുന്നു.")}
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">{pick(lang, "How It Works", "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
                {pick(lang, "Step 1", "ഘട്ടം 1")}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {pick(lang, "Citizen reports issue by category and location.", "പൗരൻ വിഭാഗവും സ്ഥലവും ചേർത്ത് പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുന്നു.")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                {pick(lang, "Step 2", "ഘട്ടം 2")}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {pick(lang, "Officials review, assign, and process resolution.", "ഉദ്യോഗസ്ഥർ പരിശോധിച്ച് ചുമതല നൽകി പരിഹാരനടപടി നടത്തുന്നു.")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold tracking-wide text-cyan-700 uppercase">
                {pick(lang, "Step 3", "ഘട്ടം 3")}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {pick(lang, "Citizens track using Track ID and receive updates.", "പൗരന്മാർ ട്രാക്ക് ഐഡി ഉപയോഗിച്ച് നില നിരീക്ഷിച്ച് അപ്ഡേറ്റുകൾ ലഭിക്കുന്നു.")}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
        >
          {pick(lang, "Back to Home", "ഹോം പേജിലേക്കു മടങ്ങുക")}
        </Link>
      </section>
    </main>
  );
}
