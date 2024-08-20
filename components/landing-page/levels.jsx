import Link from "next/link";
import { Folder, SquareArrowOutUpRight } from "lucide-react";

const Levels = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white pb-4">
      {["1 AC", "2 AC", "3 AC", "TCSF", "1 BAC", "2 BAC"].map(
        (title, index) => (
          <Link href="/" key={index}>
            <div className="flex justify-between items-center bg-primary p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="flex items-center space-x-3 text-base md:text-lg lg:text-xl">
                <div className="bg-white/20 rounded-sm p-2">
                  <Folder />
                </div>
                <h3>{title}</h3>
              </div>
              <SquareArrowOutUpRight />
            </div>
          </Link>
        )
      )}
    </div>
  );
};

export default Levels;
