import CTA from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import { ContactUsPage } from "@/config/metadata";
import React from "react";

export const metadata = ContactUsPage;

const ContactUsLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-[95rem] mx-auto">
        {children}
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default ContactUsLayout;
