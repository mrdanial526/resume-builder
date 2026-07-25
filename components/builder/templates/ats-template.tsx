import { IResumeData } from "@/types/resume";

export default function AtsTemplate({ data }: { data: IResumeData }) {
  const { personalInfo, summary, experiences, education, skills, projects } = data;

  return (
    <div className="p-8 bg-white min-h-[1056px] text-black font-serif text-sm leading-normal">
      <div className="text-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest">{personalInfo?.fullName || "NAME"}</h1>
        <p className="text-sm font-medium italic mt-1">{personalInfo?.jobTitle}</p>
        <p className="text-xs mt-2">
          {[personalInfo?.email, personalInfo?.phone, personalInfo?.address, personalInfo?.linkedin]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>

      {summary && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-black uppercase text-xs tracking-wider mb-1">SUMMARY</h2>
          <p className="text-xs">{summary}</p>
        </div>
      )}

      {experiences && experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-black uppercase text-xs tracking-wider mb-2">EXPERIENCE</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between font-bold text-xs">
                <span>{exp.company} — {exp.position}</span>
                <span>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <p className="text-xs mt-1 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-black uppercase text-xs tracking-wider mb-1">TECHNICAL SKILLS</h2>
          <p className="text-xs">{skills.map((s) => s.name).join(", ")}</p>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-black uppercase text-xs tracking-wider mb-2">EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between text-xs mb-1">
              <div>
                <span className="font-bold">{edu.institution}</span> — {edu.degree} ({edu.fieldOfStudy})
              </div>
              <span>{edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}