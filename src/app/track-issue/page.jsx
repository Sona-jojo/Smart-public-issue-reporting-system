import Link from "next/link";

export default function TrackIssuePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Track Issue
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Issue tracking page is ready for integration with Track ID lookup and
          status timeline.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
