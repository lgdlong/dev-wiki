import TutorialsIndex from "@/app/(public)/tutorials/_components/TutorialsIndex";

export default function TutorialsTagPage({
  params,
}: {
  params: { name: string };
}) {
  return <TutorialsIndex tagName={decodeURIComponent(params.name)} />;
}
