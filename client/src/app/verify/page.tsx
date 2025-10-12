import Navbar from "../componenets/Navbar";
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
      <VerifyClient token={token} />
    </div>
  );
}
