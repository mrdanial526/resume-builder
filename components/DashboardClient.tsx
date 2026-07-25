"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Edit3, FileText, Loader2 } from "lucide-react";
import { deleteResume } from "@/actions/resume-actions";
import { signOut } from "next-auth/react";

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

  // Safely sync props when they change from the server
  useEffect(() => {
    if (!isDeleting) {
      setLocalResumes(resumes);
    }
  }, [resumes, isDeleting]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Stylish Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-bold h-10 w-10 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/25">
              RB
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">ResumeBuilder</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Hero Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-10 rounded-3xl text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e512_1px,transparent_1px),linear-gradient(to_bottom,#4f46e512_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Organize, update, and deploy your professional resumes with streamlined elegance.
            </p>
          </div>
          <Link
            href="/builder/new"
            className="relative z-10 inline-flex items-center justify-center bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 text-sm active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" /> Create New Resume
          </Link>
        </div>

        {/* Search Bar Container */}
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, target role, or name..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition text-sm text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase tracking-widest">
                      {resume.template || "Standard"}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {resume.updatedAt
                        ? new Date(resume.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {resume.title || "Untitled Resume"}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 truncate">
                      {resume.fullName ? resume.fullName : "No personal details added"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/builder/${resume._id}`}
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" /> Edit Resume
                  </Link>

                  <button
                    onClick={() => handleDelete(resume._id, resume.title || "")}
                    disabled={isDeleting === resume._id}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition disabled:opacity-50"
                    title="Delete Resume"
                  >
                    {isDeleting === resume._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">No resumes found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? "No results matched your query. Try a different term."
                  : "Get started by building your first professional resume."}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/builder/new"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition"
              >
                Create Resume
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}