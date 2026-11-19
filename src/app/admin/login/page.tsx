"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid operator credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ui/guaranteed_brand_logo.png"
              alt="GuaranteedTech"
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-[10px] font-light uppercase tracking-[0.16em] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFB200]" />
              <span>Authorized Personnel Only</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
              Operations Portal
            </h1>
            <p className="text-xs font-extralight text-slate-400 mt-1">
              Enter your administrative credentials to manage inventory, orders &amp; CMS.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 space-y-5 shadow-xs">
          {errorMessage && (
            <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-light">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@guaranteedtech.ng"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-800 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 stroke-[1.4]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#EBEBEB] rounded text-xs text-slate-800 font-light focus:outline-none focus:border-[#FFB200] transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 stroke-[1.4]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.4]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.4]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-medium text-xs uppercase tracking-[0.14em] rounded-full transition-colors flex items-center justify-center gap-2 shadow-none disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Portal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-3 border-t border-[#EBEBEB] text-center">
            <Link
              href="/"
              className="text-[11px] font-light text-slate-400 hover:text-slate-800 transition-colors"
            >
              &larr; Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
