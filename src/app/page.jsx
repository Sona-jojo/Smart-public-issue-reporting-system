import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.35)), url('/citizen.png')",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(253,230,138,0.42)_0%,transparent_34%),radial-gradient(circle_at_90%_0%,rgba(191,219,254,0.38)_0%,transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.18)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-16 top-32 h-48 w-48 rounded-full bg-emerald-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 bottom-20 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl"
      />

      <header className="relative z-10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/68 px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur-md sm:px-5">
          <div className="flex items-center gap-3">
            <Image
              src="/coconut-tree.svg"
              alt="Nammude Panchayath logo"
              width={42}
              height={42}
              className="h-10 w-10 rounded-full border border-emerald-200 bg-emerald-50 p-1"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">
                Nammude Panchayath
              </p>
              <p className="text-xs text-slate-600 sm:text-sm">
                Smart Public Issue Reporting System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/about-us"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 transition hover:text-emerald-800 sm:px-3 sm:py-2 sm:text-sm"
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 transition hover:text-emerald-800 sm:px-3 sm:py-2 sm:text-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/official-login"
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 sm:text-sm"
            >
              Official Login
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-6 sm:py-14">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/65 bg-white/70 px-5 py-7 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:px-8 sm:py-9">
          <div className="text-center">
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-emerald-800">
              Citizen Service Portal
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Report and Track Public Issues Easily
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base">
              A transparent digital platform for citizens to register local
              public issues and monitor progress from submission to resolution.
            </p>

            <div className="mx-auto mt-8 grid w-full max-w-xl gap-3 sm:mt-10 sm:grid-cols-2">
              <Link
                href="/report-issue"
                className="inline-flex min-h-13 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-400/55 transition hover:-translate-y-0.5 hover:from-emerald-800 hover:to-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                Report Issue
              </Link>
              <Link
                href="/track-issue"
                className="inline-flex min-h-13 items-center justify-center rounded-xl border border-slate-300/90 bg-white/95 px-6 py-3 text-base font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                Track Issue
              </Link>
            </div>

            <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-white/75 bg-gradient-to-r from-white/85 via-emerald-50/85 to-cyan-50/85 p-4 text-left shadow-md shadow-emerald-100/50">
              <h2 className="text-lg font-semibold text-slate-900">
                Why use this platform?
              </h2>
              <ul className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                <li className="rounded-lg border border-emerald-100 bg-white/90 px-3 py-2">
                  Quick issue reporting with complete details.
                </li>
                <li className="rounded-lg border border-emerald-100 bg-white/90 px-3 py-2">
                  Easy tracking with clear status updates.
                </li>
                <li className="rounded-lg border border-emerald-100 bg-white/90 px-3 py-2">
                  Transparent and accountable resolution process.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-4 pb-6 pt-2 text-center text-xs text-white/90 sm:px-6">
        <p>
          &copy; {year} Nammude Panchayath. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
