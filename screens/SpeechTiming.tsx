
import React from 'react';
import { Screen } from '../types';

const SpeechTiming: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Speech Timing</h1>
        <div className="size-10"></div>
      </header>

      <main className="p-6 space-y-8">
        <div className="text-center py-10">
          <h2 className="text-5xl font-black font-display tracking-tighter mb-4 text-orange-500">
            4-4-3-4-4-3-3-4-3-2-2
          </h2>
          <p className="text-slate-500 text-sm tracking-widest uppercase font-bold">The Public Forum Sequence</p>
        </div>

        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Speech Breakdown</h3>
           <div className="space-y-4">
              <TimelineItem 
                time="4m" 
                title="Constructives (Pro/Con)" 
                desc="Pure offense. Read your pre-written cases. Do not deviate."
                color="border-blue-500"
              />
              <TimelineItem 
                time="3m" 
                title="Crossfire" 
                desc="Clarification and trapping. First two speakers. AI targets 2:34."
                color="border-slate-700"
              />
              <TimelineItem 
                time="4m" 
                title="Rebuttals" 
                desc="Defense and counter-offense. Attack the opponent's constructive."
                color="border-orange-500"
              />
              <TimelineItem 
                time="3m" 
                title="Summary" 
                desc="Collapsing the debate. Focus on key 'Voters' only. AI targets 3:12 with 30s of frontlining."
                color="border-purple-500"
              />
              <TimelineItem 
                time="2m" 
                title="Final Focus" 
                desc="The narrative. Why you win the ballot. No new cards."
                color="border-emerald-500"
              />
           </div>
        </section>

        <div className="bg-[#192033] p-8 rounded-[40px] border border-white/5 space-y-6">
           <h3 className="text-lg font-bold font-display">Prep Time Strategy</h3>
           <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <span className="font-bold text-slate-300">Total Prep Time</span>
              <span className="text-xl font-black text-orange-500">3:00</span>
           </div>
        </div>
      </main>
    </div>
  );
};

const TimelineItem: React.FC<{ time: string; title: string; desc: string; color: string }> = ({ time, title, desc, color }) => (
  <div className={`flex gap-6 p-6 bg-[#192033] border-l-4 rounded-r-3xl border-white/5 ${color}`}>
    <div className="text-2xl font-black font-display opacity-40 shrink-0 w-12">{time}</div>
    <div>
      <h4 className="font-bold text-base mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default SpeechTiming;
