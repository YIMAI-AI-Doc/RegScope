import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentUserPetCardData } from "@/lib/pets/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const pet = await getCurrentUserPetCardData(session.user.id);
    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch current divine beast data", error);
    return NextResponse.json({ error: "加载神兽数据失败" }, { status: 500 });
  }
}
