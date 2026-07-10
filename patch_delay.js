const fs = require('fs');
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
  console.log("Success replacing state/handlers");
} else {
  console.log("Could not find target string.");
}

const buttonsTarget = `        <div className="ml-auto flex items-center gap-4">
           <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
              <label className="text-[13px] font-semibold text-slate-700">Delay (days):</label>
              <input 
                type="number" 
                className="w-16 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                value={delayDays}
                onChange={(e) => setDelayDays(e.target.value)}
                placeholder="e.g. 14"
                disabled={isDelayApplied}
              />
              <button 
                onClick={handleDelay}
                disabled={!delayDays || isNaN(parseInt(delayDays, 10)) || isDelayApplied}
                className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors"
              >
                {isDelayApplied ? 'Applied' : 'Apply'}
              </button>
           </div>
           
           <div className="flex items-center border-l border-slate-300 pl-4 ml-2">
             <button
               onClick={() => {
                 setDoc(doc(db, 'gantt', 'schedule'), { data: scheduleData });
                 setDelayDays('');
                 setIsDelayApplied(false);
               }}
               className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors"
             >
               Factory Reset
             </button>
           </div>
        </div>`;

const buttonsReplacement = `        <div className="ml-auto flex flex-col md:flex-row md:items-center gap-4">
           {/* Pump Module Controls */}
           <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
              <span className="text-[11px] font-bold text-slate-500 mr-2 uppercase tracking-wide">Pumps:</span>
              <label className="text-[13px] font-semibold text-slate-700">Delay (days):</label>
              <input 
                type="number" 
                className="w-16 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                value={pumpDelayDays}
                onChange={(e) => setPumpDelayDays(e.target.value)}
                placeholder="e.g. 14"
                disabled={isPumpDelayApplied}
              />
              <button 
                onClick={handlePumpDelay}
                disabled={!pumpDelayDays || isNaN(parseInt(pumpDelayDays, 10)) || isPumpDelayApplied}
                className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors"
              >
                {isPumpDelayApplied ? 'Applied' : 'Apply'}
              </button>
              <button
                onClick={resetPump}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors ml-1"
              >
                Factory Reset
              </button>
           </div>
           
           {/* Corner Bracket Controls */}
           <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
              <span className="text-[11px] font-bold text-slate-500 mr-2 uppercase tracking-wide">Corners:</span>
              <label className="text-[13px] font-semibold text-slate-700">Delay (days):</label>
              <input 
                type="number" 
                className="w-16 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                value={cornerDelayDays}
                onChange={(e) => setCornerDelayDays(e.target.value)}
                placeholder="e.g. 14"
                disabled={isCornerDelayApplied}
              />
              <button 
                onClick={handleCornerDelay}
                disabled={!cornerDelayDays || isNaN(parseInt(cornerDelayDays, 10)) || isCornerDelayApplied}
                className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors"
              >
                {isCornerDelayApplied ? 'Applied' : 'Apply'}
              </button>
              <button
                onClick={resetCorner}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-[13px] font-medium transition-colors ml-1"
              >
                Factory Reset
              </button>
           </div>
        </div>`;

if(fs.readFileSync('src/components/GanttChart.tsx', 'utf8').includes(buttonsTarget)) {
  code = fs.readFileSync('src/components/GanttChart.tsx', 'utf8');
  fs.writeFileSync('src/components/GanttChart.tsx', code.replace(buttonsTarget, buttonsReplacement));
  console.log("Success replacing buttons");
} else {
  console.log("Could not find buttons target string.");
}

