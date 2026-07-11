import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regexLeftPart = /                    <div className="w-\[570px\] flex-shrink-0 bg-white border-r border-slate-300 sticky left-0 z-\[50\] shadow-\[2px_0_10px_rgba\(0,0,0,0\.05\)\] flex">/;
const replLeftPart = `                    <div className={\`\${showDatesColumn ? 'w-[570px]' : 'w-[390px]'} flex-shrink-0 bg-white border-r border-slate-300 sticky left-0 z-[50] shadow-[2px_0_10px_rgba(0,0,0,0.05)] flex\`}>`;

const regexRowGrid = /                           <div key=\{task\.id\} className="grid grid-cols-\[160px_90px_90px_90px\] divide-x divide-slate-200 h-\[30px\] hover:bg-slate-50 transition-colors flex-shrink-0">/;
const replRowGrid = `                           <div key={task.id} className={\`grid \${showDatesColumn ? 'grid-cols-[160px_90px_90px_90px]' : 'grid-cols-[160px_90px]'} divide-x divide-slate-200 h-[30px] hover:bg-slate-50 transition-colors flex-shrink-0\`}>`;

const regexInputs = /                            <div className="px-1 py-1 text-xs text-center flex items-center justify-center bg-white min-w-0 overflow-hidden">\s*<input\s*type="date"[\s\S]*?placeholder="Y-M-D"\s*\/>\s*<\/div>\s*<div className="px-1 py-1 text-xs text-center flex items-center justify-center bg-white min-w-0 overflow-hidden">\s*<input\s*type="date"[\s\S]*?placeholder="Y-M-D"\s*\/>\s*<\/div>/;

const replInputs = `                            {showDatesColumn && (
                              <>
                                <div className="px-1 py-1 text-xs text-center flex items-center justify-center bg-white min-w-0 overflow-hidden">
                                  <input 
                                    type="date" 
                                    className="w-full min-w-0 max-w-full text-center bg-transparent focus:outline-none font-mono text-[10px] text-slate-600 hover:bg-slate-100 p-1 rounded" 
                                    value={task.startDate || ''}
                                    onChange={(e) => updateStartDate(task.id, e.target.value)}
                                    placeholder="Y-M-D"
                                  />
                                </div>
                                <div className="px-1 py-1 text-xs text-center flex items-center justify-center bg-white min-w-0 overflow-hidden">
                                  <input 
                                    type="date" 
                                    className="w-full min-w-0 max-w-full text-center bg-transparent focus:outline-none font-mono text-[10px] text-slate-600 hover:bg-slate-100 p-1 rounded" 
                                    value={task.endDate || ''}
                                    onChange={(e) => updateEndDate(task.id, e.target.value)}
                                    placeholder="Y-M-D"
                                  />
                                </div>
                              </>
                            )}`;

if (regexLeftPart.test(code)) {
    code = code.replace(regexLeftPart, replLeftPart);
    console.log("Left part replaced");
} else {
    console.log("Left part not found");
}

if (regexRowGrid.test(code)) {
    code = code.replace(regexRowGrid, replRowGrid);
    console.log("Row grid replaced");
} else {
    console.log("Row grid not found");
}

if (regexInputs.test(code)) {
    code = code.replace(regexInputs, replInputs);
    console.log("Inputs replaced");
} else {
    console.log("Inputs not found");
}

fs.writeFileSync('src/components/GanttChart.tsx', code);
