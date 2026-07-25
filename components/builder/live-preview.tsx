"use client";

import { useResumeStore } from "@/hooks/use-resume-store";
import ModernTemplate from "./templates/modern-template";
import AtsTemplate from "./templates/ats-template";

export default function LivePreview() {
  const { resume } = useResumeStore();

  const renderTemplate = () => {
    switch (resume.template) {
      case "ats":
        return <AtsTemplate data={resume} />;
      case "modern":
      default:
        return <ModernTemplate data={resume} />;
    }
  };

  return (
    <div className="sticky top-6 bg-gray-200 p-4 rounded-xl shadow-inner max-h-[85vh] overflow-y-auto">
      <div className="transform scale-[0.85] origin-top bg-white shadow-2xl rounded">
        {renderTemplate()}
      </div>
    </div>
  );
}