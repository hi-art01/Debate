
import React from 'react';
import { Screen } from '../types';

const Framing: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Framing Contention</h1>
        <div className="size-10"></div>
      </header>
      <main className="p-6 space-y-8">
        <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-600/20">
          <h2 className="text-2xl font-bold mb-4 font-display">The Round Filter</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            Framing tells the judge *how* to evaluate the impacts. It's the lens through which every argument is viewed.
          </p>
        </div>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Common Frameworks</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-blue-500 mb-2">Utilitarianism (Util)</h4>
              <p className="text-xs text-slate-500">The greatest good for the greatest number. Prioritize the impact with the most lives saved.</p>
            </div>
            <div className="p-6 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-amber-500 mb-2">Structural Violence</h4>
              <p className="text-xs text-slate-500">Prioritize the impacts on the most marginalized populations, even if the raw number is smaller.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Technical Tip</h3>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-sm text-slate-300 leading-relaxed">
              If you win the framework, you usually win the round. Even if you lose a few arguments, if they don't matter under your framework, they don't hurt your ballot.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Framing;
