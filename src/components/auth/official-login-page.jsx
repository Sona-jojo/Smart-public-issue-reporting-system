import { ActorLoginForm } from "@/components/auth/actor-login-form";
import Image from "next/image";
import { BackArrowButton } from "@/components/ui/back-arrow-button";

export function OfficialLoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,#fde68a_0%,transparent_35%),radial-gradient(circle_at_90%_0%,#bfdbfe_0%,transparent_30%),linear-gradient(140deg,#f8fafc_0%,#ecfdf5_45%,#f0f9ff_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-emerald-100/70 backdrop-blur-md sm:mb-8 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <BackArrowButton />
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
                  Official Access
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-xl rounded-3xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-emerald-100/70 backdrop-blur-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Smart Public Issue Reporting System
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Admin, Secretary, Clerk and Engineer login portal.
          </p>
          <h2 className="mt-6 text-xl font-semibold text-slate-900">Login</h2>
          <div className="mt-6">
            <ActorLoginForm />
          </div>

          <p className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700">
            Secure login access for internal users only. Citizens will use a
            separate complaint portal with Track ID based status view.
          </p>
        </section>
      </main>
    </div>
  );
}
