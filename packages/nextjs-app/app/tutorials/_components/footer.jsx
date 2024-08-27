import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <p className="mt-12 text-center text-sm text-primary">
        &copy; {new Date().getFullYear()} FiziChemi. Tous droits réservés. Créé
        avec ❤️ par
        <span>
          <Link href="https://github.com/khabzox" className="underline ml-1">
            khabzox
          </Link>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
