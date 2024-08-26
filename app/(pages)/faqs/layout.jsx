import CTA from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import React from "react";

const FaqsLayout = ({ children }) => {
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
