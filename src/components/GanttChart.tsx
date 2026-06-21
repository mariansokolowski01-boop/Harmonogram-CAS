import React, { useMemo, useState, useEffect } from 'react';
import { scheduleData } from '../data';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getDaysBetween, parseISODate, differenceInDaysSigned, getWeekNumber } from '../utils';
import { Check, Columns, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function formatISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function GanttChart() {
  const currentDate = new Date();
  const [data, setData] = useState(scheduleData);
  const [celebration, setCelebration] = useState<{id: string, ts: number} | null>(null);
  const [jokeMessage, setJokeMessage] = useState<string | null>(null);
  const [rocketClicks, setRocketClicks] = useState<number[]>([]);
  
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('gantt_filters');
      if (stored) return new Set(JSON.parse(stored));
    } catch(e) {}
    return new Set();
  });

  useEffect(() => {
    const docRef = doc(db, 'gantt', 'schedule');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data().data);
      } else {
        setDoc(docRef, { data: scheduleData });
      }
    });
    return () => unsubscribe();
  }, []);
  const [hiddenWeeks, setHiddenWeeks] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('gantt_hidden_weeks');
      if (stored) return new Set(JSON.parse(stored));
    } catch(e) {}
    return new Set();
  });
  
  const timelineStart = new Date('2026-05-18');
  const timelineEnd = new Date('2026-10-31');
  
  const colWidth = 24; 
  const collapsedWeekWidth = 40;

  const { weeks, months, dayCoordMap, totalWidth } = useMemo(() => {
    const allDays = getDaysBetween(timelineStart, timelineEnd);
    
    // Group by week
    const weeksList: { name: string; days: { date: Date; x: number; width: number }[]; isCollapsed: boolean; x: number; width: number }[] = [];
    let currentWeekName = '';
    let currentWeekDays: Date[] = [];
    
    allDays.forEach(d => {
       const wName = `W${getWeekNumber(d)}`;
       if (wName !== currentWeekName) {
         if (currentWeekDays.length > 0) {
           weeksList.push({ name: currentWeekName, days: currentWeekDays.map(cd => ({ date: cd, x: 0, width: 0 })), isCollapsed: hiddenWeeks.has(currentWeekName), x: 0, width: 0 });
         }
         currentWeekName = wName;
         currentWeekDays = [d];
       } else {
         currentWeekDays.push(d);
       }
    });
    if (currentWeekDays.length > 0) {
      weeksList.push({ name: currentWeekName, days: currentWeekDays.map(cd => ({ date: cd, x: 0, width: 0 })), isCollapsed: hiddenWeeks.has(currentWeekName), x: 0, width: 0 });
    }
    
    let currentX = 0;
    const map = new Map<string, { x: number, width: number, isCollapsed: boolean }>();
    
    weeksList.forEach(w => {
       w.x = currentX;
       if (w.isCollapsed) {
          w.width = collapsedWeekWidth;
          w.days.forEach(d => {
            d.x = currentX;
            d.width = collapsedWeekWidth;
            map.set(formatISO(d.date), { x: currentX, width: collapsedWeekWidth, isCollapsed: true });
          });
          currentX += collapsedWeekWidth;
       } else {
          w.width = w.days.length * colWidth;
          w.days.forEach((d, idx) => {
            d.x = currentX + idx * colWidth;
            d.width = colWidth;
            map.set(formatISO(d.date), { x: d.x, width: colWidth, isCollapsed: false });
          });
          currentX += w.width;
       }
    });

    // Calculate Months based on visual layout
    const monthsList: { name: string; x: number; width: number }[] = [];
    let currentMonthName = '';
    let mStartX = 0;
    let lastX = 0;
    
    allDays.forEach(d => {
       const mName = d.toLocaleString('en-US', { month: 'long' });
       const info = map.get(formatISO(d))!;
       if (mName !== currentMonthName) {
          if (currentMonthName !== '') {
             const mWidth = info.x - mStartX;
             if (mWidth > 0) {
                monthsList[monthsList.length - 1].width = mWidth;
             }
          }
          currentMonthName = mName;
          mStartX = info.x;
          monthsList.push({ name: currentMonthName, x: mStartX, width: info.width });
       } else {
          if (!info.isCollapsed || (info.isCollapsed && info.x !== lastX)) {
             monthsList[monthsList.length - 1].width = (info.x + info.width) - mStartX;
          }
       }
       lastX = info.x;
    });

    return { weeks: weeksList, months: monthsList, dayCoordMap: map, totalWidth: currentX, allDays };
  }, [timelineStart, timelineEnd, hiddenWeeks]);

  const toggleWeek = (weekName: string) => {
     setHiddenWeeks(prev => {
        const next = new Set(prev);
        if (next.has(weekName)) next.delete(weekName);
        else next.add(weekName);
        localStorage.setItem('gantt_hidden_weeks', JSON.stringify(Array.from(next)));
        return next;
     });
  };

  const filteredData = useMemo(() => {
    if (activeFilters.size === 0) return data;
    return data.map(module => ({
      ...module,
      tasks: module.tasks.filter(t => activeFilters.has(t.type))
    })).filter(module => module.tasks.length > 0);
  }, [data, activeFilters]);

  const toggleTaskCompletion = (taskId: string) => {
      const newData = data.map(m => ({
          ...m,
          tasks: m.tasks.map(t => {
              if (t.id === taskId) {
                  const newStatus = !t.isCompleted;
                  if (newStatus) {
                      setCelebration({ id: t.id, ts: Date.now() });
                      setTimeout(() => setCelebration(null), 2000);
                      
                      const now = Date.now();
                      setRocketClicks(prev => {
                          const recent = prev.filter(time => now - time < 30000);
                          const updated = [...recent, now];
                          if (updated.length === 5) {
                              setJokeMessage("🚀 Houston, mamy problem! Budżet na paliwo rakietowe wyczerpany. Wracamy do szlifowania stali! 🚀");
                              setTimeout(() => setJokeMessage(null), 5000);
                          }
                          return updated;
                      });
                  }
                  return { ...t, isCompleted: newStatus };
              }
              return t;
          })
      }));
      setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };
  
  const updateCorrectionDate = (taskId: string, newDate: string) => {
      const newData = data.map(m => ({
          ...m,
          tasks: m.tasks.map(t => {
              if (t.id === taskId) {
                  return { ...t, correctionDate: newDate };
              }
              return t;
          })
      }));
      setDoc(doc(db, 'gantt', 'schedule'), { data: newData });
  };

  const currentDateStr = formatISO(currentDate);

  const filterOptions = [
    { id: 'purchase', label: 'Steel purchase' },
    { id: 'cutting', label: 'Steel cutting' },
    { id: 'assembly', label: 'Assembly' },
    { id: 'welding', label: 'Welding' },
    { id: 'painting', label: 'Painting' },
    { id: 'shipment', label: 'Shipment' }
  ];

  const toggleFilter = (typeId: string) => {
     setActiveFilters(prev => {
        const next = new Set(prev);
        if (next.has(typeId)) next.delete(typeId);
        else next.add(typeId);
        localStorage.setItem('gantt_filters', JSON.stringify(Array.from(next)));
        return next;
     });
  };
  const currentDayInfo = dayCoordMap.get(currentDateStr);

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden text-sm relative">
      <AnimatePresence>
        {jokeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-20 left-1/2 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] font-bold text-center border-2 border-slate-700 max-w-lg w-full flex items-center justify-center gap-3"
          >
            <span>{jokeMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
        <span className="font-semibold text-slate-700">Filter View:</span>
        <div className="flex flex-wrap gap-3">
           {filterOptions.map(opt => (
             <label key={opt.id} className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
               <input type="checkbox" checked={activeFilters.has(opt.id)} onChange={() => toggleFilter(opt.id)} className="rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
               <span className="text-[13px] font-medium">{opt.label}</span>
             </label>
           ))}
        </div>
        <div className="ml-auto">
           {activeFilters.size > 0 && (
              <button onClick={() => {
                const next = new Set<string>();
                setActiveFilters(next);
                localStorage.setItem('gantt_filters', JSON.stringify(Array.from(next)));
              }} className="text-xs text-slate-500 hover:text-slate-700 underline">Clear Filters</button>
           )}
        </div>
      </div>
      <div className="flex-1 overflow-auto focus:outline-none custom-scrollbar" tabIndex={0}>
        <div className="inline-block min-w-full h-max relative align-top">
            
            {/* HEADER ROW (Locked vertically, scrolls horizontally) */}
            <div className="flex flex-shrink-0 shadow-sm bg-white z-[60] sticky top-0 w-fit min-w-full">
              
              {/* Left Header - Sticky Left horizontally */}
              <div className="w-[480px] flex-shrink-0 bg-white border-r border-b-2 border-slate-300 font-bold grid grid-cols-[140px_160px_90px_90px] divide-x divide-slate-300 sticky left-0 z-[70] shadow-[2px_0_10px_rgba(0,0,0,0.05)] h-[90px]">
               <div className="p-2 flex items-center bg-slate-100">Task Group</div>
               <div className="p-2 flex items-center justify-center bg-slate-100">Stage Name</div>
               <div className="p-2 flex flex-col items-center justify-center bg-slate-100 text-center leading-tight">
                 <span>Correction</span>
                 <span className="text-[10px] font-normal text-slate-500">(Date)</span>
               </div>
               <div className="p-2 flex flex-col items-center justify-center bg-slate-100 text-center leading-tight">
                 <span>Status</span>
                 <span className="text-[10px] font-normal text-slate-500">(Check)</span>
               </div>
            </div>

            {/* Right Header - Calendar */}
            <div className="bg-white flex flex-col h-[90px] border-b-2 border-slate-300 relative" style={{ width: totalWidth }}>
              
              {/* CURRENT DAY MARKER HEADER */}
              {currentDayInfo && !currentDayInfo.isCollapsed && (
                 <div 
                   className="absolute top-[60px] bottom-0 z-40 border-l-[2px] border-rose-500 border-dashed pointer-events-none"
                   style={{ left: currentDayInfo.x + (colWidth / 2) }}
                 >
                    <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap absolute" style={{ bottom: '100%', left: '0', transform: 'translateX(-50%)', marginBottom: '2px' }}>
                       TODAY: {currentDateStr}
                    </div>
                 </div>
              )}

              {/* Timeline Header Row 1: Months */}
              <div className="h-[30px] flex border-b border-slate-300 bg-slate-100">
                {months.map((m, i) => (
                  <div key={i} style={{ width: m.width }} className="border-r border-slate-300 flex justify-center items-center font-bold text-xs uppercase tracking-wider text-slate-700">
                    {m.name}
                  </div>
                ))}
              </div>
              
              {/* Timeline Header Row 2: Weeks */}
              <div className="h-[30px] flex border-b border-slate-300 bg-slate-50">
                {weeks.map((w, i) => (
                  <div key={i} style={{ width: w.width }} className="border-r border-slate-300 flex justify-center items-center font-bold text-xs text-slate-600 font-mono relative group">
                    {w.isCollapsed ? (
                       <button onClick={() => toggleWeek(w.name)} className="w-full h-full flex flex-col items-center justify-center hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-700">
                          <EyeOff className="w-3 h-3 mb-0.5" />
                          <span className="text-[9px] leading-none">{w.name}</span>
                       </button>
                    ) : (
                       <div className="w-full flex items-center justify-between px-2">
                          <span>{w.name}</span>
                          <button onClick={() => toggleWeek(w.name)} className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 p-1 rounded transition-all text-slate-400">
                             <Columns className="w-3 h-3" />
                          </button>
                       </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Timeline Header Row 3: Days */}
              <div className="h-[30px] flex bg-white">
                {weeks.map((w, wi) => {
                  if (w.isCollapsed) {
                    return (
                      <div key={wi} style={{ width: w.width }} className="border-r border-slate-200 bg-slate-50 flex justify-center items-center">
                        <span className="text-[10px] text-slate-400 font-mono">...</span>
                      </div>
                    )
                  }
                  return w.days.map((d, di) => {
                    const isWeekend = d.date.getDay() === 0 || d.date.getDay() === 6;
                    const isToday = formatISO(d.date) === currentDateStr;
                    return (
                      <div 
                        key={`${wi}-${di}`} 
                        style={{ width: colWidth }} 
                        className={`border-r border-slate-200 flex justify-center items-center text-[11px] font-mono 
                          ${isToday ? 'bg-rose-100 text-rose-700 font-bold' : isWeekend ? 'bg-slate-50 text-slate-400' : 'text-slate-500 font-medium'}`}
                      >
                        {d.date.getDate()}
                      </div>
                    );
                  })
                })}
              </div>
            </div>
            
          </div>

          {/* BODY ROW */}
          <div className="flex flex-col relative bg-white pb-10 w-fit min-w-full">
            
             {/* Background Grid Lines & Current Day Marker */}
             <div className="absolute top-0 bottom-0 pointer-events-none z-0" style={{ left: 480, width: totalWidth }}>
                {currentDayInfo && !currentDayInfo.isCollapsed && (
                   <div 
                     className="absolute top-0 bottom-0 z-30 border-l-[2px] border-rose-500 border-dashed pointer-events-none"
                     style={{ left: currentDayInfo.x + (colWidth / 2) }}
                   />
                )}
                <div className="absolute inset-0 flex pointer-events-none z-0">
                  {weeks.map((w, wi) => {
                     if (w.isCollapsed) {
                       return <div key={wi} style={{ width: w.width }} className="border-r border-slate-200 bg-slate-50/50 flex-shrink-0" />
                     }
                     return w.days.map((d, di) => {
                       const isWeekend = d.date.getDay() === 0 || d.date.getDay() === 6;
                       return (
                         <div key={`${wi}-${di}`} style={{ width: colWidth }} className={`border-r border-slate-200 h-full flex-shrink-0 ${isWeekend ? 'bg-slate-50/50' : ''}`} />
                       )
                     });
                  })}
                </div>
             </div>

             {/* Task Rows */}
             <div className="relative w-full flex flex-col z-10">
                {filteredData.map((module) => (
                  <div key={module.id} className="flex border-b-[4px] border-slate-200 last:border-b-0 w-full relative">
                    
                    {/* Left Part - Sticky Left horizontally */}
                    <div className="w-[480px] flex-shrink-0 bg-white border-r border-slate-300 sticky left-0 z-[50] shadow-[2px_0_10px_rgba(0,0,0,0.05)] flex">
                      <div className="w-[140px] px-2 py-2 font-bold flex items-center bg-white border-r text-[12px] leading-tight flex-shrink-0">
                        {module.name}
                      </div>
                      <div className="flex-1 divide-y divide-slate-200 flex flex-col justify-start">
                        {module.tasks.map((task) => {
                          const isCompleted = task.isCompleted || false;
                          let bgClass = "bg-white";
                          let textClass = "text-slate-800";
                          let borderClass = "border-slate-200";
                          
                          if (isCompleted) {
                             bgClass = "bg-slate-300";
                             borderClass = "border-slate-400";
                             textClass = "text-slate-600";
                          } else {
                             if (task.type === 'purchase') { bgClass = 'bg-[#ffc000]'; borderClass = 'border-[#e6ad00]'; textClass = 'text-slate-900'; }
                             if (task.type === 'cutting') { bgClass = 'bg-teal-200'; borderClass = 'border-teal-400'; textClass = 'text-slate-900'; }
                             if (task.type === 'assembly') { bgClass = 'bg-[#ffff00]'; borderClass = 'border-[#e6e600]'; textClass = 'text-slate-900'; }
                             if (task.type === 'welding') { bgClass = 'bg-[#f4ce84]'; borderClass = 'border-[#e0b060]'; textClass = 'text-slate-900'; }
                             if (task.type === 'painting') { bgClass = 'bg-[#9bc2e6]'; borderClass = 'border-[#8eb2d4]'; textClass = 'text-slate-900'; }
                             if (task.type === 'shipment') { bgClass = 'bg-[#a9d08e]'; borderClass = 'border-[#96ba7f]'; textClass = 'text-slate-900'; }
                           }
     
                           return (
                           <div key={task.id} className="grid grid-cols-[160px_90px_90px] divide-x divide-slate-200 h-[30px] hover:bg-slate-50 transition-colors flex-shrink-0">
                             <div className={`px-2 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis flex items-center border-[1px] border-l-0 ${borderClass} font-medium ${bgClass} ${textClass} bg-opacity-70`} title={task.name}>
                               {task.name}
                             </div>
                            <div className="px-1 py-1 text-xs text-center flex items-center justify-center bg-white min-w-0 overflow-hidden">
                              <input 
                                type="date" 
                                className="w-full min-w-0 max-w-full text-center bg-transparent focus:outline-none font-mono text-[10px] text-slate-600 hover:bg-slate-100 p-1 rounded" 
                                value={task.correctionDate || ''}
                                onChange={(e) => updateCorrectionDate(task.id, e.target.value)}
                                placeholder="Y-M-D"
                              />
                            </div>
                            <div className="px-2 py-1 text-xs text-center flex items-center justify-center bg-white">
                               <button 
                                 onClick={() => toggleTaskCompletion(task.id)}
                                 className={`w-16 h-5 rounded flex items-center justify-center font-bold text-[10px] transition-colors border ${
                                   isCompleted 
                                     ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                                     : 'bg-slate-100 text-slate-400 border-slate-300 hover:bg-slate-200 hover:text-slate-600'
                                 }`}
                               >
                                 {isCompleted ? 'OK' : 'Waiting'}
                               </button>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>

                    {/* Right Part - Gantt Chart Canvas */}
                    <div className="relative flex flex-col justify-start bg-transparent flex-shrink-0 divide-y divide-slate-200" style={{ width: totalWidth }}>
                        {module.tasks.map((task) => {
                            const tStart = parseISODate(task.startDate);
                            const endTargetStr = task.correctionDate || task.endDate;
                            const tEnd = parseISODate(endTargetStr);
                            
                            const s = tStart <= tEnd ? tStart : tEnd;
                            const e = tStart <= tEnd ? tEnd : tStart;
                            
                            const isTaskInRange = s <= timelineEnd && e >= timelineStart;
                            if (!isTaskInRange) return <div key={task.id} className="h-[30px] hover:bg-slate-50/30 w-full flex-shrink-0" />;

                            const clampS = s < timelineStart ? timelineStart : s;
                            const clampE = e > timelineEnd ? timelineEnd : e;
                            
                            const sInfo = dayCoordMap.get(formatISO(clampS));
                            const eInfo = dayCoordMap.get(formatISO(clampE));
                            
                            if (!sInfo || !eInfo) return <div key={task.id} className="h-[30px] w-full flex-shrink-0" />;

                            let taskX = sInfo.x;
                            let taskWidth = (eInfo.x + eInfo.width) - taskX;

                            // Visual Styling
                            const isCompleted = task.isCompleted || false;
                            let bgClass = "bg-slate-400";
                            let borderClass = "border-slate-500";
                            let textClass = "text-slate-800";

                            if (isCompleted) {
                              bgClass = 'bg-slate-300';
                              borderClass = 'border-slate-400';
                              textClass = 'text-slate-600';
                            } else {
                              if (task.type === 'purchase') { bgClass = 'bg-[#ffc000]'; borderClass = 'border-[#e6ad00]'; textClass = 'text-slate-900'; }
                              if (task.type === 'cutting') { bgClass = 'bg-teal-200'; borderClass = 'border-teal-400'; textClass = 'text-slate-900'; }
                              if (task.type === 'assembly') { bgClass = 'bg-[#ffff00]'; borderClass = 'border-[#e6e600]'; textClass = 'text-slate-900'; }
                              if (task.type === 'welding') { bgClass = 'bg-[#f4ce84]'; borderClass = 'border-[#e0b060]'; textClass = 'text-slate-900'; }
                              if (task.type === 'painting') { bgClass = 'bg-[#9bc2e6]'; borderClass = 'border-[#8eb2d4]'; textClass = 'text-slate-900'; }
                              if (task.type === 'shipment') { bgClass = 'bg-[#a9d08e]'; borderClass = 'border-[#96ba7f]'; textClass = 'text-slate-900'; }
                            }

                            // Calculate Countdown Logic from real end target
                            const daysRemaining = differenceInDaysSigned(tEnd, currentDate);
                            const pastDue = !isCompleted && daysRemaining < 0;
                            const counterText = `${daysRemaining}`;

                            return (
                              <div key={task.id} className="h-[30px] relative group hover:bg-slate-50/50 transition-colors w-full flex-shrink-0">
                                    <div 
                                      className={`absolute top-[5px] h-[20px] shadow-sm rounded-[2px] border ${bgClass} ${borderClass} flex items-center justify-between font-bold text-[10px] ${textClass} focus:outline-none focus:ring-2 focus:ring-blue-400 z-10 transition-all cursor-pointer hover:shadow-md`}
                                      style={{ left: taskX, width: Math.max(taskWidth, 20) }}
                                      title={`${task.name}: ${task.startDate} to ${endTargetStr}`}
                                      onClick={() => toggleTaskCompletion(task.id)}
                                    >
                                      {task.type === 'shipment' ? (
                                         <div className="w-full flex justify-between px-1 h-full items-center relative overflow-hidden">
                                            <span>S</span>
                                            <div className="flex gap-1 items-center">
                                              <span>D</span>
                                              {isCompleted ? (
                                                <div className="flex bg-white/80 rounded-[2px] shadow-sm py-[1px] px-[2px] text-green-600">
                                                  <Check className="w-[10px] h-[10px]" strokeWidth={3} />
                                                </div>
                                              ) : (
                                                <div className={`px-1 rounded-[2px] bg-white/80 shadow-sm leading-none py-[2px] ${pastDue ? 'text-red-700 font-extrabold' : 'text-slate-800'}`}>
                                                   {counterText}
                                                </div>
                                              )}
                                            </div>
                                         </div>
                                      ) : (
                                        <div className="w-full flex justify-end px-1 items-center relative h-full">
                                          {isCompleted ? (
                                            <div className="flex bg-white/80 rounded-[2px] shadow-sm py-[1px] px-[2px] text-green-600">
                                              <Check className="w-[10px] h-[10px]" strokeWidth={3} />
                                            </div>
                                          ) : (
                                            <div className={`px-1 rounded-[2px] bg-white/80 shadow-sm leading-none py-[2px] ${pastDue ? 'text-red-700 font-extrabold' : 'text-slate-800'}`}>
                                              {counterText}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      
                                      <AnimatePresence>
                                         {celebration?.id === task.id && (
                                           <motion.div
                                              key={celebration.ts}
                                              initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
                                              animate={{ opacity: [1, 1, 0], y: [0, -50, -100], x: [0, 30, 60], scale: [0.8, 1.5, 1.5] }}
                                              exit={{ opacity: 0 }}
                                              transition={{ duration: 1.2, ease: "easeOut" }}
                                              className="absolute right-[-10px] top-[-15px] text-3xl pointer-events-none z-50 drop-shadow-md"
                                           >
                                              🚀
                                           </motion.div>
                                         )}
                                      </AnimatePresence>
                                    </div>
                              </div>
                            );
                        })}
                    </div>

                  </div>
                ))}
             </div>

             {/* Fill empty space with left grid lines */}
             <div className="flex-1 w-full flex bg-transparent flex-shrink-0 z-0 relative">
                <div className="w-[480px] sticky left-0 border-r border-slate-300 z-50 bg-white" style={{ backgroundImage: 'linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '100% 30px' }}>
                   <div className="w-full h-full grid grid-cols-[140px_160px_90px_90px] divide-x divide-slate-200 pointer-events-none">
                      <div /><div /><div /><div />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
