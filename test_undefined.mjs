import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const targetPump = `      return originalModule ? { ...originalModule, notes: m.notes } : m;`;

if(code.includes(targetPump)) {
    console.log("Found it!");
}
