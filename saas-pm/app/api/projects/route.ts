import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, workspaceId } = await req.json();

  // Validate user belongs to workspace
  const member = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspaceId: workspaceId,
    },
  });

  if (!member && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "CREATED_PROJECT",
        details: `Created project ${name}`,
        userId: session.user.id,
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Could not create project" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!session || !workspaceId) {
    return NextResponse.json({ error: "Unauthorized or Missing Workspace ID" }, { status: 401 });
  }

  // Validate access
  const member = await prisma.workspaceMember.findFirst({
    where: { userId: session.user.id, workspaceId },
  });

  if (!member && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const projects = await prisma.project.findMany({
    where: { workspaceId },
    include: { tasks: true }
  });

  return NextResponse.json(projects);
}
