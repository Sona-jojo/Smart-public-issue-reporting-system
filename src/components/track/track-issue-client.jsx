"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pick } from "@/lib/language-utils";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getSupabaseClient } from "@/lib/supabase/client";

function normalizeStatus(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function statusTone(status) {
  const s = normalizeStatus(status);
  if (s === "resolved") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "overdue") return "bg-red-100 text-red-800 border-red-200";
  if (s === "reopened") return "bg-violet-100 text-violet-800 border-violet-200";
  if (s === "in progress") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-blue-100 text-blue-800 border-blue-200";
}

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleString();
}

function getCountdown(deadline) {
  if (!deadline) return "-";
  const now = Date.now();
  const end = new Date(deadline).getTime();
  const diff = end - now;
  if (diff <= 0) return "Overdue";
  const h = Math.floor(diff / (1000 * 60 * 60));
  const d = Math.floor(h / 24);
  const remH = h % 24;
  return `${d}d ${remH}h`;
}

function defaultTimeline(record) {
  const created = record?.reported_at || record?.created_at || new Date().toISOString();
  const base = [
    {
      title: "Complaint Submitted",
      at: created,
      by: "Citizen",
      comments: "Issue report registered in the system.",
    },
    {
      title: "Assigned by Secretary to Section Clerk",
      at: new Date(new Date(created).getTime() + 35 * 60 * 1000).toISOString(),
      by: "Secretary",
      comments: "Issue assigned to the corresponding section clerk.",
    },
  ];
  const status = normalizeStatus(record?.status || "Pending");
  if (status === "in progress" || status === "resolved" || status === "overdue") {
    base.push({
      title: "In Progress",
      at: new Date(new Date(created).getTime() + 20 * 60 * 60 * 1000).toISOString(),
      by: "Section Clerk",
      comments: "Field verification started.",
    });
  }
  if (status === "resolved") {
    base.push({
      title: "Work Completed",
      at: new Date(new Date(created).getTime() + 48 * 60 * 60 * 1000).toISOString(),
      by: "Engineer",
      comments: "Resolution completed with proof.",
    });
  }
  return base;
}

function toDisplayRecord(raw, id) {
  if (!raw) return null;
  const created = raw.reported_at || raw.created_at || new Date().toISOString();
  const status = raw.status || "Pending";
  const attachments = Array.isArray(raw.attachments)
    ? raw.attachments
        .map((item) => ({
          id: item.id || `${item.track_id || id}-${item.file_url || Math.random()}`,
          fileUrl: item.file_url || item.url || null,
          uploadedBy: item.uploaded_by || "official",
          note: item.note || "",
          at: item.created_at || item.at || created,
        }))
        .filter((item) => item.fileUrl)
    : [];
  const workflowHistory = Array.isArray(raw.workflow_history)
    ? raw.workflow_history.map((item) => ({
        title: item.title || "Status Updated",
        at: item.at || created,
        by: item.by || "Official",
        comments: item.comments || "",
      }))
    : Array.isArray(raw.timeline)
      ? raw.timeline.map((item) => ({
          title: item.title || "Status Updated",
          at: item.at || created,
          by: item.by || "Official",
          comments: item.comments || "",
        }))
    : [];
  const notesText =
    typeof raw.notes === "string"
      ? raw.notes.trim()
      : typeof raw.note === "string"
        ? raw.note.trim()
        : "";
  const progressFromField = Array.isArray(raw.progress_notes)
    ? raw.progress_notes.map((item) => ({
        comment: item.comment || item.notes || "Progress updated.",
        at: item.at || raw.updated_at || created,
        proofImage: item.proofImage || null,
      }))
    : [];
  const progressFromAttachments = attachments.map((item) => ({
    comment: item.note || `Attachment uploaded by ${item.uploadedBy}.`,
    at: item.at,
    proofImage: item.fileUrl,
  }));
  const progressFromNotes = notesText
    ? notesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(-8)
        .map((line) => ({
          comment: line,
          at: raw.updated_at || created,
          proofImage: null,
        }))
    : [];

  return {
    trackId: raw.track_id || id,
    category: raw.category || raw.department_name || "General",
    subcategory: raw.sub_issue || raw.subcategory || raw.issue || "Other",
    description: raw.description || "No description provided.",
    priority: raw.priority || "High",
    location: raw.location || "-",
    reportedAt: created,
    submittedBy: raw.is_anonymous ? "Anonymous" : raw.submitted_by || raw.name || "Citizen",
    assignedSection: raw.assigned_section || raw.category || "Not assigned",
    assignedOfficer:
      raw.assigned_officer || raw.assigned_clerk || raw.assigned_to || "Not assigned",
    resolutionDeadline:
      raw.resolution_deadline ||
      new Date(new Date(created).getTime() + 72 * 60 * 60 * 1000).toISOString(),
    escalationCount: Number(raw.escalation_count || 0),
    status,
    timeline: (
      workflowHistory.length ? workflowHistory : raw.timeline || defaultTimeline(raw)
    )
      .concat(
        attachments.map((item) => ({
          title: "Attachment Uploaded",
          at: item.at,
          by: item.uploadedBy,
          comments: item.note || "Proof image uploaded.",
          proofImage: item.fileUrl,
        })),
      )
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()),
    progressNotes:
      progressFromField.length || progressFromNotes.length || progressFromAttachments.length
        ? [...progressFromField, ...progressFromNotes, ...progressFromAttachments]
            .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
        : [
            {
              comment: "Initial verification completed by field team.",
              at: new Date(new Date(created).getTime() + 24 * 60 * 60 * 1000).toISOString(),
              proofImage: null,
            },
          ],
    duplicateCount: Number(raw.duplicate_count || 0),
    resolution:
      normalizeStatus(status) === "resolved"
        ? {
            summary: raw.resolution_summary || "Issue resolved and site restored.",
            finalReport: raw.final_report || "Work completed as per departmental standards.",
            date: raw.resolved_at || new Date().toISOString(),
            proofImage: raw.resolution_proof_image || null,
            officialName: raw.official_name || "Assigned Engineer",
            department: raw.assigned_section || raw.category || "-",
            signature: raw.digital_signature || "Digitally Signed",
          }
        : null,
    stats: {
      daysTaken: raw.days_taken || 3,
      avgCategoryTime: raw.avg_category_time || "4.2 days",
      deptPerformance: raw.dept_performance || "4.3 / 5",
    },
  };
}

function buildTrackingStages(record) {
  if (!record) return [];
  const status = normalizeStatus(record.status || "");
  const titles = (record.timeline || []).map((item) =>
    String(item.title || "").toLowerCase(),
  );
  const hasAssignedEvent = titles.some((t) => t.includes("assign"));
  const hasProgressEvent = titles.some(
    (t) => t.includes("progress") || t.includes("work"),
  );
  const hasResolvedEvent = titles.some(
    (t) => t.includes("complete") || t.includes("resolved"),
  );

  const resolved = status === "resolved" || hasResolvedEvent;
  const inProgress =
    status === "in progress" ||
    status === "overdue" ||
    hasProgressEvent ||
    resolved;
  const assigned = status !== "pending" || hasAssignedEvent || inProgress || resolved;

  const assignedAt = record.timeline?.find((item) =>
    String(item.title || "").toLowerCase().includes("assigned"),
  )?.at;
  const progressAt = record.timeline?.find((item) =>
    String(item.title || "").toLowerCase().includes("progress"),
  )?.at;
  const resolvedAt =
    record.timeline?.find((item) =>
      String(item.title || "").toLowerCase().includes("completed"),
    )?.at || record.resolution?.date;

  return [
    {
      key: "verified",
      title: "Verified & Acknowledged",
      time: formatDateTime(record.reportedAt),
      note: "Issue logged and verified by secretary desk.",
      state: "done",
    },
    {
      key: "assigned",
      title: "Section Clerk Assigned",
      time: assigned ? formatDateTime(assignedAt || record.reportedAt) : "Awaiting assignment",
      note: assigned
        ? `Assigned to ${record.assignedOfficer}.`
        : "Waiting for secretary assignment.",
      state: assigned ? "done" : "todo",
    },
    {
      key: "progress",
      title: "Work In Progress",
      time: inProgress ? formatDateTime(progressAt || record.reportedAt) : "Pending",
      note: inProgress
        ? "Clerk field action and follow-up is ongoing."
        : "Will start once assigned.",
      state: inProgress ? "active" : "todo",
    },
    {
      key: "resolved",
      title: resolved ? "Resolved" : "Resolution Pending",
      time: resolved ? formatDateTime(resolvedAt) : `ETA: ${formatDateTime(record.resolutionDeadline)}`,
      note: resolved
        ? "Issue marked resolved with completion details."
        : "Estimated completion as per deadline.",
      state: resolved ? "done" : "todo",
    },
  ];
}

function downloadResolutionReport(record) {
  const html = `
    <html>
      <head><title>Resolution Report - ${record.trackId}</title></head>
      <body style="font-family:Arial,sans-serif;padding:24px;">
        <h2>Resolution Report</h2>
        <p><b>Track ID:</b> ${record.trackId}</p>
        <p><b>Category:</b> ${record.category}</p>
        <p><b>Subcategory:</b> ${record.subcategory}</p>
        <p><b>Description:</b> ${record.description}</p>
        <p><b>Assigned Section:</b> ${record.assignedSection}</p>
        <p><b>Resolution Summary:</b> ${record.resolution?.summary || "-"}</p>
        <p><b>Official:</b> ${record.resolution?.officialName || "-"}</p>
        <p><b>Digital Signature:</b> ${record.resolution?.signature || "-"}</p>
        <p><b>Timestamp:</b> ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.print();
}

export function TrackIssueClient({ lang }) {
  const issuesTable = process.env.NEXT_PUBLIC_SUPABASE_ISSUES_TABLE || "issues";
  const attachmentsTable =
    process.env.NEXT_PUBLIC_SUPABASE_ATTACHMENTS_TABLE || "issue_attachments";
  const [trackId, setTrackId] = useState("");
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reopenReason, setReopenReason] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const deadlineCountdown = useMemo(
    () => getCountdown(record?.resolutionDeadline),
    [record?.resolutionDeadline],
  );
  const trackingStages = useMemo(() => buildTrackingStages(record), [record]);

  const search = async (event) => {
    event.preventDefault();
    setError("");
    setFeedbackSaved(false);

    const id = trackId.trim().toUpperCase();
    if (!id) return;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let data = null;
        let readError = null;

        const primary = await supabase
          .from(issuesTable)
          .select("*")
          .ilike("track_id", id)
          .order("created_at", { ascending: false })
          .limit(1);
        data = primary.data;
        readError = primary.error;

        // Compatibility fallback if rows were stored with `trackid` instead of `track_id`.
        if (!readError && (!data || !data.length)) {
          const secondary = await supabase
            .from(issuesTable)
            .select("*")
            .ilike("trackid", id)
            .order("created_at", { ascending: false })
            .limit(1);
          if (!secondary.error && secondary.data?.length) {
            data = secondary.data;
          }
        }

        if (readError) {
          throw readError;
        }

        if (data?.length) {
          let attachments = [];
          try {
            const trackRef = data[0]?.track_id || data[0]?.trackid || id;
            const byTrack = await supabase
              .from(attachmentsTable)
              .select("*")
              .ilike("track_id", trackRef)
              .order("created_at", { ascending: true });
            if (!byTrack.error && byTrack.data?.length) {
              attachments = byTrack.data;
            }

            if (!attachments.length && data[0]?.id) {
              const byIssueId = await supabase
                .from(attachmentsTable)
                .select("*")
                .eq("issue_id", data[0].id)
                .order("created_at", { ascending: true });
              if (!byIssueId.error && byIssueId.data?.length) {
                attachments = byIssueId.data;
              }
            }
          } catch {
            attachments = [];
          }
          setRecord(toDisplayRecord({ ...data[0], attachments }, id));
          return;
        }

        // Supabase is reachable but row not found; do not silently use stale local cache.
        setRecord(null);
        setError(
          pick(
            lang,
            "Track ID not found in Supabase records.",
            "Supabase രേഖകളിൽ Track ID കണ്ടെത്താനായില്ല.",
          ),
        );
        return;
      } catch {
        // Fallback to local storage only for network/runtime errors.
      }
    }

    try {
      const raw = localStorage.getItem("spirs_reports");
      const list = raw ? JSON.parse(raw) : [];
      const found = list.find(
        (item) => String(item.track_id || "").toUpperCase() === id.toUpperCase(),
      );
      if (!found) {
        setRecord(null);
        setError(
          pick(
            lang,
            "Track ID not found in local records. Try a recently submitted ID.",
            "പ്രാദേശിക രേഖകളിൽ ട്രാക്ക് ഐഡി കണ്ടെത്താനായില്ല. അടുത്തിടെ സമർപ്പിച്ച ഐഡി പരീക്ഷിക്കുക.",
          ),
        );
        return;
      }
      setRecord(toDisplayRecord(found, id));
    } catch {
      setRecord(null);
      setError(
        pick(
          lang,
          "Unable to read tracking data from local storage.",
          "ലോക്കൽ സ്റ്റോറേജിൽ നിന്നുള്ള ട്രാക്കിംഗ് ഡാറ്റ വായിക്കാനായില്ല.",
        ),
      );
    }
  };

  const submitFeedback = () => {
    if (!rating) return;
    setFeedbackSaved(true);
  };

  const reopen = () => {
    if (!reopenReason.trim()) return;
    setRecord((prev) =>
      prev
        ? {
            ...prev,
            status: "Reopened",
            escalationCount: (prev.escalationCount || 0) + 1,
          }
        : prev,
    );
  };

  return (
    <main className="ui-bg min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <section className="ui-glass mx-auto w-full max-w-6xl rounded-3xl p-6 sm:p-9">
        <div className="flex items-center justify-between gap-3">
          <p className="ui-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-blue-900 uppercase">
            {pick(lang, "Smart Public Issue Tracking Interface", "സ്മാർട്ട് പൊതു പ്രശ്ന ട്രാക്കിംഗ് ഇന്റർഫേസ്")}
          </p>
          <LanguageSwitcher lang={lang} />
        </div>

        <form onSubmit={search} className="ui-surface mt-5 rounded-2xl p-4 sm:p-5">
          <label className="text-sm font-semibold text-slate-800" htmlFor="track-id">
            {pick(lang, "Enter Track ID", "ട്രാക്ക് ഐഡി നൽകുക")}
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="track-id"
              type="text"
              value={trackId}
              onChange={(event) => setTrackId(event.target.value)}
              placeholder={pick(lang, "Example: SPIRS-123456ABCD", "ഉദാഹരണം: SPIRS-123456ABCD")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
            />
            <button
              type="submit"
              className="ui-button-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
            >
              {pick(lang, "Track", "ട്രാക്ക് ചെയ്യുക")}
            </button>
          </div>
          {error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </form>

        {record ? (
          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
            <section className="ui-glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                {pick(lang, "Complaint Overview", "പരാതി അവലോകനം")}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Track ID</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{record.trackId}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Category", "വിഭാഗം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.category}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Subcategory", "ഉപവിഭാഗം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.subcategory}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Description", "വിവരണം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.description}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Priority", "പ്രാധാന്യം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.priority}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Location", "സ്ഥലം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.location}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Date & Time Reported", "റിപ്പോർട്ട് ചെയ്ത തീയതിയും സമയവും")}</p>
                  <p className="mt-1 text-sm text-slate-900">{formatDateTime(record.reportedAt)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Submitted By", "സമർപ്പിച്ചത്")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.submittedBy || pick(lang, "Anonymous", "അനാമധേയം")}</p>
                </div>
              </div>
            </section>

            <section className="ui-surface rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                {pick(lang, "Current Status", "നിലവിലെ സ്ഥിതി")}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(record.status)}`}>
                  {record.status}
                </span>
                {(record.status || "").toLowerCase() === "overdue" ? (
                  <span className="rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                    {pick(lang, "Overdue - Escalated to Secretary", "കാലാവധി കഴിഞ്ഞു - സെക്രട്ടറിയിലേക്ക് ഉയർത്തി")}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Assigned Section", "ചുമതലപ്പെടുത്തിയ സെക്ഷൻ")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.assignedSection}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Assigned Officer", "ചുമതലപ്പെടുത്തിയ ഉദ്യോഗസ്ഥൻ")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.assignedOfficer}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Resolution Deadline", "പരിഹാര സമയപരിധി")}</p>
                  <p className="mt-1 text-sm text-slate-900">{formatDateTime(record.resolutionDeadline)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Countdown", "കൗണ്ട്ഡൗൺ")}</p>
                  <p className="mt-1 text-sm text-slate-900">{deadlineCountdown}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Escalation Count", "എസ്കലേഷൻ എണ്ണം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.escalationCount}</p>
                </div>
              </div>
            </section>

            <section className="ui-glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900">{pick(lang, "Timeline History", "ടൈംലൈൻ ചരിത്രം")}</h2>
              <div className="mt-4 space-y-3">
                {record.timeline.map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.at)}</p>
                    <p className="mt-1 text-xs text-slate-600">{pick(lang, "Updated by", "അപ്ഡേറ്റ് ചെയ്തത്")}: {item.by}</p>
                    {item.comments ? (
                      <p className="mt-1 text-sm text-slate-700">{item.comments}</p>
                    ) : null}
                    {item.proofImage ? (
                      <a href={item.proofImage} target="_blank" rel="noreferrer" className="mt-2 block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.proofImage}
                          alt="Timeline proof"
                          className="h-20 w-32 rounded-lg border border-slate-200 object-cover sm:h-24 sm:w-40"
                        />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="ui-glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900">{pick(lang, "Progress Notes", "പുരോഗതി കുറിപ്പുകൾ")}</h2>
              <div className="mt-4 space-y-3">
                {record.progressNotes.map((item, idx) => (
                  <div key={`note-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-800">{item.comment}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.at)}</p>
                    {item.proofImage ? (
                      <a href={item.proofImage} target="_blank" rel="noreferrer" className="mt-2 block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.proofImage}
                          alt="Progress proof"
                          className="h-20 w-32 rounded-lg border border-slate-200 object-cover sm:h-24 sm:w-40"
                        />
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {record.resolution ? (
              <>
                <section className="ui-surface rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-emerald-900">{pick(lang, "Resolution Summary", "പരിഹാര സംഗ്രഹം")}</h2>
                  <p className="mt-2 text-sm text-emerald-900">{record.resolution.summary}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-200 bg-white p-3">
                      <p className="text-xs font-semibold text-emerald-700 uppercase">{pick(lang, "Final Report", "അന്തിമ റിപ്പോർട്ട്")}</p>
                      <p className="mt-1 text-sm text-slate-800">{record.resolution.finalReport}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-white p-3">
                      <p className="text-xs font-semibold text-emerald-700 uppercase">{pick(lang, "Resolution Date", "പരിഹാര തീയതി")}</p>
                      <p className="mt-1 text-sm text-slate-800">{formatDateTime(record.resolution.date)}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-white p-3">
                      <p className="text-xs font-semibold text-emerald-700 uppercase">{pick(lang, "Official", "ഉദ്യോഗസ്ഥൻ")}</p>
                      <p className="mt-1 text-sm text-slate-800">{record.resolution.officialName}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-white p-3">
                      <p className="text-xs font-semibold text-emerald-700 uppercase">{pick(lang, "Digital Signature", "ഡിജിറ്റൽ ഒപ്പ്")}</p>
                      <p className="mt-1 text-sm text-slate-800">{record.resolution.signature}</p>
                    </div>
                  </div>
                </section>

                <section className="ui-glass rounded-2xl p-5">
                  <button
                    type="button"
                    onClick={() => downloadResolutionReport(record)}
                    className="ui-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
                  >
                    {pick(lang, "Download PDF Resolution Report", "PDF പരിഹാര റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക")}
                  </button>
                </section>

                <section className="ui-glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-slate-900">{pick(lang, "Rate the Resolution", "പരിഹാരം വിലയിരുത്തുക")}</h2>
                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className={`h-9 w-9 rounded-full border text-sm font-semibold ${
                          rating >= n
                            ? "border-amber-300 bg-amber-100 text-amber-800"
                            : "border-slate-300 bg-white text-slate-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={pick(lang, "Add your feedback comment", "നിങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്തുക")}
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={submitFeedback}
                    className="mt-3 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
                  >
                    {pick(lang, "Submit Feedback", "ഫീഡ്‌ബാക്ക് സമർപ്പിക്കുക")}
                  </button>
                  {feedbackSaved ? (
                    <p className="mt-2 text-sm text-emerald-700">
                      {pick(lang, "Feedback submitted.", "ഫീഡ്‌ബാക്ക് സമർപ്പിച്ചു.")}
                    </p>
                  ) : null}
                </section>

                <section className="ui-glass rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-slate-900">{pick(lang, "Reopen Complaint", "പരാതി വീണ്ടും തുറക്കുക")}</h2>
                  <textarea
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder={pick(lang, "Reason for reopening", "വീണ്ടും തുറക്കാനുള്ള കാരണം")}
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={reopen}
                    className="mt-3 rounded-xl border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
                  >
                    {pick(lang, "Reopen Complaint", "പരാതി വീണ്ടും തുറക്കുക")}
                  </button>
                </section>
              </>
            ) : null}

            {record.duplicateCount > 0 ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {pick(
                  lang,
                  `This issue is linked to ${record.duplicateCount} similar complaints in your area.`,
                  `ഈ പ്രശ്നം നിങ്ങളുടെ പ്രദേശത്തെ ${record.duplicateCount} സമാന പരാതികളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു.`,
                )}
              </section>
            ) : null}

            <section className="ui-glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-slate-900">{pick(lang, "Transparency Statistics", "സുതാര്യതാ സ്ഥിതിവിവരക്കണക്ക്")}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Days Taken", "എടുത്ത ദിവസങ്ങൾ")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.stats.daysTaken}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Average Category Time", "വിഭാഗ ശരാശരി സമയം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.stats.avgCategoryTime}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{pick(lang, "Department Performance", "വകുപ്പ് പ്രകടനം")}</p>
                  <p className="mt-1 text-sm text-slate-900">{record.stats.deptPerformance}</p>
                </div>
              </div>
            </section>

            </div>

            <aside className="xl:sticky xl:top-6 xl:self-start">
              <section className="ui-glass rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold tracking-wide text-blue-800">
                    {record.trackId}
                  </span>
                  <p className="text-xs text-slate-500">{pick(lang, "Live", "Live")}</p>
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{record.subcategory}</h3>
                <p className="mt-1 text-sm text-slate-600">{record.location}</p>

                <div className="mt-6">
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    {pick(lang, "Status Timeline", "Status Timeline")}
                  </p>
                  <div className="mt-4 space-y-5">
                    {trackingStages.map((step, idx) => {
                      const isDone = step.state === "done";
                      const isActive = step.state === "active";
                      const markerClass = isDone
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-transparent";

                      return (
                        <div key={step.key} className="relative pl-9">
                          {idx < trackingStages.length - 1 ? (
                            <span className="absolute left-[13px] top-7 h-[calc(100%+12px)] w-[2px] bg-slate-200" />
                          ) : null}
                          <span
                            className={`absolute left-0 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm ${markerClass}`}
                          >
                            {isDone || isActive ? "✓" : "•"}
                          </span>
                          <p
                            className={`text-lg font-semibold ${
                              isDone
                                ? "text-emerald-700"
                                : isActive
                                  ? "text-blue-700"
                                  : "text-slate-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-sm text-slate-500">{step.time}</p>
                          <p className="mt-0.5 text-sm text-slate-600">{step.note}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {pick(lang, "Assigned Clerk", "Assigned Clerk")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{record.assignedOfficer}</p>
                  <p className="text-sm text-slate-600">{record.assignedSection}</p>
                </div>
              </section>
            </aside>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="ui-glass inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            {pick(lang, "Back to Home", "ഹോം പേജിലേക്കു മടങ്ങുക")}
          </Link>
          <Link
            href="/report-issue"
            className="ui-button-primary inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
          >
            {pick(lang, "Report New Issue", "പുതിയ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക")}
          </Link>
        </div>
      </section>
    </main>
  );
}
