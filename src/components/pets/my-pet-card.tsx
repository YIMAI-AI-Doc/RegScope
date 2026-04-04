import React from "react";
import Link from "next/link";
import type { CurrentUserPetCardData } from "@/lib/pets/queries";
import { PetAvatarStage } from "./pet-avatar-stage";
import { PetProgressStars } from "./pet-progress-stars";
import { PetTierBadge } from "./pet-tier-badge";

type MyPetCardProps = {
  pet: CurrentUserPetCardData;
  href?: string;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
};

export function MyPetCard({
  pet,
  href,
  compact = false,
  title = "我的神兽",
  subtitle = "成长会跟随你的活跃持续推进",
  actionLabel = "神兽图鉴与互动 >",
}: MyPetCardProps) {
  const body = (
    <section
      style={{
        display: "grid",
        gap: compact ? "12px" : "16px",
        padding: compact ? "14px" : "20px",
        borderRadius: compact ? "18px" : "24px",
        border: "1px solid rgba(104,132,171,0.18)",
        background:
          "radial-gradient(circle at top left, rgba(74, 149, 225, 0.12), transparent 34%), radial-gradient(circle at top right, rgba(255, 191, 77, 0.18), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(242,247,253,0.98))",
        boxShadow: compact ? "0 10px 24px rgba(31,55,90,0.10)" : "0 18px 36px rgba(31,55,90,0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
        >
        <div style={{ display: "grid", gap: "5px" }}>
          <strong style={{ fontSize: compact ? "1rem" : "1.14rem", lineHeight: 1.2 }}>{title}</strong>
          <span style={{ color: "var(--muted)", fontSize: compact ? "0.84rem" : "0.92rem" }}>{subtitle}</span>
        </div>
        <div style={{ display: "grid", gap: "8px", justifyItems: "end" }}>
          <span style={{ color: "var(--accent)", fontSize: compact ? "0.78rem" : "0.84rem", fontWeight: 700 }}>
            {actionLabel}
          </span>
          <PetTierBadge label={`${pet.tierName}阶`} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: compact ? "12px" : "16px",
          gridTemplateColumns: compact ? "minmax(0, 112px) minmax(0, 1fr)" : "minmax(0, 220px) minmax(0, 1fr)",
          alignItems: "center",
        }}
      >
        <PetAvatarStage
          pet={{
            tierSlug: pet.tierSlug,
            speciesSlug: pet.speciesSlug,
            speciesName: pet.speciesName,
            family: pet.family,
            motionPreset: pet.motionPreset,
            stage: pet.stage,
            colors: pet.colors,
            growthStageConfig: pet.growthStageConfig,
            traitKeywords: pet.traitKeywords,
          }}
          compact={compact}
        />

        <div style={{ display: "grid", gap: compact ? "10px" : "12px", minWidth: 0 }}>
          <div style={{ display: "grid", gap: "4px" }}>
            <strong style={{ fontSize: compact ? "1rem" : "1.32rem", lineHeight: 1.15 }}>{pet.speciesName}</strong>
            <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: compact ? "0.88rem" : "0.94rem" }}>{pet.speciesTitle}</span>
            <span style={{ color: "var(--muted)", fontSize: compact ? "0.8rem" : "0.88rem", lineHeight: 1.6 }}>{pet.visualStyle}</span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {pet.traitKeywords.slice(0, compact ? 2 : 4).map((keyword) => (
              <span
                key={keyword}
                style={{
                  borderRadius: "999px",
                  padding: compact ? "3px 8px" : "4px 10px",
                  background: "rgba(31,79,134,0.08)",
                  color: "var(--accent)",
                  fontSize: compact ? "0.74rem" : "0.78rem",
                  fontWeight: 700,
                }}
              >
                {keyword}
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <PetProgressStars fill={pet.starFill} compact={compact} />
              <span style={{ color: "var(--muted)", fontSize: compact ? "0.8rem" : "0.86rem" }}>
                当前积分 {pet.currentPoints} / {pet.totalRequiredPoints}
              </span>
            </div>
            <div style={{ color: "var(--muted)", fontSize: compact ? "0.8rem" : "0.88rem", lineHeight: 1.6 }}>
              {pet.isMaxTier
                ? "已达到最高阶，继续活跃会沉淀为荣耀积分。"
                : `再获得 ${pet.pointsRemaining} 分可晋升至 ${pet.nextTierName}。`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (!href) {
    return body;
  }

  return (
    <Link href={href} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
      {body}
    </Link>
  );
}
