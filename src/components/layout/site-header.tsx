import React from "react";
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
      <Link href="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
        <span className="brand-mark" aria-hidden="true">R</span>
        <div>
          <p className="brand-name">药云纵观</p>
          <p className="brand-tag">RegScope</p>
        </div>
      </Link>
      <div className="cluster-banner" aria-label="全球医药法规情报平台">
        <strong>全球医药法规情报平台</strong>
        <span className="cluster-banner-kicker">Global Pharma Regulatory Intelligence Platform</span>
      </div>
      <nav className="topnav" aria-label="主导航">
        <TopnavLinks items={navItems} />
        <AccountMenu
          viewer={{
            isAuthenticated: viewer.isAuthenticated,
            name: viewer.name,
            email: viewer.email,
            role: viewer.role,
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
