"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  MoonStar,
  NotebookPen,
  Sparkles,
  Waves,
  Wind,
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

const serenityFeatures = [
  {
    title: "Breath-paced prompts",
    description:
      "Soft guidance that mirrors the cadence of a calm inhale and exhale—never rushed, always grounded.",
    icon: NotebookPen,
  },
  {
    title: "Twilight reflections",
    description:
      "A hush-friendly palette and night mode designed for quiet evenings when you need gentle clarity.",
    icon: MoonStar,
  },
  {
    title: "Tranquil pattern insights",
    description:
      "See subtle shifts in mood without charts shouting at you—just thoughtful cues to guide your next step.",
    icon: Sparkles,
  },
  {
    title: "Ambient companions",
    description:
      "Optional ambient soundscapes and breathing nudges that keep your session feeling like solitude, not a task.",
    icon: Waves,
  },
];

const solitudeRituals = [
  {
    title: "Arrive",
    description:
      "Dim the noise with a grounding breath, check in quietly, and notice what your mind is holding onto.",
  },
  {
    title: "Observe",
    description:
      "Ease into prompts that respond to your tone, helping thoughts unfold without judgement or hurry.",
  },
  {
    title: "Release",
    description:
      "Close with a reflection and a simple breathing cue, so you leave lighter than you arrived.",
  },
];

const hushTestimonials = [
  {
    quote:
      "MindLog feels like a studio for my interior life. I leave every session softer and more certain of myself.",
    name: "Kai R.",
    role: "Writer & mindful runner",
  },
  {
    quote:
      "It’s the only journaling space that helps me balance solitude with insight. Every detail is calm on purpose.",
    name: "Leena A.",
    role: "Design lead, night owl",
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
    ? "Open your sanctuary"
    : "Begin a calm ritual";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-stone-100 text-stone-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(209,250,229,0.55),_transparent_70%)]" />
        <div className="absolute left-[-12rem] top-24 -z-10 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl animate-glow-slow" />
        <div className="absolute right-[-10rem] top-48 -z-10 h-60 w-60 rounded-full bg-emerald-100/50 blur-3xl animate-glow-slow" />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-between lg:text-left">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-3xl border border-emerald-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-500 text-white shadow-inner">
                <Image
                  src="/globe.svg"
                  alt="MindLog mark"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </span>
              <div className="flex flex-col text-left">
                <span className="text-lg font-semibold tracking-tight text-stone-900">
                  MindLog
                </span>
                <span className="text-xs uppercase tracking-[0.38em] text-emerald-500">
                  Calm journaling
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-12 lg:mt-10 lg:flex-row lg:items-center lg:gap-12">
            <div className="flex-1 space-y-6 text-center lg:space-y-8 lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-emerald-700/80 lg:justify-start">
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-white/70 backdrop-blur"
                >
                  Mind like still water
                </Badge>
                <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-200 lg:inline-block" />
                <span className="text-xs uppercase tracking-[0.35em] text-emerald-500">
                  Calm technology for quiet minds
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl md:text-6xl font-serif">
                Find a quiet home for your thoughts.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg lg:mx-0">
                MindLog is a serene workspace for self-reflection, crafted for
                solitude, guided by breath, and tuned to the rhythm of your
                mind.
              </p>

              <div className="flex w-full flex-col items-stretch gap-3 sm:mx-auto sm:max-w-md lg:mx-0 lg:w-auto lg:flex-row lg:items-center lg:justify-start">
                <Link href={primaryCtaHref}>
                  <Button
                    size="lg"
                    className="group w-full gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl lg:w-auto"
                  >
                    {primaryCtaLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 rounded-full border-emerald-200 bg-white/80 px-8 py-6 text-base font-medium text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 lg:w-auto"
                  >
                    Explore the journal
                  </Button>
                </Link>
                <Link href="/blogs">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="group w-full gap-2 rounded-full border border-transparent px-8 py-6 text-base font-medium text-emerald-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white/70 hover:text-emerald-900 lg:w-auto"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-500 transition-transform group-hover:rotate-6" />
                    Read the blog
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-emerald-200/40 via-transparent to-transparent blur-3xl" />
              <div className="relative mx-auto flex max-w-md flex-col items-center gap-6 rounded-[2.5rem] border border-emerald-100/60 bg-white/60 p-8 shadow-2xl shadow-emerald-100/40 backdrop-blur md:-mt-6 lg:-mt-10">
                <div className="absolute -top-10 right-6 h-20 w-20 rounded-full bg-white/70 shadow-lg shadow-emerald-100/40 backdrop-blur-sm" />
                <Image
                  src="/buddha.png"
                  alt="Meditative illustration"
                  width={380}
                  height={380}
                  priority
                  className="w-full max-w-sm animate-float-soft"
                />
                <div className="flex w-full flex-col items-center gap-2 text-center">
                  <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300" />
                  <p className="text-lg font-semibold tracking-tight text-stone-900">
                    Calm isn’t a destination, it’s a ritual.
                  </p>
                  <p className="text-sm text-emerald-700/90">
                    Let each reflection feel like sitting beneath a Bodhi tree.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center gap-10 text-center">
          <Badge
            variant="outline"
            className="border-emerald-200 bg-white/70 backdrop-blur"
          >
            Designed for mindful solitude
          </Badge>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Each interaction is gentle, intentional, and ready when you seek
            stillness.
          </h2>
          <p className="max-w-2xl text-base text-stone-600">
            MindLog balances sensory calm with modern craft—so your reflections
            have room to breathe.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {serenityFeatures.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="group h-full border-emerald-100/80 bg-white/70 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl"
            >
              <CardHeader className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-left text-lg text-stone-900">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left text-sm leading-relaxed text-stone-600">
                {description}
              </CardContent>
            </Card>
          ))}

          <Card className="border-dashed border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-white p-8 text-left shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600">
              <Wind className="h-4 w-4" />
              Whisper mode
            </div>
            <p className="mt-6 text-lg font-semibold text-stone-900">
              Calm technology should feel invisible.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              We keep transitions slow, sounds optional, and visuals breathable.
              MindLog respects the sacred simplicity of being alone with your
              thoughts.
            </p>
          </Card>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl border-emerald-100/60" />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="border-emerald-200 bg-white/70 backdrop-blur"
              >
                A ritual loop for stillness
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Gentle guidance, meaningful quiet.
              </h2>
              <p className="text-base text-stone-600">
                MindLog flows like a silent conversation. Every prompt, pause,
                and closing cue is crafted to help you settle the mind and feel
                centered again.
              </p>
            </div>

            <div className="space-y-6">
              {solitudeRituals.map(({ title, description }, index) => (
                <div key={title} className="flex gap-4 text-left">
                  <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                    {index + 1}
                  </span>
                  <div className="space-y-2">
                    <p className="font-medium text-stone-900">{title}</p>
                    <p className="text-sm leading-relaxed text-stone-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-emerald-100/70 bg-white/75 shadow-xl shadow-emerald-100/40">
            <CardHeader className="space-y-3">
              <CardTitle className="text-lg text-stone-900">
                Voices from quiet routines
              </CardTitle>
              <p className="text-sm text-emerald-600">
                MindLog is the companion people reach for when they need
                breathing room for their thoughts.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {hushTestimonials.map(({ quote, name, role }) => (
                <div
                  key={name}
                  className="rounded-3xl border border-emerald-100/80 bg-white/80 p-5 shadow-sm"
                >
                  <p className="text-sm italic leading-relaxed text-stone-700">
                    “{quote}”
                  </p>
                  <div className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-500">
                    {name}
                    <span className="ml-1 font-normal normal-case tracking-normal text-stone-500">
                      · {role}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 py-20 text-emerald-50">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.18), transparent 45%)",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center">
          <Badge variant="outline" className="border-white/50 bg-white/10">
            Five mindful minutes is enough
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create space for your mind, stay close to your calm.
          </h2>
          <p className="max-w-2xl text-base text-emerald-100">
            Join MindLog and turn journaling into a quiet, nourishing ritual. No
            judgement, no noise—just you and the thoughts that matter.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-emerald-700 hover:bg-emerald-100"
              >
                Start your first reflection
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/60 bg-transparent text-white hover:bg-white/10"
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
