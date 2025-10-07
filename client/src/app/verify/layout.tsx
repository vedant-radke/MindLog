import { Loader2 } from "lucide-react";
import { Suspense } from "react";

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

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/60">
      <Suspense fallback={<VerifyLoading />}>{children}</Suspense>
    </div>
  );
}
