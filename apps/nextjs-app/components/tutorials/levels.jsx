import Link from "next/link";
import { useState } from 'react';
import { Folder, SquareArrowOutUpRight, Loader2 } from "lucide-react";

const Levels = () => {
  const [loadingLevel, setLoadingLevel] = useState(null);

  const handleLevelClick = (index) => {
    setLoadingLevel(index);
  };

  const levelArr = [
    { name: "1 AC", path: "/tutorials/1ac" },
    { name: "2 AC", path: "/tutorials/2ac" },
    { name: "3 AC", path: "/tutorials/3ac" },
    { name: "TC", path: "/tutorials/tc" },
    { name: "1 BAC", path: "/tutorials/1bac" },
    { name: "2 BAC", path: "/tutorials/2bac" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white pb-4">
      {levelArr.map((level, index) => (
        <Link href={level.path} key={index}>
          <div
            onClick={() => handleLevelClick(index)}
            className="flex justify-between items-center bg-primary p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-base md:text-lg lg:text-xl">
              <div className="bg-white/20 rounded-sm p-2">
                <Folder />
              </div>
              <h3>{level.name}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {loadingLevel === index ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SquareArrowOutUpRight />
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Levels;
