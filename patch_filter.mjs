import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /        <div className="ml-auto flex items-center gap-4">[\s\S]*?           <div className="flex items-center border-l border-slate-300 pl-4 ml-2">/;
const repl = `        <div className="ml-auto flex items-center gap-4">
           <div className="flex items-center border-l border-slate-300 pl-4">
             <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
               <input type="checkbox" checked={showDatesColumn} onChange={() => setShowDatesColumn(v => !v)} className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500" />
               <span className="text-[13px] font-medium">Show Start/End Dates</span>
             </label>
           </div>
           <div className="flex items-center border-l border-slate-300 pl-4">`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("Filter UI patched");
} else {
    console.log("Regex not found");
}
