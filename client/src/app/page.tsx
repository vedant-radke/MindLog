"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { ArrowRight, BookOpen, PenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "../lib/auth";
import Navbar from "./componenets/Navbar";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#dbeafe] to-[#e9d5ff] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
            Yaaar,<br />
            <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-transparent bg-clip-text">
              Khudse bhi to baat kar ke dekho...
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            MindLog helps you journal your emotions and gain insights into your mental well-being.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoggedIn && (
              <>
                <Link href="/signup">
                  <Button className="rounded-full px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full px-6 py-3 text-base border-gray-400">
                    Login
                  </Button>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Link href="/journal">
                <Button className="rounded-full px-6 py-3 text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md">
                  Go to Journals
                </Button>
              </Link>
            )}

            <Link href="/blogs">
              <Button variant="ghost" className="rounded-full px-6 py-3 text-base flex items-center gap-2 text-gray-700 hover:text-purple-700">
                <BookOpen className="w-5 h-5" />
                Read Blogs
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12"
        >
          <img
            src="/aaron-burden-AXqMy8MSSdk-unsplash.jpg"
            alt="Animated journaling"
            className="w-72 h-auto opacity-90 animate-pulse"
          />
        </motion.div>
      </main>
    </>
  );
}