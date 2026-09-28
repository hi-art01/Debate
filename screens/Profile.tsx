
import React from 'react';
import { Screen } from '../types';

interface ProfileProps {
  navigate: (screen: Screen) => void;
  fullName: string;
  isPro: boolean;
  onLogout: () => void;
  stats: {
    won: number;
    total: number;
    avgLogic: number;
    elo: number;
    rank: string;
    history: Array<{ title: string; time: string; status: 'WIN' | 'LOSS'; type: string }>;
  };
}

const Profile: React.FC<ProfileProps> = ({ navigate, fullName, stats, onLogout }) => {
  const hasActivity = stats.total > 0;
  const avatarSeed = `${fullName}-varsity`;

  const ranks = [
    { name: "Novice", min: 0 },
    { name: "Junior Varsity", min: 2 },
    { name: "Varsity", min: 5 },
    { name: "Elite", min: 10 },
    { name: "National Circuit", min: 20 }
  ];

  const nextRank = ranks.find(r => r.min > stats.won) || { name: "GOAT", min: stats.won };
  const prevRankMin = ranks.reverse().find(r => r.min <= stats.won)?.min || 0;
  ranks.reverse(); // put it back
  
  const progress = nextRank.name === "GOAT" 
    ? 100 
    : ((stats.won - prevRankMin) / (nextRank.min - prevRankMin)) * 100;

  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6">
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[28px]">settings</span>
        </button>
        <h1 className="text-xl font-bold font-display">Competitor Profile</h1>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[28px]">share</span>
        </button>
      </header>

      <main className="flex-1 px-6">
        <div className="flex flex-col items-center pt-8 pb-8">
          <div className="relative">
            <div className="size-28 rounded-full border-[3px] border-[#252a41] p-1.5 bg-[#192033]">
              <img alt="Profile" className="w-full h-full rounded-full object-cover" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} />
            </div>
            <div className="absolute bottom-1 right-1 bg-blue-600 size-7 rounded-full flex items-center justify-center border-[3px] border-[#101522]">
              <span className="material-symbols-outlined text-white text-[16px] fill-1">verified</span>
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold font-display tracking-tight">{fullName}</h2>
          <div className="mt-3 px-6 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/40">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em]">
              {stats.rank}
            </span>
          </div>
        </div>

        {/* Rank Progression Card */}
        <section className="bg-[#192033] rounded-[32px] border border-white/5 p-6 mb-8">
          <div className="flex justify-between items-end mb-4">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Milestone</p>
                <h3 className="text-xl font-bold font-display">{nextRank.name}</h3>
             </div>
             <p className="text-xs font-bold text-blue-500">
                {nextRank.name === "GOAT" ? "Max Level" : `${nextRank.min - stats.won} more wins`}
             </p>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
             <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }} 
             />
          </div>
          <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
             <span>{stats.rank}</span>
             <span>{nextRank.name}</span>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatBox value={stats.won.toString()} label="DEBATES WON" color="text-blue-500" />
          <StatBox value={stats.total.toString()} label="TOTAL ROUNDS" />
          <StatBox value={hasActivity ? stats.elo.toLocaleString() : "1,000"} label="ELO RATING" color="text-emerald-400" />
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold font-display">Recent Activity</h3>
            {hasActivity && <button className="text-sm font-bold text-blue-500">View History</button>}
          </div>
          <div className="space-y-4">
            {hasActivity ? (
              stats.history.map((h, i) => (
                <ActivityItem key={i} title={h.title} time={h.time} status={h.status} type={h.type} />
              ))
            ) : (
              <div className="bg-[#192033] rounded-[24px] border border-white/5 p-8 flex flex-col items-center justify-center text-center opacity-40">
                <span className="material-symbols-outlined text-4xl mb-3">history</span>
                <p className="text-sm font-medium text-slate-400">No rounds recorded yet.<br/>Enter the arena to start your legacy.</p>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-center pb-12">
          <button onClick={onLogout} className="flex items-center gap-2 text-red-500 font-bold hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

const StatBox: React.FC<{ value: string; label: string; color?: string }> = ({ value, label, color }) => (
  <div className="bg-[#192033] border border-white/5 rounded-[24px] p-5 flex flex-col items-center justify-center">
    <span className={`text-2xl font-black font-display ${color || 'text-white'}`}>{value}</span>
    <span className="text-[8px] uppercase tracking-[0.1em] font-black text-slate-500 mt-2 text-center leading-tight">{label}</span>
  </div>
);

const ActivityItem: React.FC<{ title: string; time: string; status: 'WIN' | 'LOSS'; type: string }> = ({ title, time, status, type }) => (
  <div className="flex items-center gap-4 p-5 bg-[#192033] border border-white/5 rounded-[24px]">
    <div className={`size-12 rounded-2xl flex items-center justify-center ${status === 'WIN' ? 'bg-blue-600/10 text-blue-500' : 'bg-orange-600/10 text-orange-500'}`}>
      <span className="material-symbols-outlined text-2xl font-bold">{status === 'WIN' ? 'trending_up' : 'trending_down'}</span>
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-base">{title}</h4>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[11px] font-medium text-slate-500">{time}</span>
        <span className={`text-[11px] font-black ${status === 'WIN' ? 'text-emerald-400' : 'text-orange-500'}`}>{status}</span>
      </div>
    </div>
    <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-500 tracking-wider">{type}</div>
  </div>
);

export default Profile;
