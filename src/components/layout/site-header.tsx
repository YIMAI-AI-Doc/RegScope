import React from "react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/feed", label: "情报快讯" },
  { href: "/topics", label: "领域订阅" },
  { href: "/sources", label: "官方来源" },
  { href: "/countries", label: "国家地区" },
  { href: "/discussions", label: "讨论问答" },
  { href: "/me/follows", label: "我的关注" },
] as const;

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">R</span>
        <div>
          <p className="brand-name">RegScope</p>
          <p className="brand-tag">全球医药监管情报平台</p>
        </div>
      </div>
      <nav className="topnav" aria-label="主导航">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
