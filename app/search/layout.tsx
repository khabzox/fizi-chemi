import Footer from "@/components/tutorials/footer";
import Navbar from "@/components/landing-page/navbar";
import { getTutorial } from "@/components/tutorials/fetchData";
import TutorialsLayout from "@/components/tutorials/tutorials-layout";
import { SearchPage } from "@/config/metadata";
import { ReactNode } from "react";

export const metadata = SearchPage;

export const dynamic = "force-dynamic";

const SearchLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const tutorialData = await getTutorial()
  return (
    <>
      <Navbar />
      <main className="max-w-[95rem] mx-auto">
        <TutorialsLayout title={"Trouvez vos cours"} tutorialData={tutorialData} path={"search"} pathName={"Rechercher"}>
          {children}
        </TutorialsLayout>
      </main>
      <Footer />
    </>
  );
};

export default SearchLayout;
