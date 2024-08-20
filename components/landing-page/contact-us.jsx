import ContactForm from "./contact-form";

import { UbuntuFont } from "@/config/fonts";

export default function ContactUs() {
  return (
    <div className="mt-48 mb-28 px-10 3xl:px-0">
      <div className="flex flex-col">
        <div>
          <h1 className={`${UbuntuFont.className} text-4xl sm:text-5xl md:text-7xl font-bold`}>
            {"Nous Sommes à Votre Écoute, Contactez-Nous"}
          </h1>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
