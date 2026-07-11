import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('current_data.json', 'utf8'));

// Filter out outfitting from corner brackets
const cleanedData = rawData.map(m => {
  if (m.name.toLowerCase().includes('corner')) {
    m.tasks = m.tasks.filter(t => t.type !== 'outfitting');
  }
  
  // Also sort tasks by type order to keep it clean
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

const fileContent = `import { Module } from './types';

export const scheduleData: Module[] = ${JSON.stringify(cleanedData, null, 2)};
`;

fs.writeFileSync('src/data.ts', fileContent);
console.log("Updated src/data.ts");
