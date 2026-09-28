
import React from 'react';
import { Screen } from '../types';

const LinkChains: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Link Chain Logic</h1>
        <div className="size-10"></div>
      </header>
      <main className="p-6 space-y-8">
        <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-600/20">
          <h2 className="text-2xl font-bold mb-4">Mastering Internal Links</h2>
          <p className="text-slate-400 leading-relaxed">
            A "Link Chain" is the series of causal arguments connecting your advocacy to an impact. If one link breaks, the entire contention fails.
          </p>
        </div>
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Technical Drill: The 5 Whys</h3>
          <div className="bg-[#192033] p-6 rounded-2xl border border-white/5">
            <p className="text-sm text-slate-300">
              For every claim (e.g., "The plan stops war"), you must explain exactly HOW. Ask "Why?" five times to find the deep internal warrants that opponents usually drop.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LinkChains;
