
import React from 'react';
import { Screen } from '../types';

const ImpactCalc: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Impact Calculus</h1>
        <div className="size-10"></div>
      </header>
      <main className="p-6 space-y-8">
        <div className="bg-orange-600/10 p-8 rounded-3xl border border-orange-600/20">
          <h2 className="text-2xl font-bold mb-4 text-orange-500 font-display">Weighing the Round</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            In technical PF, impacts aren't just about size. You win by winning the comparison between your impacts and theirs using standard technical mechanisms.
          </p>
        </div>
        
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Weighing Mechanisms</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Magnitude</h4>
              <p className="text-xs text-slate-500 leading-relaxed">The total amount of impact. Quantify the absolute scale of the damage or benefit (e.g., $10B vs $100B).</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Severity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">The qualitative nature of the impact. Death is a higher severity than financial loss.</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Scope</h4>
              <p className="text-xs text-slate-500 leading-relaxed">How many people are affected? Is it existential or local? Quantify the breadth of the harm.</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Probability</h4>
              <p className="text-xs text-slate-500 leading-relaxed">How likely is the impact? A 100% chance of a small harm beats a 1% chance of a large one.</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Reversibility</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Can the impact be fixed? Death and climate tipping points are irreversible, making them higher priority.</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Pre-requisite</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Does your impact have to happen for theirs to even matter? (e.g., economy is a pre-req to solving poverty).</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Timeframe</h4>
              <p className="text-xs text-slate-500 leading-relaxed">How fast does it happen? Short-term suffering should often be addressed before long-term potential harms.</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white mb-2">Link In (We solve to)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Argue that your impact actually solves their link chain. You capture their offense by solving the root cause.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImpactCalc;
