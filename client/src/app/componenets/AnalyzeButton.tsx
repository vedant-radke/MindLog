"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { getToken } from "../../lib/auth";

interface Props {
  days?: number;
  onResult?: (summary: string) => void;
}

export default function AnalyzeButton({ days = 7, onResult }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:8001/api/journals/summary?days=${days}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const summary = res.data.summary;

      if (onResult) onResult(summary);

      toast.success("Analysis complete ✅");

      router.push(`/summary?data=${encodeURIComponent(summary)}`);
      
    } catch (err: unknown) {
  const error = err as AxiosError<{ message: string }>;
  toast.error(error.response?.data?.message || "AI analysis failed");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="fixed bottom-6 right-6">
      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="rounded-full px-6 py-3 shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Journals"}
      </Button>
    </div>
  );
}
