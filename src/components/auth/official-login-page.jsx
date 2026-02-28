import { ActorLoginForm } from "@/components/auth/actor-login-form";
import Image from "next/image";
import { BackArrowButton } from "@/components/ui/back-arrow-button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getServerLang } from "@/lib/language";
import { pick } from "@/lib/language-utils";

export async function OfficialLoginPage() {
  const lang = await getServerLang();

  return (
    <div className="ui-bg min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <header className="ui-glass mb-6 rounded-2xl p-4 sm:mb-8 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <BackArrowButton lang={lang} />
            <LanguageSwitcher lang={lang} />
            <div className="flex items-center gap-3">
              <Image
                src="/coconut-tree.svg"
                alt="Nammude Panchayath logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-emerald-200 bg-emerald-50 p-1"
              />
              <div className="text-right">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">
                  Nammude Panchayath
                </p>
                <p className="text-xs text-slate-600 sm:text-sm">
                  {pick(lang, "Official Access", "ഓഫീഷ്യൽ ആക്സസ്")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="ui-glass mx-auto w-full max-w-xl rounded-3xl p-6 sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {pick(lang, "Smart Public Issue Reporting System", "സ്മാർട്ട് പൊതു പ്രശ്ന റിപ്പോർട്ടിംഗ് സിസ്റ്റം")}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            {pick(lang, "Admin, Secretary, Clerk and Engineer login portal.", "അഡ്മിൻ, സെക്രട്ടറി, ക്ലർക്ക്, എഞ്ചിനീയർ ലോഗിൻ പോർട്ടൽ.")}
          </p>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">{pick(lang, "Login", "ലോഗിൻ")}</h2>
          <div className="mt-6">
            <ActorLoginForm lang={lang} />
          </div>

          <p className="ui-surface mt-6 rounded-xl px-4 py-3 text-sm leading-6 text-slate-700">
            {pick(
              lang,
              "Secure login access for internal users only. Citizens will use a separate complaint portal with Track ID based status view.",
              "ഇത് ആഭ്യന്തര ഉപയോക്താക്കൾക്കുള്ള സുരക്ഷിത ലോഗിൻ സംവിധാനമാണ്. പൗരന്മാർ ട്രാക്ക് ഐഡി അടിസ്ഥാനത്തിലുള്ള വേർതിരിച്ച പരാതിപോർട്ടൽ ഉപയോഗിക്കും.",
            )}
          </p>
        </section>
      </main>
    </div>
  );
}
