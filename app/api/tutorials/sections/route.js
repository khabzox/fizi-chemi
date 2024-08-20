// pages/api/sections.js
import {
  db,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "@/config/firebase";

export default async function handler(req, res) {
  const { method } = req;
  const { level, semesterId, sectionId, data } = req.body;

  switch (method) {
    case "GET":
      try {
        const docRef = doc(db, level, semesterId, "sections", sectionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          res.status(200).json(docSnap.data());
        } else {
          res.status(404).json({ error: "Section not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching section data" });
      }
      break;

    case "POST":
      try {
        const docRef = doc(db, level, semesterId, "sections", sectionId);
        await setDoc(docRef, data, { merge: true });

        res.status(200).json({ message: "Section data saved successfully!" });
      } catch (error) {
        res.status(500).json({ error: "Error saving section data" });
      }
      break;

    case "PUT":
      try {
        const docRef = doc(db, level, semesterId, "sections", sectionId);
        await updateDoc(docRef, data);

        res.status(200).json({ message: "Section data updated successfully!" });
      } catch (error) {
        res.status(500).json({ error: "Error updating section data" });
      }
      break;

    case "DELETE":
      try {
        const docRef = doc(db, level, semesterId, "sections", sectionId);
        await deleteDoc(docRef);

        res.status(200).json({ message: "Section deleted successfully!" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting section" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
