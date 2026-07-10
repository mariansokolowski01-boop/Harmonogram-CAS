import fs from 'fs';
const dataFile = fs.readFileSync('src/data.ts', 'utf8');
console.log(dataFile.length);
