import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  await connectToDatabase();

  const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).lean();
  const formattedResumes = JSON.parse(JSON.stringify(resumes));

  return <DashboardClient resumes={formattedResumes} />;
}