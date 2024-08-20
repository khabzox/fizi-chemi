import { UbuntuFont } from "@/config/fonts";
import Image from "next/image";
import React from "react";
import { HeroBtn } from "../shared/customs-btns";

const AboutUs = () => {
  return (
    <div className="flex items-center justify-center py-10 px-0 md:px-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="md:w-1/2">
          <h1
            className={`${UbuntuFont.className} text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6`}
          >
           FiziChemi : Votre Partenaire en Sciences
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-primary-hover font-semibold mb-8">
          Chez FiziChemi, nous nous engageons à rendre la physique et la chimie accessibles et passionnantes pour tous. Notre plateforme propose des tutoriels détaillés, des articles de blog informatifs, et des ressources interactives pour vous aider à exceller dans vos études et à nourrir votre curiosité scientifique.
          </p>
        </div>
        <div className=" md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end">
          <Image
            src="/images/about.svg"
            alt="Students"
            width={500}
            height={300}
            //   className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
