import { redirect } from 'next/navigation';
import LevelsPageServer from './_components/levelsPageServer';
import { generateMetadataByLevelId } from "@/config/metadata";

export async function generateMetadata({ params }) {
  const levelId = params.levelId;
  console.log(levelId); // Debugging log to check the levelId
  return generateMetadataByLevelId(levelId);
}

export default function Page({ params }) {
  const levelId = params.levelId;

  console.log(levelId);
  if (levelId !== "1ac" && levelId !== "2ac" && levelId !== "3ac" && levelId !== "tc" && levelId !== "1bac" && levelId !== "2bac") {
    return redirect("/tutorials");
  }

  return <LevelsPageServer params={params} />;
}
