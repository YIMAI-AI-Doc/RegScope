import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ConclusionPanel } from "@/components/discussions/conclusion-panel";
import { EvidenceList } from "@/components/discussions/evidence-list";
import { ControversyPanel } from "@/components/discussions/controversy-panel";
import { AnswerList } from "@/components/discussions/answer-list";
import { DiscussionViewTracker } from "@/components/discussions/view-tracker";
import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getDiscussionPageData } from "@/lib/discussions/queries";

type DiscussionDetailPageProps = {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: DiscussionDetailPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const data = await getDiscussionPageData(resolvedParams.slug);

  return {
    title: `${data.question.title} | RegScope`,
    description: data.question.summary,
  };
}

export default async function DiscussionDetailPage({ params }: DiscussionDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const session = await getServerSession(authOptions);
  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true },
      })
    : null;
  const data = await getDiscussionPageData(resolvedParams.slug, {
    userId: currentUser?.id,
    role: currentUser?.role ?? session?.user?.role,
  });

  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <DiscussionViewTracker slug={data.slug} />
      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(31,79,134,0.08), rgba(255,255,255,0.96))",
          boxShadow: "0 14px 34px rgba(31, 55, 90, 0.06)",
          padding: "24px",
          display: "grid",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>问题定义</p>
            <h1 style={{ margin: "8px 0 0", fontSize: "clamp(1.9rem, 4vw, 3rem)", lineHeight: 1.1 }}>
              {data.question.title}
            </h1>
          </div>
          <span
            style={{
              alignSelf: "start",
              borderRadius: "999px",
              padding: "6px 10px",
              background: "rgba(31, 79, 134, 0.08)",
              color: "var(--accent)",
              fontSize: "0.84rem",
              whiteSpace: "nowrap",
            }}
          >
            {data.question.updatedAtLabel}
          </span>
        </div>

        <p style={{ margin: 0, maxWidth: "70ch", color: "var(--muted)", lineHeight: 1.85 }}>
          {data.question.summary}
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Chip>{data.question.statusLabel}</Chip>
          <Chip>{data.question.countryLabel}</Chip>
          <Chip>{data.question.topicLabel}</Chip>
          <Chip>{data.question.createdByLabel}</Chip>
        </div>

        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
          发起于 {data.question.createdAtLabel} · {data.question.statusDescription}
        </p>
      </section>

      <ConclusionPanel conclusion={data.conclusion} />
      <EvidenceList items={data.evidence} />
      <ControversyPanel {...data.controversy} />
      <AnswerList
        answers={data.answers}
        viewer={data.viewer}
      />
      {data.relatedQuestions.length > 0 ? (
        <section
          style={{
            border: "1px solid var(--border)",
            borderRadius: "24px",
            background: "var(--panel-strong)",
            boxShadow: "0 14px 34px rgba(31, 55, 90, 0.06)",
            padding: "22px 24px",
            display: "grid",
            gap: "16px",
          }}
        >
          <div>
            <p style={{ margin: 0, color: "var(--accent)", fontWeight: 700 }}>相关问题</p>
            <h2 style={{ margin: "6px 0 0" }}>继续看相近讨论</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {data.relatedQuestions.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  background: "rgba(31, 79, 134, 0.04)",
                  color: "inherit",
                  padding: "16px 18px",
                  display: "grid",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "fit-content",
                    borderRadius: "999px",
                    padding: "4px 8px",
                    background: "rgba(31, 79, 134, 0.08)",
                    color: "var(--accent)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                  }}
                >
                  {item.reason}
                </span>
                <strong style={{ lineHeight: 1.5 }}>{item.title}</strong>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{item.conclusion}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <BackToTopButton />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        borderRadius: "999px",
        padding: "6px 10px",
        background: "rgba(31, 79, 134, 0.08)",
        color: "var(--accent)",
        fontWeight: 700,
        fontSize: "0.8rem",
      }}
    >
      {children}
    </span>
  );
}
