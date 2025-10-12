"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { getToken } from "../../lib/auth";
import { cn } from "../../lib/utils";
import { Sparkles } from "lucide-react";

interface Props {
  days?: number;
}

export default function AnalyzeButton({ days = 7 }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please sign in to analyze your journals.");
        router.push("/login");
        return;
      }
      toast.info("Generating your personalized insights...");
      router.push(`/summary?days=${days}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("pointer-events-auto", "fixed bottom-6 right-6 z-50")}>
      <Button
        onClick={handleAnalyze}
        disabled={loading}
        size="lg"
        className="group flex items-center gap-2 border border-[#4f6f8f] bg-[#4f6f8f] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#9ab7d3]/40 transition hover:-translate-y-0.5 hover:bg-[#435c78] focus-visible:ring-[#c2d0e5]"
      >
        <Sparkles
          className={cn(
            "h-4 w-4 transition group-hover:rotate-12",
            loading && "animate-spin"
          )}
          aria-hidden="true"
        />
        {loading ? "Analyzing..." : "Analyze Journals"}
      </Button>
    </div>
  );
}
