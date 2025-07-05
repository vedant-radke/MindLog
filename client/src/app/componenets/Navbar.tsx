"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { clearToken } from "../../lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    toast.success("Logged out");
    router.push("/login");
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return null; // Hide navbar on login/signup

  return (
    <nav className="w-full px-6 py-4 shadow-sm bg-white flex items-center justify-between">
      <Link href="/journal" className="text-lg font-semibold text-purple-700">
        🧠 MindLog
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

        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </nav>
  );
}
