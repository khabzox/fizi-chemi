import Image from "next/image";
import Link from "next/link";

import { House } from "lucide-react";

import Levels from "./levels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";

const TutorialsLayout = ({ children, tutorialData, title, pathName, path }) => {
  return (
    <>
      {/* <div className="px-5 lg:px-20 mt-10">
      <Button>Go Back</Button>
    </div> */}
      <div className="bg-white rounded-lg p-6 px-5 lg:px-20 mt-2 flex flex-col-reverse lg:flex-row">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gradient-to-r from-secondary to-destructive-hover text-white p-4 rounded-lg flex justify-around items-center min-h-40 px-10">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold items-center">
                {title}
              </h1>
              <p className="flex space-x-2 items-center">
                <span>
                  <Link href="/">
                    <House className="mr-2" size={19} />
                  </Link>
                </span>
                /
                <span className="font-semibold">
                  <Link href="/tutorials" className="underline mr-2">
                    Tutoriels
                  </Link>
                </span>
                /
                <span className="font-semibold">
                  <Link href={`/tutorials/${path}`} className="underline">
                    {pathName}
                  </Link>
                </span>
              </p>
            </div>
            <Image
              src="/images/cta.webp"
              alt="Rocket Image"
              width={170}
              height={170}
              className="hidden sm:block"
            />
          </div>
          <Sidebar className="w-full my-8 p-4 block lg:hidden" tutorialData={tutorialData} />

          <div className="mt-4 flex space-x-2 py-10 w-full">
            <Input
              className="bg-transparent border-4 border-primary active:border-primary active:focus:ring-black py-6 text-xl placeholder:text-xl placeholder:text-primary/50 text-primary"
              placeholder="Rechercher..."
            />
            <Button className="h-15 px-8 text-xl font-bold">Rechercher</Button>
          </div>
          {children}
        </div>

        {/* Sidebar */}
        <Sidebar className="w-72 lg:mb-0 p-4 ml-6 hidden lg:block" tutorialData={tutorialData} />
      </div>
    </>
  );
};

export default TutorialsLayout;
