import TutorialsIndex from "@/app/(public)/tutorials/_components/TutorialsIndex";

export default async function TutorialsPage({
 searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const initialQ = typeof sp.q === "string" ? sp.q : "";

  return <TutorialsIndex initialQ={initialQ} />;
}
