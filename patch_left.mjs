import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /<div className="absolute top-0 bottom-0 pointer-events-none z-0" style=\{\{ left: 570, width: totalWidth \}\}>/;
const repl = `<div className="absolute top-0 bottom-0 pointer-events-none z-0" style={{ left: showDatesColumn ? 570 : 390, width: totalWidth }}>`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("Left position patched");
} else {
    console.log("Regex not found");
}
