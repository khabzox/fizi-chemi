import LevelsPageServer from './_components/levelsPageServer';
import { redirect } from 'next/navigation';

export default function Page({ params }) {
  const levelId = params.levelId;

  console.log(levelId);
  if (levelId !== "1ac" && levelId !== "2ac" && levelId !== "3ac" && levelId !== "tcsf" && levelId !== "1bac" && levelId !== "2bac") {
    return redirect("/tutorials");
  }

  return <LevelsPageServer params={params} />;
}
