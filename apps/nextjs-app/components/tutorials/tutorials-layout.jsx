"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { House } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";

const TutorialsLayout = ({ children, tutorialData, title, pathName, path }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Extract search query from the URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
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
                  <Link href={`/${path}`} className="underline">
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

          <div className="mt-4 flex flex-col md:flex-row space-x-0 space-y-2 md:space-x-2 md:space-y-0 py-10 w-full">
            <Input
              className="bg-transparent border-4 border-primary active:border-primary active:focus:ring-black py-6 text-xl placeholder:text-xl placeholder:text-primary/50 text-primary"
              placeholder="Rechercher..."
              value={searchQuery}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              className="h-15 px-8 text-xl font-bold"
            >
              Rechercher
            </Button>
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
