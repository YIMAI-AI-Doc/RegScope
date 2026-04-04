import React from "react";
import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { getServerSession } from "next-auth";
import { HomeDiscussionSection } from "@/components/home/home-discussion-section";
import { HomeIntelligenceSection } from "@/components/home/home-intelligence-section";
import { authOptions } from "@/lib/auth";
import { getHomepageData } from "@/lib/content/queries";
import { getDailyQuizPanelData } from "@/lib/quiz/queries";

export default async function HomePage() {
  const [data, session] = await Promise.all([getHomepageData(), getServerSession(authOptions)]);
  const dailyQuestion = await getDailyQuizPanelData(session?.user?.id ?? null);

  return (
    <div style={{ display: "grid", gap: "38px" }}>
      <HomeIntelligenceSection hotCluster={data.hotCluster} items={data.featuredCards} dailyQuestion={dailyQuestion} />
      <HomeDiscussionSection discussions={data.discussions} />
      <BackToTopButton />
    </div>
  );
}
