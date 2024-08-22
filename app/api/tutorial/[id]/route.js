import { db } from "@/config/firebase";
import { getDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params; // Extract ID from URL params
    const url = new URL(req.url, `http://${req.headers.host}`);
    const fileLocation = url.searchParams.getAll("fileLocation"); // Extract fileLocation from query parameters

    if (!id || fileLocation.length === 0) {
      return NextResponse.json(
        { message: "Error", error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [LEVEL_ID, semester, subject, section] = fileLocation;
    const lessonDocRef = doc(
      db,
      LEVEL_ID,
      semester,
      "subjects",
      subject,
      "sections",
      section
    );
    const docSnap = await getDoc(lessonDocRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const file = existingData.files.find((file) => file.id === id);

      if (file) {
        return NextResponse.json({ file }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Error", error: "File not found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Error", error: "Document does not exist" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { title, downloadLink, fileLocation } = body;
    const id = params.id;

    if (!id || !title || !downloadLink || !fileLocation) {
      return NextResponse.json(
        { message: "Error", error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [LEVEL_ID, semester, subject, section] = fileLocation;
    const lessonDocRef = doc(
      db,
      LEVEL_ID,
      semester,
      "subjects",
      subject,
      "sections",
      section
    );
    const docSnap = await getDoc(lessonDocRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const updatedFiles = existingData.files.map((file) =>
        file.id == id
          ? {
              ...file,
              title,
              downloadLink,
              updatedAt: new Date().toISOString(),
            }
          : file
      );

      await updateDoc(lessonDocRef, { files: updatedFiles });
    } else {
      return NextResponse.json(
        { message: "Error", error: "Document does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Lesson Updated" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const { fileLocation } = await req.json();

    if (!id || !fileLocation) {
      return NextResponse.json(
        { message: "Error", error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [LEVEL_ID, semester, subject, section] = fileLocation;
    const lessonDocRef = doc(
      db,
      LEVEL_ID,
      semester,
      "subjects",
      subject,
      "sections",
      section
    );
    const docSnap = await getDoc(lessonDocRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const updatedFiles = existingData.files.filter((file) => file.id !== id);

      await updateDoc(lessonDocRef, { files: updatedFiles });
    } else {
      return NextResponse.json(
        { message: "Error", error: "Document does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Lesson Deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Error", error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
