import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminEmailClient from "./client-page";

export default async function AdminEmailPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl">
       <AdminEmailClient />
    </div>
  );
}
