import CTA from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import { FAQSPage } from "@/config/metadata";
import { ReactNode } from "react";

export const metadata = FAQSPage;

const FaqsLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
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

export default FaqsLayout;
