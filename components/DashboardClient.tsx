"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit3, FileText, Loader2 } from "lucide-react";
import { deleteResume } from "@/actions/resume-actions";

interface ResumeItem {
  _id: string;
  title?: string;
  fullName?: string;
  email?: string;
  template?: string;
  updatedAt?: string | Date;
}

export default function DashboardClient({ resumes = [] }: { resumes?: ResumeItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [localResumes, setLocalResumes] = useState<ResumeItem[]>(resumes);

  if (resumes !== localResumes && !isDeleting) {
    setLocalResumes(resumes);
  }

  const filteredResumes = localResumes.filter((resume) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const titleMatch = resume.title?.toLowerCase().includes(query);
    const nameMatch = resume.fullName?.toLowerCase().includes(query);
    const emailMatch = resume.email?.toLowerCase().includes(query);
    return titleMatch || nameMatch || emailMatch;
  });

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title || "this resume"}"?`
    );
    if (!confirmDelete) return;

    setIsDeleting(id);
    setLocalResumes((prev) => prev.filter((r) => r._id !== id));

    try {
      const res = await deleteResume(id);
      if (!res?.success) {
        setLocalResumes(resumes);
        const errorMsg = "error" in res && res.error ? String(res.error) : "Failed to delete resume";
        alert(errorMsg);
      }
    } catch (err) {
      setLocalResumes(resumes);
      alert("An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and organize your resumes</p>
        </div>
        <Link
          href="/builder/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          Create New Resume
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, target role, or name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          />
        </div>
      </div>

      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div
              key={resume._id}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase tracking-wide">
                    {resume.template || "Standard"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {resume.updatedAt
                      ? new Date(resume.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {resume.title || "Untitled Resume"}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {resume.fullName ? resume.fullName : "No personal details added"}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/builder/${resume._id}`}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit Resume
                </Link>

                <button
                  onClick={() => handleDelete(resume._id, resume.title || "")}
                  disabled={isDeleting === resume._id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                  title="Delete Resume"
                >
                  {isDeleting === resume._id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No resumes found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery
              ? "Try searching for a different keyword."
              : "Get started by creating your first resume!"}
          </p>
        </div>
      )}
    </div>
  );
}