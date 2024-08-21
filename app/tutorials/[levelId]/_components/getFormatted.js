export const getFormattedSemesterName = (semester) => {
  switch (semester) {
    case "Semestre 1":
      return "semester_1";
    case "Semestre 2":
      return "semester_2";
    default:
      return "N/A";
  }
};

export const getFormattedSubjectsName = (subject) => {
  switch (subject) {
    case "Physique":
      return "physics";
    case "Chimie":
      return "chemistry";
    default:
      return "N/A";
  }
};

export const getFormattedSectionsName = (section) => {
  switch (section) {
    case "Cours":
      return "Cours";
    case "Cours PowerPoint":
      return "Cours PowerPoint";
    case "Exercices corrigés":
      return "Exercices corrigés";
    case "Devoirs surveillés":
      return "Devoirs surveillés";
    case "Fiches pédagogiques":
      return "Fiches pédagogiques";
    case "Évaluations diagnostiques":
      return "Évaluations diagnostiques";
    case "Vidéos":
      return "Vidéos";
    default:
      return "N/A";
  }
};
