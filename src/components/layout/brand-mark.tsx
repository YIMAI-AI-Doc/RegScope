import React from "react";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 44 44" role="img" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="brand-sky" x1="6" x2="36" y1="6" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3A78D1" />
          <stop offset="1" stopColor="#1C4E8E" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="41" height="41" rx="13" fill="url(#brand-sky)" />
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
    </svg>
  );
}
