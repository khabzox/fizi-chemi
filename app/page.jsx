import AboutUs from "@/components/landing-page/about-us";
import ContactUs from "@/components/landing-page/contact-us";
import Hero from "@/components/landing-page/hero";
import Navbar from "@/components/landing-page/navbar";
import Tutorials from "@/components/landing-page/tutorials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <div className="max-w-[95rem] mx-auto">
          <Hero />
        </div>
        <Tutorials />
        <div className="max-w-[95rem] mx-auto">
          <AboutUs />
          <ContactUs />
        </div>
      </main>
    </>
  );
}
