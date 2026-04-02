import React, { useId } from "react";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  const id = useId().replace(/:/g, "");
  const skyId = `brand-sky-${id}`;
  const wavePrimaryId = `brand-wave-primary-${id}`;
  const waveSecondaryId = `brand-wave-secondary-${id}`;
  const waveTertiaryId = `brand-wave-tertiary-${id}`;
  const highlightId = `brand-highlight-${id}`;
  const shadowId = `brand-shadow-${id}`;

  return (
    <svg viewBox="0 0 44 44" role="img" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={skyId} x1="6" x2="36" y1="6" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3A78D1" />
          <stop offset="1" stopColor="#1C4E8E" />
        </linearGradient>
        <linearGradient id={wavePrimaryId} x1="0" x2="44" y1="26" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#52A8F2" stopOpacity="0.42" />
          <stop offset="1" stopColor="#97CBFC" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={waveSecondaryId} x1="0" x2="44" y1="29" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0F5CA8" stopOpacity="0.06" />
          <stop offset="1" stopColor="#86BFF6" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id={waveTertiaryId} x1="0" x2="44" y1="33" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0E4A94" stopOpacity="0.02" />
          <stop offset="1" stopColor="#B3D9FD" stopOpacity="0.18" />
        </linearGradient>
        <radialGradient id={highlightId} cx="0" cy="0" r="1" gradientTransform="translate(13 10) rotate(38) scale(24 19)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.8" stdDeviation="1.6" floodColor="#0C3770" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect x="1.5" y="1.5" width="41" height="41" rx="13" fill={`url(#${skyId})`} />
      <rect x="1.5" y="1.5" width="41" height="41" rx="13" fill={`url(#${highlightId})`} />
      <path d="M1.5 29.2c7.7-3.7 14-2.5 20.2.7 5.5 2.9 10 4 20.8 1.4v11.2h-41Z" fill={`url(#${wavePrimaryId})`} />
      <path d="M1.5 34c8.6-3.1 16-2.1 23 1.6 5 2.6 10 3.2 18 1.5v5.4h-41Z" fill={`url(#${waveSecondaryId})`} />
      <path d="M1.5 38.2c9-1.5 16.4-1 23 1.9 4.5 2 9.4 2.3 18 1.8v.6h-41Z" fill={`url(#${waveTertiaryId})`} />
      <g filter={`url(#${shadowId})`}>
        <path
          d="M14.5 14.5 22 22.1 29.5 14.5"
          fill="none"
          stroke="#FFFFFF"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M22 22.1V29.6"
          fill="none"
          stroke="#FFFFFF"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M15.2 30.4c1.5-2.1 3.9-3.2 6.8-3.2s5.3 1.1 6.8 3.2"
          fill="none"
          stroke="#D9E8FB"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
}
