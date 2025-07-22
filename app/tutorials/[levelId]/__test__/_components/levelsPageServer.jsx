import LevelsPage from "./levelsPage";
import { getTutorial } from "./fetchData";

export default async function LevelsPageServer({ params }) {

    const levelId = params.levelId;
    const tutorialData = await getTutorial();

    return <LevelsPage tutorialData={tutorialData} levelId={levelId} />;
}
