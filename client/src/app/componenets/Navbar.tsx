"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { clearToken, getToken } from "../../lib/auth";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, [pathname]); // Refresh check on route change

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

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage || !isLoggedIn) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-stone-200/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
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

          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-green-700"
          >
            MindLog
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/journal">
            <Button variant={pathname === "/journal" ? "default" : "ghost"}>
              My Journals
            </Button>
          </Link>

          <Link href="/journal/new">
            <Button variant={pathname === "/journal/new" ? "default" : "ghost"}>
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
      </div>
    </nav>
  );
}
