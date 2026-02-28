"use client";

import { useMemo, useState } from "react";
import { pick } from "@/lib/language-utils";

const ROLES = [
  {
    value: "admin",
    labelEn: "Admin",
    labelMl: "അഡ്മിൻ",
  },
  {
    value: "secretary",
    labelEn: "Panchayath Secretary",
    labelMl: "പഞ്ചായത്ത് സെക്രട്ടറി",
  },
  {
    value: "engineer",
    labelEn: "Section Clerk / Engineer",
    labelMl: "സെക്ഷൻ ക്ലർക്ക് / എഞ്ചിനീയർ",
  },
];

export function ActorLoginForm({ lang = "en" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeRole = useMemo(
    () =>
      ROLES.find((item) => item.value === role)?.[
        lang === "ml" ? "labelMl" : "labelEn"
      ] ?? "",
    [role, lang],
  );

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError(pick(lang, "Email and password are required.", "ഇമെയിലും പാസ്‌വേർഡും ആവശ്യമാണ്."));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        setError(
          result.message ||
            pick(
              lang,
              "Unable to login with provided credentials.",
              "നൽകിയ ക്രെഡൻഷ്യലുകൾ ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യാനായില്ല.",
            ),
        );
        return;
      }

      setSuccess(
        `Logged in as ${result.data.name} (${activeRole}). Token: ${result.data.sessionToken.slice(
          0,
          12,
        )}...`,
      );
    } catch {
      setError(pick(lang, "Server error while logging in. Please retry.", "ലോഗിൻ സമയത്ത് സർവർ പിഴവ്. വീണ്ടും ശ്രമിക്കുക."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ROLES.map((option) => {
          const isActive = role === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-xs font-medium transition ${
                isActive
                  ? "border-teal-700 bg-gradient-to-r from-teal-700 to-cyan-700 text-white shadow-md shadow-cyan-100"
                  : "border-slate-300 bg-white text-slate-700 hover:border-teal-600 hover:bg-teal-50"
              }`}
            >
              <input
                type="radio"
                name="role"
                className="sr-only"
                checked={isActive}
                onChange={() => setRole(option.value)}
              />
              {pick(lang, option.labelEn, option.labelMl)}
            </label>
          );
        })}
      </fieldset>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          {pick(lang, "Email", "ഇമെയിൽ")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={pick(lang, "official@panchayath.gov", "official@panchayath.gov")}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          {pick(lang, "Password", "പാസ്‌വേഡ്")}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={pick(lang, "Enter password", "പാസ്‌വേഡ് നൽകുക")}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          autoComplete="current-password"
        />
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-gradient-to-r from-slate-900 via-teal-800 to-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:from-slate-800 hover:via-teal-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-500"
      >
        {isLoading ? pick(lang, "Signing in...", "ലോഗിൻ ചെയ്യുന്നു...") : pick(lang, "Sign In", "സൈൻ ഇൻ")}
      </button>
    </form>
  );
}
