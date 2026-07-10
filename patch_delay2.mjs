import fs from 'fs';
let code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');

const target = `  const [delayDays, setDelayDays] = useState<string>('');
  const [isDelayApplied, setIsDelayApplied] = useState(false);

  const handleDelay = () => {
    const daysToShift = parseInt(delayDays, 10);
    if (isNaN(daysToShift)) return;

    const newData = data.map(m => ({
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
    }));
    
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setIsDelayApplied(true);
  };`;

const target2 = `  const [delayDays, setDelayDays] = useState<string>('');
  const [isDelayApplied, setIsDelayApplied] = useState(false);

  const handleDelay = () => {
    const daysToShift = parseInt(delayDays, 10);
    if (isNaN(daysToShift)) return;
    const newData = data.map(m => ({
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
    }));
    setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
    setIsDelayApplied(true);
  };`;

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

if(code.includes(target)) {
  fs.writeFileSync('src/components/GanttChart.tsx', code.replace(target, replacement));
  console.log("Success replacing state/handlers (with newlines)");
} else if(code.includes(target2)) {
  fs.writeFileSync('src/components/GanttChart.tsx', code.replace(target2, replacement));
  console.log("Success replacing state/handlers (no newlines)");
} else {
  console.log("Could not find target string either.");
}

