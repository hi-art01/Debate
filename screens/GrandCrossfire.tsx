
import React from 'react';
import { Screen } from '../types';

const GrandCrossfire: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Grand Crossfire</h1>
        <div className="size-10"></div>
      </header>

      <main className="p-6 space-y-8">
        <div className="relative rounded-3xl overflow-hidden aspect-video bg-blue-600/20 border border-blue-600/30 p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
             <span className="material-symbols-outlined text-blue-500 text-4xl fill-1">groups</span>
             <h2 className="text-3xl font-black font-display tracking-tight leading-tight">Controlled Chaos</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
            The only 3 minutes where all four debaters interact. Strategy is everything.
          </p>
        </div>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">The 3 Pillars of GCF</h3>
          <div className="grid gap-4">
            <GCFCard 
              title="Team Coordination" 
              desc="Don't talk over your partner. Use hand signals or silent eye contact to determine who takes the next question."
              icon="hand_gesture"
            />
            <GCFCard 
              title="Direct Engagement" 
              desc="Avoid look-away responses. Address opponents directly but keep your eyes on the judge during the 'Impact' phase."
              icon="visibility"
            />
            <GCFCard 
              title="Agenda Control" 
              desc="The first question usually sets the pace. If you won the Summary, use GCF to cement your narrative."
              icon="assignment_turned_in"
            />
          </div>
        </section>

        <section className="bg-[#192033] rounded-[32px] p-8 border border-white/5">
           <h3 className="text-lg font-bold font-display mb-6">The Importance of Politeness</h3>
           <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
             "GCF is the most common place for debaters to lose speaker points. Aggression is fine, but interrupting without reason is a fatal error."
           </p>
           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="size-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-emerald-500 font-bold">check</span>
                 </div>
                 <p className="text-xs text-slate-300">Wait for your partner to finish their sentence before jumping in.</p>
              </div>
           </div>
        </section>

        <button onClick={() => navigate('arena')} className="w-full bg-blue-600 h-16 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">psychology</span>
          Practice GCF Responses
        </button>
      </main>
    </div>
  );
};

const GCFCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div className="p-6 bg-[#192033] border border-white/5 rounded-3xl flex gap-5">
    <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-blue-500 fill-1">{icon}</span>
    </div>
    <div>
      <h4 className="font-bold text-base mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default GrandCrossfire;
