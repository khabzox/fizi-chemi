import { db, collection, doc, setDoc } from "@/config/firebase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { level, title, section, files } = req.body;

    try {
      // Example: Save the uploaded file metadata to Firestore
      const docRef = doc(collection(db, level, section, "items"), title);
      await setDoc(docRef, { files });

      res.status(200).json({ message: "File data saved successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error saving file data" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
