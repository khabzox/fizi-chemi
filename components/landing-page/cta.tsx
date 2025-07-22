import { HeroBtn } from "@/components/shared/customs-btns";
export default function CTA() {
  return (
    <section className="w-full px-2 sm:px-10 mb-10">
      <div className="text-center text-white py-10 mt-4 px-4 flex flex-col justify-center items-center gap-4 bg-secondary rounded-lg">
        <h2 className="font-bold text-2xl md:text-4xl">
          Commencez votre voyage <br className="block md:hidden" /> scientifique
          dès maintenant !
        </h2>
        <p className="font-semibold text-sm md:text-lg text-white/85 max-w-3xl mx-auto">
          Explorez la physique et la chimie avec FiziChemi. Nos tutoriels
          interactifs, adaptés à tous les niveaux, offrent des explications
          claires et des exemples pratiques.
        </p>
        <HeroBtn text={"Commencer Maintenant"} href={"/tutorials"} />
      </div>
    </section>
  );
}
