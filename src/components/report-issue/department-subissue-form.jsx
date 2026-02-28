"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DepartmentIcon, IssueIcon } from "@/components/report-issue/icons";
import { buildTrackId, DISTRICT_OPTIONS } from "@/lib/report-issue-data";
import { pick } from "@/lib/language-utils";
import { getSupabaseClient } from "@/lib/supabase/client";

export function DepartmentSubIssueForm({ department, lang = "en" }) {
  const router = useRouter();
  const issuesTable =
    process.env.NEXT_PUBLIC_SUPABASE_ISSUES_TABLE || "issues";

  const issueOptions = useMemo(
    () => [
      ...department.issues,
      {
        slug: "other",
        label: "Other",
        labelMl: "മറ്റ്",
        description: "Any issue not listed above.",
        descriptionMl: "മുകളിലെ പട്ടികയിൽ ഇല്ലാത്ത പ്രശ്നം.",
      },
    ],
    [department.issues],
  );

  const [selectedIssueSlug, setSelectedIssueSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [district, setDistrict] = useState("");
  const [panchayath, setPanchayath] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedIssue = useMemo(
    () => issueOptions.find((issue) => issue.slug === selectedIssueSlug) ?? null,
    [issueOptions, selectedIssueSlug],
  );

  const panchayathOptions = useMemo(
    () => (district ? DISTRICT_OPTIONS[district] ?? [] : []),
    [district],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageChange = (event) => {
    const fileList = Array.from(event.target.files ?? []);
    const selected = fileList.slice(0, 3);
    setImagePreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const detectLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        pick(
          lang,
          "GPS is not supported in this browser.",
          "ഈ ബ്രൗസറിൽ GPS പിന്തുണയില്ല.",
        ),
      );
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        });
        setIsLocating(false);
      },
      () => {
        setLocationError(
          pick(
            lang,
            "Unable to detect current location. Please allow GPS permission.",
            "നിലവിലെ സ്ഥാനം കണ്ടെത്താനായില്ല. GPS അനുമതി നൽകുക.",
          ),
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!selectedIssueSlug || !description || !priority) {
      setSubmitError(
        pick(
          lang,
          "Please fill all required fields before submitting.",
          "സമർപ്പിക്കുന്നതിന് മുമ്പ് ആവശ്യമായ എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക.",
        ),
      );
      return;
    }

    if (!isAnonymous && !email && !phone) {
      setSubmitError(
        pick(
          lang,
          "Provide at least Email or Mobile Number, or choose anonymous submission.",
          "കുറഞ്ഞത് ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ നൽകുക, അല്ലെങ്കിൽ അനാമധേയ സമർപ്പണം തിരഞ്ഞെടുക്കുക.",
        ),
      );
      return;
    }

    const autoLocationText =
      location?.latitude && location?.longitude
        ? `${location.latitude}, ${location.longitude}`
        : "";
    const manualLocationText =
      district && panchayath ? `${district}, ${panchayath}` : "";
    const finalLocation = autoLocationText || manualLocationText;

    if (!finalLocation) {
      setSubmitError(
        pick(
          lang,
          "Provide location using Auto-detect GPS or manual District + Panchayath.",
          "à´¸àµà´¥à´²à´‚ à´¨àµ½à´•àµà´•: GPS à´¸àµà´µà´¯à´‚ à´•à´£àµà´Ÿàµ†à´¤àµà´¤àµà´• à´…à´²àµà´²àµ†à´™àµà´•à´¿àµ½ à´œà´¿à´²àµà´² + à´ªà´žàµà´šà´¾à´¯à´¤àµà´¤àµ à´¤à´¿à´°à´žàµà´žàµ†à´Ÿàµà´•àµà´•àµà´•.",
        ),
      );
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setSubmitError(
        pick(
          lang,
          "Supabase config is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
          "Supabase ക്രമീകരണം ലഭ്യമല്ല. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY എന്നിവ നൽകുക.",
        ),
      );
      return;
    }

    const issueLabel =
      selectedIssue?.[lang === "ml" ? "labelMl" : "label"] ??
      pick(lang, "Other", "മറ്റ്");

    const trackId = buildTrackId();
    setIsSubmitting(true);

    const nowIso = new Date().toISOString();
    const fallbackRecord = {
      track_id: trackId,
      category: department.name,
      subcategory: issueLabel,
      description,
      priority,
      district: district || null,
      panchayath: panchayath || null,
      location: finalLocation,
      reported_at: nowIso,
      submitted_by: isAnonymous ? "Anonymous" : "Citizen",
      reported_email: isAnonymous ? null : email || null,
      reported_phone: isAnonymous ? null : phone || null,
      is_anonymous: isAnonymous,
      status: "Pending",
    };

    try {
      const raw = localStorage.getItem("spirs_reports");
      const parsed = raw ? JSON.parse(raw) : [];
      const next = [fallbackRecord, ...parsed].slice(0, 100);
      localStorage.setItem("spirs_reports", JSON.stringify(next));
    } catch {
      // Ignore local storage errors.
    }

    let error = null;
    try {
      const payload = {
        // Keep both variants so whichever exists in DB is filled.
        trackid: trackId,
        track_id: trackId,
        category: department.name,
        sub_issue: issueLabel,
        subcategory: issueLabel,
        issue: issueLabel,
        description,
        priority,
        district: district || null,
        panchayath: panchayath || null,
        location: finalLocation,
        phone: isAnonymous ? null : phone || null,
        email: isAnonymous ? null : email || null,
        reported_phone: isAnonymous ? null : phone || null,
        reported_email: isAnonymous ? null : email || null,
        is_anonymous: isAnonymous,
        status: "Pending",
        escalation_count: 0,
        resolution_deadline: null,
        created_at: nowIso,
        updated_at: nowIso,
      };

      // Retry by removing unknown columns one by one from Supabase error message.
      let workingPayload = { ...payload };
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const result = await supabase.from(issuesTable).insert(workingPayload);
        if (!result.error) {
          error = null;
          break;
        }

        const message = String(result.error.message || "");
        const missingColumn = message.match(/Could not find the '([^']+)' column/i)?.[1];
        if (missingColumn && missingColumn in workingPayload) {
          delete workingPayload[missingColumn];
          continue;
        }

        error = result.error;
        break;
      }
    } catch (caught) {
      error = caught instanceof Error ? caught : new Error(String(caught));
    }

    if (error) {
      setIsSubmitting(false);
      const message =
        String(error.message || "").includes("Failed to fetch")
          ? pick(
              lang,
              "Failed to reach Supabase (network/DNS/config). Verify NEXT_PUBLIC_SUPABASE_URL and key, then restart `npm run dev`.",
              "Supabase-ലേക്ക് എത്താനായില്ല (നെറ്റ്‌വർക്ക്/DNS/ക്രമീകരണം). NEXT_PUBLIC_SUPABASE_URL, key പരിശോധിച്ച് `npm run dev` റീസ്റ്റാർട്ട് ചെയ്യുക.",
            )
          : pick(
              lang,
              `Failed to save complaint in Supabase: ${error.message}`,
              `Supabase-ൽ പരാതി സേവ് ചെയ്യാനായില്ല: ${error.message}`,
            );
      setSubmitError(
        message,
      );
      return;
    }

    const query = new URLSearchParams({
      trackId,
      department: department.slug,
      issue: selectedIssueSlug,
      issueLabel,
    }).toString();

    setIsSubmitting(false);
    router.push(`/report-issue/confirmation?${query}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="ui-surface rounded-2xl p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-800">
          {pick(lang, "Select Sub-Issue", "ഉപപ്രശ്നം തിരഞ്ഞെടുക്കുക")}
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          {pick(lang, "Choose one issue type.", "ഒരു പ്രശ്നതരം തിരഞ്ഞെടുക്കുക.")}
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {issueOptions.map((issue) => {
            const isActive = selectedIssueSlug === issue.slug;
            return (
              <button
                key={issue.slug}
                type="button"
                onClick={() => setSelectedIssueSlug(issue.slug)}
                className={`rounded-xl border p-3 text-left transition ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50/70 hover:to-cyan-50/70 hover:shadow-sm"
                }`}
              >
                <div className="mb-2">
                  {issue.slug === "other" ? (
                    <DepartmentIcon code={department.icon} />
                  ) : (
                    <IssueIcon issueSlug={issue.slug} />
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {issue[lang === "ml" ? "labelMl" : "label"] ?? issue.label}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {issue[lang === "ml" ? "descriptionMl" : "description"] ??
                    issue.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ui-glass rounded-2xl p-4 sm:p-5">
        <label htmlFor="description" className="text-sm font-semibold text-slate-800">
          {pick(lang, "Issue Description", "പ്രശ്ന വിവരണം")}
        </label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={
            selectedIssue
              ? pick(
                  lang,
                  `Describe ${(selectedIssue.label ?? "").toLowerCase()} with exact location and timeline.`,
                  `സ്ഥലവും സമയവും ചേർത്ത് ${(selectedIssue.labelMl ?? selectedIssue.label ?? "").toLowerCase()} വിശദമായി രേഖപ്പെടുത്തുക.`,
                )
              : pick(
                  lang,
                  "Select a sub-issue above, then describe the complaint in detail.",
                  "മുകളിലെ ഉപപ്രശ്നം തിരഞ്ഞെടുക്കി പരാതി വിശദമായി എഴുതുക.",
                )
          }
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
          required
        />
      </div>

      <div className="ui-glass rounded-2xl p-4 sm:p-5">
        <label className="text-sm font-semibold text-slate-800">
          {pick(lang, "Upload Images (up to 3)", "ചിത്രങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക (പരമാവധി 3)")}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-emerald-700"
        />
        {imagePreviews.length ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {imagePreviews.map((src, index) => (
              <Image
                key={`${src}-${index}`}
                src={src}
                alt={`Preview ${index + 1}`}
                width={320}
                height={192}
                unoptimized
                className="h-24 w-full rounded-lg border border-slate-200 object-cover"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="ui-glass rounded-2xl p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-800">
          {pick(lang, "Location", "സ്ഥലം")}
        </h2>
        <button
          type="button"
          onClick={detectLocation}
          className="ui-button-primary mt-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition"
        >
          {isLocating
            ? pick(lang, "Detecting...", "കണ്ടെത്തുന്നു...")
            : pick(lang, "Auto-detect GPS Location", "GPS സ്ഥാനം സ്വയം കണ്ടെത്തുക")}
        </button>

        {location ? (
          <p className="mt-2 text-sm text-emerald-700">
            {pick(lang, "Detected", "കണ്ടെത്തിയത്")}: {location.latitude},{" "}
            {location.longitude}
          </p>
        ) : null}

        {locationError ? (
          <p className="mt-2 text-sm text-red-700">{locationError}</p>
        ) : null}

        <p className="mt-3 text-xs text-slate-600">
          {pick(lang, "Or select location manually below.", "അല്ലെങ്കിൽ താഴെ കൈമാറി സ്ഥലം തിരഞ്ഞെടുക്കുക.")}
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="district" className="text-sm font-medium text-slate-700">
              {pick(lang, "District", "ജില്ല")}
            </label>
            <select
              id="district"
              value={district}
              onChange={(event) => {
                setDistrict(event.target.value);
                setPanchayath("");
              }}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
            >
              <option value="">{pick(lang, "Select district", "ജില്ല തിരഞ്ഞെടുക്കുക")}</option>
              {Object.keys(DISTRICT_OPTIONS).map((districtName) => (
                <option key={districtName} value={districtName}>
                  {districtName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="panchayath" className="text-sm font-medium text-slate-700">
              {pick(lang, "Panchayath", "പഞ്ചായത്ത്")}
            </label>
            <select
              id="panchayath"
              value={panchayath}
              onChange={(event) => setPanchayath(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
            >
              <option value="">{pick(lang, "Select panchayath", "പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക")}</option>
              {panchayathOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="ui-glass rounded-2xl p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-800">
          {pick(lang, "Priority", "പ്രാധാന്യം")}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="cursor-pointer rounded-xl border border-emerald-300 bg-emerald-50 p-3">
            <input
              type="radio"
              name="priority"
              value="LOW"
              checked={priority === "LOW"}
              onChange={() => setPriority("LOW")}
              className="mr-2"
            />
            <span className="font-semibold text-emerald-800">
              {pick(lang, "Low", "കുറവ്")}
            </span>
          </label>
          <label className="cursor-pointer rounded-xl border border-amber-300 bg-amber-50 p-3">
            <input
              type="radio"
              name="priority"
              value="HIGH"
              checked={priority === "HIGH"}
              onChange={() => setPriority("HIGH")}
              className="mr-2"
            />
            <span className="font-semibold text-amber-800">
              {pick(lang, "High", "ഉയർന്ന")}
            </span>
          </label>
          <label className="cursor-pointer rounded-xl border border-red-300 bg-red-50 p-3">
            <input
              type="radio"
              name="priority"
              value="URGENT"
              checked={priority === "URGENT"}
              onChange={() => setPriority("URGENT")}
              className="mr-2"
            />
            <span className="font-semibold text-red-800">
              {pick(lang, "Urgent", "അത്യാവശ്യം")}
            </span>
          </label>
        </div>
      </div>

      <div className="ui-glass rounded-2xl p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-800">
          {pick(lang, "Citizen Info (Optional)", "പൗര വിവരങ്ങൾ (ഐച്ഛികം)")}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={pick(lang, "Mobile Number", "മൊബൈൽ നമ്പർ")}
            disabled={isAnonymous}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={pick(lang, "Email address", "ഇമെയിൽ വിലാസം")}
            disabled={isAnonymous}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => setIsAnonymous(event.target.checked)}
          />
          {pick(lang, "Submit anonymously", "അനാമധേയം ആയി സമർപ്പിക്കുക")}
        </label>
      </div>

      {submitError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="ui-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting
          ? pick(lang, "Submitting...", "സമർപ്പിക്കുന്നു...")
          : pick(lang, "Submit Complaint", "പരാതി സമർപ്പിക്കുക")}
      </button>
    </form>
  );
}
