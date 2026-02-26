import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProjectClientPage from "./client-page";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string; projectId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { projectId } = await params;

  // Validate Access
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
        tasks: true,
        workspace: {
            include: {
                members: true
            }
        }
    }
  });

  if (!project) return <div>Project not found</div>;

  const isMember = project.workspace.members.some(m => m.userId === session.user.id);
  const isAdmin = session.user.role === "SUPER_ADMIN";

  if (!isMember && !isAdmin) {
      return <div>Unauthorized access to this project</div>;
  }

  return <ProjectClientPage tasks={project.tasks} projectId={projectId} />;
}
