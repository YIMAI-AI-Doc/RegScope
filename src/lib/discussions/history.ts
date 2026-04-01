export const DISCUSSION_HISTORY_COOKIE = "regscope_recent_discussions";
const MAX_DISCUSSION_HISTORY = 12;

export function parseDiscussionHistory(rawValue?: string | null): string[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue));
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === "string").slice(0, MAX_DISCUSSION_HISTORY);
  } catch {
    return [];
  }
}

export function updateDiscussionHistory(history: string[], slug: string): string[] {
  return [slug, ...history.filter((entry) => entry !== slug)].slice(0, MAX_DISCUSSION_HISTORY);
}

export function serializeDiscussionHistory(history: string[]): string {
  return encodeURIComponent(JSON.stringify(history.slice(0, MAX_DISCUSSION_HISTORY)));
}
