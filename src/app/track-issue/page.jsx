import { TrackIssueClient } from "@/components/track/track-issue-client";
import { getServerLang } from "@/lib/language";

export default async function TrackIssuePage() {
  const lang = await getServerLang();
  return <TrackIssueClient lang={lang} />;
}
