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
    case "physics":
      return "Physique";
    case "chemistry":
      return "Chimie";
    default:
      return "N/A";
  }
};

export const getFormattedSectionsName = (section) => {
  switch (section) {
    case "Cours":
      return "cours";
    case "Cours PowerPoint":
      return "course_powerpoint";
    case "Exercices corrigés":
      return "corrected_exercises";
    case "Devoirs surveillés":
      return "supervised_homework";
    case "Fiches pédagogiques":
      return "educational_sheets";
    case "Évaluations diagnostiques":
      return "diagnostic_assessments";
    case "Vidéos":
      return "videos";
    default:
      return "N/A";
  }
};
