"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import { CheckCircle2, Mail, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("verify_email") || "alex.sharma@example.com";
      setEmail(stored);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const code = otp.join("");
    try {
      await api.verifyEmail({ email, code });
      setIsVerified(true);
      await refreshUser();
      setTimeout(() => {
        router.push("/role-select");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Use code 123456.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-indigo-50/40">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-elevated text-center">
        
        {isVerified ? (
          <div className="py-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Account Verified! ✓</h2>
            <p className="text-xs text-slate-600">
              Your email has been authenticated. Redirecting to role selection...
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4" /> Verified Candidate Badge Active
            </div>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Verify Your Account</h1>
            <p className="text-xs text-slate-500 mt-2">
              We've sent a 6-digit verification code to <span className="font-bold text-slate-700">{email}</span>
            </p>

            <div className="p-2.5 my-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              Demo OTP: <strong className="tracking-widest">123456</strong>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              {/* 6-box OTP */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-extrabold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying..." : "Verify Account"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => setCountdown(60)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {countdown > 0 ? `Resend Code in ${countdown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
