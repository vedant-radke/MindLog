"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../componenets/Navbar";
import AnalyzeButton from "../componenets/AnalyzeButton";
import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ArrowRight, Clock, LineChart } from "lucide-react";
import { cn } from "../../lib/utils";

// ✅ Journal type definition
type Journal = {
  _id: string;
  content: string;
  createdAt: string;
  analysis?: {
    sentiment?: string;
    emotions?: string[];
    suggestions?: string[];
  };
};

const getSentimentBadgeClasses = (sentiment?: string) => {
  if (!sentiment) {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  const normalized = sentiment.toLowerCase();

  if (normalized.includes("neg")) {
    return "border-rose-300 bg-rose-50 text-rose-600";
  }

  if (normalized.includes("pos")) {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }

  return "border-amber-300 bg-amber-50 text-amber-700";
};

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const ordered = [...res.data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setJournals(ordered);
      })
      .catch(() => {
        toast.error("Failed to fetch journals.");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  // ✅ Helper to remove HTML tags
  const getPlainText = (html: string) => {
    return (
      new DOMParser().parseFromString(html, "text/html").body.textContent || ""
    );
  };

  const entriesCount = journals.length;
  const analyzedCount = journals.filter((journal) => journal.analysis).length;
  const lastEntryDate = journals[0]
    ? new Date(journals[0].createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const averageSuggestions = analyzedCount
    ? Math.round(
        journals.reduce((acc, journal) => {
          return acc + (journal.analysis?.suggestions?.length || 0);
        }, 0) / analyzedCount
      )
    : 0;

  return (
    <>
      <Navbar />
      <AnalyzeButton />

      <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40 pb-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_65%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
          <section className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-emerald-600"
              >
                Daily reflections
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Your journal library, calm and organized.
              </h1>
              <p className="text-base leading-relaxed text-slate-600">
                Track your emotional patterns, revisit meaningful entries, and
                notice how your practice evolves over time.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <Link href="/journal/new">
                <Button size="lg" className="gap-2">
                  Start a new entry
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/summary" className="sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-200 bg-white/70 text-emerald-700 hover:bg-emerald-50"
                >
                  View recent summary
                </Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-emerald-100 bg-white/80 shadow-md shadow-emerald-100/30 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Entries captured
                </CardTitle>
                <LineChart className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-900">
                  {entriesCount}
                </div>
                <CardDescription className="mt-1 text-sm text-slate-500">
                  {entriesCount === 0
                    ? "Let’s begin with your first reflection."
                    : "Keep nurturing your daily ritual."}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 bg-white/80 shadow-md shadow-emerald-100/30 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Last reflection
                </CardTitle>
                <Clock className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-900">
                  {lastEntryDate}
                </div>
                <CardDescription className="mt-1 text-sm text-slate-500">
                  {entriesCount
                    ? "Keep the energy flowing."
                    : "Consistency builds clarity."}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 bg-white/80 shadow-md shadow-emerald-100/30 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Average insights
                </CardTitle>
                <ArrowRight className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-900">
                  {averageSuggestions}
                </div>
                <CardDescription className="mt-1 text-sm text-slate-500">
                  Suggestions surfaced per analyzed entry.
                </CardDescription>
              </CardContent>
            </Card>
          </section>

          <Separator className="border-emerald-100/70" />

          <section className="space-y-6">
            <header className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Latest reflections
              </h2>
              <span className="text-sm text-slate-500">
                {entriesCount} {entriesCount === 1 ? "entry" : "entries"}
              </span>
            </header>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-32 animate-pulse rounded-3xl border border-emerald-100 bg-white/70"
                  />
                ))}
              </div>
            ) : entriesCount === 0 ? (
              <Card className="border-dashed border-emerald-200 bg-white/70 p-8 text-center">
                <CardContent className="space-y-4 p-0">
                  <h3 className="text-lg font-semibold text-slate-900">
                    No journal entries yet
                  </h3>
                  <p className="text-sm text-slate-500">
                    Capture your first reflection to see insights and track your
                    emotional journey.
                  </p>
                  <Link href="/journal/new">
                    <Button className="gap-2">
                      Start journaling now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {journals.map((journal) => {
                  const entryDate = new Date(journal.createdAt).toLocaleString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  );
                  const sentimentClasses = getSentimentBadgeClasses(
                    journal.analysis?.sentiment
                  );

                  return (
                    <Card
                      key={journal._id}
                      className="group border border-emerald-100 bg-white/80 shadow-sm shadow-emerald-100/30 transition-transform duration-300 hover:-translate-y-1 hover:border-emerald-200"
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                          >
                            {entryDate}
                          </Badge>
                          {journal.analysis?.sentiment && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-full border px-3 py-1 text-xs font-medium",
                                sentimentClasses
                              )}
                            >
                              Sentiment: {journal.analysis.sentiment}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base leading-relaxed text-slate-700">
                          {getPlainText(journal.content)}
                        </CardDescription>
                      </CardHeader>

                      {journal.analysis && (
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {(journal.analysis.emotions || []).map(
                              (emotion) => (
                                <Badge
                                  key={emotion}
                                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                >
                                  {emotion}
                                </Badge>
                              )
                            )}
                          </div>

                          {journal.analysis.suggestions?.length ? (
                            <div className="space-y-2 text-sm text-slate-600">
                              <p className="font-medium text-slate-800">
                                Suggestions to explore:
                              </p>
                              <ul className="list-disc space-y-1 pl-5">
                                {journal.analysis.suggestions.map(
                                  (suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : null}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
