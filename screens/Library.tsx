
import React, { useState } from 'react';
import { Screen, LibraryItem } from '../types';

const MOCK_ITEMS: LibraryItem[] = [
  {
    id: '0',
    category: 'Advanced Strategy',
    title: 'Mastering the Summary',
    readTime: '12 min read',
    description: 'Collapse, extend, and weigh your way to the ballot with elite summary skills.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400',
    screen: 'summary_strategy'
  },
  {
    id: '1',
    category: 'Analysis',
    title: 'Link Chain Logic',
    readTime: '15 min read',
    description: 'Master the internal link structures that connect your plan to existential impacts.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
    screen: 'linkchains'
  },
  {
    id: '2',
    category: 'Strategy',
    title: 'Impact Calculus',
    readTime: '10 min read',
    description: 'Magnitude, Probability, and Time-Frame: Winning the "Even If" scenario.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    screen: 'impactcalc'
  },
  {
    id: '3',
    category: 'Technical',
    title: 'K-Layering 101',
    readTime: '20 min read',
    description: 'How to deploy and answer philosophical critiques in technical PF rounds.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    screen: 'klayering'
  },
  {
    id: '4',
    category: 'Theory',
    title: 'Theory & Shells',
    readTime: '12 min read',
    description: 'Using technical rules of fairness to gain strategic advantages.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
    screen: 'theory101'
  },
  {
    id: '5',
    category: 'Technical',
    title: 'Topicality Shells',
    readTime: '18 min read',
    description: 'Master definitions and standard-violations to win on the flow.',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400',
    screen: 'topicality'
  },
  {
    id: '6',
    category: 'Analysis',
    title: 'Framing Contention',
    readTime: '14 min read',
    description: 'Winning the round before it starts by controlling the weighing framework.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
    screen: 'framing'
  }
];

interface LibraryProps {
  navigate: (screen: Screen) => void;
}

const Library: React.FC<LibraryProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32 bg-[#101522] text-white">
      <header className="sticky top-0 z-50 bg-[#101522]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between p-4 px-6">
          <button onClick={() => navigate('home')} className="flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold font-display uppercase tracking-widest">PF Master Library</h1>
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </button>
        </div>
      </header>

      <main className="p-6 space-y-10">
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Library Disclaimer</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            This repository is designed for <span className="text-amber-500 font-bold">beginners</span> and intermediate debaters. Note: Competitive debate meta evolves rapidly—always cross-reference these basics with current tournament norms.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-500">search</span>
          </div>
          <input className="block w-full pl-12 pr-4 py-4 bg-[#192033] border border-white/5 rounded-2xl leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm" placeholder="Search technical guides..." type="text" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display uppercase tracking-tight">Advanced PF Guides</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4">
            {MOCK_ITEMS.map(item => (
              <div 
                key={item.id} 
                onClick={() => item.screen && navigate(item.screen)}
                className="flex flex-col min-w-[280px] w-72 bg-[#192033] border border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-600/30 transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="w-full h-44 bg-slate-800 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.category}</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] font-bold text-slate-500">{item.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-2 font-display">{item.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold font-display uppercase tracking-tight mb-6">Foundations Repository</h2>
          <div className="flex flex-col gap-4">
            <RepoItem icon="casino" label="Coin Flip Strategy" desc="Winning the toss & optimal selections" color="text-amber-500" bg="bg-amber-500/10" onClick={() => navigate('coinflip')} />
            <RepoItem icon="groups" label="Grand Crossfire" desc="Controlling the 4-person chaos" color="text-blue-500" bg="bg-blue-500/10" onClick={() => navigate('grandcrossfire')} />
            <RepoItem icon="gavel" label="PF Evidence Rules" desc="Carding, citations & challenges" color="text-emerald-500" bg="bg-emerald-500/10" onClick={() => navigate('evidencerules')} />
            <RepoItem icon="schedule" label="PF Speech Timing" desc="Sequence of events breakdown" color="text-orange-500" bg="bg-orange-500/10" onClick={() => navigate('speechtiming')} />
            <RepoItem icon="format_list_bulleted" label="Flowing PF Rounds" desc="Notation systems & drop tracking" color="text-purple-500" bg="bg-purple-500/10" onClick={() => navigate('flowingstrategy')} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold font-display uppercase tracking-tight mb-6">Official Resources</h2>
          <a 
            href="https://www.speechanddebate.org/unified-manual/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-5 p-5 bg-blue-600/10 border border-blue-600/20 rounded-[32px] active:scale-[0.98] transition-transform cursor-pointer hover:bg-blue-600/20"
          >
            <div className="flex-shrink-0 size-12 rounded-2xl flex items-center justify-center bg-blue-600 text-white">
              <span className="material-symbols-outlined text-2xl fill-1">menu_book</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-base font-display text-white">NSDA Unified Manual</h4>
              <p className="text-sm text-slate-400 mt-0.5">The official rules and constitution for all speech and debate events.</p>
            </div>
            <span className="material-symbols-outlined text-blue-500">open_in_new</span>
          </a>
        </section>
      </main>
    </div>
  );
};

const RepoItem: React.FC<{ icon: string; label: string; desc: string; color: string; bg: string; onClick: () => void }> = ({ icon, label, desc, color, bg, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-5 p-5 bg-[#192033] border border-white/5 rounded-3xl active:scale-[0.98] transition-transform cursor-pointer hover:bg-white/[0.02]">
    <div className={`flex-shrink-0 size-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}><span className="material-symbols-outlined text-2xl fill-1">{icon}</span></div>
    <div className="flex-1"><h4 className="font-bold text-base font-display">{label}</h4><p className="text-sm text-slate-500 mt-0.5">{desc}</p></div>
    <span className="material-symbols-outlined text-slate-600">chevron_right</span>
  </div>
);

export default Library;
