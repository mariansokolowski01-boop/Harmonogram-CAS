import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "cybernetic-fact-8txfk",
  appId: "1:110216305217:web:d57a975498517fe5c644c0",
  apiKey: "AIzaSyBc-bwSHCWYSHaCp9Gl1UEYaDTOqyG0Nfc",
  authDomain: "cybernetic-fact-8txfk.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-b074ee16-acb2-4ead-9913-4b2ed16ae85a");

async function updateData() {
  try {
    const docRef = doc(db, 'gantt', 'schedule');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data().data;
      data = data.map(m => {
        if (m.name.toLowerCase().includes('corner')) {
          m.tasks = m.tasks.filter(t => t.type !== 'outfitting');
        }
        return m;
      });
      await setDoc(docRef, { data });
      console.log("Database cleaned.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

updateData();
