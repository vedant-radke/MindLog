"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  ArrowLeft,
  Brain,
  Compass,
  Flame,
  Loader2,
  Sparkles,
} from "lucide-react";
import Navbar from "../componenets/Navbar";
import { getToken } from "../../lib/auth";

type SummarySection = {
  key: string;
  title: string;
  icon: ReactNode;
  accent: string;
  description: string;
};

const SECTION_CONFIG: Array<Omit<SummarySection, "description">> = [
  {
    key: "Emotion",
    title: "Emotional landscape",
    icon: <Brain className="h-4 w-4" />,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    key: "Solution",
    title: "Grounding practices",
    icon: <Compass className="h-4 w-4" />,
    accent: "border-sky-200 bg-sky-50 text-sky-700",
  },
  {
    key: "Motivation",
    title: "Momentum to keep",
    icon: <Flame className="h-4 w-4" />,
    accent: "border-amber-200 bg-amber-50 text-amber-700",
  },
];

const DEFAULT_SECTION_TEXT = "No insights available yet.";

const getSectionText = (summary: string | null, sectionKey: string) => {
  if (!summary) return DEFAULT_SECTION_TEXT;

  const regex = new RegExp(
    `${sectionKey}\\s*:\\s*([\\s\\S]*?)(\\n[A-Z][^:]*:|$)`,
    "i"
  );
  const match = summary.match(regex);
  if (!match) return DEFAULT_SECTION_TEXT;

  const text = match[1]
    .replace(/^[-•]+\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text.length ? text : DEFAULT_SECTION_TEXT;
};

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const daysParam = searchParams.get("days");
  const days = useMemo(() => {
    const parsed = Number(daysParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 7;
  }, [daysParam]);

  const sanitizedSummary = summary.trim();
  const isSummaryReady = sanitizedSummary.length > 0;

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setSummary("");
      setError("Please sign in to view your AI insights.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        setSummary("");

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/summary?days=${days}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        setSummary(data?.summary ?? "");
      } catch (err) {
        if (axios.isCancel(err)) return;
        setSummary("");
        setError("We couldn’t retrieve your summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };
  }, [days]);

  const sections: SummarySection[] = useMemo(
    () =>
      SECTION_CONFIG.map((config) => ({
        ...config,
        description: getSectionText(sanitizedSummary, config.key),
      })),
    [sanitizedSummary]
  );

  const hasContent = sections.some(
    (section) => section.description !== DEFAULT_SECTION_TEXT
  );
  const shouldShowFallback = isSummaryReady && !hasContent;

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_70%)]" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge
              variant="outline"
              className="border-emerald-200 bg-white/80 text-emerald-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              MindLog analysis
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Personalized summary for your latest reflections
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              These insights synthesize your recent entries to highlight how
              you&apos;re feeling, practical next steps, and motivation to keep
              you grounded.
            </p>
          </div>

          <Card className="border-none bg-white/90 shadow-xl shadow-emerald-100/40 backdrop-blur">
            <CardHeader className="gap-3 border-b border-emerald-100/70">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                <Brain className="h-5 w-5 text-emerald-600" />
                Summary snapshot
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                {loading
                  ? "Gathering your latest reflections..."
                  : error
                  ? error
                  : isSummaryReady && hasContent
                  ? "Here’s what MindLog noticed across your latest entries."
                  : isSummaryReady
                  ? "We couldn’t extract clear insights yet. Try journaling a little more for richer summaries."
                  : "Synthesizing your personalized insights..."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {loading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="h-6 w-48 animate-pulse rounded-full bg-emerald-100/60" />
                      <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                      </div>
                      {idx !== 2 ? (
                        <Separator className="border-emerald-100/60" />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-700">
                  {error}
                </div>
              ) : !isSummaryReady ? (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-6 text-sm text-emerald-700">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  <span>
                    We’re still polishing your insights. This usually takes a
                    few seconds.
                  </span>
                </div>
              ) : shouldShowFallback ? (
                <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-4 text-sm text-amber-700">
                  We couldn’t extract clear insights yet. Try journaling a
                  little more for richer summaries.
                </div>
              ) : (
                sections.map(({ key, title, icon, accent, description }) => (
                  <section key={key} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-2 ${accent}`}
                      >
                        {icon}
                        {title}
                      </Badge>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {description}
                    </p>
                    {key !== sections[sections.length - 1].key ? (
                      <Separator className="border-emerald-100/60" />
                    ) : null}
                  </section>
                ))
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/journal">
              <Button
                variant="outline"
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to journals
              </Button>
            </Link>
            <Link href="/journal/new">
              <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500">
                Add another reflection
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
