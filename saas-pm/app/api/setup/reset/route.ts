import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  try {
    await prisma.user.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.systemConfig.deleteMany();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
