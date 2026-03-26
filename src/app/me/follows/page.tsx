import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "我的关注 | RegScope",
  description: "管理已关注的国家、机构和领域。",
};

export default async function FollowCenterPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return <AnonymousState />;
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      ...(session.user?.name ? { name: session.user.name } : {}),
      ...(session.user?.role === "ADMIN" ? { role: "ADMIN" } : {}),
    },
    create: {
      email,
      name: session.user?.name ?? null,
      role: session.user?.role === "ADMIN" ? "ADMIN" : "USER",
    },
  });

  const follows = await prisma.follow.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      source: true,
      country: true,
      topic: true,
    },
  });

  const grouped = {
    sources: follows.filter((item) => item.targetType === "SOURCE" && item.source),
    countries: follows.filter((item) => item.targetType === "COUNTRY" && item.country),
    topics: follows.filter((item) => item.targetType === "TOPIC" && item.topic),
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
          我的关注
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          关注中心
        </h1>
        <p style={{ margin: 0, maxWidth: "66ch", color: "var(--muted)", lineHeight: 1.8 }}>
          统一管理你关注的官方来源、国家地区和细分领域。
        </p>
      </section>

      <section style={panelStyle}>
        <p style={{ margin: 0, color: "var(--muted)" }}>当前账号</p>
        <h2 style={{ margin: "6px 0 0" }}>{session.user?.name ?? email}</h2>
        <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
          已关注 {follows.length} 项
        </p>
      </section>

      <FollowGroup title="关注中的来源" items={grouped.sources} emptyText="还没有关注来源，先从官方来源页开始。">
        <Link href="/sources" style={actionLinkStyle}>
          去看来源
        </Link>
      </FollowGroup>

      <FollowGroup title="关注中的国家" items={grouped.countries} emptyText="还没有关注国家，先从国家地区页开始。">
        <Link href="/countries" style={actionLinkStyle}>
          去看国家
        </Link>
      </FollowGroup>

      <FollowGroup title="关注中的领域" items={grouped.topics} emptyText="还没有关注领域，先从领域订阅页开始。">
        <Link href="/topics" style={actionLinkStyle}>
          去看领域
        </Link>
      </FollowGroup>
    </div>
  );
}

function AnonymousState() {
  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
          我的关注
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          登录后管理关注
        </h1>
        <p style={{ margin: 0, maxWidth: "66ch", color: "var(--muted)", lineHeight: 1.8 }}>
          游客可以直接浏览内容；登录后才能关注国家、机构和领域。
        </p>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: 0 }}>你还未登录</h2>
        <p style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
          登录后，你可以保存关注项并在首页收到个性化更新。
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "18px", flexWrap: "wrap" }}>
          <Link href="/topics" style={primaryButtonStyle}>
            先浏览领域
          </Link>
          <Link href="/sources" style={secondaryButtonStyle}>
            查看官方来源
          </Link>
        </div>
      </section>
    </div>
  );
}

function FollowGroup({
  title,
  items,
  emptyText,
  children,
}: {
  title: string;
  items: Array<{
    id: string;
    source?: { slug: string; name: string; description: string | null; feedUrl: string | null };
    country?: { slug: string; name: string; region: string | null };
    topic?: { slug: string; name: string; level: number };
  }>;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <section style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {children}
      </div>

      {items.length === 0 ? (
        <p style={{ margin: "16px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>{emptyText}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginTop: "16px" }}>
          {items.map((item) => {
            const card = item.source ?? item.country ?? item.topic;
            if (!card) {
              return null;
            }

            const href =
              item.source?.slug
                ? `/sources/${item.source.slug}`
                : item.country?.slug
                  ? `/countries/${item.country.slug}`
                  : `/topics/${item.topic?.slug ?? ""}`;

            const note = item.source?.description ?? item.country?.region ?? `Level ${item.topic?.level ?? 1}`;

            return (
              <Link key={item.id} href={href} style={followCardStyle}>
                <strong>{card.name}</strong>
                <span style={{ color: "var(--muted)", fontSize: "0.92rem" }}>{note ?? "关注项"}</span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

const panelStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "24px",
  background: "var(--panel-strong)",
  padding: "22px 24px",
  boxShadow: "0 12px 30px rgba(31, 55, 90, 0.06)",
};

const followCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "18px",
  background: "rgba(31, 79, 134, 0.04)",
  padding: "16px",
  display: "grid",
  gap: "8px",
};

const primaryButtonStyle: React.CSSProperties = {
  borderRadius: "12px",
  background: "linear-gradient(135deg, #1f4f86, #2f6aa8)",
  color: "#fff",
  padding: "10px 16px",
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: "12px",
  border: "1px solid var(--border)",
  color: "var(--text)",
  padding: "10px 16px",
  fontWeight: 700,
};

const actionLinkStyle: React.CSSProperties = {
  color: "var(--accent)",
  fontWeight: 700,
};
