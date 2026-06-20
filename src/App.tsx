/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GanttChart } from './components/GanttChart';
import { Calendar, FileBarChart, MonitorPlay, Share2, Check } from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText('https://harmonogram-cas.vercel.app');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

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
        <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600">
               <Calendar className="w-4 h-4 text-slate-400" />
               <span>Today: {new Date().toISOString().slice(0, 10)}</span>
            </div>
            
            <button 
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 border cursor-pointer select-none ${
                copied 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
              }`}
            >
               {copied ? (
                 <>
                   <Check className="w-4 h-4" />
                   <span>Copied!</span>
                 </>
               ) : (
                 <>
                   <Share2 className="w-4 h-4" />
                   <span>Share</span>
                 </>
               )}
            </button>

            <button 
              onClick={() => window.open(window.location.href, '_blank')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors border border-blue-600 cursor-pointer"
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
