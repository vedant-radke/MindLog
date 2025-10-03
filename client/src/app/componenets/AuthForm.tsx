"use client";

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
import { ArrowRight, Feather, ShieldCheck, Sparkles } from "lucide-react";

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
    try {
      const url =
        mode === "login"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

      const res = await axios.post(url, data);
      const token = res.data.token;

      if (token) {
        saveToken(token);
        toast.success(`${mode === "login" ? "Logged in" : "Account created"}!`);
        router.push("/journal");
      }

      // this code will make automatic logout afer 600000 mili seconds
      // setTimeout(() => {
      //   clearToken();
      //   alert("Session expired. Please log in again.");
      //   window.location.href = "/login";
      // }, 600000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.log("🔥 ERROR:", error.response?.data?.message);
      toast.error(error.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-100 px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 rounded-3xl border border-emerald-100/50 bg-white/70 p-6 shadow-xl shadow-emerald-100/30 backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div className="flex flex-col justify-between gap-10">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              MindLog • {mode === "login" ? "Welcome back" : "Create your calm"}
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
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

          <div className="grid gap-4 text-sm text-slate-600">
            {highlightItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 backdrop-blur"
              >
                <Icon className="h-4 w-4 text-emerald-600" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-none bg-white/80 backdrop-blur">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              {mode === "login" ? "Sign in to continue" : "Create your account"}
            </CardTitle>
            <p className="text-sm text-slate-500">
              {mode === "login"
                ? "We’re glad you’re back. Enter your details to pick up where you left off."
                : "Just a few fields away from a calmer mind. Your data stays private and encrypted."}
            </p>
          </CardHeader>
          <CardContent>
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
                    className="h-11 rounded-xl border-slate-200 bg-white/70 focus:border-emerald-300 focus:ring-emerald-200"
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
                  className="h-11 rounded-xl border-slate-200 bg-white/70 focus:border-emerald-300 focus:ring-emerald-200"
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
                  className="h-11 rounded-xl border-slate-200 bg-white/70 focus:border-emerald-300 focus:ring-emerald-200"
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
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-80"
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
                    className="font-medium text-emerald-600 underline-offset-4 transition-colors hover:text-emerald-700 hover:underline"
                  >
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already a member?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-emerald-600 underline-offset-4 transition-colors hover:text-emerald-700 hover:underline"
                  >
                    Log in here
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
