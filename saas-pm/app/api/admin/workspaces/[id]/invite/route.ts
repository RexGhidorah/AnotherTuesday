import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  const { id: workspaceId } = await params;

  try {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
    });

    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    // 1. Check if user exists, if not create a placeholder user
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({
        data: { email, role: "MEMBER" },
      });
      isNewUser = true;
    }

    // 2. Add user to workspace
    // Check if already member
    const existingMember = await prisma.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (existingMember) {
        return NextResponse.json({ message: "User already in workspace" });
    }

    await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId,
        role: "MEMBER",
      },
    });

    // 3. Send email
    const subject = `Invitation to join ${workspace.name}`;
    const text = isNewUser
        ? `You have been invited to join ${workspace.name} on SAAS PM. Please register at ${process.env.NEXTAUTH_URL}/login using this email.`
        : `You have been added to the workspace ${workspace.name} on SAAS PM.`;

    await sendEmail({
        to: email,
        subject,
        text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not invite user" }, { status: 500 });
  }
}
