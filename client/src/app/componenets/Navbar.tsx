"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { clearToken, getToken } from "../../lib/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, [pathname]); // Refresh check on route change

  const handleLogout = () => {
    clearToken();
    toast.success("Logged out");
    router.push("/login");
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage || !isLoggedIn) return null;

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-3 shadow-sm bg-stone-200 flex items-center justify-between">
      <Link
        href="/"
        className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-green-700"
      >
        MindLog
      </Link>

      <div className="space-x-4">
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
    </nav>
  );
}
