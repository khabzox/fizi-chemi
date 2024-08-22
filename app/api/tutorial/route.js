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
  try {
    // Utility function to handle errors
    function handleError(error, context) {
      console.error(`Error ${context}:`, error);
      return NextResponse.json(
        { error: `Error ${context}: ${error.message}` },
        { status: 500 }
      );
    }

    // Fetch files for a given section
    async function fetchFilesForSection(sectionRef) {
      try {
        const sectionDoc = await getDoc(sectionRef);
        const sectionData = sectionDoc.data() || {};
        const filesArray = sectionData.files || [];

        return {
          title: sectionData.title || "Untitled Section",
          files: filesArray.map((fileData) => ({
            createdAt: fileData.createdAt,
            downloadLink: fileData.downloadLink,
            title: fileData.title,
            updatedAt: fileData.updatedAt,
          })),
        };
      } catch (error) {
        throw new Error(`Fetching files for section failed: ${error.message}`);
      }
    }

    // Fetch data for a given subject
    async function fetchSubjectData(subjectRef) {
      try {
        const subjectDoc = await getDoc(subjectRef);
        const subjectData = subjectDoc.data() || {};
        const sectionsWithFiles = {};

        const sectionsSnapshot = await getDocs(
          collection(subjectRef, "sections")
        );
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
      } catch (error) {
        throw new Error(`Fetching subject data failed: ${error.message}`);
      }
    }

    // Fetch data for a given semester
    async function fetchSemesterData(semesterRef) {
      try {
        const semesterDoc = await getDoc(semesterRef);
        const semesterData = semesterDoc.data() || {};
        const subjects = {};

        const subjectsSnapshot = await getDocs(
          collection(semesterRef, "subjects")
        );
        await Promise.all(
          subjectsSnapshot.docs.map(async (subjectDoc) => {
            const subjectRef = subjectDoc.ref;
            const subjectData = await fetchSubjectData(subjectRef);
            subjects[subjectDoc.id] = subjectData;
          })
        );

        return {
          title: semesterData.title || "Untitled Semester",
          subjects,
        };
      } catch (error) {
        throw new Error(`Fetching semester data failed: ${error.message}`);
      }
    }

    // Fetch data for all semesters
    async function fetchAllData() {
      const collectionsNames = [
        "1ac",
        "2ac",
        "3ac",
        "tcs",
        "1bac",
        "2bac",
      ];
      const semesters = {};

      for (const collectionName of collectionsNames) {
        semesters[collectionName] = {};

        try {
          semesters[collectionName]["semester_1"] = await fetchSemesterData(
            doc(db, collectionName, "semester_1")
          );
        } catch (error) {
          handleError(error, `fetching ${collectionName}, semester_1`);
        }

        try {
          semesters[collectionName]["semester_2"] = await fetchSemesterData(
            doc(db, collectionName, "semester_2")
          );
        } catch (error) {
          handleError(error, `fetching ${collectionName}, semester_2`);
        }
      }

      return semesters;
    }

    const data = await fetchAllData();
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, "fetching all data");
  }
}

export async function POST(req) {
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
    const subjectData = subjectSnap.exists() ? subjectSnap.data() : {};
    if (subjectFields && subjectFields.title) {
      subjectData.title = subjectFields.title;
    }
    await setDoc(subjectDocRef, subjectData);

    // Update or create section document
    const sectionData = sectionSnap.exists()
      ? sectionSnap.data()
      : { files: [] };
    if (sectionFields && sectionFields.title) {
      sectionData.title = sectionFields.title;
    }
    // Add the new file to the section's files array
    sectionData.files.push(fileData);
    await setDoc(sectionDocRef, sectionData);

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
