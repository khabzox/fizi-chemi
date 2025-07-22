"use client";

import { UbuntuFont } from "@/config/fonts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQS() {
  const faqs = [
    {
      question: "Qu'est-ce que FiziChemi ?",
      answer: "FiziChemi est une plateforme dédiée à l'apprentissage de la physique et de la chimie, offrant des tutoriels interactifs et des ressources pédagogiques."
    },
    {
      question: "Comment puis-je commencer à utiliser FiziChemi ?",
      answer: "Pour commencer, inscrivez-vous sur notre plateforme, explorez nos tutoriels et sélectionnez le niveau qui vous convient."
    },
    {
      question: "FiziChemi est-il gratuit ?",
      answer: "Oui, l'accès aux tutoriels de base est gratuit. Cependant, certains contenus premium peuvent nécessiter un abonnement."
    },
    {
      question: "Quels niveaux d'étude sont couverts par FiziChemi ?",
      answer: "Nous couvrons tous les niveaux d'études, de la première année du collège jusqu'au baccalauréat."
    },
    {
      question: "Comment puis-je contacter le support de FiziChemi ?",
      answer: "Vous pouvez nous contacter via le formulaire de contact sur notre site ou directement par email à info@fizichemi.com."
    },
    {
      question: "Puis-je télécharger les tutoriels de FiziChemi ?",
      answer: "Les tutoriels ne sont actuellement pas téléchargeables, mais vous pouvez les consulter en ligne à tout moment."
    },
    {
      question: "FiziChemi propose-t-il des exercices pratiques ?",
      answer: "Oui, chaque tutoriel est accompagné d'exercices pratiques pour renforcer votre apprentissage."
    },
    {
      question: "Comment puis-je accéder aux contenus premium ?",
      answer: "Pour accéder aux contenus premium, vous devez souscrire à un abonnement via notre plateforme."
    },
    {
      question: "FiziChemi est-il adapté aux débutants ?",
      answer: "Oui, nos tutoriels sont conçus pour être accessibles aux débutants, avec des explications claires et progressives."
    },
    {
      question: "Puis-je utiliser FiziChemi sur mon smartphone ?",
      answer: "Oui, notre plateforme est entièrement optimisée pour une utilisation sur mobile."
    },
    {
      question: "Comment sont structurés les tutoriels sur FiziChemi ?",
      answer: "Les tutoriels sont structurés par niveaux d'étude, avec des sections dédiées à chaque sujet clé."
    },
    {
      question: "Puis-je poser des questions spécifiques à un sujet ?",
      answer: "Oui, vous pouvez poser des questions sur les tutoriels via la section commentaires ou notre forum."
    },
    {
      question: "FiziChemi propose-t-il des vidéos explicatives ?",
      answer: "Oui, en plus des tutoriels écrits, nous proposons également des vidéos explicatives."
    },
    {
      question: "Puis-je me connecter avec mon compte Google ?",
      answer: "Oui, vous pouvez vous connecter à FiziChemi en utilisant votre compte Google."
    },
    {
      question: "Comment puis-je sauvegarder mes progrès sur FiziChemi ?",
      answer: "Vos progrès sont automatiquement sauvegardés lorsque vous êtes connecté à votre compte."
    },
    {
      question: "FiziChemi propose-t-il des sessions de tutorat en direct ?",
      answer: "Nous prévoyons de lancer des sessions de tutorat en direct bientôt, restez à l'écoute pour plus d'informations."
    },
    {
      question: "Comment puis-je donner mon avis sur un tutoriel ?",
      answer: "Vous pouvez laisser un commentaire à la fin de chaque tutoriel pour partager votre avis."
    },
    {
      question: "Est-ce que FiziChemi est disponible en plusieurs langues ?",
      answer: "Pour l'instant, FiziChemi est disponible en français, mais nous envisageons d'ajouter d'autres langues à l'avenir."
    },
    {
      question: "Puis-je recommander FiziChemi à mes amis ?",
      answer: "Bien sûr ! Nous vous encourageons à partager FiziChemi avec vos amis et collègues."
    },
    {
      question: "FiziChemi offre-t-il des certifications ?",
      answer: "Nous travaillons sur un programme de certification pour les utilisateurs qui complètent certains modules."
    },
    {
      question: "Comment puis-je accéder aux actualités scientifiques sur FiziChemi ?",
      answer: "Vous pouvez accéder aux actualités scientifiques via la section 'Articles' de notre site."
    },
    {
      question: "FiziChemi propose-t-il des cours en direct ?",
      answer: "Nous envisageons de lancer des cours en direct dans le futur. Inscrivez-vous à notre newsletter pour être informé."
    },
    {
      question: "Puis-je personnaliser mon expérience d'apprentissage sur FiziChemi ?",
      answer: "Oui, vous pouvez personnaliser votre tableau de bord et suivre les sujets qui vous intéressent le plus."
    },
    {
      question: "FiziChemi est-il compatible avec les tableaux interactifs ?",
      answer: "Oui, notre plateforme est compatible avec les tableaux interactifs pour une expérience d'apprentissage améliorée."
    },
    {
      question: "Comment puis-je désactiver les notifications par email de FiziChemi ?",
      answer: "Vous pouvez gérer vos préférences de notification dans les paramètres de votre compte."
    },
  ];

  return (
    <section id="faqs" className="my-16 md:mt-24 px-5 md:px-20 3xl:px-0">
      <div className="flex flex-col items-center text-center">
        <h2
          className={`${UbuntuFont.className} text-3xl text-secondary sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8`}
        >
          Questions Fréquemment Posées
        </h2>
        <p className="md:w-2/3 py-5 text-sm sm:text-base md:text-lg text-accent-TextHover font-semibold mb-8">
          {`Vous trouverez ici les réponses aux questions les plus courantes sur FiziChemi et ses fonctionnalités. Si vous avez d'autres questions, n'hésitez pas à nous contacter !`}
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
