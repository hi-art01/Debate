
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { getDebateTip } from '../services/geminiService';

interface HomeProps {
  navigate: (screen: Screen) => void;
  fullName: string;
  hasActivity: boolean;
  elo: number;
  rank: string;
  winRate: number;
}

const Home: React.FC<HomeProps> = ({ navigate, fullName, hasActivity, elo, rank, winRate }) => {
  const [tip, setTip] = useState("Loading your daily strategy tip...");

  useEffect(() => {
    getDebateTip().then(setTip).catch(() => setTip("Focus on your framework early in the constructive."));
  }, []);

  const avatarSeed = hasActivity ? `${fullName}-varsity` : `${fullName}-novice`;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32 bg-[#101522]">
      <header className="sticky top-0 z-10 bg-[#101522]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="size-11 rounded-full border-2 border-blue-600 bg-cover bg-center"
            style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}')` }}
          />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">Competitor</p>
            <h1 className="text-xl font-bold font-display tracking-tight text-white">{fullName}</h1>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <div className="px-3 py-1 bg-blue-600/10 rounded-lg border border-blue-600/20">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{rank}</span>
           </div>
        </div>
      </header>

      <main className="px-6 space-y-8 pt-4">
        {/* Real-time stats */}
        <div className="flex gap-4 overflow-x-auto py-2 hide-scrollbar">
          <StatCard label="Current Rank" value={rank} />
          <StatCard label="Win Rate" value={`${winRate}%`} color={winRate > 50 ? "text-emerald-400" : "text-slate-500"} />
          <StatCard label="Elo Rating" value={elo.toLocaleString()} />
        </div>

        {/* Rank Progress Bar (Home Version) */}
        <section className="bg-[#192033] p-5 rounded-3xl border border-white/5">
           <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rank Progression</span>
             <span className="text-[10px] font-bold text-blue-500 uppercase">Track Wins</span>
           </div>
           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, (winRate > 0 ? (winRate / 1.5) : 5))}%` }} 
              />
           </div>
        </section>

        {/* Official NSDA Link Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 font-display text-white uppercase tracking-tight">
              <span className="material-symbols-outlined text-gold fill-1">gavel</span>
              NSDA Official Topics
            </h3>
          </div>
          
          <a 
            href="https://www.speechanddebate.org/topics/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-[#192033] border border-blue-600/10 p-6 rounded-[32px] group hover:border-blue-600/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-blue-500 text-[10px] font-black tracking-widest uppercase">Live Resolution Feed</span>
                <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Check Monthly Topics</span>
                <p className="text-xs text-slate-500 max-w-[200px]">Always stay updated with the latest Public Forum and Policy resolutions.</p>
              </div>
              <div className="size-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined">open_in_new</span>
              </div>
            </div>
          </a>
        </section>

        {/* Action Button */}
        <section>
          <button 
            onClick={() => navigate('setup')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-7 rounded-[32px] flex items-center justify-between group shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="bg-white/10 p-4 rounded-2xl">
                <span className="material-symbols-outlined text-[32px] fill-1">psychology</span>
              </div>
              <div className="text-left">
                <span className="block text-xl font-bold font-display tracking-tight">AI Sparring</span>
                <span className="text-white/60 text-xs font-medium">Practice your case against a pro</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[28px] opacity-40 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </section>

        {/* Daily Strategy */}
        <section className="space-y-4 pb-10">
          <h3 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Daily Strategy Tip</h3>
          <div className="bg-[#192033] border border-white/5 p-6 rounded-[28px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-6xl">format_quote</span>
             </div>
             <p className="text-slate-300 text-sm leading-relaxed italic relative z-10">
               "{tip}"
             </p>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className="flex-1 min-w-[130px] bg-[#192033] p-5 rounded-3xl border border-white/5 shadow-sm">
    <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500 font-black mb-1">{label}</p>
    <p className={`text-lg font-black font-display tracking-tight ${color || 'text-white'}`}>{value}</p>
  </div>
);

export default Home;
