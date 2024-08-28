import Footer from "@/components/tutorials/footer";
import Navbar from "@/components/landing-page/navbar";
import { getTutorial } from "@/components/tutorials/fetchData";
import TutorialsLayout from "@/components/tutorials/tutorials-layout";

const SearchLayout = async ({ children }) => {
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
