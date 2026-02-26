import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.systemConfig.findUnique({
    where: { key: "SMTP_SETTINGS" },
  });

  return NextResponse.json(config ? JSON.parse(config.value) : {});
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { host, port, user, pass, from } = await req.json();

  const settings = {
    host,
    port,
    user,
    pass,
    from,
    secure: parseInt(port) === 465,
  };

  await prisma.systemConfig.upsert({
    where: { key: "SMTP_SETTINGS" },
    update: { value: JSON.stringify(settings) },
    create: { key: "SMTP_SETTINGS", value: JSON.stringify(settings) },
  });

  return NextResponse.json({ success: true });
}
