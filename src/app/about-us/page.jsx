import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          About Us
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-700 sm:text-base">
          Smart Public Issue Reporting System is a citizen-focused government
          service platform that helps people report local public issues and
          track their resolution transparently.
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
          The platform is designed to improve accountability between citizens
          and Panchayath officials through clear status updates, structured
          workflows, and timely issue resolution.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Transparency</h2>
            <p className="mt-2 text-sm text-slate-600">
              Citizens can monitor progress from report submission to closure.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Accessibility</h2>
            <p className="mt-2 text-sm text-slate-600">
              Simple, mobile-friendly service for everyday public issue reporting.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Accountability</h2>
            <p className="mt-2 text-sm text-slate-600">
              Role-based workflow ensures responsible follow-up by officials.
            </p>
          </article>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
