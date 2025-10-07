import { Suspense } from "react";
import Navbar from "../componenets/Navbar";
import { Loader2 } from "lucide-react";
import VerifyClient from "./VerifyClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const tokenParam = resolvedParams?.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/60">
      <Navbar />
      <Suspense fallback={<VerifyLoading />}>
        <VerifyClient token={token} />
      </Suspense>
    </div>
  );
}

function VerifyLoading() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-sm text-slate-600">Loading verification details…</p>
      </div>
    </main>
  );
}
