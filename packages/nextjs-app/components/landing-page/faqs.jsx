"use client";

import { UbuntuFont } from "@/config/fonts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQS() {
  const faqs = [
    {
      question: "What is Next.js?",
      answer: "Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations."
    },
    {
      question: "What is the App Router?",
      answer: "The App Router is a new paradigm in Next.js for building applications using React's latest features. It allows you to create routes using a file-system based router, and supports layouts, nested routing, and more."
    },
    {
      question: "What are Server Components?",
      answer: "Server Components are a new React feature that allows you to render components on the server. This can lead to improved performance and a better user experience, especially for content-heavy pages."
    },
    {
      question: "How do I create a new page in the App Router?",
      answer: "To create a new page in the App Router, you simply create a new file named 'page.js' or 'page.tsx' inside a folder in the 'app' directory. The folder name becomes the route."
    }
  ];

  return (
    <section id="faqs" className="my-16 md:mt-24 px-5 md:px-20 3xl:px-0">
      <div className="flex flex-col items-center text-center">
        <h2
          className={`${UbuntuFont.className} text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8`}
        >
          Frequently Asked Questions
        </h2>
        <p className="md:w-2/3 py-5 text-sm sm:text-base md:text-lg text-accent-TextHover font-semibold mb-8">
        {`Here you'll find answers to some of the most common questions about Next.js and its features. If you have any other questions, feel free to reach out to us!`}
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger
              className="text-lg font-semibold text-primary py-3"
            >
              {faq.question}
            </AccordionTrigger>
            <AccordionContent
              className="text-base text-accent-TextHover"
            >
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
