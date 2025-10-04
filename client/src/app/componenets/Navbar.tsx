"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { clearToken, getToken } from "../../lib/auth";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import Image from "next/image";

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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-stone-100/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {canGoBack ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-700 hover:bg-stone-300"
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : null}

          <Link href="/">
            <Image
              src="/mindlog-logo.png" 
              alt="MindLog Logo"
              width={150} 
              height={50} 
              className="transition-colors duration-300 hover:opacity-80"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/journal">
              <Button variant={pathname === "/journal" ? "default" : "ghost"}>
                My Journals
              </Button>
            </Link>

            <Link href="/journal/new">
              <Button
                variant={pathname === "/journal/new" ? "default" : "ghost"}
              >
                Write New
              </Button>
            </Link>

            <Link href="/chat">
              <Button variant={pathname === "/chat" ? "default" : "ghost"}>
                Chat
              </Button>
            </Link>

            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="inline-flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-stone-200 md:hidden"
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
        <div className="mx-auto mt-3 flex w-full max-w-6xl flex-col gap-2 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-sm">
          <Link href="/journal">
            <Button
              variant={pathname === "/journal" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              My Journals
            </Button>
          </Link>

          <Link href="/journal/new">
            <Button
              variant={pathname === "/journal/new" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              Write New
            </Button>
          </Link>

          <Link href="/chat">
            <Button
              variant={pathname === "/chat" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              Chat
            </Button>
          </Link>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
