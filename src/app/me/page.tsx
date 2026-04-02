import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProfileAvatarCard } from "@/components/profile/profile-avatar-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "个人中心 | RegScope",
  description: "查看个人信息、收藏和互动记录",
};

export default async function MePage() {
  const session = await getServerSession(authOptions);
  const viewer = session?.user;

  if (!viewer?.id) {
    redirect("/api/auth/signin");
  }

  const [profile, stats, favorites] = await Promise.all([
    getProfileSummary(viewer.id),
    getProfileStats(viewer.id),
    getFavorites(viewer.id),
  ]);

  return (
    <div style={{ display: "grid", gap: "18px", padding: "24px 0" }}>
      <ProfileAvatarCard
        name={profile.name ?? viewer.name ?? viewer.email ?? ""}
        email={profile.email ?? viewer.email ?? ""}
        avatarUrl={profile.avatarUrl}
      />

      <section
        style={{
          display: "grid",
          gap: "12px",
          padding: "18px",
          borderRadius: "18px",
          border: "1px solid rgba(104,132,171,0.22)",
          background: "white",
          boxShadow: "0 8px 24px rgba(31,55,90,0.08)",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
          <div>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>我的活跃</p>
            <strong style={{ fontSize: "1.04rem" }}>{viewer.name ?? viewer.email}</strong>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
          <StatCard label="关注" value={stats.followCount} href="/me/follows" />
          <StatCard label="回答" value={stats.answerCount} />
          <StatCard label="讨论" value={stats.discussionCount} />
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: "10px",
          padding: "18px",
          borderRadius: "18px",
          border: "1px solid rgba(104,132,171,0.22)",
          background: "white",
          boxShadow: "0 8px 24px rgba(31,55,90,0.08)",
        }}
      >
        <header>
          <strong style={{ fontSize: "1.02rem" }}>收藏与点赞</strong>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>收藏的文章、点赞的讨论会显示在这里。</p>
        </header>
        <FavoritesList favorites={favorites} />
      </section>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const body = (
    <div
      style={{
        display: "grid",
        gap: "6px",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid rgba(104,132,171,0.18)",
        background: "linear-gradient(180deg, rgba(249,252,255,0.98), rgba(244,248,253,0.96))",
      }}
    >
      <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{label}</span>
      <strong style={{ fontSize: "1.4rem", color: "var(--accent)" }}>{value}</strong>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none" }}>
        {body}
      </a>
    );
  }

  return body;
}

type Favorites = Awaited<ReturnType<typeof getFavorites>>;

function FavoritesList({ favorites }: { favorites: Favorites }) {
  const empty = favorites.content.length === 0 && favorites.discussions.length === 0;
  if (empty) {
    return (
      <div
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          border: "1px dashed rgba(104,132,171,0.24)",
          background: "rgba(247,250,254,0.72)",
        }}
      >
        <strong style={{ display: "block", marginBottom: "4px" }}>还没有收藏或点赞</strong>
        <span style={{ color: "var(--muted)" }}>去浏览情报或讨论，点击收藏/点赞后会出现在这里。</span>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {favorites.content.length > 0 ? (
        <div>
          <p style={{ margin: "0 0 6px", color: "var(--muted)" }}>收藏的文章 / 情报</p>
          <div style={{ display: "grid", gap: "8px" }}>
            {favorites.content.map((item) => (
              <a
                key={item.slug}
                href={`/content/${item.slug}`}
                style={{
                  display: "grid",
                  gap: "2px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(104,132,171,0.16)",
                  background: "rgba(247,250,254,0.78)",
                  textDecoration: "none",
                }}
              >
                <strong style={{ color: "#163d2f", fontSize: "0.98rem" }}>{item.title}</strong>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{item.sourceName}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {favorites.discussions.length > 0 ? (
        <div>
          <p style={{ margin: "0 0 6px", color: "var(--muted)" }}>点赞的讨论</p>
          <div style={{ display: "grid", gap: "8px" }}>
            {favorites.discussions.map((item) => (
              <a
                key={item.slug}
                href={`/discussions/${item.slug}`}
                style={{
                  display: "grid",
                  gap: "2px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(104,132,171,0.16)",
                  background: "rgba(247,250,254,0.78)",
                  textDecoration: "none",
                }}
              >
                <strong style={{ color: "#163d2f", fontSize: "0.98rem" }}>{item.title}</strong>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{item.topicName ?? "讨论"}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

async function getProfileStats(userId: string) {
  const [followCount, answerCount, discussionCount] = await Promise.all([
    prisma.follow.count({ where: { userId } }),
    prisma.answer.count({ where: { authorId: userId } }),
    prisma.discussion.count({ where: { createdById: userId } }),
  ]);

  return {
    followCount,
    answerCount,
    discussionCount,
  };
}

async function getProfileSummary(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true, name: true, email: true },
  });

  return {
    avatarUrl: user?.avatarUrl ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
  };
}

async function getFavorites(userId: string) {
  const [contentFavs, discussionFavs] = await Promise.all([
    prisma.contentFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { content: { select: { slug: true, title: true, source: { select: { name: true } } } } },
    }),
    prisma.discussionFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { discussion: { select: { slug: true, title: true, topic: { select: { name: true } } } } },
    }),
  ]);

  return {
    content: contentFavs.map((item) => ({
      slug: item.content.slug,
      title: item.content.title,
      sourceName: item.content.source.name ?? "来源",
    })),
    discussions: discussionFavs.map((item) => ({
      slug: item.discussion.slug,
      title: item.discussion.title,
      topicName: item.discussion.topic?.name ?? null,
    })),
  };
}
