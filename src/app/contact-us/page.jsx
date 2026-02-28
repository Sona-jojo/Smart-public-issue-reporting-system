import Link from "next/link";

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Contact Us
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-700 sm:text-base">
          Need help with reporting or tracking a public issue? Reach the support
          desk during office hours.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Citizen Support Desk
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Panchayath Service Center
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Email: support@panchayath.gov
            </p>
            <p className="mt-1 text-sm text-slate-600">Phone: +91 00000 00000</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Office Hours</h2>
            <p className="mt-2 text-sm text-slate-600">
              Monday to Friday: 10:00 AM to 5:00 PM
            </p>
            <p className="mt-1 text-sm text-slate-600">Saturday: 10:00 AM to 1:00 PM</p>
            <p className="mt-1 text-sm text-slate-600">Sunday: Closed</p>
          </article>
        </div>

        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          For emergencies related to public safety, please contact local
          emergency authorities directly.
        </p>

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
