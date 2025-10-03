"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  HeartPulse,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Sun,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { getToken } from "../lib/auth";

const features = [
  {
    title: "Guided Journaling",
    description:
      "Evidence-based prompts adapt to your mood, giving structure without feeling prescriptive.",
    icon: NotebookPen,
  },
  {
    title: "Responsive Check-ins",
    description:
      "Gentle, timely nudges and reflective questions keep you consistently engaged with your practice.",
    icon: MessageCircle,
  },
  {
    title: "Mood Intelligence",
    description:
      "Spot emotional patterns instantly with digestible analytics and elegant visual summaries.",
    icon: Sparkles,
  },
];

const highlights = [
  { label: "Daily reflections completed", value: "120K+" },
  { label: "Average mood lift in 30 days", value: "23%" },
  { label: "Clinician partnerships", value: "350+" },
];

const testimonials = [
  {
    quote:
      "I finally have a journaling rhythm that sticks. The prompts feel like they were written just for me.",
    name: "Avery L.",
    role: "Product Designer",
  },
  {
    quote:
      "My patients love how gentle and intuitive the experience is. Their insights are deeper than ever.",
    name: "Dr. Amara Singh",
    role: "Licensed Therapist",
  },
];

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const refresh = () => setIsLoggedIn(!!getToken());
    refresh();

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const primaryCtaHref = isLoggedIn ? "/journal" : "/signup";
  const primaryCtaLabel = isLoggedIn
    ? "Open your journals"
    : "Start your journey";

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 text-stone-900">
      <section className="overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-32 md:pt-36">
          <div className="flex flex-col gap-8 text-center md:gap-10">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-stone-600">
              <Badge
                variant="outline"
                className="border-stone-300 bg-white/60 backdrop-blur"
              >
                Built with clinicians • Loved by humans
              </Badge>
              <span className="hidden h-1.5 w-1.5 rounded-full bg-stone-300 md:inline-block" />
              <span className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Mindful journaling reimagined
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
              Feel lighter with a journaling ritual that meets you where you
              are.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-stone-600 sm:text-lg">
              MindLog combines gentle guidance, responsive reflections, and
              measured insights so you can process emotions, stay grounded, and
              notice what makes you feel whole.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={primaryCtaHref}>
                <Button size="lg" className="group gap-2 px-7">
                  {primaryCtaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/journal">
                <Button size="lg" variant="ghost" className="gap-2 px-7">
                  Explore the journal
                  <Sun className="h-4 w-4 opacity-75" />
                </Button>
              </Link>
              <Link href="/blogs">
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 px-7 text-stone-600 hover:text-stone-900"
                >
                  Read the blog
                  <Sparkles className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-stone-500">
            <span className="font-semibold uppercase tracking-[0.25em] text-stone-400">
              Trusted by teams at
            </span>
            <div className="flex flex-wrap items-center gap-6 opacity-70">
              <span>MeditateWell</span>
              <span>MentalFit</span>
              <span>Northstar Health</span>
              <span>Calm Collective</span>
            </div>
          </div>

          <Card className="border-none bg-white/80 shadow-lg shadow-emerald-100/40 backdrop-blur">
            <CardContent className="grid gap-6 p-8 md:grid-cols-3 md:gap-8">
              {highlights.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-stone-200/70 bg-white/60 p-6 text-left transition-transform duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-sm"
                >
                  <div className="mb-3 text-3xl font-semibold text-stone-900">
                    {value}
                  </div>
                  <p className="text-sm text-stone-600">{label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <Badge
              variant="outline"
              className="border-stone-300 bg-white/70 backdrop-blur"
            >
              Designed to feel effortless
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Structure when you want it, space when you need it.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-stone-600">
              Each touchpoint balances warmth with clarity—calm gradients,
              measured motion, and interactions that invite reflection without
              overwhelm.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="group border-stone-200/80 bg-white/70 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl"
              >
                <CardHeader className="space-y-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-stone-900">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed border-stone-200 bg-gradient-to-br from-emerald-50 via-white to-stone-50 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-lg md:col-span-2 lg:col-span-1">
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600">
                  <HeartPulse className="h-3.5 w-3.5" />
                  Calm by design
                </div>
                <CardTitle className="text-lg text-stone-900">
                  Crafted with therapists for restorative journaling.
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-stone-600">
                Every animation is capped at 250ms, color palettes pass WCAG AA,
                and the layout adapts seamlessly from mobile to desktop for
                calming focus, wherever you land.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl border-stone-200/70" />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div>
              <Badge
                variant="outline"
                className="border-stone-300 bg-white/70 backdrop-blur"
              >
                Built for real lives
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Gentle guidance, meaningful momentum.
              </h2>
              <p className="mt-3 text-base text-stone-600">
                MindLog’s flow feels closer to a caring conversation than a
                checklist. Tasteful micro-interactions acknowledge progress,
                while breathing room respects your pace.
              </p>
            </div>
            <div className="grid gap-6">
              {testimonials.map(({ quote, name, role }) => (
                <Card
                  key={name}
                  className="border-stone-200/70 bg-white/75 transition-shadow hover:shadow-lg"
                >
                  <CardContent className="space-y-4 p-6">
                    <p className="text-base italic leading-relaxed text-stone-700">
                      “{quote}”
                    </p>
                    <div className="text-sm font-medium text-stone-900">
                      {name}
                      <span className="ml-2 font-normal text-stone-500">
                        · {role}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-stone-200/80 bg-white/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-stone-900">
                A mindful flow in three moments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  1
                </span>
                <div>
                  <p className="font-medium text-stone-900">
                    Begin with a grounded check-in
                  </p>
                  <p className="text-sm text-stone-600">
                    Surface your emotional baseline with a tactile slider and
                    tone-matching palette.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  2
                </span>
                <div>
                  <p className="font-medium text-stone-900">
                    Glide through tailored prompts
                  </p>
                  <p className="text-sm text-stone-600">
                    Dynamic prompts open one at a time with subtle motion,
                    keeping focus and presence.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  3
                </span>
                <div>
                  <p className="font-medium text-stone-900">
                    Close with calm insights
                  </p>
                  <p className="text-sm text-stone-600">
                    Receive micro-insights paired with gentle breathing cues to
                    leave the session centered.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-16 text-stone-50">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center">
          <Badge variant="outline" className="border-white/50 bg-white/10">
            Start in under two minutes
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create space for your mind, one reflection at a time.
          </h2>
          <p className="max-w-2xl text-base text-emerald-100">
            Sign up now to unlock guided journeys, mindful rituals, and sleek
            analytics that make emotional wellbeing tangible.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-stone-100"
              >
                Claim your free month
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white/10"
              >
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
