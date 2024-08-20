import Image from "next/image";
import Link from "next/link";

import { House } from "lucide-react";

import Levels from "./levels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 px-5 lg:px-20 mt-10 flex flex-col-reverse lg:flex-row">
      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-gradient-to-r from-secondary to-destructive-hover text-white p-4 rounded-lg flex justify-around items-center min-h-40 px-10">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold items-center">
              Sélectionnez Votre Niveau Scolaire
            </h1>
            <p className="flex space-x-2">
              <span>
                <Link href="/">
                  <House className="mr-2" />
                </Link>
              </span>
              /
              <span className="font-semibold">
                <Link href="/Tutorials" className="hover:underline">
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
        <div className="w-full my-8 bg-gray-100 p-4 rounded-lg border-2 border-primary block lg:hidden">
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>

        {/* Add more sidebar content here */}
      </div>
        <div className="mt-4 flex space-x-2 py-10 w-full">
          <Input
            className="bg-transparent border-4 border-primary active:border-primary active:focus:ring-black py-6 placeholder:text-xl placeholder:text-primary/50 text-primary"
            placeholder="Recherche..."
          />
          <Button className="h-15 px-8 text-xl font-bold">Search</Button>
        </div>
        <Levels />
      </div>

      {/* Sidebar */}
      <aside className="w-72 lg:mb-0 bg-gray-100 p-4 ml-6 rounded-lg border-2 border-primary hidden lg:block">
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>
        <p className="mb-4">Additional information or links can go here.</p>

        {/* Add more sidebar content here */}
      </aside>
    </div>
  );
};

export default HomePage;
