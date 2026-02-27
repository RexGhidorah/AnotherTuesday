import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SetupForm from "./setup-form";

export const dynamic = 'force-dynamic';

export default async function SetupPageWrapper() {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    redirect("/login");
  }

  return <SetupForm />;
}
