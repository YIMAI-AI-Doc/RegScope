import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { DiscussionCard } from "@/components/cards/discussion-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DISCUSSION_HISTORY_COOKIE, parseDiscussionHistory } from "@/lib/discussions/history";
import { getDiscussionListData } from "@/lib/discussions/queries";

export const metadata: Metadata = {
  title: "讨论问答 | RegScope",
  description: "浏览 RegScope 的问题、结论、证据和回复。",
};

export default async function DiscussionsPage() {
  const [session, cookieStore] = await Promise.all([getServerSession(authOptions), cookies()]);
  const fallbackRecentDiscussionSlugs = parseDiscussionHistory(
    cookieStore.get(DISCUSSION_HISTORY_COOKIE)?.value,
  );
  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;
  const [recentViews, followedTargets] = currentUser
    ? await Promise.all([
        prisma.discussionView.findMany({
          where: { userId: currentUser.id },
          orderBy: [{ lastViewedAt: "desc" }],
          take: 12,
          select: {
            discussion: { select: { slug: true } },
          },
        }),
        prisma.follow.findMany({
          where: { userId: currentUser.id },
          select: {
            country: { select: { slug: true } },
            topic: { select: { slug: true } },
          },
        }),
      ])
    : [[], []];
  const recentDiscussionSlugs =
    recentViews.length > 0
      ? recentViews.flatMap((item) => (item.discussion?.slug ? [item.discussion.slug] : []))
      : fallbackRecentDiscussionSlugs;

  const data = await getDiscussionListData({
    recentDiscussionSlugs,
    followedCountrySlugs: followedTargets.flatMap((item) => (item.country?.slug ? [item.country.slug] : [])),
    followedTopicSlugs: followedTargets.flatMap((item) => (item.topic?.slug ? [item.topic.slug] : [])),
  });

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "10px" }}>
        <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>讨论问答</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>{data.title}</h1>
        <p style={{ margin: 0, maxWidth: "66ch", color: "var(--muted)", lineHeight: 1.8 }}>{data.summary}</p>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>为你推荐</h2>
            <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
              按最近浏览、关注范围和讨论活跃度综合排序。
            </p>
          </div>
          <span style={{ color: "var(--muted)" }}>{data.recommendedItems.length} 条</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {data.recommendedItems.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "22px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,248,253,0.95))",
                boxShadow: "0 12px 28px rgba(31, 55, 90, 0.06)",
                color: "inherit",
                padding: "18px 20px",
                display: "grid",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "fit-content",
                  borderRadius: "999px",
                  padding: "6px 10px",
                  background: "rgba(31, 79, 134, 0.08)",
                  color: "var(--accent)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {item.reason}
              </span>
              <strong style={{ fontSize: "1rem", lineHeight: 1.5 }}>{item.title}</strong>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{item.conclusion}</p>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
                {item.answerCount} 条回答 · {item.evidenceCount} 条证据
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>问题列表</h2>
          <span style={{ color: "var(--muted)" }}>{data.items.length} 条</span>
        </div>
        <div style={{ display: "grid", gap: "14px" }}>
          {data.items.map((item) => (
            <DiscussionCard key={item.slug} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
