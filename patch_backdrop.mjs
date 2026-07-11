import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /<div className="w-\[570px\] sticky left-0 border-r border-slate-300 z-50 bg-white" style=\{\{ backgroundImage: 'linear-gradient\(to bottom, #e2e8f0 1px, transparent 1px\)', backgroundSize: '100% 30px' \}\}>\s*<div className="w-full h-full grid grid-cols-\[140px_160px_90px_90px_90px\] divide-x divide-slate-200 pointer-events-none\">\s*<div \/><div \/><div \/><div \/><div \/>\s*<\/div>\s*<\/div>/;

const repl = `<div className={\`\${showDatesColumn ? 'w-[570px]' : 'w-[390px]'} sticky left-0 border-r border-slate-300 z-50 bg-white\`} style={{ backgroundImage: 'linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '100% 30px' }}>
                   <div className={\`w-full h-full grid \${showDatesColumn ? 'grid-cols-[140px_160px_90px_90px_90px]' : 'grid-cols-[140px_160px_90px]'} divide-x divide-slate-200 pointer-events-none\`}>
                      <div /><div />{showDatesColumn && <><div /><div /></>}<div />
                   </div>
                </div>`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("Backdrop patched");
} else {
    console.log("Backdrop regex not found");
}
