import fs from 'fs';

let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const targetLogicRegex = /  const \[pumpDelayDays, setPumpDelayDays\] = useState<string>\(''\);[\s\S]*?  const resetCorner = \(\) => \{[\s\S]*?setIsCornerDelayApplied\(false\);\s*\};/;

const replLogic = `  const factoryReset = () => {
    // Merge existing notes with hardcoded scheduleData
    const newData = scheduleData.map(originalModule => {
       const currentModule = data.find(m => m.id === originalModule.id);
       if (currentModule && currentModule.notes !== undefined) {
          return { ...originalModule, notes: currentModule.notes };
       }
       return originalModule;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };`;

if (targetLogicRegex.test(code)) {
    code = code.replace(targetLogicRegex, replLogic);
    console.log("Replaced logic.");
} else {
    console.log("Could not find logic regex!");
}

const targetUIRegex = /        <div className="ml-auto flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4 py-2">[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;

const replUI = `        <div className="ml-auto flex items-center gap-4">
           <div className="flex items-center border-l border-slate-300 pl-4 ml-2">
             <button
               onClick={factoryReset}
               className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors"
               title="Reset to default schedule dates"
             >
               Factory Reset
             </button>
           </div>
        </div>`;

if (targetUIRegex.test(code)) {
    code = code.replace(targetUIRegex, replUI);
    console.log("Replaced UI.");
} else {
    console.log("Could not find UI regex!");
}

fs.writeFileSync('src/components/GanttChart.tsx', code);
