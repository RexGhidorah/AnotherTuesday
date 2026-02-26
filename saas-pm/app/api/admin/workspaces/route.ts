import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug } = await req.json();

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(workspace);
  } catch (error) {
    return NextResponse.json({ error: "Could not create workspace" }, { status: 500 });
  }
}
