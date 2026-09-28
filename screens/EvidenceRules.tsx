
import React, { useState } from 'react';
import { Screen } from '../types';

const EvidenceRules: React.FC<{ navigate: (s: Screen) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('Paraphrase');
  const [expandedSection, setExpandedSection] = useState<string | null>('request');

  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-10 font-sans">
      <header className="sticky top-0 z-50 bg-[#101522] flex items-center justify-between p-4 px-6">
        <button onClick={() => navigate('library')} className="flex items-center justify-center size-10">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">PF Evidence Rules</h1>
        <button className="flex items-center justify-center size-10">
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </header>

      <div className="px-4 mb-8">
        <div className="flex p-1 bg-[#192033] rounded-xl border border-white/5">
          {['Paraphrase', 'Quotes', 'NSDA Rules'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab ? 'bg-[#252a41] text-white' : 'text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 space-y-8">
        <section>
          <h2 className="text-3xl font-bold font-display tracking-tight mb-4">Handling Evidence</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Public Forum rules require that all evidence, whether paraphrased or quoted, must be available in its 
            original form during the round. Failure to provide text can result in the evidence being disregarded.
          </p>
        </section>

        <div className="bg-[#0f172a] border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-500 fill-1">lightbulb</span>
            <span className="text-[11px] font-black text-blue-500 tracking-[0.15em] uppercase">CITATION CHECKER PRO-TIP</span>
            <div className="ml-auto opacity-40">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">
            Always verify <span className="text-white font-bold">Author Qualifications</span>. NSDA rules emphasize that the credibility of the source is as important as the data itself. If an opponent can't name the author's credentials, use it to challenge the evidence weight.
          </p>
        </div>

        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">STANDARD PROTOCOLS</h3>
          
          <div className="space-y-3">
            <ProtocolItem 
              id="request" 
              icon="content_paste_search" 
              label="How to Request a Card" 
              expanded={expandedSection === 'request'}
              onClick={() => setExpandedSection(expandedSection === 'request' ? null : 'request')}
              content={
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    In-between speeches, clearly state the author and year. The opponent must provide the full text of the evidence within a reasonable timeframe (usually under 1 minute).
                  </p>
                  <div className="p-4 bg-blue-600/10 border-l-4 border-blue-600 rounded-r-xl italic">
                    <p className="text-xs text-slate-300">
                      "May I see the Smith 2023 card regarding climate migration? I need to see the full paragraph including the citation."
                    </p>
                  </div>
                </div>
              }
            />
            <ProtocolItem 
              id="transparency" 
              icon="visibility" 
              label="Evidence Transparency" 
              expanded={expandedSection === 'transparency'} 
              onClick={() => setExpandedSection(expandedSection === 'transparency' ? null : 'transparency')}
              content={
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Transparency means being able to show exactly where your data came from. This includes having the full URL and author bio ready if challenged.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                    <li>Card must include full citation.</li>
                    <li>No "shadow" paraphrasing.</li>
                    <li>Links must be clickable and live.</li>
                  </ul>
                </div>
              }
            />
            <ProtocolItem 
              id="authors" 
              icon="school" 
              label="Author Qualifications" 
              expanded={expandedSection === 'authors'} 
              onClick={() => setExpandedSection(expandedSection === 'authors' ? null : 'authors')}
              content={
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    A source from a PhD in Economics at Harvard carries more weight than a random blog post.
                  </p>
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-xs text-emerald-500 font-bold uppercase mb-1">Winning Strategy</p>
                    <p className="text-[11px] text-slate-300 italic">"Indict their author: Why should we trust a political journalist on a purely scientific claim?"</p>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-lg">compare_arrows</span>
            <h3 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">Rule Comparison</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pb-4">
            <div className="bg-[#192033] border border-white/5 rounded-[28px] p-6 space-y-3">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block">PARAPHRASING</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Must accurately represent the original author's intent. Must have the source text ready to present immediately.
              </p>
            </div>
            <div className="bg-[#192033] border border-white/5 rounded-[28px] p-6 space-y-3">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block">DIRECT QUOTES</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Requires word-for-word accuracy. Any ellipses must not change the meaning of the original passage.
              </p>
            </div>
          </div>
        </section>

        <button className="w-full bg-blue-600 h-16 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 mb-4">
          <span className="material-symbols-outlined text-2xl">download</span>
          <span className="text-base font-bold">Download NSDA Official Handbook</span>
        </button>

        <div className="text-center pb-8 opacity-40">
          <span className="text-[10px] font-bold tracking-widest uppercase">LAST UPDATED: SEPTEMBER 2024</span>
        </div>
      </main>
    </div>
  );
};

const ProtocolItem: React.FC<{ id: string; icon: string; label: string; expanded: boolean; onClick: () => void; content?: React.ReactNode }> = ({ icon, label, expanded, onClick, content }) => (
  <div className="bg-[#192033] border border-white/5 rounded-2xl overflow-hidden">
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 text-left">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-blue-500 text-xl">{icon}</span>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <span className={`material-symbols-outlined text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
    </button>
    {expanded && content && <div className="px-5 pb-5">{content}</div>}
  </div>
);

export default EvidenceRules;
