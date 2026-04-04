import React from "react";
import { petSpeciesBySlug } from "@/lib/pets/catalog";
import type { PetDexPageData } from "@/lib/pets/queries";
import { PetAvatarStage } from "./pet-avatar-stage";

type PetDexGridProps = {
  tiers: PetDexPageData["tiers"];
};

export function PetDexGrid({ tiers }: PetDexGridProps) {
  return (
    <div style={{ display: "grid", gap: "18px" }}>
      {tiers.map((tier) => (
        <section
          key={tier.slug}
          style={{
            display: "grid",
            gap: "14px",
            padding: "18px",
            borderRadius: "22px",
            border: tier.current ? "1px solid rgba(56, 113, 182, 0.34)" : "1px solid rgba(104,132,171,0.18)",
            background:
              tier.current
                ? "linear-gradient(180deg, rgba(248,252,255,0.98), rgba(239,247,255,0.98))"
                : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,249,253,0.96))",
            boxShadow: "0 12px 28px rgba(31,55,90,0.08)",
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline", flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: "4px" }}>
              <strong style={{ fontSize: "1.06rem" }}>{tier.name}</strong>
              <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{tier.flavor}</span>
            </div>
            <span
              style={{
                borderRadius: "999px",
                padding: "5px 10px",
                background: tier.current ? "rgba(31,79,134,0.12)" : "rgba(104,132,171,0.08)",
                color: "var(--accent)",
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              {tier.current ? "当前阶" : tier.unlocked ? "已解锁" : "未解锁"}
            </span>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {tier.species.map((item) => {
              const species = petSpeciesBySlug[item.slug];
              return (
                <article
                  key={item.slug}
                  style={{
                    display: "grid",
                    gap: "10px",
                    padding: "14px",
                    borderRadius: "18px",
                    border: item.isCurrent ? "1px solid rgba(56, 113, 182, 0.32)" : "1px solid rgba(104,132,171,0.16)",
                    background: "rgba(255,255,255,0.82)",
                    opacity: item.unlocked ? 1 : 0.58,
                  }}
                >
                  <div style={{ filter: item.unlocked ? "none" : "grayscale(0.82)" }}>
                    <PetAvatarStage
                      pet={{
                        tierSlug: species.tierSlug,
                        speciesSlug: species.slug,
                        speciesName: species.name,
                        family: species.family,
                        motionPreset: species.motionPreset,
                        stage: item.isCurrent ? "MATURE" : "BABY",
                        colors: species.colors,
                        growthStageConfig: species.growthStageConfig,
                        traitKeywords: species.traitKeywords,
                      }}
                      compact
                    />
                  </div>
                  <div style={{ display: "grid", gap: "4px" }}>
                    <strong style={{ fontSize: "0.94rem" }}>{item.name}</strong>
                    <span style={{ color: "var(--accent)", fontSize: "0.82rem", fontWeight: 700 }}>{item.title}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.55 }}>
                      {item.unlocked ? item.visualStyle : "继续活跃后解锁这一阶的神兽。"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
