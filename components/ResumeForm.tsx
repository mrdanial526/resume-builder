"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveResume } from "@/actions/resume-actions";

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  year: string;
}

interface Project {
  title: string;
  technologies: string;
  link: string;
  description: string;
}

interface ResumeFormProps {
  initialData?: {
    _id?: string;
    title?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    summary?: string;
    picture?: string;
    skills?: string | string[];
    languages?: string;
    certifications?: string;
    experience?: Experience[];
    education?: Education[];
    projects?: Project[];
  };
}

export default function ResumeForm({ initialData }: ResumeFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    summary: initialData?.summary ?? "",
    picture: initialData?.picture ?? "",
    languages: initialData?.languages ?? "",
    certifications: initialData?.certifications ?? "",
    skills: Array.isArray(initialData?.skills)
      ? initialData.skills.join(", ")
      : initialData?.skills ?? "",
  });

  const [experience, setExperience] = useState<Experience[]>(
    initialData?.experience?.length
      ? initialData.experience
      : [{ company: "", role: "", startDate: "", endDate: "", description: "" }]
  );

  const [education, setEducation] = useState<Education[]>(
    initialData?.education?.length
      ? initialData.education
      : [{ school: "", degree: "", year: "" }]
  );

  const [projects, setProjects] = useState<Project[]>(
    initialData?.projects?.length
      ? initialData.projects
      : [{ title: "", technologies: "", link: "", description: "" }]
  );

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!saveStatus) return;
    const timer = setTimeout(() => setSaveStatus(null), 4000);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 300;
          const scaleFactor = img.width > 0 ? MAX_WIDTH / img.width : 1;
          canvas.width = MAX_WIDTH;
          canvas.height = Math.round(img.height * scaleFactor);

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setFormData((prev) => ({ ...prev, picture: compressedDataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperience((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeExperience = (index: number) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation((prev) => [...prev, { school: "", degree: "", year: "" }]);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { title: "", technologies: "", link: "", description: "" },
    ]);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    setProjects((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim()) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaveStatus("Save Error: Please fill in all required fields (Name and Email).");
      return;
    }

    setErrors({});
    setSaving(true);
    setSaveStatus(null);

    try {
      const payload = {
        _id: initialData?._id,
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience,
        education,
        projects,
      };

      const result = await saveResume(payload);

      if (!result?.success) {
        const errorMsg = "error" in result && result.error ? String(result.error) : "Failed to save resume";
        throw new Error(errorMsg);
      }

      setSaveStatus("Saved successfully!");

      const savedId = "id" in result ? result.id : undefined;
      if (savedId && (initialData?._id === "new" || !initialData?._id)) {
        router.push(`/builder/${savedId}`);
      }
    } catch (err: any) {
      setSaveStatus(`Save Error: ${err.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const skillsList =
    typeof formData.skills === "string" && formData.skills.trim() !== ""
      ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-resume,
          #printable-resume * {
            visibility: visible;
          }
          #printable-resume {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1500px] mx-auto p-6 items-start">
        {/* Editor Form Column */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6 no-print">
          <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                ← Dashboard
              </Link>
              <h2 className="text-xl font-bold text-gray-800">Resume Editor</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                🖨️ PDF
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {saveStatus && (
            <div
              className={`p-3 rounded-md text-xs font-semibold ${
                saveStatus.includes("Error")
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {saveStatus}
            </div>
          )}

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 border-b pb-1">
              1. Personal Details & Title
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Resume Title (e.g., Software Engineer Resume)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Untitled Resume"
                className="w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full mt-1 p-1 text-xs border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 ${
                    errors.fullName
                      ? "border-red-500 bg-red-50"
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Professional Summary
              </label>
              <textarea
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Certifications (comma separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="AWS Certified, CCNA..."
                  className="w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Languages (comma separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="English, Urdu..."
                  className="w-full mt-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                2. Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded font-medium"
              >
                + Add Experience
              </button>
            </div>

            {experience.map((exp, index) => (
              <div
                key={index}
                className="p-3 border rounded bg-slate-50 space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-500">
                    Role #{index + 1}
                  </span>
                  {experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) =>
                      updateExperience(index, "role", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Start Date (e.g. Jan 2024)"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(index, "startDate", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g. Present)"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(index, "endDate", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                </div>

                <textarea
                  placeholder="Responsibilities..."
                  rows={2}
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  className="w-full p-1.5 border rounded text-xs"
                />
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                3. Key Projects
              </h3>
              <button
                type="button"
                onClick={addProject}
                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded font-medium"
              >
                + Add Project
              </button>
            </div>

            {projects.map((proj, index) => (
              <div
                key={index}
                className="p-3 border rounded bg-slate-50 space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-500">
                    Project #{index + 1}
                  </span>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) =>
                      updateProject(index, "title", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Technologies"
                    value={proj.technologies}
                    onChange={(e) =>
                      updateProject(index, "technologies", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Project Link"
                  value={proj.link}
                  onChange={(e) => updateProject(index, "link", e.target.value)}
                  className="w-full p-1.5 border rounded text-xs"
                />

                <textarea
                  placeholder="Project details..."
                  rows={2}
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                  className="w-full p-1.5 border rounded text-xs"
                />
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                4. Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded font-medium"
              >
                + Add Education
              </button>
            </div>

            {education.map((edu, index) => (
              <div
                key={index}
                className="p-3 border rounded bg-slate-50 space-y-2 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-500">
                    Degree #{index + 1}
                  </span>
                  {education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="School / University"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) =>
                      updateEducation(index, "year", e.target.value)
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  className="w-full p-1.5 border rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Executive Two-Column Resume Preview Layout */}
        <div
          id="printable-resume"
          className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden min-h-[850px] lg:sticky lg:top-6"
        >
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-8 flex justify-between items-center">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {formData.fullName || "Your Name"}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                {formData.email && <span>✉️ {formData.email}</span>}
                {formData.phone && <span>📞 {formData.phone}</span>}
              </div>
            </div>

            {formData.picture && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={formData.picture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-md"
              />
            )}
          </div>

          {/* Two Column Layout Body */}
          <div className="grid grid-cols-12 p-8 gap-8">
            {/* Left Main Content Column */}
            <div className="col-span-7 space-y-6">
              {formData.summary && (
                <div className="space-y-1.5 break-inside-avoid">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Profile Summary
                  </h2>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {formData.summary}
                  </p>
                </div>
              )}

              {experience.some((e) => e.role || e.company) && (
                <div className="space-y-3">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <div key={index} className="space-y-1 break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900 text-xs">
                            {exp.role || "Role"}
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                          </span>
                        </div>
                        {exp.company && (
                          <p className="text-[11px] font-medium text-blue-600">
                            {exp.company}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed pt-0.5">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projects.some((p) => p.title) && (
                <div className="space-y-3">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {projects.map((proj, index) => (
                      <div key={index} className="space-y-1 break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900 text-xs">
                            {proj.title}
                          </h3>
                          {proj.technologies && (
                            <span className="text-[10px] font-semibold text-slate-500">
                              {proj.technologies}
                            </span>
                          )}
                        </div>
                        {proj.link && (
                          <p className="text-[10px] text-blue-600 font-mono">
                            {proj.link}
                          </p>
                        )}
                        {proj.description && (
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {proj.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Column */}
            <div className="col-span-5 space-y-6 border-l pl-6 border-gray-100">
              {skillsList.length > 0 && (
                <div className="space-y-2 break-inside-avoid">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Technical Skills
                  </h2>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillsList.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {education.some((e) => e.school || e.degree) && (
                <div className="space-y-3">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-0.5 break-inside-avoid">
                        <h3 className="font-bold text-gray-900 text-xs">
                          {edu.degree || "Degree"}
                        </h3>
                        <p className="text-xs text-gray-600">{edu.school}</p>
                        <p className="text-[10px] font-semibold text-slate-400">
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.certifications && (
                <div className="space-y-2 break-inside-avoid">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Certifications
                  </h2>
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                    {formData.certifications.split(",").map((cert, i) => (
                      <li key={i}>{cert.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.languages && (
                <div className="space-y-2 break-inside-avoid">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-1">
                    Languages
                  </h2>
                  <p className="text-xs text-gray-700">{formData.languages}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}