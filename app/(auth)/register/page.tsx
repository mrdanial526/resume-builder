"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth-actions";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Track errors individually per field
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    // Validate individual fields and map out specific reasons
    const errors: { [key: string]: string } = {};
    if (!name.trim()) {
      errors.name = "Full name is required to personalize your resumes.";
    }
    if (!email.trim()) {
      errors.email = "Email address is required for your account login.";
    }
    if (!password.trim()) {
      errors.password = "Password is required to secure your account.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    // If there are validation errors, block submission and display them
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError("Please fill out all required fields properly before registering.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({ name, email, password });

      if (res?.error) {
        setGeneralError(res.error);
        setLoading(false);
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      setGeneralError("An unexpected network error occurred. Please try again.");
      setLoading(false);
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

          {generalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <p>{generalError}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Full Name *
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Muhammad Danial"
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white transition duration-200 ${
                  fieldErrors.name
                    ? "border-rose-500 ring-2 ring-rose-100"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-600"
                }`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                }}
              />
              {fieldErrors.name && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  ⚠️ {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Address Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address *
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white transition duration-200 ${
                  fieldErrors.email
                    ? "border-rose-500 ring-2 ring-rose-100"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-600"
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
              />
              {fieldErrors.email && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  ⚠️ {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password *
              </label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white transition duration-200 ${
                  fieldErrors.password
                    ? "border-rose-500 ring-2 ring-rose-100"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-600"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
              />
              {fieldErrors.password && (
                <p className="text-xs font-semibold text-rose-600 mt-1">
                  ⚠️ {fieldErrors.password}
                </p>
              )}
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
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}