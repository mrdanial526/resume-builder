"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createResume } from "@/actions/resume-actions";

export default function CreateResumeBtn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreate = () => {
    startTransition(async () => {
      const res = await createResume("My Resume");
      if (res?.resumeId) {
        router.push(`/builder/${res.resumeId}`);
      }
    });
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isPending}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-50"
    >
      {isPending ? "Creating..." : "+ Create New Resume"}
    </button>
  );
}