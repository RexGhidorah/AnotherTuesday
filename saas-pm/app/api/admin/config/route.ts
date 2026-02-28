import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const config = await prisma.systemConfig.findUnique({
    where: { key },
  });

  return NextResponse.json(config ? JSON.parse(config.value) : {});
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!dbUser) return NextResponse.json({ error: "Admin user not found" }, { status: 404 });

  const { key, value } = await req.json();

  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  await prisma.systemConfig.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });

  await prisma.activityLog.create({
      data: {
        action: "UPDATED_SYSTEM_CONFIG",
        details: `Actualizó la configuración: ${key}`,
        userId: dbUser.id,
      }
  });

  return NextResponse.json({ success: true });
}
