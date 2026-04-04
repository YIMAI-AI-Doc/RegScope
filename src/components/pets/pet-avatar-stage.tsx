import React from "react";
import type { CurrentUserPetCardData } from "@/lib/pets/queries";

type PetAvatarStageProps = {
  pet: Pick<
    CurrentUserPetCardData,
    | "tierSlug"
    | "speciesSlug"
    | "speciesName"
    | "family"
    | "motionPreset"
    | "stage"
    | "colors"
    | "growthStageConfig"
    | "traitKeywords"
  >;
  compact?: boolean;
};

export function PetAvatarStage({ pet, compact = false }: PetAvatarStageProps) {
  const stageVisual = pet.growthStageConfig[pet.stage];
  const sizeClass = compact ? "is-compact" : "";

  return (
    <div
      className={`pet-stage motion-${pet.motionPreset} family-${pet.family} tier-${pet.tierSlug.toLowerCase()} stage-${pet.stage.toLowerCase()} ${sizeClass}`.trim()}
      data-testid="pet-stage-root"
      data-stage={pet.stage}
      data-motion={pet.motionPreset}
      style={
        {
          "--pet-body": pet.colors.body,
          "--pet-accent": pet.colors.accent,
          "--pet-aura": pet.colors.aura,
          "--pet-scale": String(stageVisual.scale),
        } as React.CSSProperties
      }
    >
      <div className="pet-stage-aura" aria-hidden="true" />
      <svg className="pet-stage-svg" viewBox="0 0 220 180" aria-hidden="true">
        <g className="pet-stage-figure">
          {renderSpecies(pet)}
        </g>
      </svg>
    </div>
  );
}

function renderSpecies(pet: PetAvatarStageProps["pet"]) {
  if (pet.speciesSlug === "lop-rabbit" && pet.stage === "BABY") {
    return renderBabyLopRabbit();
  }

  switch (pet.speciesSlug) {
    case "goldfish":
      return renderFish(pet);
    case "baiji":
      return renderBaiji(pet);
    case "azure-dragon":
      return renderAzureDragon(pet);
    case "xuanwu":
      return renderXuanwu(pet);
    case "qilin":
      return renderQilin(pet);
    case "vermilion-bird":
    case "golden-eagle":
    case "red-crowned-crane":
    case "cockatiel":
      return renderBird(pet);
    default:
      return renderQuadruped(pet);
  }
}

function renderBabyLopRabbit() {
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="152" rx="56" ry="13" />
      <ellipse className="pet-body" cx="112" cy="112" rx="46" ry="36" />
      <ellipse className="pet-head" cx="110" cy="82" rx="42" ry="34" />
      <path className="pet-belly" d="M82 110 C 88 92 132 92 140 112 C 138 140 86 142 82 110 Z" />
      <path className="pet-ear" d="M76 72 C 56 84 50 124 68 136 C 82 144 92 126 92 106 C 92 92 90 78 76 72 Z" />
      <path className="pet-ear" d="M144 72 C 164 84 170 124 152 136 C 138 144 128 126 128 106 C 128 92 130 78 144 72 Z" />
      <path className="pet-ear-inner" d="M78 86 C 66 94 64 118 74 126 C 82 132 88 118 88 104 C 88 96 86 90 78 86 Z" />
      <path className="pet-ear-inner" d="M142 86 C 154 94 156 118 146 126 C 138 132 132 118 132 104 C 132 96 134 90 142 86 Z" />
      <circle className="pet-cheek" cx="82" cy="94" r="10" />
      <circle className="pet-cheek" cx="138" cy="94" r="10" />
      <ellipse className="pet-eye" cx="94" cy="86" rx="5.8" ry="7.2" />
      <ellipse className="pet-eye" cx="126" cy="86" rx="5.8" ry="7.2" />
      <circle className="pet-eye-spark" cx="96" cy="83" r="1.8" />
      <circle className="pet-eye-spark" cx="128" cy="83" r="1.8" />
      <ellipse className="pet-nose" cx="110" cy="96" rx="5.6" ry="4.8" />
      <path className="pet-mouth" d="M110 100 v7 M110 107 C 106 112 100 112 98 108 M110 107 C 114 112 120 112 122 108" />
      <ellipse className="pet-rabbit-paw" cx="94" cy="116" rx="10" ry="14" transform="rotate(18 94 116)" />
      <ellipse className="pet-rabbit-paw" cx="126" cy="116" rx="10" ry="14" transform="rotate(-18 126 116)" />
      <path className="pet-rabbit-snack" d="M103 102 C 108 98 114 98 118 102 C 120 110 116 124 110 128 C 104 124 100 110 103 102 Z" />
      <path className="pet-rabbit-snack-shell" d="M110 102 L110 128" />
      <ellipse className="pet-foot" cx="90" cy="144" rx="10" ry="7" />
      <ellipse className="pet-foot" cx="132" cy="144" rx="10" ry="7" />
      <path className="pet-tail" d="M146 114 C 164 116 168 132 156 140" fill="none" stroke="var(--pet-accent)" strokeWidth="10" strokeLinecap="round" />
    </>
  );
}

function renderQuadruped(pet: PetAvatarStageProps["pet"]) {
  const headX = pet.family === "fox" ? 86 : 92;
  const earSize = pet.family === "rabbit" ? 18 : pet.family === "fox" ? 20 : 12;
  const tailWidth = pet.speciesSlug === "nine-tail-fox" ? 54 : pet.family === "canine" ? 42 : 34;
  const hasWings = pet.speciesSlug === "sugar-glider";
  const isTiger = pet.speciesSlug === "south-china-tiger" || pet.speciesSlug === "white-tiger";
  const isPanda = pet.speciesSlug === "red-panda";

  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="56" ry="13" />
      <path
        className="pet-tail"
        d={`M146 104 C ${170 + tailWidth / 3} 94 ${166 + tailWidth} 122 ${152 + tailWidth / 4} 136`}
        fill="none"
        stroke="var(--pet-accent)"
        strokeWidth={pet.family === "fox" ? 18 : 14}
        strokeLinecap="round"
      />
      {pet.speciesSlug === "nine-tail-fox"
        ? Array.from({ length: 4 }).map((_, index) => (
            <path
              key={index}
              className="pet-tail"
              d={`M142 106 C ${154 + index * 8} ${90 - index * 6} ${180 + index * 6} ${118 - index * 4} ${155 + index * 5} ${138 + index * 2}`}
              fill="none"
              stroke={index % 2 === 0 ? "var(--pet-body)" : "var(--pet-accent)"}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.84}
            />
          ))
        : null}
      <ellipse className="pet-body" cx="116" cy="106" rx={44} ry={34} />
      <circle className="pet-head" cx={headX} cy="84" r={28} />
      {pet.family === "rabbit" ? (
        <>
          <ellipse className="pet-ear" cx={78} cy={50} rx={8} ry={earSize} />
          <ellipse className="pet-ear" cx={97} cy={48} rx={8} ry={earSize + 2} />
        </>
      ) : (
        <>
          <polygon className="pet-ear" points={`${headX - 18},62 ${headX - 6},42 ${headX + 2},68`} />
          <polygon className="pet-ear" points={`${headX + 6},66 ${headX + 18},42 ${headX + 28},66`} />
          {pet.family === "fox" ? (
            <>
              <polygon className="pet-ear-accent" points={`${headX - 15},62 ${headX - 6},48 ${headX - 1},66`} />
              <polygon className="pet-ear-accent" points={`${headX + 8},64 ${headX + 17},48 ${headX + 23},64`} />
            </>
          ) : null}
        </>
      )}
      {hasWings ? (
        <>
          <ellipse className="pet-wing" cx="128" cy="98" rx="20" ry="34" />
          <ellipse className="pet-wing" cx="98" cy="98" rx="20" ry="34" />
        </>
      ) : null}
      <circle className="pet-eye" cx={headX - 8} cy="84" r="3.2" />
      <circle className="pet-eye" cx={headX + 9} cy="84" r="3.2" />
      <path className="pet-mouth" d={`M${headX - 4} 94 Q ${headX} 99 ${headX + 6} 94`} />
      {pet.family === "primate" ? <path className="pet-tail" d="M151 103 C 182 114 180 82 154 78" fill="none" stroke="var(--pet-accent)" strokeWidth="8" strokeLinecap="round" /> : null}
      {isTiger ? (
        <>
          <path className="pet-mark" d="M92 72 98 82 104 72" />
          <path className="pet-mark" d="M74 92 86 96" />
          <path className="pet-mark" d="M102 92 114 96" />
          <path className="pet-mark" d="M118 88 130 92" />
        </>
      ) : null}
      {isPanda ? (
        <>
          <path className="pet-mark" d="M154 104 C 178 96 180 126 158 132" />
          <path className="pet-mark" d="M158 110 C 172 112 174 118 160 124" />
        </>
      ) : null}
      {pet.speciesSlug === "fennec-fox" ? (
        <>
          <ellipse className="pet-ear" cx="70" cy="56" rx="15" ry="24" />
          <ellipse className="pet-ear" cx="103" cy="54" rx="16" ry="25" />
          <ellipse className="pet-ear-accent" cx="70" cy="60" rx="8" ry="14" />
          <ellipse className="pet-ear-accent" cx="103" cy="58" rx="9" ry="15" />
        </>
      ) : null}
      {pet.speciesSlug === "qilin" ? null : (
        <>
          <rect className="pet-leg" x="88" y="128" width="10" height="22" rx="5" />
          <rect className="pet-leg" x="106" y="130" width="10" height="20" rx="5" />
          <rect className="pet-leg" x="126" y="128" width="10" height="22" rx="5" />
          <rect className="pet-leg" x="144" y="130" width="10" height="20" rx="5" />
        </>
      )}
    </>
  );
}

function renderBird(pet: PetAvatarStageProps["pet"]) {
  const longLegs = pet.speciesSlug === "red-crowned-crane";
  const phoenixTail = pet.speciesSlug === "vermilion-bird";
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="52" ry="12" />
      <ellipse className="pet-body" cx="110" cy="96" rx="34" ry="28" />
      <circle className="pet-head" cx="86" cy="76" r="18" />
      <path className="pet-wing" d="M116 82 C 156 88 162 124 120 128" />
      <path className="pet-wing" d="M102 84 C 64 96 68 124 104 128" />
      <polygon className="pet-beak" points="68,76 84,70 82,82" />
      <circle className="pet-eye" cx="84" cy="75" r="2.5" />
      <path className="pet-tail" d={phoenixTail ? "M140 106 C 174 110 176 148 150 150" : "M138 102 C 164 110 164 130 144 136"} fill="none" stroke="var(--pet-accent)" strokeWidth={phoenixTail ? 12 : 9} strokeLinecap="round" />
      {pet.speciesSlug === "cockatiel" ? <path className="pet-crest" d="M84 56 C 74 42 82 38 88 52 M86 56 C 88 40 96 40 92 56" /> : null}
      {pet.speciesSlug === "golden-eagle" ? <path className="pet-mark" d="M100 70 C 112 66 118 66 128 76" /> : null}
      {longLegs ? (
        <>
          <rect className="pet-leg" x="106" y="122" width="4" height="28" rx="2" />
          <rect className="pet-leg" x="116" y="122" width="4" height="28" rx="2" />
        </>
      ) : (
        <>
          <rect className="pet-leg" x="106" y="120" width="5" height="18" rx="2.5" />
          <rect className="pet-leg" x="116" y="120" width="5" height="18" rx="2.5" />
        </>
      )}
    </>
  );
}

function renderFish() {
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="60" ry="12" />
      <ellipse className="pet-body" cx="108" cy="98" rx="40" ry="28" />
      <polygon className="pet-fin" points="146,98 180,78 176,118" />
      <polygon className="pet-fin" points="102,70 120,48 128,76" />
      <polygon className="pet-fin" points="100,122 122,122 116,144" />
      <circle className="pet-eye" cx="92" cy="92" r="3.6" />
      <circle className="pet-bubble" cx="156" cy="56" r="6" />
      <circle className="pet-bubble" cx="170" cy="74" r="4.4" />
    </>
  );
}

function renderBaiji() {
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="60" ry="12" />
      <path className="pet-body" d="M56 102 C 78 70 140 66 168 86 C 182 94 176 112 154 118 C 122 128 84 126 56 102 Z" />
      <polygon className="pet-fin" points="112,82 122,52 134,86" />
      <polygon className="pet-fin" points="156,100 188,84 184,114" />
      <circle className="pet-eye" cx="86" cy="92" r="3" />
      <path className="pet-mark" d="M50 104 C 42 108 38 116 46 122" />
    </>
  );
}

function renderAzureDragon() {
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="62" ry="12" />
      <path className="pet-dragon-body" d="M54 118 C 40 86 82 52 126 58 C 160 62 178 84 168 106 C 158 128 126 132 104 120 C 84 108 92 84 116 86 C 134 88 136 102 126 112" />
      <circle className="pet-head" cx="150" cy="78" r="18" />
      <path className="pet-horn" d="M144 58 134 42 M158 58 168 42" />
      <circle className="pet-eye" cx="148" cy="77" r="2.5" />
      <path className="pet-mouth" d="M154 84 Q 160 88 166 84" />
      <path className="pet-tail" d="M54 118 C 40 126 34 138 44 146" fill="none" stroke="var(--pet-accent)" strokeWidth="7" strokeLinecap="round" />
    </>
  );
}

function renderQilin() {
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="56" ry="12" />
      <ellipse className="pet-body" cx="118" cy="106" rx="42" ry="30" />
      <circle className="pet-head" cx="88" cy="84" r="24" />
      <path className="pet-horn" d="M88 58 C 82 40 92 34 98 52" />
      <path className="pet-tail" d="M148 102 C 174 94 176 124 154 136" fill="none" stroke="var(--pet-accent)" strokeWidth="14" strokeLinecap="round" />
      <circle className="pet-eye" cx="84" cy="84" r="3" />
      <circle className="pet-eye" cx="98" cy="84" r="3" />
      <path className="pet-mouth" d="M86 94 Q 92 98 98 94" />
      <path className="pet-mark" d="M116 86 C 124 82 134 82 142 88" />
      <rect className="pet-leg" x="92" y="128" width="9" height="20" rx="4.5" />
      <rect className="pet-leg" x="110" y="130" width="9" height="18" rx="4.5" />
      <rect className="pet-leg" x="128" y="128" width="9" height="20" rx="4.5" />
      <rect className="pet-leg" x="146" y="130" width="9" height="18" rx="4.5" />
    </>
  );
}

function renderXuanwu() {
  return (
    <>
      <ellipse className="pet-ground-glow" cx="110" cy="150" rx="58" ry="12" />
      <ellipse className="pet-body" cx="110" cy="108" rx="48" ry="34" />
      <path className="pet-shell" d="M76 108 C 80 82 140 80 144 108 C 140 132 80 132 76 108 Z" />
      <circle className="pet-head" cx="74" cy="98" r="16" />
      <circle className="pet-eye" cx="70" cy="98" r="2.6" />
      <path className="pet-snake" d="M144 98 C 166 82 178 92 170 108 C 162 122 144 122 138 114" />
      <path className="pet-mark" d="M96 94 C 104 90 116 90 124 94 M92 108 C 102 104 118 104 128 108" />
      <rect className="pet-leg" x="86" y="132" width="10" height="14" rx="5" />
      <rect className="pet-leg" x="126" y="132" width="10" height="14" rx="5" />
    </>
  );
}
