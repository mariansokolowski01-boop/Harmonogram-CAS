import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /  const \[hiddenWeeks, setHiddenWeeks\] = useState<Set<string>>\(\(\) => \{[\s\S]*?  \}\);/;
const repl = `  const [hiddenWeeks, setHiddenWeeks] = useState<Set<string>>(() => {
    return new Set<string>();
  });
  const [showDatesColumn, setShowDatesColumn] = useState<boolean>(true);`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("State patched");
} else {
    console.log("Regex not found");
}
