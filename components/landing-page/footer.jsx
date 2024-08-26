import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="max-w-[95rem] mx-auto">
      <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24 font-medium">
        <div className="absolute end-4 top-4 sm:end-6 sm:top-6 lg:end-8 lg:top-8">
          <Link
            className="inline-block rounded-full bg-secondary p-2 text-white shadow transition hover:bg-secondary/90 sm:p-3 lg:p-4"
            href="#MainContent"
          >
            <span className="sr-only">Back to top</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <div className="flex justify-center text-secondary lg:justify-start">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  width={190}
                  height={100}
                  alt={"FiziChemi Logo"}
                  className="hover:opacity-85 active:scale-[0.99]"
                />
              </Link>
            </div>

            <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-primary lg:text-left">
              Explorez la physique et la chimie avec nos tutoriels interactifs
              et articles informatifs. Découvrez, apprenez, et excellez dans vos
              études scientifiques avec nous.
            </p>
          </div>

          <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
            <li>
              <Link
                className="text-primary transition hover:text-primary/75"
                href="#Tutoriels"
              >
                Tutoriels
              </Link>
            </li>

            <li>
              <Link
                className="text-primary transition hover:text-primary/75"
                href="/faqs"
              >
                FAQ
              </Link>
            </li>

            <li>
              <Link
                className="text-primary transition hover:text-primary/75"
                href="#À-Propos"
              >
                À-Propos
              </Link>
            </li>

            <li>
              <Link
                className="text-primary transition hover:text-primary/75"
                href="#Contact"
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                className="text-primary transition hover:text-primary/75"
                href="/blog"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <p className="mt-12 text-center text-sm text-primary">
          &copy; {new Date().getFullYear()} FiziChemi. Tous droits réservés.
          Créé avec ❤️ par
          <span>
            <Link href="https://github.com/khabzox" className="underline ml-1">
              khabzox
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
