"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { ArrowRight, BookOpen, Lock, Brain, TrendingUp } from "lucide-react";
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
      <main className="flex flex-col items-center justify-center bg-white overflow-hidden">
        {/* Hero Section - Full Screen */}
        <section
          className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/landing-background.jpg')" }}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black opacity-80"></div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center text-white px-6"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-snug mb-6 drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-green-300">
                A private space
              </span>{" "}
              to write, reflect, and grow.
            </h1>
            <p className="text-lg sm:text-xl font-medium mb-10 max-w-xl mx-auto drop-shadow-lg">
              MindLog helps you journal your emotions and gain insights into your mental well-being with intelligent analysis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {!isLoggedIn && (
                <>
                  <Link href="/signup">
                    <Button
                      className="rounded-full px-8 py-3 text-base font-semibold bg-white text-green-700 hover:bg-gray-100 shadow-lg transform transition-transform duration-300 hover:scale-105"
                      variant="outline"
                    >
                      <span className="relative z-20 text-black transition-colors duration-300">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4 inline" />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="rounded-full px-8 py-3 text-base font-semibold bg-white text-black hover:bg-gray-100 shadow-lg transform transition-transform duration-300 hover:scale-105">
                      Login
                    </Button>
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <Link href="/journal">
                  <Button
                    className="rounded-full px-8 py-3 text-base font-semibold bg-white text-green-700 hover:bg-gray-100 shadow-lg transform transition-transform duration-300 hover:scale-105"
                    variant="outline"
                  >
                    <span className="relative z-20 text-green-700 transition-colors duration-300">
                      Go to Journals
                    </span>
                  </Button>
                </Link>
              )}
              <Link href="/blogs">
                <Button
                  variant="ghost"
                  className="rounded-full px-6 py-3 text-base flex items-center gap-2 text-white hover:text-teal-300 hover:bg-transparent"
                >
                  <BookOpen className="w-5 h-5" />
                  Read Blogs
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section - Full Screen */}
        <section className="py-20 h-screen flex items-center justify-center bg-stone-300 w-full px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-extrabold text-stone-900 mb-4">
              Discover a Deeper You
            </h2>
            <p className="text-xl text-stone-600 mb-12">
              Uncover meaningful patterns and gain clarity from your thoughts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards with updated colors */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Private & Secure
                </h3>
                <p className="text-stone-600">
                  Your thoughts are yours alone. We ensure your data is always
                  protected with advanced encryption.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-teal-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  AI-Powered Insights
                </h3>
                <p className="text-stone-600">
                  Using AI , we analyze your entries to uncover emotional
                  patterns and help you understand yourself better.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-lime-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-lime-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Track Your Progress
                </h3>
                <p className="text-stone-600">
                  Visualize your emotional journey over time with beautiful,
                  interactive charts and graphs.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final Call to Action Section - Full Screen */}
        <section className="h-screen flex items-center justify-center bg-stone-700 text-white text-center w-full">
          <div className="container mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Ready to start your journey?
            </h2>
            <Link href="/signup">
              <Button className="rounded-full px-8 py-3 text-base font-semibold bg-white text-stone-900 hover:bg-gray-100 shadow-lg transform transition-transform duration-300 hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}