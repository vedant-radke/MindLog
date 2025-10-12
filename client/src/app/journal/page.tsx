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
import { ArrowRight, Clock, LineChart, Loader2, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

// Journal type definition
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
    return "border-[#d6e1f1] bg-[#eef2f9] text-[#4f6f8f]";
  }

  const normalized = sentiment.toLowerCase();

  if (normalized.includes("neg")) {
    return "border-rose-300 bg-rose-50 text-rose-600";
  }

  if (normalized.includes("pos")) {
    return "border-[#9ab7d3] bg-[#e7eff7] text-[#2f4c63]";
  }

  return "border-amber-300 bg-amber-50 text-amber-700";
};

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
  const handleDelete = async (journalId: string) => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    setDeletingId(journalId);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals/${journalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJournals((prev) =>
        prev.filter((journal) => journal._id !== journalId)
      );
      toast.success("Journal deleted.");
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
      toast.error("Failed to delete journal.");
    } finally {
      setDeletingId(null);
    }
  };

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

      <main className="relative min-h-screen bg-gradient-to-b from-[#eef2f8] via-white to-[#f5f7fb] pb-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,174,206,0.18),transparent_65%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
          <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-[#bcd1e6] bg-white/80 text-[#4f6f8f]"
              >
                Daily reflections
              </Badge>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [font-family:var(--font-newsreader)]">
                  Your journal library, calm and organized.
                </h1>
                <p className="text-base leading-relaxed text-slate-600">
                  Track your emotional patterns, revisit meaningful entries, and
                  notice how your practice evolves over time.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/journal/new">
                  <Button
                    size="sm"
                    className="gap-2 rounded-none bg-[#4f6f8f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#456380]"
                  >
                    Start a new entry
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/summary" className="sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-none border-[#bcd1e6] bg-white/80 px-6 py-3 text-sm font-medium text-[#2f4c63] hover:border-[#9ab7d3] hover:bg-[#eef4fb]"
                  >
                    View recent summary
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex h-full flex-col gap-4 border border-[#d6e1f1] bg-white/85 p-6 text-sm text-slate-600 shadow-md shadow-[#cbd9ed]/40">
              <h3 className="text-base font-semibold text-slate-900">
                Make the most of your practice
              </h3>
              <p>
                Drop in for a few minutes each day, revisit patterns in your
                reflections, and capture insights when they feel fresh.
              </p>
              <Separator className="border-[#d6e1f1]" />
              <ul className="space-y-2">
                <li className="border border-[#d6e1f1] bg-[#eef2f9] p-3 text-[#2f4c63]">
                  Add entries whenever inspiration hits—MindLog keeps them
                  organized chronologically.
                </li>
                <li className="border border-[#d6e1f1] bg-[#eef2f9] p-3 text-[#2f4c63]">
                  Trigger quick analyses to surface emotions and actionable
                  suggestions.
                </li>
                <li className="border border-[#d6e1f1] bg-[#eef2f9] p-3 text-[#2f4c63]">
                  Revisit your summaries to stay grounded in what matters.
                </li>
              </ul>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-[#d6e1f1] bg-white/85 shadow-md shadow-[#cbd9ed]/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Entries captured
                </CardTitle>
                <LineChart className="h-4 w-4 text-[#4f6f8f]" />
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
            <Card className="border-[#d6e1f1] bg-white/85 shadow-md shadow-[#cbd9ed]/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Last reflection
                </CardTitle>
                <Clock className="h-4 w-4 text-[#4f6f8f]" />
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
            <Card className="border-[#d6e1f1] bg-white/85 shadow-md shadow-[#cbd9ed]/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Average insights
                </CardTitle>
                <ArrowRight className="h-4 w-4 text-[#4f6f8f]" />
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

          <Separator className="border-[#d6e1f1]" />

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
                    className="h-32 animate-pulse border border-[#d6e1f1] bg-white/70"
                  />
                ))}
              </div>
            ) : entriesCount === 0 ? (
              <Card className="border border-dashed border-[#bcd1e6] bg-white/80 p-8 text-center">
                <CardContent className="space-y-4 p-0">
                  <h3 className="text-lg font-semibold text-slate-900">
                    No journal entries yet
                  </h3>
                  <p className="text-sm text-slate-500">
                    Capture your first reflection to see insights and track your
                    emotional journey.
                  </p>
                  <Link href="/journal/new">
                    <Button className="gap-2 rounded-none bg-[#4f6f8f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#456380]">
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
                      className="group border border-[#d6e1f1] bg-white/85 shadow-sm shadow-[#cbd9ed]/30 transition-transform duration-300 hover:-translate-y-1 hover:border-[#9ab7d3]"
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge
                              variant="outline"
                              className="border-[#bcd1e6] bg-white/80 text-[#4f6f8f]"
                            >
                              {entryDate}
                            </Badge>
                            {journal.analysis?.sentiment && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "border px-3 py-1 text-xs font-medium",
                                  sentimentClasses
                                )}
                              >
                                Sentiment: {journal.analysis.sentiment}
                              </Badge>
                            )}
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                disabled={deletingId === journal._id}
                                aria-label="Delete journal entry"
                              >
                                {deletingId === journal._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete journal entry?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove the journal
                                  created on {entryDate} from your history.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep entry
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-rose-600 text-white hover:bg-rose-500"
                                  disabled={deletingId === journal._id}
                                  onClick={async () => {
                                    await handleDelete(journal._id);
                                  }}
                                >
                                  {deletingId === journal._id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
                                  className="border border-[#d6e1f1] bg-[#e7eff7] text-[#2f4c63] hover:bg-[#e7eff7]"
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
