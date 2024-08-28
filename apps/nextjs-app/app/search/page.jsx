"use client";

import { useState } from 'react';
import useSearch from "@/hooks/useSearch";
import { File, SquareArrowOutUpRight, Loader, Loader2 } from "lucide-react";
import Link from "next/link";

export const LoadingCard = () => (
  <div className="flex justify-between items-center bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
    <div className="flex items-center space-x-3 text-base md:text-lg lg:text-xl">
      <div className="bg-gray-300 rounded-sm p-2 w-8 h-8"></div>
      <div className="bg-gray-300 h-6 w-32 rounded"></div>
    </div>
    <div className="bg-gray-300 w-6 h-6 rounded"></div>
  </div>
);

const SearchPage = () => {
  const [results, loading, query] = useSearch();
  const [loadingFileId, setLoadingFileId] = useState(null);

  const handleFileClick = (id) => {
    setLoadingFileId(id);
    setTimeout(() => setLoadingFileId(null), 3000);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-0">
        <h1 className="text-3xl font-bold text-primary mb-6">
          {`Résultats de la recherche pour "${query}"`}
        </h1>
        <ul className="space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <LoadingCard />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  console.log(results)
  return (
    <div className="container mx-auto py-8 px-0">
      <h1 className="text-3xl font-bold text-primary mb-6">
        {`Résultats de la recherche pour "${query}"`}
      </h1>
      {results.length === 0 ? (
        <p className="text-lg text-subtle">Aucun résultat trouvé.</p>
      ) : (
        <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
          {results.map((result) => (
            <li key={result.id} className="relative">
              <Link href={result.downloadLink} target="_blank" aria-label={`Télécharger ${result.title}`} onClick={() => handleFileClick(result.id)}>
                <div className="flex justify-between items-center bg-primary text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                  <div className="flex items-center space-x-3 text-base md:text-lg lg:text-xl">
                    <div className="bg-white/20 rounded-sm p-2">
                      <File />
                    </div>
                    <h3>{result.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {loadingFileId === result.id && (
                      <Loader2 className="animate-spin" />
                    )}
                    <SquareArrowOutUpRight />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
