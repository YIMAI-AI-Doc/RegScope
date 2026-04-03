import React from "react";
import { BrandMark } from "@/components/layout/brand-mark";

export function BrandIdentity() {
  return (
    <>
      <span className="brand-mark">
        <BrandMark />
      </span>
      <div className="brand-copy">
        <p className="brand-name">药宇纵观</p>
        <p className="brand-tag">RegScope</p>
      </div>
    </>
  );
}
