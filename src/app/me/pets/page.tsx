import React from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MyPetCard } from "@/components/pets/my-pet-card";
import { PetDexGrid } from "@/components/pets/pet-dex-grid";
import { authOptions } from "@/lib/auth";
import { getPetDexPageData } from "@/lib/pets/queries";

export const metadata: Metadata = {
  title: "我的神兽 | RegScope",
  description: "查看当前神兽成长进度与全部图鉴解锁状态",
};

export default async function MyPetsPage() {
  const session = await getServerSession(authOptions);
  const viewer = session?.user;

  if (!viewer?.id) {
    redirect("/api/auth/signin");
  }

  const data = await getPetDexPageData(viewer.id);

  return (
    <div style={{ display: "grid", gap: "20px", padding: "24px 0" }}>
      <header style={{ display: "grid", gap: "6px" }}>
        <strong style={{ fontSize: "1.3rem" }}>神兽图鉴与互动</strong>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          当前神兽会随着你的活跃逐步成长；解锁更高等级后，将随机迎来新的神兽伙伴。
        </p>
      </header>

      <MyPetCard
        pet={data.currentPet}
        title="当前神兽"
        subtitle="保持连续活跃，点亮三星后晋升下一阶"
      />

      <section
        style={{
          display: "grid",
          gap: "8px",
          padding: "16px 18px",
          borderRadius: "18px",
          border: "1px solid rgba(104,132,171,0.18)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,249,253,0.96))",
          boxShadow: "0 10px 24px rgba(31,55,90,0.08)",
        }}
      >
        <strong style={{ fontSize: "1rem" }}>升级规则</strong>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          每阶共 15 分，按 5 分一星推进成长。点亮三颗星后会晋升到下一阶，并随机迎来该等级的新神兽。
        </p>
      </section>

      <PetDexGrid tiers={data.tiers} />
    </div>
  );
}
