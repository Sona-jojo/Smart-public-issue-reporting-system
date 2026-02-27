"use client";

import { useMemo, useState } from "react";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "secretary", label: "Panchayath Secretary" },
  { value: "engineer", label: "Section Clerk / Engineer" },
];

export function ActorLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeRole = useMemo(
    () => ROLES.find((item) => item.value === role)?.label ?? "",
    [role],
  );

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
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
        setError(result.message || "Unable to login with provided credentials.");
        return;
      }

      setSuccess(
        `Logged in as ${result.data.name} (${activeRole}). Token: ${result.data.sessionToken.slice(
          0,
          12,
        )}...`,
      );
    } catch {
      setError("Server error while logging in. Please retry.");
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
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-teal-600"
              }`}
            >
              <input
                type="radio"
                name="role"
                className="sr-only"
                checked={isActive}
                onChange={() => setRole(option.value)}
              />
              {option.label}
            </label>
          );
        })}
      </fieldset>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="official@panchayath.gov"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-600"
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
        className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
