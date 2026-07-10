import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const targetPump = `  const resetPump = () => {
    console.log("resetPump clicked");
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('pump')) return m;
      const originalModule = JSON.parse(JSON.stringify(scheduleData.find(om => om.id === m.id)));
      console.log("Found original module:", originalModule);
      return originalModule ? { ...originalModule, notes: m.notes } : m;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setPumpDelayDays('');
    setIsPumpDelayApplied(false);
  };`;

const targetCorner = `  const resetCorner = () => {
    console.log("resetCorner clicked");
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('corner')) return m;
      const originalModule = JSON.parse(JSON.stringify(scheduleData.find(om => om.id === m.id)));
      return originalModule ? { ...originalModule, notes: m.notes } : m;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setCornerDelayDays('');
    setIsCornerDelayApplied(false);
  };`;

const replPump = `  const resetPump = () => {
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('pump')) return m;
      const originalModule = JSON.parse(JSON.stringify(scheduleData.find(om => om.id === m.id)));
      if (originalModule) {
         if (m.notes !== undefined) originalModule.notes = m.notes;
         return originalModule;
      }
      return m;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setPumpDelayDays('');
    setIsPumpDelayApplied(false);
  };`;

const replCorner = `  const resetCorner = () => {
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('corner')) return m;
      const originalModule = JSON.parse(JSON.stringify(scheduleData.find(om => om.id === m.id)));
      if (originalModule) {
         if (m.notes !== undefined) originalModule.notes = m.notes;
         return originalModule;
      }
      return m;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setCornerDelayDays('');
    setIsCornerDelayApplied(false);
  };`;

code = code.replace(targetPump, replPump).replace(targetCorner, replCorner);
fs.writeFileSync('src/components/GanttChart.tsx', code);
console.log("Patched undefined notes issue!");
