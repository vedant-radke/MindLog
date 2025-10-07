"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "../../components/ui/button";
import { saveToken } from "../../lib/auth";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

type VerifyClientProps = {
  token: string | null;
};

export default function VerifyClient({ token }: VerifyClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const [email, setEmail] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

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

  const primaryAction = () =>
    router.push(status === "success" ? "/journal" : "/login");
  const secondaryAction = () => router.push("/signup");

  return (
    <VerifyCard
      status={status}
      message={message}
      email={email}
      redirectCountdown={redirectCountdown}
      onPrimaryAction={primaryAction}
      onSecondaryAction={secondaryAction}
      isSuccess={status === "success"}
    />
  );
}

type VerifyCardProps = {
  status: "loading" | "success" | "error";
  message: string;
  email: string | null;
  redirectCountdown: number;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  isSuccess: boolean;
};

function VerifyCard({
  status,
  message,
  email,
  redirectCountdown,
  onPrimaryAction,
  onSecondaryAction,
  isSuccess,
}: VerifyCardProps) {
  return (
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
          <Button
            onClick={onPrimaryAction}
            className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-500"
          >
            {isSuccess ? "Go to journal" : "Back to login"}
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6"
            onClick={onSecondaryAction}
          >
            Start over
          </Button>
        </div>
      </div>
    </main>
  );
}
