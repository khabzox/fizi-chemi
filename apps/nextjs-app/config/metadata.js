// dynamic metadata
export function generateMetadataByLevelId(levelId) {
  const levelTitles = {
    "1ac": "1ère Année Collège",
    "2ac": "2ème Année Collège",
    "3ac": "3ème Année Collège",
    "tc": "Tronc Commun",
    "1bac": "1ère Bac",
    "2bac": "2ème Bac",
  };

  const levelDescriptions = {
    "1ac":
      "Explorez les tutoriels et ressources pour la 1ère Année Collège en physique et chimie.",
    "2ac":
      "Découvrez les tutoriels et ressources pour la 2ème Année Collège en physique et chimie.",
    "3ac":
      "Accédez aux tutoriels et ressources pour la 3ème Année Collège en physique et chimie.",
    "tc": "Trouvez des tutoriels et ressources pour le Tronc Commun en physique et chimie.",
    "1bac":
      "Préparez-vous avec des tutoriels et ressources pour la 1ère Bac en physique et chimie.",
    "2bac":
      "Obtenez des tutoriels et ressources pour la 2ème Bac en physique et chimie.",
  };

  const levelKeywords = {
    "1ac":
      "1ère Année Collège, tutoriels, physique, chimie, FiziChemi, collège, éducation, ressources pédagogiques, apprentissage interactif, niveau scolaire, sciences",
    "2ac":
      "2ème Année Collège, tutoriels, physique, chimie, FiziChemi, collège, éducation, ressources pédagogiques, apprentissage interactif, niveau scolaire, sciences",
    "3ac":
      "3ème Année Collège, tutoriels, physique, chimie, FiziChemi, collège, éducation, ressources pédagogiques, apprentissage interactif, niveau scolaire, sciences",
    "tc": "Tronc Commun, tutoriels, physique, chimie, FiziChemi, éducation, ressources pédagogiques, apprentissage interactif, niveau scolaire, sciences",
    "1bac":
      "1ère Bac, tutoriels, physique, chimie, FiziChemi, bac, éducation, ressources pédagogiques, apprentissage interactif, niveau scolaire, sciences",
    "2bac":
      "2ème Bac, tutoriels, physique, chimie, FiziChemi, bac, éducation, ressources pédagogiques, apprentissage interactif, niveau scolaire, sciences",
  };

  return {
    title: levelTitles[levelId] || "Niveau Inconnu",
    description:
      levelDescriptions[levelId] ||
      "Description non disponible pour ce niveau.",
    openGraph: {
      title: levelTitles[levelId] || "Niveau Inconnu",
      description:
        levelDescriptions[levelId] ||
        "Description non disponible pour ce niveau.",
      images: ["/path-to-your-image.jpg"], // Update the path as needed
      url: `https://www.fizichemi.com/tutorials/${levelId}`,
    },
    twitter: {
      title: levelTitles[levelId] || "Niveau Inconnu",
      description:
        levelDescriptions[levelId] ||
        "Description non disponible pour ce niveau.",
      image: "/path-to-your-image.jpg", // Update the path as needed
      card: "summary_large_image",
    },
    keywords:
      levelKeywords[levelId] ||
      "niveau, tutoriels, physique, chimie, FiziChemi",
  };
}

// static metadata
export const HomePage = {
  title: "FiziChemi - Découvrez la Physique et la Chimie",
  description:
    "Découvrez la physique et la chimie avec FiziChemi ! Plongez dans des tutoriels captivants et restez à jour avec les dernières actualités scientifiques.",
  openGraph: {
    title: "FiziChemi - Découvrez la Physique et la Chimie",
    description:
      "Découvrez la physique et la chimie avec FiziChemi ! Plongez dans des tutoriels captivants et restez à jour avec les dernières actualités scientifiques.",
    images: ["/path-to-your-image.jpg"],
    url: "https://www.fizichemi.com/",
  },
  twitter: {
    title: "FiziChemi - Découvrez la Physique et la Chimie",
    description:
      "Découvrez la physique et la chimie avec FiziChemi ! Plongez dans des tutoriels captivants et restez à jour avec les dernières actualités scientifiques.",
    image: "/path-to-your-image.jpg",
    card: "summary_large_image",
  },
  keywords:
    "physique, chimie, tutoriels, FiziChemi, science, éducation, actualités scientifiques, tutoriels interactifs, ressources pédagogiques, apprentissage en ligne, cours de physique, cours de chimie, études scientifiques, éducation scientifique, guide d'étude, préparation académique, exercices pratiques, matériel d'étude, découvertes scientifiques, actualités en sciences, contenu éducatif, exploration des sciences, recherche scientifique, concepts de physique, concepts de chimie, simulations scientifiques, ressources pour étudiants, outils d'apprentissage, soutien éducatif, avancées scientifiques, études de cas, démonstrations scientifiques, expériences pratiques, recherche en physique, recherche en chimie, cours en ligne, ressources interactives, soutien scolaire, défis scientifiques, compréhension approfondie",
};

export const TutorialsPage = {
  title: "FiziChemi - Tutoriels de Physique et Chimie",
  description:
    "Explorez nos tutoriels interactifs de physique et chimie, adaptés à tous les niveaux. Obtenez des explications claires et des exemples pratiques pour exceller dans vos études.",
  openGraph: {
    title: "FiziChemi - Tutoriels de Physique et Chimie",
    description:
      "Explorez nos tutoriels interactifs de physique et chimie, adaptés à tous les niveaux. Obtenez des explications claires et des exemples pratiques pour exceller dans vos études.",
    images: ["/path-to-your-image.jpg"],
    url: "https://www.fizichemi.com/tutorials",
  },
  twitter: {
    title: "FiziChemi - Tutoriels de Physique et Chimie",
    description:
      "Explorez nos tutoriels interactifs de physique et chimie, adaptés à tous les niveaux. Obtenez des explications claires et des exemples pratiques pour exceller dans vos études.",
    image: "/path-to-your-image.jpg",
    card: "summary_large_image",
  },
  keywords:
    "tutoriels, physique, chimie, FiziChemi, cours de physique, cours de chimie, apprentissage interactif, ressources scientifiques, exercices pratiques, sciences, éducation, formation, concepts scientifiques, tutoriels en ligne, étudiants, enseignement, démonstrations, pratiques de laboratoire, étude des sciences, explications détaillées, matériel éducatif, guides d'étude, révision, préparation aux examens, physique des matières, chimie organique, chimie inorganique, mécanique, thermodynamique, électromagnétisme, optique, laboratoire virtuel, simulation scientifique, ressources pédagogiques, sciences naturelles, recherche scientifique, méthodes d'apprentissage, problèmes de physique, exercices de chimie, tests de compréhension, solutions scientifiques, expérience en laboratoire, études scientifiques avancées, didacticiels scientifiques, apprentissage personnalisé, soutien académique",
};

export const SearchPage = {
  title: "FiziChemi - Recherche",
  description:
    "Utilisez notre fonction de recherche pour trouver des ressources pertinentes en physique et chimie sur FiziChemi.",
  openGraph: {
    title: "FiziChemi - Recherche",
    description:
      "Utilisez notre fonction de recherche pour trouver des ressources pertinentes en physique et chimie sur FiziChemi.",
    images: ["/path-to-your-image.jpg"],
    url: "https://www.fizichemi.com/search",
  },
  twitter: {
    title: "FiziChemi - Recherche",
    description:
      "Utilisez notre fonction de recherche pour trouver des ressources pertinentes en physique et chimie sur FiziChemi.",
    image: "/path-to-your-image.jpg",
    card: "summary_large_image",
  },
  keywords:
    "recherche, physique, chimie, FiziChemi, moteur de recherche, ressources scientifiques, articles, tutoriels, études, matière, examens, supports d'étude, contenu éducatif, ressources pédagogiques, recherche académique, outils de recherche, exploration scientifique, documents, résultats de recherche, éducation en ligne, études scientifiques, recherche de tutoriels, recherche de cours, résultats scientifiques, outils d'apprentissage, ressources en ligne, accès aux informations, découverte scientifique, matériel d'étude, exploration des concepts, recherche de contenu, méthodologie de recherche, recherche approfondie, recherche rapide, outils éducatifs, recherche personnalisée, guides d'étude, recherche de matières, recherche pour étudiants, outils de recherche académique, recherche en ligne, recherche interactive",
};

export const AboutUsPage = {
  title: "FiziChemi - À-Propos",
  description:
    "En savoir plus sur FiziChemi et notre mission de rendre la physique et la chimie accessibles et passionnantes.",
  openGraph: {
    title: "FiziChemi - À-Propos",
    description:
      "En savoir plus sur FiziChemi et notre mission de rendre la physique et la chimie accessibles et passionnantes.",
    images: ["/path-to-your-image.jpg"],
    url: "https://www.fizichemi.com/about-us",
  },
  twitter: {
    title: "FiziChemi - À-Propos",
    description:
      "En savoir plus sur FiziChemi et notre mission de rendre la physique et la chimie accessibles et passionnantes.",
    image: "/path-to-your-image.jpg",
    card: "summary_large_image",
  },
  keywords:
    "à-propos, FiziChemi, mission, vision, éducation scientifique, équipe, valeurs, objectifs, histoire, éducation, engagement, innovation, services éducatifs, plateforme d'apprentissage, équipe pédagogique, recherche scientifique, accessibilité en sciences, formation scientifique, développement éducatif, éducation en physique, éducation en chimie, valeurs éducatives, mission éducative, expertise scientifique, engagement pour l'éducation, soutien à l'apprentissage, partenaires, recherche en éducation, projets éducatifs, programme éducatif, développement de la plateforme, histoire de l'entreprise, objectifs de l'entreprise, vision de l'éducation, innovations en sciences, impact éducatif",
};

export const ContactUsPage = {
  title: "FiziChemi - Contact",
  description:
    "Contactez-nous pour toute question ou demande concernant nos tutoriels et ressources en physique et chimie.",
  openGraph: {
    title: "FiziChemi - Contact",
    description:
      "Contactez-nous pour toute question ou demande concernant nos tutoriels et ressources en physique et chimie.",
    images: ["/path-to-your-image.jpg"],
    url: "https://www.fizichemi.com/contact-us",
  },
  twitter: {
    title: "FiziChemi - Contact",
    description:
      "Contactez-nous pour toute question ou demande concernant nos tutoriels et ressources en physique et chimie.",
    image: "/path-to-your-image.jpg",
    card: "summary_large_image",
  },
  keywords:
    "contact, FiziChemi, support, assistance, demande d'information, questions, service client, contactez-nous, aide, service d'assistance, formulaire de contact, soutien académique, questions fréquentes, support technique, demande d'aide, réponses aux questions, contact direct, support aux utilisateurs, demandes, informations de contact, soutien client, communication, services, contact en ligne, questions et réponses, assistance en ligne, service de support, réponse rapide, contact par email, assistance par téléphone, aide en ligne, support pédagogique, demandes de renseignements, service après-vente",
};

export const FAQSPage = {
  title: "FiziChemi - FAQ",
  description:
    "Trouvez des réponses aux questions fréquemment posées sur nos tutoriels et ressources en physique et chimie.",
  openGraph: {
    title: "FiziChemi - FAQ",
    description:
      "Trouvez des réponses aux questions fréquemment posées sur nos tutoriels et ressources en physique et chimie.",
    images: ["/path-to-your-image.jpg"],
    url: "https://www.fizichemi.com/faqs",
  },
  twitter: {
    title: "FiziChemi - FAQ",
    description:
      "Trouvez des réponses aux questions fréquemment posées sur nos tutoriels et ressources en physique et chimie.",
    image: "/path-to-your-image.jpg",
    card: "summary_large_image",
  },
  keywords:
    "FAQ, questions fréquentes, aide, support, FiziChemi, physique, chimie, tutoriels, ressources, réponse aux questions, aide en ligne, assistance, guide, aide aux utilisateurs, solutions, problèmes courants, support technique, informations, tutoriels scientifiques, éducation en ligne, questions courantes, réponses rapides, problèmes courants, soutien aux étudiants, explication, ressources pédagogiques, questions sur les cours, informations sur les tutoriels, aide académique, FAQ scientifique, aide aux tutoriels, assistance en physique, assistance en chimie, recherche de réponses, aide aux questions, guide d'utilisation, aide en éducation, questions et réponses, contact pour support, demandes fréquentes, solutions aux problèmes, assistance pédagogique, aide en ligne, soutien client, centre d'aide",
};
