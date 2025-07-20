"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

function extractSection(summary: string | null, section: string) {
  if (!summary) return "";
  const regex = new RegExp(`${section}:([\\s\\S]*?)(\\n\\w+:|$)`, "i");
  const match = summary.match(regex);
  return match ? match[1].trim() : "No data available.";
}

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const summary = searchParams.get("data");

  const solutionText = extractSection(summary, "Solution");
  const emotionText = extractSection(summary, "Emotion");
  const motivationText = extractSection(summary, "Motivation");

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-primary">🧠 AI Summary Report</h1>
          <p className="text-muted-foreground mt-2">
            Insightful analysis of your recent journal entries.
          </p>
        </div>

        {/* Emotions Section */}
        <Card className="border-l-4 border-blue-500 bg-blue-50">
          <CardContent className="p-5">
            <h2 className="text-xl font-bold text-blue-700 mb-2">💬 Emotions</h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {emotionText}
            </p>
          </CardContent>
        </Card>
        
        {/* Solutions Section */}
        <Card className="border-l-4 border-green-500 bg-green-50">
          <CardContent className="p-5">
            <h2 className="text-xl font-bold text-green-700 mb-2">✅ Solutions</h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {solutionText}
            </p>
          </CardContent>
        </Card>


        {/* Motivation Section */}
        <Card className="border-l-4 border-yellow-500 bg-yellow-50">
          <CardContent className="p-5">
            <h2 className="text-xl font-bold text-yellow-700 mb-2">🚀 Motivation</h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {motivationText}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
          >
            ← Back to Journals
          </Button>
        </div>
      </div>
    </div>
  );
}
