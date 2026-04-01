"use client";

import { useEffect } from "react";
import {
  DISCUSSION_HISTORY_COOKIE,
  parseDiscussionHistory,
  serializeDiscussionHistory,
  updateDiscussionHistory,
} from "@/lib/discussions/history";

type DiscussionViewTrackerProps = {
  slug: string;
};

export function DiscussionViewTracker({ slug }: DiscussionViewTrackerProps) {
  useEffect(() => {
    const currentCookie = readCookie(DISCUSSION_HISTORY_COOKIE);
    const nextHistory = updateDiscussionHistory(parseDiscussionHistory(currentCookie), slug);
    document.cookie = `${DISCUSSION_HISTORY_COOKIE}=${serializeDiscussionHistory(nextHistory)}; Path=/; Max-Age=2592000; SameSite=Lax`;

    const requestUrl = new URL(`/api/discussions/${slug}/view`, window.location.origin).toString();

    void fetch(requestUrl, {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => undefined);
  }, [slug]);

  return null;
}

function readCookie(name: string) {
  const prefix = `${name}=`;

  for (const segment of document.cookie.split("; ")) {
    if (segment.startsWith(prefix)) {
      return segment.slice(prefix.length);
    }
  }

  return undefined;
}
