import Footer from "@/components/tutorials/footer";
import Navbar from "@/components/landing-page/navbar";
import React from "react";

const TutorialsLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-[95rem] mx-auto">{children}</main>
      <Footer />
    </>
  );
};

export default TutorialsLayout;
