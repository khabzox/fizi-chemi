import config from "@/config/app";

export const getTutorial = async () => {
  try {
    const res = await fetch(`${config.domainName}/api/tutorial`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Tutorial");
    }

    const TutorialData = res.json();

    return TutorialData;
  } catch (error) {
    console.log("Error loading Tutorial: ", error);
  }
};
