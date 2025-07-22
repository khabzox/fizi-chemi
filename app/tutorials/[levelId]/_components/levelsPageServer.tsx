import LevelsPage from "./levelsPage";
import { getTutorial } from "@/components/tutorials/fetchData";

interface LevelsPageServerProps {
    readonly params: {
        readonly levelId: string;
    };
}

export default async function LevelsPageServer({ params }: LevelsPageServerProps) {

    const levelId = params.levelId;
    const tutorialData = await getTutorial();

    return <LevelsPage tutorialData={tutorialData} levelId={levelId} />;
}
