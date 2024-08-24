import { db } from "@/config/firebase";
import {
  getDoc,
  setDoc,
  doc,
  collection,
  getDocs,
  docs,
  listCollections,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function GET() {
  // Utility function to handle errors
  function handleError(error, context) {
    console.error(`Error ${context}:`, error);
    return NextResponse.json(
      { error: `Error ${context}: ${error.message}` },
      { status: 500 }
    );
  }

  // Higher-order function to handle errors in async functions
  function withErrorHandling(fn, context) {
    return async function (...args) {
      try {
        return await fn(...args);
      } catch (error) {
        throw new Error(`Error ${context}: ${error.message}`);
      }
    };
  }

  // Fetch files for a given section
  async function fetchFilesForSection(sectionRef) {
    const sectionDoc = await getDoc(sectionRef);
    const sectionData = sectionDoc.data() || {};
    const filesArray = sectionData.files || [];

    return {
      title: sectionData.title || "Untitled Section",
      files: filesArray.map((fileData) => ({
        id: fileData.id,
        createdAt: fileData.createdAt,
        downloadLink: fileData.downloadLink,
        title: fileData.title,
        updatedAt: fileData.updatedAt,
      })),
    };
  }

  // Fetch data for a given subject
  const fetchSubjectData = withErrorHandling(async (subjectRef) => {
    const subjectDoc = await getDoc(subjectRef);
    if (!subjectDoc.exists()) {
      console.warn(`Subject document does not exist for: ${subjectRef.path}`);
      return { title: "Untitled Subject", sections: {} };
    }

    const subjectData = subjectDoc.data() || {};
    const sectionsWithFiles = {};

    const sectionsSnapshot = await getDocs(collection(subjectRef, "sections"));

    await Promise.all(
      sectionsSnapshot.docs.map(async (sectionDoc) => {
        const sectionFiles = await fetchFilesForSection(sectionDoc.ref);
        sectionsWithFiles[sectionDoc.id] = {
          title: sectionFiles.title,
          files: sectionFiles.files,
        };
      })
    );

    return {
      title: subjectData.title || "Untitled Subject",
      sections: sectionsWithFiles,
    };
  }, "fetching subject data");

  // Fetch data for a given semester
  const fetchSemesterData = withErrorHandling(
    async (semesterRef, semesterNumber) => {
      const semesterDoc = await getDoc(semesterRef);
      if (!semesterDoc.exists()) {
        console.warn(
          `Semester document does not exist at path: ${semesterRef.path}`
        );
        return {
          title: `Semestre ${semesterNumber}`,
          subjects: createEmptySubjectStructure(),
        };
      }

      const semesterData = semesterDoc.data() || {};
      const subjects = {};

      const subjectsSnapshot = await getDocs(
        collection(semesterRef, "subjects")
      );

      await Promise.all(
        subjectsSnapshot.docs.map(async (subjectDoc) => {
          const subjectData = await fetchSubjectData(subjectDoc.ref);
          subjects[subjectDoc.id] = subjectData;
        })
      );

      return {
        title: semesterData.title || `Semestre ${semesterNumber}`,
        subjects,
      };
    },
    "fetching semester data"
  );

  // Function to create an empty subject structure (can be extended if needed)
  function createEmptySubjectStructure() {
    const sections = {
      cours: { title: "Cours", files: {} },
      course_powerpoint: { title: "Cours PowerPoint", files: {} },
      corrected_exercises: { title: "Exercices corrigés", files: {} },
      supervised_homework: { title: "Devoirs surveillés", files: {} },
      educational_sheets: { title: "Fiches pédagogiques", files: {} },
      diagnostic_assessments: { title: "Évaluations diagnostiques", files: {} },
      videos: { title: "Vidéos", files: {} },
    };

    return {
      physics: { title: "Physique", sections },
      chemistry: { title: "Chimie", sections },
    };
  }

  // Fetch data for all semesters
  async function fetchAllData() {
    const collectionsNames = ["1ac", "2ac", "3ac", "tc", "1bac", "2bac"];
    const semesters = {};

    await Promise.all(
      collectionsNames.map(async (collectionName) => {
        semesters[collectionName] = {};

        try {
          semesters[collectionName]["semester_1"] = await fetchSemesterData(
            doc(db, collectionName, "semester_1"),
            1
          );
        } catch (error) {
          handleError(error, `fetching ${collectionName}, semester_1`);
        }

        try {
          semesters[collectionName]["semester_2"] = await fetchSemesterData(
            doc(db, collectionName, "semester_2"),
            2
          );
        } catch (error) {
          handleError(error, `fetching ${collectionName}, semester_2`);
        }
      })
    );

    return semesters;
  }

  try {
    const data = await fetchAllData();
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, "fetching all data");
  }
}

export async function POST(req) {
  const sectionTitles = {
    cours: "Cours",
    course_powerpoint: "Cours PowerPoint",
    corrected_exercises: "Exercices corrigés",
    supervised_homework: "Devoirs surveillés",
    educational_sheets: "Fiches pédagogiques",
    diagnostic_assessments: "Évaluations diagnostiques",
    videos: "Vidéos",
  };

  const subjectTitles = {
    physics: "Physique",
    chemistry: "Chimie",
  };
  try {
    // Parse the request body
    const body = await req.json();
    const timestamp = new Date().toISOString();
    const { title, downloadLink, fileLocation } = body;

    // Check for required fields
    if (!title || !downloadLink || !fileLocation) {
      return NextResponse.json(
        { message: "Error", error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate and destructure fileLocation
    const [
      LEVEL_ID,
      [semester, semesterFields],
      [subject, subjectFields],
      [section, sectionFields],
    ] = fileLocation;

    // Prepare the file object
    const fileData = {
      id: uuidv4(), // Generate a unique ID for the file
      title,
      downloadLink,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Reference to the Firestore documents
    const semesterDocRef = doc(db, LEVEL_ID, semester);
    const subjectDocRef = doc(db, LEVEL_ID, semester, "subjects", subject);
    const sectionDocRef = doc(
      db,
      LEVEL_ID,
      semester,
      "subjects",
      subject,
      "sections",
      section
    );

    // Fetch existing documents
    const [semesterSnap, subjectSnap, sectionSnap] = await Promise.all([
      getDoc(semesterDocRef),
      getDoc(subjectDocRef),
      getDoc(sectionDocRef),
    ]);

    // Update or create semester document
    const semesterData = semesterSnap.exists() ? semesterSnap.data() : {};
    if (semesterFields && semesterFields.title) {
      semesterData.title = semesterFields.title;
    }
    await setDoc(semesterDocRef, semesterData);

    // Update or create subject document
    const subjectData = subjectSnap.exists()
      ? subjectSnap.data()
      : { title: subjectTitles[subject] };
    if (subjectFields && subjectFields.title) {
      subjectData.title = subjectFields.title;
    } else if (!subjectSnap.exists()) {
      subjectData.title = subjectTitles[subject];
    }
    await setDoc(subjectDocRef, subjectData);

    // Update or create section document
    let sectionData = sectionSnap.exists()
      ? sectionSnap.data()
      : { title: sectionTitles[section], files: [] };

    // Always update the title
    if (sectionFields && sectionFields.title) {
      sectionData.title = sectionFields.title;
    }

    // Add the new file to the section's files array if there are files
    if (sectionData.files) {
      sectionData.files.push(fileData);
    } else {
      // Initialize files array with the new file if necessary
      sectionData.files = [fileData];
    }

    await setDoc(sectionDocRef, sectionData);

    // Ensure each section document for all subjects in the semester
    for (const subjectKey of Object.keys(subjectTitles)) {
      const subjectRef = doc(db, LEVEL_ID, semester, "subjects", subjectKey);
      const sectionsSnap = await getDocs(
        collection(db, LEVEL_ID, semester, "subjects", subjectKey, "sections")
      );

      const sectionDocsPromises = Object.keys(sectionTitles).map(
        async (sectionKey) => {
          const sectionRef = doc(
            db,
            LEVEL_ID,
            semester,
            "subjects",
            subjectKey,
            "sections",
            sectionKey
          );
          const sectionSnap = await getDoc(sectionRef);
          if (!sectionSnap.exists()) {
            await setDoc(sectionRef, {
              title: sectionTitles[sectionKey],
              files: [],
            });
          }
        }
      );

      // Ensure subject document has the correct title and section documents
      const subjectSnap = await getDoc(subjectRef);
      if (!subjectSnap.exists()) {
        await setDoc(subjectRef, { title: subjectTitles[subjectKey] });
      }

      await Promise.all(sectionDocsPromises);
    }

    return NextResponse.json(
      { message: "Lesson Created and Documents Updated Successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
