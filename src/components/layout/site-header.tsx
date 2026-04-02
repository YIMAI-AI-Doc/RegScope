import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { AccountMenu } from "@/components/layout/account-menu";
import { BrandMark } from "@/components/layout/brand-mark";
import { TopnavLinks } from "@/components/layout/topnav-links";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/feed", label: "情报搜索" },
  { href: "/topics", label: "领域订阅" },
  { href: "/discussions", label: "讨论问答" },
] as const;

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const viewerSession = session?.user?.email
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
  const [latestProfile, stats] = viewerSession.isAuthenticated
    ? await Promise.all([
        prisma.user.findUnique({
          where: { id: viewerSession.userId ?? "" },
          select: { avatarUrl: true, name: true, email: true, role: true },
        }),
        Promise.all([
          prisma.follow.count({ where: { userId: viewerSession.userId ?? "" } }),
          prisma.answer.count({ where: { authorId: viewerSession.userId ?? "" } }),
          prisma.discussion.count({ where: { createdById: viewerSession.userId ?? "" } }),
        ]),
      ])
    : [null, [0, 0, 0] as const];

  const viewer = {
    ...viewerSession,
    name: latestProfile?.name ?? viewerSession.name,
    email: latestProfile?.email ?? viewerSession.email,
    role: latestProfile?.role ?? viewerSession.role,
    avatarUrl: latestProfile?.avatarUrl ?? viewerSession.avatarUrl,
  };

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
