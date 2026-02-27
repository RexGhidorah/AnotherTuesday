import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderPlus } from "lucide-react";

export default async function WorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { slug } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      projects: true,
    },
  });

  if (!workspace) return <div>Workspace not found</div>;

  return (
    <div className="flex h-full flex-col p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{workspace.name}</h1>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
           <FolderPlus size={18} />
           New Project
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workspace.projects.map((project) => (
          <Link
            key={project.id}
            href={`/workspace/${slug}/project/${project.id}`}
            className="group relative flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description || "No description provided."}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-gray-400">
               <span>Updated recently</span>
               <span className="font-medium text-indigo-500 group-hover:underline">View Tasks &rarr;</span>
            </div>
          </Link>
        ))}

        {workspace.projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
                <FolderPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">Get started by creating a new project for this workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
}
