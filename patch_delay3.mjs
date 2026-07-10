import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const regex = /  const \[delayDays, setDelayDays\] = useState<string>\(''\);\s*const \[isDelayApplied, setIsDelayApplied\] = useState\(false\);\s*const handleDelay = \(\) => \{\s*const daysToShift = parseInt\(delayDays, 10\);\s*if \(isNaN\(daysToShift\)\) return;\s*const newData = data\.map\(m => \(\{\s*\.\.\.m,\s*tasks: m\.tasks\.map\(t => \{\s*let newStart = t\.startDate;\s*let newEnd = t\.endDate;\s*if \(newStart\) \{\s*const d = parseISODate\(newStart\);\s*d\.setDate\(d\.getDate\(\) \+ daysToShift\);\s*newStart = formatISO\(d\);\s*\}\s*if \(newEnd\) \{\s*const d = parseISODate\(newEnd\);\s*d\.setDate\(d\.getDate\(\) \+ daysToShift\);\s*newEnd = formatISO\(d\);\s*\}\s*return \{ \.\.\.t, startDate: newStart, endDate: newEnd \};\s*\}\)\s*\}\)\);\s*setDoc\(doc\(db, 'gantt', 'schedule'\), \{ data: newData \}\);\s*setIsDelayApplied\(true\);\s*\};/;

const replacement = `  const [pumpDelayDays, setPumpDelayDays] = useState<string>('');
  const [isPumpDelayApplied, setIsPumpDelayApplied] = useState(false);

  const [cornerDelayDays, setCornerDelayDays] = useState<string>('');
  const [isCornerDelayApplied, setIsCornerDelayApplied] = useState(false);

  const handlePumpDelay = () => {
    const daysToShift = parseInt(pumpDelayDays, 10);
    if (isNaN(daysToShift)) return;
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('pump')) return m;
      return {
        ...m,
        tasks: m.tasks.map(t => {
          let newStart = t.startDate;
          let newEnd = t.endDate;
          if (newStart) {
            const d = parseISODate(newStart);
            d.setDate(d.getDate() + daysToShift);
            newStart = formatISO(d);
          }
          if (newEnd) {
            const d = parseISODate(newEnd);
            d.setDate(d.getDate() + daysToShift);
            newEnd = formatISO(d);
          }
          return { ...t, startDate: newStart, endDate: newEnd };
        })
      };
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setIsPumpDelayApplied(true);
  };

  const resetPump = () => {
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('pump')) return m;
      const originalModule = scheduleData.find(om => om.id === m.id);
      return originalModule ? { ...originalModule, notes: m.notes } : m;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setPumpDelayDays('');
    setIsPumpDelayApplied(false);
  };

  const handleCornerDelay = () => {
    const daysToShift = parseInt(cornerDelayDays, 10);
    if (isNaN(daysToShift)) return;
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('corner')) return m;
      return {
        ...m,
        tasks: m.tasks.map(t => {
          let newStart = t.startDate;
          let newEnd = t.endDate;
          if (newStart) {
            const d = parseISODate(newStart);
            d.setDate(d.getDate() + daysToShift);
            newStart = formatISO(d);
          }
          if (newEnd) {
            const d = parseISODate(newEnd);
            d.setDate(d.getDate() + daysToShift);
            newEnd = formatISO(d);
          }
          return { ...t, startDate: newStart, endDate: newEnd };
        })
      };
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setIsCornerDelayApplied(true);
  };

  const resetCorner = () => {
    const newData = data.map(m => {
      if (!m.name.toLowerCase().includes('corner')) return m;
      const originalModule = scheduleData.find(om => om.id === m.id);
      return originalModule ? { ...originalModule, notes: m.notes } : m;
    });
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setCornerDelayDays('');
    setIsCornerDelayApplied(false);
  };`;

if(regex.test(code)) {
  fs.writeFileSync('src/components/GanttChart.tsx', code.replace(regex, replacement));
  console.log("Success!");
} else {
  console.log("Could not find regex target.");
}
