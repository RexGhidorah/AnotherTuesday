import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Verify no users exist (Security Check)
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json({ error: "Setup already completed" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password required" }, { status: 400 });
    }

    // 2. Create Admin User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    // 3. Save SMTP Config if provided
    if (smtpHost) {
      const settings = {
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        pass: smtpPass,
        from: smtpFrom,
        secure: parseInt(smtpPort) === 465,
      };

      await prisma.systemConfig.create({
        data: {
          key: "SMTP_SETTINGS",
          value: JSON.stringify(settings),
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}
