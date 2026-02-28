"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// --- Users ---

export async function inviteUser(data: { email: string; role: string; name?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Admin user not found" };

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User already exists with this email." };
    }

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || data.email.split("@")[0],
        role: data.role,
        image: `https://ui-avatars.com/api/?name=${data.name || data.email}&background=random`,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "INVITED_USER",
        details: `Invitó al usuario ${newUser.email} con rol ${newUser.role}`,
        userId: dbUser.id,
      }
    });

    revalidatePath("/admin/users");
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Failed to invite user:", error);
    return { error: "Failed to invite user." };
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Admin user not found" };

    const userToDelete = await prisma.user.findUnique({ where: { id: userId }});
    if (!userToDelete) return { error: "User not found" };

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.activityLog.create({
      data: {
        action: "DELETED_USER",
        details: `Eliminó al usuario ${userToDelete.email}`,
        userId: dbUser.id,
      }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user." };
  }
}

export async function deleteWorkspace(workspaceId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Admin user not found in DB" };

    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) return { error: "Workspace not found" };

    // Log the action BEFORE deleting to avoid SQLite cascade foreign key lock issues
    await prisma.activityLog.create({
      data: {
        action: "DELETED_WORKSPACE",
        details: `Eliminó el workspace ${workspace.name}`,
        userId: dbUser.id,
      }
    });

    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete workspace:", error);
    return { error: "Failed to delete workspace." };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) return { error: "Admin user not found" };

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATED_USER_ROLE",
        details: `Actualizó el rol de ${user.email} a ${newRole}`,
        userId: dbUser.id,
      }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { error: "Failed to update user role." };
  }
}
