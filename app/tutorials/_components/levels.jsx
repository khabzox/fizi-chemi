import Link from "next/link";
import { Folder, SquareArrowOutUpRight } from "lucide-react";

const Levels = () => {
  // Define an array of objects, each with a name and path
  const levelArr = [
    { name: "1 AC", path: "/tutorials/1ac" },
    { name: "2 AC", path: "/tutorials/2ac" },
    { name: "3 AC", path: "/tutorials/3ac" },
    { name: "TCSF", path: "/tutorials/tcsf" },
    { name: "1 BAC", path: "/tutorials/1bac" },
    { name: "2 BAC", path: "/tutorials/2bac" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white pb-4">
      {levelArr.map((level, index) => (
        <Link href={level.path} key={index}>
          <div className="flex justify-between items-center bg-primary p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="flex items-center space-x-3 text-base md:text-lg lg:text-xl">
              <div className="bg-white/20 rounded-sm p-2">
                <Folder />
              </div>
              <h3>{level.name}</h3>
            </div>
            <SquareArrowOutUpRight />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Levels;
