
import React from 'react';
import { Screen } from '../types';

const Topicality: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Topicality Shells</h1>
        <div className="size-10"></div>
      </header>
      <main className="p-6 space-y-8">
        <div className="bg-emerald-600/10 p-8 rounded-3xl border border-emerald-600/20">
          <h2 className="text-2xl font-bold mb-4 text-emerald-500 font-display">Defining the Resolution</h2>
          <p className="text-slate-400 leading-relaxed text-sm">
            Topicality (T) is a technical argument that the Pro side is not debating the actual resolution as written.
          </p>
        </div>
        
        <section className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Structure of a T Shell</h3>
          <div className="space-y-3">
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">1. Interpretation</h4>
              <p className="text-xs text-slate-500">Your definition of a specific word in the topic (e.g., "Substantially").</p>
            </div>
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">2. Violation</h4>
              <p className="text-xs text-slate-500">Why their plan or case falls outside of that definition.</p>
            </div>
            <div className="p-5 bg-[#192033] rounded-2xl border border-white/5">
              <h4 className="font-bold text-white text-sm mb-1">3. Standards</h4>
              <p className="text-xs text-slate-500">Why your definition is better for the round (e.g., "Limits" or "Predictability").</p>
            </div>
          </div>
        </section>

        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 italic text-sm text-slate-300">
          "Judge, if they can define the resolution however they want, we can never be prepared. That makes the round uneducational."
        </div>
      </main>
    </div>
  );
};

export default Topicality;
