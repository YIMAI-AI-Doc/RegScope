import React from "react";
import Image from "next/image";

export function BrandIdentity() {
  return (
    <>
      <span className="brand-mark">
        <Image
          src="/brand-mark-blackbar.png"
          alt=""
          width={512}
          height={512}
          className="brand-mark-image"
        />
      </span>
      <div className="brand-copy">
        <p className="brand-name">药宇纵观</p>
        <p className="brand-tag">
          <span className="brand-tag-accent">Reg</span>
          <span className="brand-tag-main">Scope</span>
        </p>
      </div>
    </>
  );
}
