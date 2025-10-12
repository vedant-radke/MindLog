"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Compass,
  Heart,
  MoonStar,
  NotebookPen,
  Sparkles,
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

const supportFeatures = [
  {
    title: "Nurturing prompts",
    description:
      "Light, personalised journaling invitations that let you meet yourself exactly where you are.",
    icon: NotebookPen,
  },
  {
    title: "Gentle reflections",
    description:
      "Mood snapshots, breathing cues, and micro-wins delivered in a whisper—not a dashboard.",
    icon: Heart,
  },
  {
    title: "Quiet routines",
    description:
      "Soft reminders and evening wind-downs that help you keep a promise to your calm.",
    icon: MoonStar,
  },
  {
    title: "Emotion library",
    description:
      "Bookmark feelings, track breakthroughs, and remember the practices that bring you home.",
    icon: Bookmark,
  },
  {
    title: "Compass guidance",
    description:
      "See gentle trends in your energy so you know when to rest, reach out, or rejoice.",
    icon: Compass,
  },
  {
    title: "Moments of awe",
    description:
      "Curated stories, mindful art, and soundscapes to soften the edges of your day.",
    icon: Sparkles,
  },
];

const ritualSteps = [
  {
    title: "Arrive softly",
    description:
      "Open MindLog to a welcoming breath, a calming sound, and one question that grounds you.",
  },
  {
    title: "Listen inward",
    description:
      "Write or speak freely. Prompts adapt to your tone, offering space when words slow down.",
  },
  {
    title: "Integrate",
    description:
      "Close with a micro-summary, a self-kind action, or a pause cue that keeps the calm with you.",
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

  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";

    return () => {
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  const primaryCtaHref = isLoggedIn ? "/journal" : "/signup";
  const primaryCtaLabel = isLoggedIn
    ? "Open your sanctuary"
    : "Begin a calm ritual";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eef2f8] via-white to-[#f5f7fb] text-slate-800">
      <header className="border-b border-[#d6e1f1] bg-white/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-200 hover:text-[#4f6f8f]"
          >
            MindLog
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[#4f6f8f]">
            <Link
              href="#features"
              className="rounded-none border border-transparent px-3 py-2 transition-colors hover:border-[#bcd1e6] hover:bg-[#f5f7fb]"
            >
              Features
            </Link>
            <Link
              href="#ritual"
              className="rounded-none border border-transparent px-3 py-2 transition-colors hover:border-[#bcd1e6] hover:bg-[#f5f7fb]"
            >
              Ritual
            </Link>
            <Link
              href="/blogs"
              className="rounded-none border border-transparent px-3 py-2 transition-colors hover:border-[#bcd1e6] hover:bg-[#f5f7fb]"
            >
              Blog
            </Link>
            <Link
              href={primaryCtaHref}
              className="rounded-none border border-[#4f6f8f] px-3 py-2 font-medium text-[#4f6f8f] transition-colors hover:bg-[#4f6f8f] hover:text-white"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(116,155,196,0.18),_transparent_60%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-16 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-8 text-center lg:max-w-xl lg:text-left">
            <div className="inline-flex items-center justify-center gap-2 border border-slate-200/80 bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-slate-500 backdrop-blur-sm lg:justify-start">
              MindLog — gentle journaling ritual
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl [font-family:var(--font-newsreader)]">
              A quiet space to hear yourself again.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              MindLog guides soft, meaningful check-ins for emotional clarity.
              Arrive for five minutes, leave with lighter shoulders and a kinder
              relationship with your thoughts.
            </p>

            <div className="flex w-full flex-col items-stretch gap-2 sm:mx-auto sm:max-w-lg lg:mx-0 lg:w-full lg:flex-row lg:items-center lg:justify-start">
              <Link href={primaryCtaHref}>
                <Button
                  size="sm"
                  className="group w-full gap-2 rounded-none bg-[#4f6f8f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#9ab7d3]/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#456380] sm:w-auto"
                >
                  {primaryCtaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/journal">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 rounded-none border-[#bcd1e6] bg-white/80 px-5 py-3 text-sm font-medium text-[#2f4c63] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9ab7d3] hover:bg-[#eef4fb] sm:w-auto"
                >
                  Preview the journal
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="relative h-48 border border-[#d6e1f1] bg-white/90 shadow-[#9ab7d3]/30 shadow-lg sm:h-56">
                <Image
                  src="/mindfulness.png"
                  alt="Mindfulness practice"
                  fill
                  className="object-cover"
                  priority
                />
              </figure>
              <figure className="relative h-48 border border-[#d6e1f1] bg-white/90 shadow-[#9ab7d3]/20 shadow-md sm:h-56">
                <Image
                  src="/doWhatMakeHappy.png"
                  alt="Do what makes you happy"
                  fill
                  className="object-cover"
                />
              </figure>
              <figure className="relative h-48 border border-[#d6e1f1] bg-white/90 shadow-[#9ab7d3]/20 shadow-md sm:h-56">
                <Image
                  src="/think_positive.png"
                  alt="Think positive reminder"
                  fill
                  className="object-cover"
                />
              </figure>
              <figure className="relative h-48 border border-[#d6e1f1] bg-white/90 shadow-[#9ab7d3]/20 shadow-md sm:h-56">
                <Image
                  src="/worry-less.png"
                  alt="Worry less message"
                  fill
                  className="object-cover"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-20"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge
            variant="outline"
            className="rounded-none border-[#bcd1e6] bg-white/70"
          >
            Crafted for mind–body harmony
          </Badge>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [font-family:var(--font-newsreader)]">
            Tools that keep the noise low and the self-awareness high.
          </h2>
          <p className="max-w-2xl text-base text-slate-600">
            Every element in MindLog is designed to soothe: light typography,
            breathable spacing, and guidance that always feels optional.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {supportFeatures.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="group h-full rounded-none border-[#d6e1f1] bg-white/85 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9ab7d3] hover:shadow-lg"
            >
              <CardHeader className="space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center border border-[#d6e1f1] bg-[#e7eff7] text-[#4f6f8f] transition-colors duration-300 group-hover:bg-[#4f6f8f] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-left text-lg text-slate-900">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left text-sm leading-relaxed text-slate-600">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl border-[#d6e1f1]" />

      <section
        id="ritual"
        className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20"
      >
        <div className="grid gap-12 lg:grid-cols-1">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-none border-[#bcd1e6] bg-white/70"
              >
                A ritual loop for stillness
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [font-family:var(--font-newsreader)]">
                Slow down, notice, and carry calm with you.
              </h2>
              <p className="text-base text-slate-600">
                MindLog flows like a caring conversation. The prompts and
                closing rituals adapt to your energy to keep reflection light,
                intentional, and healing.
              </p>
            </div>

            <div className="space-y-5">
              {ritualSteps.map(({ title, description }, index) => (
                <div key={title} className="flex gap-4 text-left">
                  <span className="mt-1 flex h-9 w-9 items-center justify-center border border-[#d6e1f1] bg-[#e7eff7] text-sm font-semibold text-[#4f6f8f]">
                    {index + 1}
                  </span>
                  <div className="space-y-2">
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#4f6f8f] via-[#456380] to-[#1f3342] py-20 text-[#e7eff7]">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 30%, rgba(172,203,231,0.25), transparent 52%)",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center">
          <Badge
            variant="outline"
            className="rounded-none border-[#e7eff7]/70 bg-white/10 text-[#e7eff7]"
          >
            A mindful pause whenever you need it
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl [font-family:var(--font-newsreader)]">
            Come as you are. Leave with steadier breath and kinder thoughts.
          </h2>
          <p className="max-w-2xl text-base text-[#d3e3f4]">
            Join MindLog to transform emotional check-ins into a soothing daily
            ritual. No judgement, no clutter—just space to feel good again.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-none bg-white px-8 text-[#2f4c63] transition-colors hover:bg-[#f0f4fb]"
              >
                Create a calm space
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-none border-white/70 bg-transparent text-white hover:bg-white/10"
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
