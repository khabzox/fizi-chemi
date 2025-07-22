"use client"

import Image from "next/image";
import Link from "next/link";

import { House } from "lucide-react";

import Levels from "./levels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
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
    <div className="bg-white rounded-lg p-6 px-5 lg:px-20 mt-10 flex flex-col-reverse lg:flex-row">
      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-gradient-to-r from-secondary to-destructive-hover text-white p-4 rounded-lg flex justify-around items-center min-h-40 px-10">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold items-center">
              Sélectionnez Votre Niveau Scolaire
            </h1>
            <p className="flex space-x-2 items-center">
              <span>
                <Link href="/">
                  <House className="mr-2" size={19} />
                </Link>
              </span>
              /
              <span className="font-semibold">
                <Link href="/tutorials" className="underline">
                  Tutoriels
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
        <div className="mt-4 flex flex-col md:flex-row space-y-2 space-x-0 md:space-y-0  md:space-x-2 py-10 w-full">
          <Input
            className="bg-transparent border-4 border-primary active:border-primary text-xl active:focus:ring-black py-6 placeholder:text-xl placeholder:text-primary/50 text-primary"
            placeholder="Rechercher..."
            value={searchQuery}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            className="h-15 px-8 text-xl font-bold"
          >Rechercher</Button>
        </div>
        <Levels />
      </div>
    </div>
  );
};

export default HomePage;
