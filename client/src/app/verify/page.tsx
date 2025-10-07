"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import Navbar from "../componenets/Navbar";
import { Button } from "../../components/ui/button";
import { saveToken } from "../../lib/auth";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const [email, setEmail] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is invalid or missing its token.");
      return;
    }

    let redirectTimer: ReturnType<typeof setTimeout> | null = null;
    let countdownTimer: ReturnType<typeof setInterval> | null = null;

    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
          { token }
        );

        if (res.data.user?.email) {
          setEmail(res.data.user.email);
        }

        if (res.data.token) {
          saveToken(res.data.token);
          setMessage("Email verified! Redirecting you to your journal...");
          setStatus("success");

          redirectTimer = setTimeout(() => {
            router.push("/journal");
          }, 3000);

          countdownTimer = setInterval(() => {
            setRedirectCountdown((prev) => (prev > 0 ? prev - 1 : 0));
          }, 1000);
        } else {
          setStatus("success");
          setMessage(res.data.message || "Email verified. You can log in now.");
        }
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification link is invalid or expired."
        );
      }
    };

    verifyEmail();

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/60">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white/80 p-10 text-center shadow-xl shadow-emerald-100/40 backdrop-blur">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            {status === "loading" && (
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            )}
            {status === "error" && (
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            )}
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            {status === "success"
              ? "Email verified"
              : status === "error"
              ? "Verification issue"
              : "Verifying..."}
          </h1>

          <p className="mt-3 text-sm text-slate-600">{message}</p>

          {status === "success" && email && (
            <p className="mt-2 text-sm text-slate-500">
              Verified for <span className="font-medium">{email}</span>
            </p>
          )}

          {status === "success" && redirectCountdown > 0 && (
            <p className="mt-4 text-xs uppercase tracking-wide text-emerald-600">
              Taking you to your journal in {redirectCountdown}s
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {status === "success" ? (
              <Button
                onClick={() => router.push("/journal")}
                className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500"
              >
                Go to journal
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500"
              >
                Back to login
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-full px-6"
              onClick={() => router.push("/signup")}
            >
              Start over
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
