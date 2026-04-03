import React from "react";
import { DailyQuestionPanel } from "@/components/home/daily-question-panel";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import type { HotClusterItemData, IntelligenceCardData } from "@/lib/content/queries";
import type { DailyQuizPanelData } from "@/lib/quiz/queries";

type HomeIntelligenceSectionProps = {
  hotCluster: HotClusterItemData[];
  items: IntelligenceCardData[];
  dailyQuestion: DailyQuizPanelData | null;
};

export function HomeIntelligenceSection({ hotCluster = [], items, dailyQuestion }: HomeIntelligenceSectionProps) {
  const hasFocusPanel = hotCluster.length > 0 || Boolean(dailyQuestion);
  const visibleItems = items.slice(0, Math.max(0, 30 - (hasFocusPanel ? 4 : 0)));

  return (
    <section>
      <div className="homepage-mixed-grid">
        {hasFocusPanel ? (
          <DailyQuestionPanel hotCluster={hotCluster} initialQuestion={dailyQuestion} />
        ) : null}

        {visibleItems.map((card) => (
          <IntelligenceCard key={card.slug} {...card} />
        ))}
      </div>
    </section>
  );
}
