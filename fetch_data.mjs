import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "cybernetic-fact-8txfk",
  appId: "1:110216305217:web:d57a975498517fe5c644c0",
  apiKey: "AIzaSyBc-bwSHCWYSHaCp9Gl1UEYaDTOqyG0Nfc",
  authDomain: "cybernetic-fact-8txfk.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-b074ee16-acb2-4ead-9913-4b2ed16ae85a");

async function fetchData() {
  try {
    const docRef = doc(db, 'gantt', 'schedule');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(JSON.stringify(docSnap.data().data, null, 2));
    } else {
      console.log("No such document!");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fetchData();
