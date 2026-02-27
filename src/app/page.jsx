import { ActorLoginForm } from "@/components/auth/actor-login-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#ccfbf1_0%,#f6f7fb_45%),radial-gradient(circle_at_80%_0%,#bae6fd_0%,transparent_35%)] px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <header className="mb-6 text-center sm:mb-8">
          <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold tracking-wide text-teal-800 uppercase">
            Panchayath Governance Platform
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Smart Public Issue Reporting System
          </h1>
        </header>

        <section className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-[var(--panel)] p-6 shadow-xl sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
          <div className="mt-6">
            <ActorLoginForm />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-teal-100 bg-white/85 p-6 shadow-sm backdrop-blur-sm sm:mt-8 sm:p-8">
          <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Secure login access for internal users only. Citizens will use a
            separate complaint portal with Track ID based status view.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Secretary assigns issues, deadlines, and escalations.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Section officials update progress and upload proof.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Admin controls users, categories, and analytics.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              Every action will be captured through audit trails.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
