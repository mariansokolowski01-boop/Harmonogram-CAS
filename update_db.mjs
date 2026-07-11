import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  projectId: "cybernetic-fact-8txfk",
  appId: "1:110216305217:web:d57a975498517fe5c644c0",
  apiKey: "AIzaSyBc-bwSHCWYSHaCp9Gl1UEYaDTOqyG0Nfc",
  authDomain: "cybernetic-fact-8txfk.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-b074ee16-acb2-4ead-9913-4b2ed16ae85a");

const rawData = JSON.parse(fs.readFileSync('current_data.json', 'utf8'));

// Filter out outfitting from corner brackets
const cleanedData = rawData.map(m => {
  if (m.name.toLowerCase().includes('corner')) {
    m.tasks = m.tasks.filter(t => t.type !== 'outfitting');
  }
  
  const typeOrder = {
    'purchase': 1,
    'cutting': 2,
    'assembly': 3,
    'welding': 4,
    'outfitting': 5,
    'painting': 6,
    'shipment': 7
  };
  m.tasks.sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99));

  return m;
});

async function updateData() {
  try {
    const docRef = doc(db, 'gantt', 'schedule');
    await setDoc(docRef, { data: cleanedData });
    console.log("Database updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

updateData();
