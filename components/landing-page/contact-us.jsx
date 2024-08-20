import ContactForm from "./contact-form";

import { UbuntuFont } from "@/config/fonts";

export default function ContactUs() {
  return (
    <section className="mt-48 mb-28 px-8 md:px-28 3xl:px-0" id="Contact">
      <div className="flex flex-col">
        <div>
          <h1 className={`${UbuntuFont.className} text-4xl sm:text-5xl md:text-6xl w-full md:max-w-3xl font-bold`}>
            {"Nous Sommes à Votre Écoute, Contactez-Nous"}
          </h1>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
