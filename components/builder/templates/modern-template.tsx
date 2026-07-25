import { IResumeData } from "@/types/resume";

export default function ModernTemplate({ data }: { data: IResumeData }) {
  const { personalInfo, summary, experiences, education, skills, projects } = data;

  return (
    <div className="p-8 bg-white min-h-[1056px] text-gray-800 font-sans shadow-lg text-sm leading-relaxed">
      <header className="border-b-2 border-indigo-600 pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-950 uppercase">
          {personalInfo?.fullName || "Your Name"}
        </h1>
        <p className="text-lg font-medium text-indigo-600 mt-1">
          {personalInfo?.jobTitle || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-3">
          {personalInfo?.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo?.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo?.address && <span>📍 {personalInfo.address}</span>}
          {personalInfo?.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo?.github && <span>💻 {personalInfo.github}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 border-b pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {experiences && experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 border-b pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-semibold text-gray-900">
                  <span>{exp.position} — <span className="text-indigo-700">{exp.company}</span></span>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 border-b pb-1">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-semibold text-gray-900">
                  <span>{proj.title}</span>
                  <div className="space-x-2 text-xs text-indigo-600">
                    {proj.githubUrl && <span>GitHub</span>}
                    {proj.liveUrl && <span>Live Demo</span>}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 border-b pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-xs text-indigo-700">{edu.institution}</p>
                  <p className="text-[11px] text-gray-500">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 border-b pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border border-gray-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}