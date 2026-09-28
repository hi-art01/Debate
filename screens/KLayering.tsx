
import React from 'react';
import { Screen } from '../types';

const KLayering: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">K-Layering 101</h1>
        <div className="size-10"></div>
      </header>
      <main className="p-6 space-y-8">
        <div className="bg-purple-600/10 p-8 rounded-3xl border border-purple-600/20">
          <h2 className="text-2xl font-bold mb-4 text-purple-500">The Kritik in PF</h2>
          <p className="text-slate-400 leading-relaxed">
            "K-Layering" is about winning the debate before the judge even looks at the resolution. You attack the assumptions of the round itself.
          </p>
        </div>
        <div className="space-y-4">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">The Four Parts of a K</h3>
           <ol className="space-y-3">
             <li className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300">1. Links: How their case uses harmful assumptions.</li>
             <li className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300">2. Impacts: Why those assumptions lead to real-world harm.</li>
             <li className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300">3. Alternative: A different way of thinking or acting.</li>
             <li className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-300">4. Framing: Why the judge should prioritize the K over the flow.</li>
           </ol>
        </div>
      </main>
    </div>
  );
};

export default KLayering;
