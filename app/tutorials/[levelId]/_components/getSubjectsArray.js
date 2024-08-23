// Function to get subjects as an array from semesters
export const getSubjectsArray = (semesters) => {
    return Object.keys(semesters).flatMap((semesterKey) => {
        const semester = semesters[semesterKey];
        return Object.keys(semester.subjects).map((subjectKey) => ({
            semester: semesterKey,
            subjectKey,
            ...semester.subjects[subjectKey],
        }));
    });
};
