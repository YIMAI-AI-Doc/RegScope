import React from "react";
import type { Metadata } from "next";
import { TopicBrowser } from "@/components/topics/topic-browser";
import { getTopicDirectoryData } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "领域订阅 | RegScope",
  description: "按大领域和小领域浏览全球医药监管领域。",
};

export default async function TopicsPage() {
  const data = await getTopicDirectoryData();

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <TopicBrowser groups={data.topicGroups} mode="directory" />
    </div>
  );
}
