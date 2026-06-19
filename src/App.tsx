/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GanttChart } from './components/GanttChart';
import { Calendar, FileBarChart, MonitorPlay } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <FileBarChart className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none mb-1">CAS Project _ production schedule</h1>
          </div>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600">
               <Calendar className="w-4 h-4 text-slate-400" />
               <span>Today: {new Date().toISOString().slice(0, 10)}</span>
            </div>
            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
               <MonitorPlay className="w-4 h-4" /> Live View
            </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
         <div className="w-full h-full">
            <GanttChart />
         </div>
      </main>
    </div>
  );
}
