"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth-actions";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await registerUser({ name, email, password });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      {/* Left Column: Branding / Design Graphic */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e512_1px,transparent_1px),linear-gradient(to_bottom,#4f46e512_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <span className="text-sm font-semibold tracking-widest uppercase bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full border border-indigo-400/20">
            Resume Builder Suite
          </span>
        </div>
        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight leading-snug">
            Start building your career milestones today.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Join thousands of professionals creating beautiful, responsive resumes in minutes.
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} Resume Builder. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create an Account
            </h2>
            <p className="text-sm text-slate-500">
              Enter your details below to get started.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Muhammad Danial"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch={false}
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}