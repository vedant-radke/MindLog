"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 text-center">
      <div className="max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
          Reflect, Heal, and Grow 🌱
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          MindLog helps you journal your emotions and gain insights into your mental well-being.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button className="rounded-full px-6 py-3 text-base bg-purple-600 hover:bg-purple-700">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="rounded-full px-6 py-3 text-base border-gray-400">
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Optional illustration */}
      <div className="mt-10">
        <img
          src="/journal-mind.svg"
          alt="Mental journaling illustration"
          className="w-64 h-auto opacity-80"
        />
      </div>
    </main>
  );
}
