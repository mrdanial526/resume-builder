import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import ResumeForm from "@/components/builder/resume-form";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  if (id === "new") {
    const emptyResume = {
      _id: "",
      title: "Untitled Resume",
      fullName: session.user.name || "",
      email: session.user.email || "",
      phone: "",
      summary: "",
      skills: [],
      template: "standard",
      experience: [],
      education: [],
      projects: [],
    };

    return <ResumeForm initialData={emptyResume} />;
  }

  await connectToDatabase();
  // Using findOne ensures a single document is returned instead of an array
  const rawResume = await Resume.findOne({ _id: id, userId }).lean();

  if (!rawResume) {
    notFound();
  }

  const initialData = JSON.parse(JSON.stringify(rawResume));

  return <ResumeForm initialData={initialData} />;
}