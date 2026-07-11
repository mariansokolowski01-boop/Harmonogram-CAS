import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /  const factoryReset = \(\) => \{[\s\S]*?    setDoc\(doc\(db, 'gantt', 'schedule'\), \{ data: newData \}\);\n  \};/;

const repl = `  const factoryReset = () => {
    const newData = data.map(currentModule => {
       const originalModule = scheduleData.find(m => m.id === currentModule.id);
       if (originalModule) {
          return {
             ...currentModule,
             tasks: currentModule.tasks.map(currentTask => {
                const originalTask = originalModule.tasks.find(t => t.id === currentTask.id);
                if (originalTask) {
                   return {
                      ...currentTask,
                      startDate: originalTask.startDate,
                      endDate: originalTask.endDate
                   };
                }
                return { ...currentTask, startDate: '', endDate: '' };
             })
          };
       }
       return currentModule;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };`;

if (regex.test(code)) {
    code = code.replace(regex, repl);
    fs.writeFileSync('src/components/GanttChart.tsx', code);
    console.log("factoryReset patched");
} else {
    console.log("Regex not found");
}
