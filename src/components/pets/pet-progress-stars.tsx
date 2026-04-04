import React from "react";

type PetProgressStarsProps = {
  fill: number[];
  compact?: boolean;
};

export function PetProgressStars({ fill, compact = false }: PetProgressStarsProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? "6px" : "8px" }}>
      {fill.map((value, index) => (
        <Star key={index} fill={value} size={compact ? 20 : 24} />
      ))}
    </div>
  );
}

function Star({ fill, size }: { fill: number; size: number }) {
  const gradientId = React.useId();

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${Math.max(0, Math.min(100, fill * 100))}%`} stopColor="#ffbf4d" />
          <stop offset={`${Math.max(0, Math.min(100, fill * 100))}%`} stopColor="rgba(220,228,242,0.24)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.9 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 2.9Z"
        fill={`url(#${gradientId})`}
        stroke={fill >= 1 ? "#f29f05" : "rgba(130,147,177,0.46)"}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}
