"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { saveToken } from "../../lib/auth";
import {
  ArrowRight,
  Feather,
  Home,
  MailCheck,
  MailWarning,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
}

const baseSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .optional(),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

type FormData = z.infer<typeof baseSchema>;

const highlightItems = [
  {
    icon: ShieldCheck,
    label: "Privacy-first encryption",
  },
  {
    icon: Feather,
    label: "Adaptive prompts tuned to you",
  },
  {
    icon: Sparkles,
    label: "Insights you can actually use",
  },
] as const;

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const schema = baseSchema.superRefine((data, ctx) => {
    if (mode === "signup" && !data.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required",
        path: ["name"],
      });
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setInfoMessage(null);
    if (mode === "login") {
      setPendingVerificationEmail(null);
    }

    try {
      const url =
        mode === "login"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

      const res = await axios.post(url, data);
      const token = res.data.token;

      if (mode === "signup") {
        setPendingVerificationEmail(data.email);
        setInfoMessage(
          res.data.message ||
            "We just sent you a confirmation email. Please verify to continue."
        );
        toast.success("Almost there! Check your inbox to verify your email.");
        return;
      }

      if (token) {
        saveToken(token);
        toast.success("Logged in!");
        router.push("/journal");
      }

      // this code will make automatic logout afer 600000 mili seconds
      // setTimeout(() => {
      //   clearToken();
      //   alert("Session expired. Please log in again.");
      //   window.location.href = "/login";
      // }, 600000);
    } catch (err: unknown) {
      const error = err as AxiosError<{
        message?: string;
        needsVerification?: boolean;
      }>;
      const serverMessage = error.response?.data?.message;

      if (
        mode === "login" &&
        error.response?.status === 403 &&
        error.response.data?.needsVerification
      ) {
        setPendingVerificationEmail(data.email);
        setInfoMessage(
          serverMessage || "Please verify your email before logging in."
        );
        toast.info("Please verify your email before logging in.");
        return;
      }

      console.log("🔥 ERROR:", serverMessage);
      toast.error(serverMessage || "Auth failed");
    }
  };

  const handleResendVerification = async () => {
    if (!pendingVerificationEmail) return;
    try {
      setResendLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`,
        { email: pendingVerificationEmail }
      );
      toast.success("Verification email sent.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2f8] via-white to-[#f5f7fb] px-4 py-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,174,206,0.14),transparent_60%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 border border-[#d6e1f1] bg-white/85 px-5 py-8 shadow-xl shadow-[#9ab7d3]/30 backdrop-blur-sm lg:grid-cols-[1.1fr_1fr] lg:px-12 lg:py-12">
        <div className="hidden max-h-[calc(100vh-4rem)] flex-col justify-between gap-10 overflow-y-auto pr-1 lg:flex">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-[#bcd1e6] bg-white/80 text-[#4f6f8f]"
            >
              MindLog • {mode === "login" ? "Welcome back" : "Create your calm"}
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl [font-family:var(--font-newsreader)]">
                {mode === "login"
                  ? "Return to the rituals that keep you grounded."
                  : "Begin a journaling practice designed for your mind."}
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-slate-600 lg:text-lg">
                A few mindful minutes each day can reshape how you process
                feelings. MindLog keeps your reflections safe, structured, and
                gently insightful.
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-600">
            {highlightItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-[#d6e1f1] bg-white/70 px-4 py-3"
              >
                <Icon className="h-4 w-4 text-[#4f6f8f]" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm text-slate-500">
            <p>
              MindLog keeps your reflections private and guides you toward
              consistent, gentle progress. Start where you are—every entry
              counts.
            </p>
            <p>
              Need to switch modes?
              <Link
                href={mode === "login" ? "/signup" : "/login"}
                className="ml-1 font-medium text-[#4f6f8f] underline-offset-4 hover:text-[#3c556d] hover:underline"
              >
                {mode === "login" ? "Create an account" : "Log in"}
              </Link>
              .
            </p>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md border border-[#d6e1f1] bg-white/90 shadow-lg shadow-[#cbd9ed]/40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                {mode === "login"
                  ? "Sign in to continue"
                  : "Create your account"}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                className="inline-flex items-center gap-2 text-[#4f6f8f] hover:bg-[#f0f4fb]"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              {mode === "login"
                ? "We’re glad you’re back. Enter your details to pick up where you left off."
                : "Just a few fields away from a calmer mind. Your data stays private and encrypted."}
            </p>
          </CardHeader>
          <CardContent>
            {mode === "signup" && pendingVerificationEmail ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#d6e1f1] bg-[#e7eff7]">
                  <MailCheck className="h-8 w-8 text-[#4f6f8f]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Confirm your email to get started
                  </h3>
                  <p className="text-sm text-slate-600">
                    {infoMessage ||
                      "We just sent a verification link to confirm your email."}
                  </p>
                  <p className="text-sm text-slate-500">
                    Email sent to{" "}
                    <span className="font-medium">
                      {pendingVerificationEmail}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500">
                    Didn’t receive it? You can resend a new link below.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="inline-flex items-center gap-2 rounded-none bg-[#4f6f8f] px-6 text-white shadow-sm hover:bg-[#456380] disabled:opacity-70"
                  >
                    {resendLoading ? "Sending..." : "Resend email"}
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none border-[#bcd1e6] px-6 text-[#2f4c63] hover:bg-[#f0f4fb]"
                    onClick={() => router.push("/login")}
                  >
                    Back to login
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {infoMessage && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <MailWarning className="h-5 w-5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p>{infoMessage}</p>
                      {pendingVerificationEmail && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-0 text-amber-900 hover:bg-transparent hover:underline"
                          onClick={handleResendVerification}
                          disabled={resendLoading}
                        >
                          {resendLoading
                            ? "Sending..."
                            : "Resend verification email"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-slate-700"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="What should we call you?"
                        autoComplete="name"
                        {...register("name")}
                        className="h-11 rounded-none border-[#d6e1f1] bg-white/70 focus:border-[#9ab7d3] focus:ring-[#c7d8ec]"
                      />
                      {errors.name && (
                        <p className="text-sm text-rose-500">
                          {errors.name.message as string}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className="h-11 rounded-none border-[#d6e1f1] bg-white/70 focus:border-[#9ab7d3] focus:ring-[#c7d8ec]"
                    />
                    {errors.email && (
                      <p className="text-sm text-rose-500">
                        {errors.email.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      placeholder="Create a secure password"
                      {...register("password")}
                      className="h-11 rounded-none border-[#d6e1f1] bg-white/70 focus:border-[#9ab7d3] focus:ring-[#c7d8ec]"
                    />
                    {errors.password && (
                      <p className="text-sm text-rose-500">
                        {errors.password.message as string}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-none bg-[#4f6f8f] py-3 text-base font-semibold text-white transition-colors hover:bg-[#456380] disabled:opacity-80"
                  >
                    {isSubmitting
                      ? mode === "login"
                        ? "Signing you in..."
                        : "Creating your space..."
                      : mode === "login"
                      ? "Log in"
                      : "Sign up"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                  {mode === "login" ? (
                    <>
                      New to MindLog?{" "}
                      <Link
                        href="/signup"
                        className="font-medium text-[#4f6f8f] underline-offset-4 transition-colors hover:text-[#3c556d] hover:underline"
                      >
                        Create an account
                      </Link>
                    </>
                  ) : (
                    <>
                      Already a member?{" "}
                      <Link
                        href="/login"
                        className="font-medium text-[#4f6f8f] underline-offset-4 transition-colors hover:text-[#3c556d] hover:underline"
                      >
                        Log in here
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
