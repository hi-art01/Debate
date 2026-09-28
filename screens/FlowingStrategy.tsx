
import React from 'react';
import { Screen } from '../types';

const FlowingStrategy: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Flowing Strategy</h1>
        <div className="size-10"></div>
      </header>

      <main className="p-6 space-y-8">
        <div className="relative rounded-[40px] overflow-hidden bg-purple-600/10 border border-purple-600/30 p-10 flex flex-col items-center">
          <div className="size-20 rounded-3xl bg-purple-500/20 flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-purple-500 text-5xl fill-1">format_list_bulleted</span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight mb-2">The Flowsheet</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs text-center">
            Your map of the debate. If it's not on the flow, it didn't happen.
          </p>
        </div>

        <section className="space-y-6">
           <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Visual Systems</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#192033] p-5 rounded-3xl border border-white/5">
                 <h4 className="font-bold text-sm mb-3">Vertical Flow</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   Best for speed rounds. Allows for more detailed notation of sub-points.
                 </p>
              </div>
              <div className="bg-[#192033] p-5 rounded-3xl border border-white/5">
                 <h4 className="font-bold text-sm mb-3">Horizontal Flow</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   Classic system. Easy to track "Drops" across the columns.
                 </p>
              </div>
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Notation Legend</h3>
           <div className="bg-[#192033] rounded-[32px] overflow-hidden border border-white/5">
              <LegendRow symbol="?" label="Question / Crossfire" />
              <LegendRow symbol="↓" label="Extended / Carried Through" />
              <LegendRow symbol="X" label="Drop (Opponent ignored)" />
              <LegendRow symbol="→" label="Dropped (You didn't extend)" />
              <LegendRow symbol="!" label="Impact / Voter" />
              <LegendRow symbol="->" label="Link / Connection" />
              <LegendRow symbol="~" label="Framework Conflict" />
           </div>
        </section>

        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-[40px] border border-white/10">
           <h4 className="font-bold text-lg mb-4">The "Drop" Rule</h4>
           <p className="text-sm text-slate-300 leading-relaxed">
             If your opponent "drops" (fails to address) a specific argument in their Rebuttal or Summary, you must point it out to the judge in your next speech. 
             <br/><br/>
             <span className="font-black italic text-white">"Judge, they dropped the economic impact of C1, which means you should flow that impact through to our side automatically."</span>
           </p>
        </div>
      </main>
    </div>
  );
};

const LegendRow: React.FC<{ symbol: string; label: string }> = ({ symbol, label }) => (
  <div className="flex items-center gap-6 p-5 border-b border-white/5 last:border-0">
    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-purple-500 font-mono text-lg shrink-0">
      {symbol}
    </div>
    <span className="text-sm font-bold text-slate-300">{label}</span>
  </div>
);

export default FlowingStrategy;
