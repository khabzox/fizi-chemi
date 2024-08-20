"use client";

import { UbuntuFont } from "@/config/fonts";

import Image from "next/image";

import { HeroBtn } from "../shared/customs-btns";

export default function Hero() {

  return (
    <section className="mt-16 md:mt-24">
      <div className="flex flex-col xl:flex-row items-center justify-between relative px-5 md:px-20 3xl:px-0">
        <div className="xl:relative z-10">
          <h1
            className={`${UbuntuFont.className} text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8`}
          >
            Découvrez la physique
            <br />
            et la chimie avec 
            <br />
            <span className="text-secondary">FiziChemi !</span>
          </h1>
          <p className="md:w-1/2 py-5 text-sm sm:text-base md:text-xl text-accent-TextHover font-semibold mb-8">
          Plongez dans des tutoriels captivants et restez à jour avec les dernières actualités scientifiques. Transformez votre apprentissage avec nos ressources interactives et expertises.
          </p>
          <HeroBtn
            text={"Commencez"}
            href="/tutorials"
            // className=""
          />
        </div>
        <div className="mt-10 flex justify-center xl:absolute right-0">
          <Image
            src="/images/hero.svg"
            alt="Students"
            width={500}
            height={300}
            className="mr-1 md:mr-20"
          />
          <div className="absolute inset-0 z-0 bg-transparent"></div>
        </div>
      </div>
    </section>
  );
}
