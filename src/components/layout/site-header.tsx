import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { AccountMenu } from "@/components/layout/account-menu";
import { TopnavLinks } from "@/components/layout/topnav-links";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/feed", label: "情报搜索" },
  { href: "/topics", label: "领域订阅" },
  { href: "/discussions", label: "讨论问答" },
] as const;

function BrandMark() {
  return (
    <svg viewBox="0 0 44 44" role="img" aria-hidden="true">
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

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const viewer = session?.user?.email
    ? {
        isAuthenticated: true,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        role: session.user.role ?? null,
        avatarUrl: session.user.avatarUrl ?? null,
        userId: session.user.id,
      }
    : {
        isAuthenticated: false,
        name: null,
        email: null,
        role: null,
        avatarUrl: null,
        userId: null as string | null,
      };
  const stats = viewer.isAuthenticated
    ? await Promise.all([
        prisma.follow.count({ where: { userId: viewer.userId ?? "" } }),
        prisma.answer.count({ where: { authorId: viewer.userId ?? "" } }),
        prisma.discussion.count({ where: { createdById: viewer.userId ?? "" } }),
      ])
    : [0, 0, 0];

  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="返回 RegScope 首页">
        <span className="brand-mark">
          <BrandMark />
        </span>
        <div>
          <p className="brand-name">药云纵观</p>
          <p className="brand-tag">RegScope</p>
        </div>
      </Link>
      <div className="cluster-banner" aria-label="全球医药法规情报平台">
        <span className="cluster-banner-kicker">Global Pharma Regulatory Intelligence Platform</span>
        <strong>全球医药法规情报平台</strong>
      </div>
      <nav className="topnav" aria-label="主导航">
        <TopnavLinks items={navItems} />
        <AccountMenu
          viewer={{
            isAuthenticated: viewer.isAuthenticated,
            name: viewer.name,
            email: viewer.email,
            role: viewer.role,
            avatarUrl: viewer.avatarUrl,
          }}
          stats={{
            followCount: stats[0],
            answerCount: stats[1],
            discussionCount: stats[2],
          }}
        />
      </nav>
    </header>
  );
}
