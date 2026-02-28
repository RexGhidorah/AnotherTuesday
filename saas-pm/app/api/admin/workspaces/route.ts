import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug } = await req.json();

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return NextResponse.json({ error: "Admin user not found" }, { status: 404 });

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        members: {
          create: {
            userId: dbUser.id,
            role: "ADMIN",
          }
        }
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATED_WORKSPACE",
        details: `Creó el workspace ${workspace.name}`,
        userId: dbUser.id,
      }
    });

    return NextResponse.json(workspace);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create workspace" }, { status: 500 });
  }
}
