import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";

export default function FirestoreTerminalTest() {
  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "test"));
      console.log("Firestore docs:");
      snap.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    }

    load().catch((err) => console.error("Firestore error:", err));
  }, []);

  return null;
}
