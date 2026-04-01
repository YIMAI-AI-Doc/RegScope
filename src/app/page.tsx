import React from "react";
import { HomeDiscussionSection } from "@/components/home/home-discussion-section";
import { HomeIntelligenceSection } from "@/components/home/home-intelligence-section";
import { getHomepageData } from "@/lib/content/queries";

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <div style={{ display: "grid", gap: "28px" }}>
      <HomeIntelligenceSection hotCluster={data.hotCluster} items={data.featuredCards} />
      <HomeDiscussionSection discussions={data.discussions} />
    </div>
  );
}
