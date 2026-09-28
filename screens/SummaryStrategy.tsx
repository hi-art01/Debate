
import React, { useState } from 'react';
import { Screen } from '../types';

const SummaryStrategy: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Address opponent's strongest point first", checked: false },
    { id: 2, text: "Mention at least two weighing mechanisms", checked: false },
    { id: 3, text: "Extend warrants, not just the claim", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display tracking-tight">Summary Strategy</h1>
        <button className="flex items-center justify-center size-10 -mr-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined text-2xl">star</span>
        </button>
      </header>

      <main className="p-6 space-y-10">
        {/* Hero Section */}
        <section className="relative rounded-[32px] overflow-hidden aspect-[16/10] bg-slate-800 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600" 
            className="w-full h-full object-cover opacity-60" 
            alt="Debater"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <span className="bg-blue-600 self-start px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-3">
              Advanced Strategy
            </span>
            <h2 className="text-3xl font-black font-display tracking-tighter leading-tight">Mastering the Summary</h2>
          </div>
        </section>

        {/* Intro Text */}
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          The Summary is the most critical speech for narrowing the round. Your goal is to collapse on your best arguments, extend key warrants, and weigh your impacts to provide a clear path to the ballot.
        </p>

        {/* Core Strategies */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-500 fill-1">insights</span>
            <h3 className="text-xl font-bold font-display uppercase tracking-tight">Core Strategies</h3>
          </div>
          <div className="space-y-4">
            <StrategyCard 
              num="01"
              icon="track_changes"
              title="Collapsing"
              desc="Choose one clear path to victory. Drop redundant arguments to gain time for deep explanation."
            />
            <StrategyCard 
              num="02"
              icon="balance"
              title="Impact Weighing"
              desc="Use Magnitude, Probability, and Scope to explain why your impact matters more than theirs."
            />
          </div>
        </section>

        {/* Speech Structure */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display uppercase tracking-tight">Speech Structure</h3>
            <span className="bg-blue-600/20 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              3:00 Total
            </span>
          </div>
          <div className="space-y-1 relative">
             <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/5 z-0" />
             <StructureItem 
               num="1"
               title="Extension"
               time="0:30 mins"
               desc="Quickly answer opponent's rebuttal turns. Save time for your offense."
               progress={15}
             />
             <StructureItem 
               num="2"
               title="Defense and Offense"
               time="2:00 mins"
               desc="Extend your winning argument with full warrants and data from the Rebuttal while protecting your flow."
               progress={80}
             />
             <StructureItem 
               num="3"
               title="Weighing"
               time="0:30 mins"
               desc="Crystallize the round. Explain exactly why your impacts win under the framework."
               progress={20}
             />
          </div>
        </section>

        {/* Readiness Checklist */}
        <section className="space-y-6 pb-6">
          <h3 className="text-xl font-bold font-display uppercase tracking-tight">Readiness Checklist</h3>
          <div className="space-y-3">
            {checklist.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleCheck(item.id)}
                className={`p-5 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${item.checked ? 'bg-blue-600/10 border-blue-600/30' : 'bg-[#192033] border-white/5'}`}
              >
                <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-white/20'}`}>
                  {item.checked && <span className="material-symbols-outlined text-white text-base">check</span>}
                </div>
                <span className={`text-sm font-bold ${item.checked ? 'text-white' : 'text-slate-400'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Drill Button */}
        <button 
          onClick={() => navigate('arena')}
          className="w-full bg-blue-600 h-16 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40 active:scale-95 transition-all mb-10"
        >
          <span className="material-symbols-outlined text-white fill-1">play_circle</span>
          <span className="text-lg font-bold">Start Practice Drill</span>
        </button>
      </main>
    </div>
  );
};

const StrategyCard: React.FC<{ num: string; icon: string; title: string; desc: string }> = ({ num, icon, title, desc }) => (
  <div className="bg-[#192033] rounded-[24px] border border-white/5 p-8 relative overflow-hidden group hover:border-blue-600/30 transition-all">
    <div className="absolute top-8 right-8 text-[10px] font-black text-slate-700 uppercase tracking-widest">{num}</div>
    <div className="size-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
       <span className="material-symbols-outlined text-[28px] fill-1">{icon}</span>
    </div>
    <h4 className="text-xl font-bold mb-2">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const StructureItem: React.FC<{ num: string; title: string; time: string; desc: string; progress: number }> = ({ num, title, time, desc, progress }) => (
  <div className="relative pl-12 py-4 group">
    <div className="absolute left-2.5 top-6 size-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black z-10">
      {num}
    </div>
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-bold text-sm">{title}</h4>
      <span className="text-[10px] font-bold text-slate-600">{time}</span>
    </div>
    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{desc}</p>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
       <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default SummaryStrategy;
