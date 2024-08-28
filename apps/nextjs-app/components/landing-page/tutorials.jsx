"use client";

import { UbuntuFont } from "@/config/fonts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Levels from "./levels";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Tutorials = () => {
  const [loadingSearch, setLoadingSearch] = useState(null);
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
    setLoadingSearch(true);
    setTimeout(() => setLoadingSearch(null), 3000);
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
    <section className="bg-secondary my-44" id="Tutoriels">
      <div className="flex flex-col max-w-[95rem] mx-auto px-5 md:px-24 py-20">
        <div>
          <h1
            className={`${UbuntuFont.className} text-white text-4xl sm:text-5xl md:text-6xl font-bold`}
          >
            Explorez Nos Tutoriels de
            <br />
            Physique et Chimie
          </h1>

          <div className="flex space-x-2 py-10 max-w-4xl">
            <Input
              className="bg-transparent border-4 border-primary active:border-primary active:focus:ring-black py-6 placeholder:text-xl placeholder:text-white/50 text-white"
              placeholder="Recherche..."
              value={searchQuery}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              className="h-15 px-8 text-xl font-bold"
            >
              {loadingSearch ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Rechercher"
              )}
            </Button>
          </div>
        </div>
        <Levels />
      </div>
    </section>
  );
};

export default Tutorials;
