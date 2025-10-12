"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { clearToken, getToken } from "../../lib/auth";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, [pathname]); // Refresh check on route change

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const canGoBack = useMemo(() => pathname !== "/", [pathname]);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleLogout = () => {
    clearToken();
    toast.success("Logged out");
    router.push("/login");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage || !isLoggedIn) return null;

  const baseLinkClasses =
    "rounded-none border border-transparent px-3 py-2 text-sm font-medium text-[#4f6f8f] transition-colors hover:border-[#bcd1e6] hover:bg-[#f5f7fb]";

  const getLinkClasses = (target: string) =>
    cn(baseLinkClasses, pathname === target && "border-[#4f6f8f] bg-[#eef2f9]");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#d6e1f1] bg-white/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          {canGoBack ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#4f6f8f] hover:bg-[#eef2f9]"
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : null}

          <Link
            href="/"
            className="inline-flex items-center text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-200 hover:text-[#4f6f8f]"
          >
            MindLog
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3">
          <nav className="hidden flex-wrap items-center gap-2 md:flex">
            <Link href="/journal" className={getLinkClasses("/journal")}>
              My Journals
            </Link>
            <Link
              href="/journal/new"
              className={getLinkClasses("/journal/new")}
            >
              Write New
            </Link>
            <Link href="/chat" className={getLinkClasses("/chat")}>
              Chat
            </Link>
            <Link href="/blogs" className={getLinkClasses("/blogs")}>
              Blogs
            </Link>
            <Button
              onClick={handleLogout}
              className="rounded-none border border-[#4f6f8f] px-3 py-2 text-sm font-medium text-[#4f6f8f] hover:bg-[#4f6f8f] hover:text-white"
              variant="outline"
            >
              Logout
            </Button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="inline-flex h-10 w-10 items-center justify-center text-[#4f6f8f] hover:bg-[#eef2f9] md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } animate-in fade-in slide-in-from-top-2 duration-200`}
      >
        <div className="mx-auto mt-3 flex w-full max-w-6xl flex-col gap-2 border border-[#d6e1f1] bg-white/95 p-4 shadow-sm">
          <Link
            href="/journal"
            className={cn(getLinkClasses("/journal"), "w-full text-left")}
          >
            My Journals
          </Link>
          <Link
            href="/journal/new"
            className={cn(getLinkClasses("/journal/new"), "w-full text-left")}
          >
            Write New
          </Link>
          <Link
            href="/chat"
            className={cn(getLinkClasses("/chat"), "w-full text-left")}
          >
            Chat
          </Link>
          <Link
            href="/blogs"
            className={cn(getLinkClasses("/blogs"), "w-full text-left")}
          >
            Blogs
          </Link>
          <Button
            onClick={handleLogout}
            className="w-full rounded-none border border-[#4f6f8f] px-3 py-2 text-sm font-medium text-[#4f6f8f] hover:bg-[#4f6f8f] hover:text-white"
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
