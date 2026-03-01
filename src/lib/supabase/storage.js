import { getSupabaseClient } from "@/lib/supabase/client";

function sanitizeFileName(name) {
  return String(name || "file")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function uploadIssueAttachment({
  file,
  trackId,
  uploaderType = "citizen",
}) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: new Error("Supabase client unavailable."), url: null, path: null };
  }

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_ATTACHMENTS_BUCKET || "issue-attachments";
  const safeTrackId = String(trackId || "unknown").replace(/[^A-Za-z0-9_-]/g, "");
  const ext = file?.name?.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : "jpg";
  const filename = sanitizeFileName(file?.name || `attachment.${ext}`);
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${safeTrackId}/${uploaderType}/${unique}-${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file?.type || undefined,
    });

  if (uploadError) {
    return { error: uploadError, url: null, path: null };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { error: null, url: publicUrl || null, path };
}
