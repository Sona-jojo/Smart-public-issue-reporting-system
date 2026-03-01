"use client";

import { useMemo, useState } from "react";
import { pick } from "@/lib/language-utils";
import { OfficialWorkflowForm } from "@/components/auth/official-workflow-form";

const ROLES = [
  { value: "admin", labelEn: "Admin", labelMl: "Admin" },
  { value: "secretary", labelEn: "Panchayath Secretary", labelMl: "Panchayath Secretary" },
  { value: "engineer", labelEn: "Section Clerk / Engineer", labelMl: "Section Clerk / Engineer" },
];

export function ActorLoginForm({ lang = "en" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionUser, setSessionUser] = useState(null);

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
    setSessionUser(null);

    if (!email || !password) {
      setError(pick(lang, "Email and password are required.", "Email and password are required."));
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
              "Unable to login with provided credentials.",
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
      setSessionUser(result.data);
    } catch {
      setError(pick(lang, "Server error while logging in. Please retry.", "Server error while logging in. Please retry."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-5" onSubmit={submit}>
        <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ROLES.map((option) => {
            const isActive = role === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-xs font-medium transition ${
                  isActive
                    ? "ui-button-primary border-transparent text-white"
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
            {pick(lang, "Email", "Email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="official@panchayath.gov"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            {pick(lang, "Password", "Password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={pick(lang, "Enter password", "Enter password")}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <p className="ui-surface rounded-lg px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        {success ? (
          <p className="ui-surface rounded-lg px-3 py-2 text-sm text-emerald-700">{success}</p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="ui-button-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? pick(lang, "Signing in...", "Signing in...") : pick(lang, "Sign In", "Sign In")}
        </button>
      </form>

      {sessionUser ? (
        <OfficialWorkflowForm
          lang={lang}
          operatorName={sessionUser.name || activeRole || "Official"}
        />
      ) : null}
    </>
  );
}
