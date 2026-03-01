"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { pick } from "@/lib/language-utils";
import { uploadIssueAttachment } from "@/lib/supabase/storage";

const STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Resolved",
  "Overdue",
  "Reopened",
];

function statusTitle(status) {
  if (status === "In Progress") return "Work In Progress";
  if (status === "Resolved") return "Work Completed";
  if (status === "Overdue") return "Overdue - Escalated";
  if (status === "Reopened") return "Complaint Reopened";
  return "Complaint Updated";
}

export function OfficialWorkflowForm({ lang = "en", operatorName = "Official" }) {
  const issuesTable = process.env.NEXT_PUBLIC_SUPABASE_ISSUES_TABLE || "issues";
  const attachmentsTable =
    process.env.NEXT_PUBLIC_SUPABASE_ATTACHMENTS_TABLE || "issue_attachments";
  const [trackId, setTrackId] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [assignedOfficer, setAssignedOfficer] = useState(operatorName);
  const [resolutionDeadline, setResolutionDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFiles, setProofFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanTrackId = trackId.trim().toUpperCase();
    if (!cleanTrackId) {
      setError(pick(lang, "Track ID is required.", "Track ID ആവശ്യമാണ്."));
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError(
        pick(
          lang,
          "Supabase config missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
          "Supabase ക്രമീകരണം ലഭ്യമല്ല. NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY നൽകുക.",
        ),
      );
      return;
    }

    setIsSaving(true);

    try {
      const { data: found, error: findError } = await supabase
        .from(issuesTable)
        .select("*")
        .ilike("track_id", cleanTrackId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (findError) {
        throw findError;
      }
      if (!found?.length) {
        throw new Error("Track ID not found.");
      }

      const row = found[0];
      const nowIso = new Date().toISOString();
      const trimmedNote = notes.trim();
      const noteLine = trimmedNote
        ? `[${new Date().toLocaleString()}] ${operatorName}: ${trimmedNote}`
        : "";
      const existingNotes =
        typeof row.notes === "string"
          ? row.notes.trim()
          : typeof row.note === "string"
            ? row.note.trim()
            : "";
      const mergedNotes = [existingNotes, noteLine].filter(Boolean).join("\n");
      const existingHistory = Array.isArray(row.workflow_history)
        ? row.workflow_history
        : Array.isArray(row.timeline)
          ? row.timeline
        : [];
      const nextHistory = [
        ...existingHistory,
        {
          title: statusTitle(status),
          at: nowIso,
          by: operatorName,
          comments: trimmedNote || `Status changed to ${status}.`,
          status,
        },
      ].slice(-40);
      const existingProgress = Array.isArray(row.progress_notes)
        ? row.progress_notes
        : [];
      const nextProgress = [
        ...existingProgress,
        {
          comment: trimmedNote || `Status changed to ${status}.`,
          at: nowIso,
          by: operatorName,
          proofImage: null,
        },
      ].slice(-40);

      const payload = {
        status,
        assigned_officer: assignedOfficer.trim() || operatorName,
        resolution_deadline: resolutionDeadline || null,
        notes: mergedNotes || null,
        workflow_history: nextHistory,
        timeline: nextHistory,
        progress_notes: nextProgress,
        updated_at: nowIso,
      };

      const droppedColumns = [];
      let workingPayload = { ...payload };
      let finalError = null;
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const result = await supabase
          .from(issuesTable)
          .update(workingPayload)
          .eq("track_id", row.track_id);

        if (!result.error) {
          finalError = null;
          break;
        }

        const msg = String(result.error.message || "");
        const missingColumn = msg.match(/Could not find the '([^']+)' column/i)?.[1];
        if (missingColumn && missingColumn in workingPayload) {
          droppedColumns.push(missingColumn);
          delete workingPayload[missingColumn];
          continue;
        }

        finalError = result.error;
        break;
      }

      if (finalError) {
        throw finalError;
      }

      if (droppedColumns.length) {
        setMessage(
          `Updated. Missing DB columns skipped: ${[...new Set(droppedColumns)].join(", ")}`,
        );
      } else {
        setMessage("Workflow update saved successfully.");
      }

      if (proofFiles.length) {
        for (const file of proofFiles) {
          const uploaded = await uploadIssueAttachment({
            file,
            trackId: row.track_id || cleanTrackId,
            uploaderType: "official",
          });
          if (uploaded.error || !uploaded.url) {
            continue;
          }

          const attachmentPayload = {
            issue_id: row.id ?? null,
            track_id: row.track_id || cleanTrackId,
            file_url: uploaded.url,
            storage_path: uploaded.path,
            uploaded_by: "official",
            note: trimmedNote || "Official proof update",
            created_at: nowIso,
          };

          let workingAttachmentPayload = { ...attachmentPayload };
          for (let attempt = 0; attempt < 12; attempt += 1) {
            const attachResult = await supabase
              .from(attachmentsTable)
              .insert(workingAttachmentPayload);
            if (!attachResult.error) break;
            const missingColumn = String(attachResult.error.message || "")
              .match(/Could not find the '([^']+)' column/i)?.[1];
            if (missingColumn && missingColumn in workingAttachmentPayload) {
              delete workingAttachmentPayload[missingColumn];
              continue;
            }
            break;
          }
        }
      }
      setNotes("");
      setProofFiles([]);
    } catch (caught) {
      const msg =
        caught instanceof Error ? caught.message : "Failed to update workflow.";
      setError(
        pick(
          lang,
          `Failed to update workflow: ${msg}`,
          `Workflow അപ്ഡേറ്റ് പരാജയപ്പെട്ടു: ${msg}`,
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="ui-glass mt-7 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-slate-900">
        {pick(lang, "Official Workflow Update", "ഓഫീഷ്യൽ workflow അപ്ഡേറ്റ്")}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        {pick(
          lang,
          "Update assigned officer, status, resolution deadline and notes for a Track ID.",
          "Track ID അനുസരിച്ച് status, assigned officer, deadline, notes അപ്ഡേറ്റ് ചെയ്യുക.",
        )}
      </p>

      <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          placeholder={pick(lang, "Track ID", "Track ID")}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 sm:col-span-2"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={assignedOfficer}
          onChange={(e) => setAssignedOfficer(e.target.value)}
          placeholder={pick(lang, "Assigned officer/clerk", "ചുമതലപ്പെടുത്തിയ ഓഫീസർ/ക്ലർക്ക്")}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600"
        />
        <input
          type="datetime-local"
          value={resolutionDeadline}
          onChange={(e) => setResolutionDeadline(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 sm:col-span-2"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={pick(lang, "Progress note", "പ്രോഗ്രസ് കുറിപ്പ്")}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 sm:col-span-2"
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setProofFiles(Array.from(e.target.files ?? []).slice(0, 3))
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-700 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-800 sm:col-span-2"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="ui-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
        >
          {isSaving
            ? pick(lang, "Saving...", "സേവ് ചെയ്യുന്നു...")
            : pick(lang, "Save Workflow Update", "Workflow അപ്ഡേറ്റ് സേവ് ചെയ്യുക")}
        </button>
      </form>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
    </section>
  );
}
