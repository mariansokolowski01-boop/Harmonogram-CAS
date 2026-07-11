import fs from 'fs';

let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /          if \(\!tasks\.some\(\(t: any\) => t\.type === 'outfitting'\)\) \{[\s\S]*?             \}\);[\s\S]*?          \}/;

const repl = `          if (m.name.toLowerCase().includes('pump') && !tasks.some((t: any) => t.type === 'outfitting')) {
             needsUpdate = true;
             tasks.push({
                id: \`\${m.id}-t7\`,
                name: 'Outfitting',
                startDate: '',
                endDate: '',
                type: 'outfitting'
             });
          }`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("Migration logic updated successfully.");
} else {
    console.log("Regex not found.");
}
