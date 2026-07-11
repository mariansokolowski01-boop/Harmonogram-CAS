import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /              <div className="w-\[570px\] flex-shrink-0 bg-white border-r border-b-2 border-slate-300 font-bold grid grid-cols-\[140px_160px_90px_90px_90px\] divide-x divide-slate-300 sticky left-0 z-\[70\] shadow-\[2px_0_10px_rgba\(0,0,0,0\.05\)\] h-\[90px\]">[\s\S]*?                 <span className="text-\[10px\] font-normal text-slate-500">\(Check\)<\/span>\s*<\/div>\s*<\/div>/;

const repl = `              <div className={\`\${showDatesColumn ? 'w-[570px]' : 'w-[390px]'} flex-shrink-0 bg-white border-r border-b-2 border-slate-300 font-bold grid \${showDatesColumn ? 'grid-cols-[140px_160px_90px_90px_90px]' : 'grid-cols-[140px_160px_90px]'} divide-x divide-slate-300 sticky left-0 z-[70] shadow-[2px_0_10px_rgba(0,0,0,0.05)] h-[90px]\`}>
               <div className="p-2 flex items-center bg-slate-100">Task Group</div>
               <div className="p-2 flex items-center justify-center bg-slate-100">Stage Name</div>
               {showDatesColumn && (
                 <>
                   <div className="p-2 flex flex-col items-center justify-center bg-slate-100 text-center leading-tight">
                     <span>Start Date</span>
                   </div>
                   <div className="p-2 flex flex-col items-center justify-center bg-slate-100 text-center leading-tight">
                     <span>End Date</span>
                   </div>
                 </>
               )}
               <div className="p-2 flex flex-col items-center justify-center bg-slate-100 text-center leading-tight">
                 <span>Status</span>
                 <span className="text-[10px] font-normal text-slate-500">(Check)</span>
               </div>
            </div>`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("Header patched");
} else {
    console.log("Regex not found");
}
