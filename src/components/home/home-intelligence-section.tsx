"use client";

import React, { useMemo, useState } from "react";
import { DailyQuestionPanel } from "@/components/home/daily-question-panel";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import type { HotClusterItemData, IntelligenceCardData } from "@/lib/content/queries";
import type { DailyQuizPanelData } from "@/lib/quiz/queries";

const HOMEPAGE_VISIBLE_CARD_COUNT = 30;
const HOMEPAGE_FOCUS_PANEL_SLOTS = 4;
const HOMEPAGE_REFRESH_BATCH_WITH_PANEL = 11;
const HOMEPAGE_REFRESH_BATCH_NO_PANEL = 15;

function rotateCards(items: IntelligenceCardData[], offset: number) {
  if (items.length === 0) {
    return [];
  }

  const normalizedOffset = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalizedOffset), ...items.slice(0, normalizedOffset)];
}

type HomeIntelligenceSectionProps = {
  hotCluster: HotClusterItemData[];
  items: IntelligenceCardData[];
  dailyQuestion: DailyQuizPanelData | null;
};

export function HomeIntelligenceSection({ hotCluster = [], items, dailyQuestion }: HomeIntelligenceSectionProps) {
  const hasFocusPanel = hotCluster.length > 0 || Boolean(dailyQuestion);
  const visibleCount = Math.max(0, HOMEPAGE_VISIBLE_CARD_COUNT - (hasFocusPanel ? HOMEPAGE_FOCUS_PANEL_SLOTS : 0));
  const refreshBatchSize = hasFocusPanel ? HOMEPAGE_REFRESH_BATCH_WITH_PANEL : HOMEPAGE_REFRESH_BATCH_NO_PANEL;
  const batchCount = Math.max(1, Math.ceil(items.length / refreshBatchSize));
  const canRefresh = items.length > refreshBatchSize;
  const [activeBatch, setActiveBatch] = useState(0);
  const visibleItems = useMemo(() => {
    const rotated = rotateCards(items, activeBatch * refreshBatchSize);
    return rotated.slice(0, visibleCount);
  }, [activeBatch, items, refreshBatchSize, visibleCount]);

  return (
    <section className="homepage-intelligence-section">
      {canRefresh ? (
        <div className="homepage-intelligence-toolbar">
          <button
            type="button"
            className="homepage-refresh-button"
            onClick={() => setActiveBatch((current) => (current + 1) % batchCount)}
            aria-label="换一换首页情报卡片"
            title="换一换"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M17.5 7.2A6.8 6.8 0 0 0 5.9 9.3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M5.8 5.2v4.4h4.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 16.8a6.8 6.8 0 0 0 11.6-2.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M18.2 18.8v-4.4h-4.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>换一换</span>
          </button>
        </div>
      ) : null}

      <div className="homepage-mixed-grid">
        {hasFocusPanel ? (
          <DailyQuestionPanel hotCluster={hotCluster} initialQuestion={dailyQuestion} />
        ) : null}

        {visibleItems.map((card, index) => (
          <div
            key={`${card.slug}-${activeBatch}-${index}`}
            className="homepage-intelligence-slot"
            style={{ animationDelay: `${Math.min(index, 10) * 28}ms` }}
          >
            <IntelligenceCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
}
