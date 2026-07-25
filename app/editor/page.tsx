import ResumeForm from "@/components/ResumeForm";

export default async function EditResumePage({ params }: { params: { id: string } }) {
  // 1. Fetch existing resume data from your API or database
  // Example placeholder data:
  const initialData = {
    _id: params.id,
    title: "My Software Engineer Resume",
    fullName: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1 234 567 890",
    summary: "Passionate Full-Stack Developer...",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    experience: [],
    education: [],
    projects: [],
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <ResumeForm initialData={initialData} />
    </main>
  );
}