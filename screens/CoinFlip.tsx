
import React, { useState } from 'react';
import { Screen } from '../types';

interface CoinFlipProps {
  navigate: (screen: Screen) => void;
}

const CoinFlip: React.FC<CoinFlipProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'side' | 'order'>('side');
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Verify judge paradigms & biases', checked: true },
    { id: 2, text: 'Confirm side preference with partner', checked: true },
    { id: 3, text: 'Check technical setup & flowsheet', checked: false },
    { id: 4, text: 'Scout opponent\'s previous flip trends', checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a14] text-white overflow-y-auto pb-10">
      <header className="sticky top-0 z-50 bg-[#0a0a14]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Coin Flip Strategy</h1>
        <button className="flex items-center justify-center size-10 -mr-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined text-amber-500 fill-1">info</span>
        </button>
      </header>

      <main className="p-6 space-y-6">
        {/* Master Class Hero */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-b from-[#1a1a3a] to-[#0a0a14] border border-white/5 p-8 flex flex-col justify-end">
          <div className="absolute top-8 left-8">
             <span className="bg-amber-500/20 text-amber-500 text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-md border border-amber-500/30 uppercase">
                Master Class
             </span>
          </div>
          <div className="absolute top-8 right-8 w-32 h-32 opacity-80 rotate-12">
            <img src="https://images.unsplash.com/photo-1619410283995-43d9134e7656?auto=format&fit=crop&q=80&w=200" alt="Coin" className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>
          <h2 className="text-4xl font-black font-display mb-2 leading-tight tracking-tight">The Art of the Flip</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">
            Winning the flip is your first strategic advantage in Public Forum.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex p-1 bg-white/5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('side')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'side' ? 'bg-primary text-white' : 'text-slate-500'}`}
          >
            Picking Side
          </button>
          <button 
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'order' ? 'bg-primary text-white' : 'text-slate-500'}`}
          >
            Picking Order
          </button>
        </div>

        {/* Pro vs Con Advantages */}
        <div className="bg-[#16162a] rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-primary fill-1">groups</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display">Pro vs. Con Advantages</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pro typically advocates for "try or die" scenarios where the plan is essential. Neg (Con) defends the status quo or warns that the plan leads to something worse.
              </p>
              <button className="text-primary text-sm font-bold flex items-center gap-1 pt-1">
                <span className="material-symbols-outlined text-sm">bar_chart</span>
                View Resolution Stats
              </button>
            </div>
          </div>
        </div>

        {/* Pro-Tip Box */}
        <div className="bg-gradient-to-br from-[#1c1c3c] to-[#0a0a14] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-amber-500 text-xl fill-1">lightbulb</span>
            <span className="text-[10px] font-bold text-amber-500 tracking-[0.2em] uppercase">Debater Pro-Tip</span>
          </div>
          <p className="text-lg italic font-medium leading-relaxed text-slate-200">
            "Always pick second unless you are running a K or theory."
          </p>
        </div>

        {/* Checklist */}
        <div className="bg-[#16162a] rounded-2xl p-6 border border-white/5 space-y-5">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary fill-1">fact_check</span>
             </div>
             <h3 className="text-lg font-bold font-display">Pre-Round Checklist</h3>
          </div>
          <div className="space-y-4">
            {checklist.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleCheck(item.id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-primary/50'}`}>
                  {item.checked && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                </div>
                <span className={`text-sm font-medium ${item.checked ? 'text-white' : 'text-slate-400'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario Logic */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Scenario Logic</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Scenario A</span>
              <p className="text-xs font-bold leading-tight">If Judge is "Lay", always pick 2ND Order.</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">Scenario B</span>
              <p className="text-xs font-bold leading-tight">If Judge is "Technical", pick side if running K/Theory.</p>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <button className="w-full bg-primary hover:bg-blue-700 h-16 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/40 active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-2xl">casino</span>
          <span className="text-lg font-bold">Practice Random Flip</span>
        </button>
      </main>
    </div>
  );
};

export default CoinFlip;
