import { UbuntuFont } from "@/config/fonts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Levels from "./levels";

const Tutorials = () => {
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
            />
            <Button className="h-15 px-8 text-xl font-bold">Search</Button>
          </div>
        </div>
        <Levels />
      </div>
    </section>
  );
};

export default Tutorials;
