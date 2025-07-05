"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../componenets/Navbar";
import AnalyzeButton from "../componenets/AnalyzeButton";

{/* <AnalyzeButton onResult={(summary) => setAiSummary(summary)} /> */}

// ✅ Define Journal type
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

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("http://localhost:8001/api/journals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setJournals(res.data))
      .catch(() => {
        toast.error("Failed to fetch journals.");
      });
    }, []);
    
    return (
      <>
      <Navbar/>
      <AnalyzeButton />
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">📝 Your Journals</h1>

      {journals.length === 0 ? (
        <p className="text-gray-600">No journal entries found.</p>
      ) : (
        journals.map((j) => (
          <div
            key={j._id}
            className="mb-6 p-4 bg-white rounded-2xl shadow-md border border-gray-200"
            >
            <p className="mb-2 text-base">{j.content}</p>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(j.createdAt).toLocaleDateString()}
            </p>

            {j.analysis && (
              <div className="text-sm text-gray-700 space-y-1">
                <p>🧠 <strong>Sentiment:</strong> {j.analysis.sentiment}</p>
                <p>
                  😶‍🌫️ <strong>Emotions:</strong>{" "}
                  {j.analysis.emotions?.join(", ")}
                </p>
                <div>
                  💡 <strong>Suggestions:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {j.analysis.suggestions?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
    </>
  );
}
