import React from "react";
import Link from "next/link";
import { IntelligenceCard } from "@/components/cards/intelligence-card";
import type { HotClusterItemData, IntelligenceCardData } from "@/lib/content/queries";

type HomeIntelligenceSectionProps = {
  hotCluster: HotClusterItemData[];
  items: IntelligenceCardData[];
};

export function HomeIntelligenceSection({ hotCluster = [], items }: HomeIntelligenceSectionProps) {
  const visibleItems = items.slice(0, Math.max(0, 30 - (hotCluster.length > 0 ? 4 : 0)));

  return (
    <section>
      <div className="homepage-mixed-grid">
        {hotCluster.length > 0 ? (
          <article className="homepage-hot-cluster">
            <div style={{ display: "grid", gap: "6px", alignContent: "start" }}>
              <h2 style={{ margin: 0, fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.1, color: "#111" }}>
                站内热榜 Top10
              </h2>
            </div>

            <div className="homepage-hot-list">
              {hotCluster.slice(0, 10).map((item, index) => (
                <Link key={`${item.kind}-${item.rank}-${item.href}`} href={item.href} className="homepage-hot-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <span className="homepage-hot-rank">{String(index + 1).padStart(2, "0")}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
                      <strong className="homepage-hot-title">{item.title}</strong>
                      <span className="homepage-hot-kind">{item.kindLabel}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ) : null}

        {visibleItems.map((card) => (
          <IntelligenceCard key={card.slug} {...card} />
        ))}
      </div>
    </section>
  );
}
