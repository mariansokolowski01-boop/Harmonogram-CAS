import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const startTarget = `  const updateStartDate = (taskId: string, newDate: string) => {
      const newData = data.map(m => ({
          ...m,
          tasks: m.tasks.map(t => {
              if (t.id === taskId) {
                  return { ...t, startDate: newDate };
              }
              return t;
          })
      }));
      setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };`;

const startRepl = `  const updateStartDate = (taskId: string, newDate: string) => {
      const newData = data.map(m => ({
          ...m,
          tasks: m.tasks.map(t => {
              if (t.id === taskId) {
                  let dateToSet = newDate;
                  if (!dateToSet) {
                      const originalModule = scheduleData.find(om => om.id === m.id);
                      const originalTask = originalModule?.tasks.find(ot => ot.id === t.id);
                      if (originalTask) dateToSet = originalTask.startDate;
                  }
                  return { ...t, startDate: dateToSet };
              }
              return t;
          })
      }));
      setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };`;

const endTarget = `  const updateEndDate = (taskId: string, newDate: string) => {
      const newData = data.map(m => ({
          ...m,
          tasks: m.tasks.map(t => {
              if (t.id === taskId) {
                  return { ...t, endDate: newDate };
              }
              return t;
          })
      }));
      setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };`;

const endRepl = `  const updateEndDate = (taskId: string, newDate: string) => {
      const newData = data.map(m => ({
          ...m,
          tasks: m.tasks.map(t => {
              if (t.id === taskId) {
                  let dateToSet = newDate;
                  if (!dateToSet) {
                      const originalModule = scheduleData.find(om => om.id === m.id);
                      const originalTask = originalModule?.tasks.find(ot => ot.id === t.id);
                      if (originalTask) dateToSet = originalTask.endDate;
                  }
                  return { ...t, endDate: dateToSet };
              }
              return t;
          })
      }));
      setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };`;

if(code.includes(startTarget)) {
  code = code.replace(startTarget, startRepl);
  console.log("Start date patched");
}
if(code.includes(endTarget)) {
  code = code.replace(endTarget, endRepl);
  console.log("End date patched");
}
fs.writeFileSync('src/components/GanttChart.tsx', code);
