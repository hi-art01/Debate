
import React from 'react';
import { Screen } from '../types';

const Theory101: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Theory & Shells</h1>
        <div className="size-10"></div>
      </header>
      <main className="p-6 space-y-8">
        <div className="bg-emerald-600/10 p-8 rounded-3xl border border-emerald-600/20">
          <h2 className="text-2xl font-bold mb-4 text-emerald-500 font-display">Fairness & Education</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            Theory is a meta-argument that claims the opponent has violated a rule of the game, making the round unfair or uneducational. It serves as a check on abusive practices.
          </p>
        </div>
        
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">The Four Parts of a Shell</h3>
          <div className="space-y-3">
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">1. Interpretation</h4>
              <p className="text-xs text-slate-500">The specific rule you believe should be followed (e.g., 'Debaters must provide cut cards').</p>
            </div>
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">2. Violation</h4>
              <p className="text-xs text-slate-500">How the opponent broke that rule in this specific round.</p>
            </div>
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">3. Standards</h4>
              <p className="text-xs text-slate-500">Why your rule is good for the activity (Fairness, Education, Predictability).</p>
            </div>
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">4. Voters</h4>
              <p className="text-xs text-slate-500">Why the judge should vote on this. Usually 'Drop the team' as a deterrent for bad behavior.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Theory101;
