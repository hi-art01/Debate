
import React, { useState, useEffect } from 'react';
import { DebateStyle, DebateMode, Screen, TechnicalStrategy, UserAccount } from '../types';
import { fetchCurrentTopics, TopicInfo } from '../services/geminiService';

interface SetupProps {
  onStart: (style: DebateStyle, mode: DebateMode, topic: string, side: 'Pro' | 'Con', order: '1st' | '2nd', techStrat?: TechnicalStrategy) => void;
  navigate: (screen: Screen) => void;
  onWatchAd: () => void;
  user: UserAccount;
}

type SetupStep = 'mode' | 'topic' | 'role' | 'style' | 'techConfig';

const Setup: React.FC<SetupProps> = ({ onStart, navigate, user }) => {
  const [step, setStep] = useState<SetupStep>('mode');
  const [selectedStyle, setSelectedStyle] = useState<DebateStyle>(DebateStyle.LAY);
  const [selectedTechStrategy, setSelectedTechStrategy] = useState<TechnicalStrategy>('Substance');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<'Pro' | 'Con'>('Pro');
  const [selectedOrder, setSelectedOrder] = useState<'1st' | '2nd' | 'Random'>('1st');
  const [mode, setMode] = useState<DebateMode>('ai');
  const [topics, setTopics] = useState<TopicInfo[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    if (step === 'topic' && topics.length === 0) {
      setLoadingTopics(true);
      fetchCurrentTopics().then(data => {
        setTopics(data);
        const current = data.find(t => t.isCurrent) || data[0];
        if (current) setSelectedTopic(current.topic);
      }).catch(() => {
        const fallback = [
          { month: "CURRENT (ACTIVE)", topic: "The United States should substantially increase its military presence in the Arctic.", sources: [], isCurrent: true },
          { month: "NEXT MONTH (UPCOMING)", topic: "The United States should significantly increase domestic production of semiconductors.", sources: [], isCurrent: false }
        ];
        setTopics(fallback);
        setSelectedTopic(fallback[0].topic);
      }).finally(() => setLoadingTopics(false));
    }
  }, [step]);

  const STYLES = [
    { id: DebateStyle.LAY, title: 'Lay (Persuasive)', desc: 'Judging like a parent. Values clarity, persuasion, and logic.', icon: 'record_voice_over' },
    { id: DebateStyle.FLAY, title: 'Flay (Moderate)', desc: 'Judging like a coach. Values technical flow and impacts.', icon: 'balance' },
    { id: DebateStyle.TECHNICAL, title: 'Technical (Policy)', desc: 'Judging like a pro. Expects spreading, theory, and K.', icon: 'analytics' }
  ];

  const handleEnterArena = () => {
    let finalOrder: '1st' | '2nd' = selectedOrder === 'Random' ? (Math.random() > 0.5 ? '1st' : '2nd') : selectedOrder;
    onStart(selectedStyle, mode, selectedTopic, selectedSide, finalOrder, selectedTechStrategy);
  };

  const StepHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <header className="flex items-center px-4 py-8 justify-between sticky top-0 bg-[#101522]/95 backdrop-blur-md z-20 border-b border-white/5">
      <button onClick={onBack} className="flex size-10 items-center justify-start hover:text-blue-500 transition-colors">
        <span className="material-symbols-outlined text-white">arrow_back_ios</span>
      </button>
      <h2 className="text-base font-bold font-display text-white uppercase tracking-widest">{title}</h2>
      <div className="size-10"></div>
    </header>
  );

  if (step === 'mode') {
    return (
      <div className="flex flex-col h-full bg-[#101522]">
        <StepHeader title="Round Type" onBack={() => navigate('home')} />
        <main className="flex-1 px-6 pt-10 space-y-4">
          <ModeCard active={mode === 'ai'} icon="smart_toy" title="AI Sparring" desc="Practice line-by-line against a virtual opponent." onClick={() => setMode('ai')} />
          <ModeCard active={mode === 'full_round'} icon="history_edu" title="Full Round" desc="AI simulates both sides. Perfect for flow practice." onClick={() => setMode('full_round')} />
          <ModeCard active={mode === 'observer'} icon="podcasts" title="Live Judge" desc="AI listens to your real round and provides NSDA feedback." onClick={() => setMode('observer')} />
        </main>
        <div className="p-6 pb-12">
          <button onClick={() => setStep('topic')} className="w-full bg-blue-600 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/30 active:scale-95 transition-all">Select Topic</button>
        </div>
      </div>
    );
  }

  if (step === 'topic') {
    return (
      <div className="flex flex-col h-full bg-[#101522]">
        <StepHeader title="Resolution" onBack={() => setStep('mode')} />
        <main className="flex-1 px-6 pt-6 space-y-8 overflow-y-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-display text-white tracking-tight leading-none">Choose Debate</h1>
            <p className="text-sm text-slate-500 font-medium">Select current or upcoming NSDA resolution.</p>
          </div>

          {loadingTopics ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="size-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Accessing NSDA Feed...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((t, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedTopic(t.topic)}
                  className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all ${selectedTopic === t.topic ? 'border-blue-500 bg-blue-600/10' : 'border-white/10 bg-[#192033] hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.isCurrent ? 'text-blue-500' : 'text-amber-500'}`}>
                      {t.isCurrent ? 'Current Resolution' : 'Upcoming Resolution'}
                    </span>
                    {selectedTopic === t.topic && <span className="material-symbols-outlined text-blue-500 text-lg fill-1">check_circle</span>}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-relaxed">
                    {t.topic}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.month}</span>
                    {t.sources?.length > 0 && (
                      <div className="flex gap-2">
                        {t.sources.slice(0, 1).map((s, i) => (
                          <span key={i} className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">link</span>
                            Sources Available
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="p-6 bg-amber-500/5 rounded-[28px] border border-amber-500/10 mt-4">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Coach Note</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Resolutions are fetched directly from the official NSDA circuit feed. If you don't see the expected topic, check back after the 1st of the month.
                </p>
              </div>
            </div>
          )}
        </main>
        <div className="p-6 pb-12">
          <button 
            onClick={() => setStep(mode === 'ai' ? 'role' : 'style')} 
            disabled={!selectedTopic} 
            className="w-full bg-blue-600 py-4 rounded-2xl font-bold disabled:opacity-30 active:scale-95 transition-all"
          >
            {mode === 'ai' ? 'Configure Position' : (mode === 'full_round' ? 'Configure Style' : 'Configure Judge')}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'role') {
    return (
      <div className="flex flex-col h-full bg-[#101522]">
        <StepHeader title="Side & Order" onBack={() => setStep('topic')} />
        <main className="flex-1 px-6 pt-10 space-y-12">
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-600 tracking-[0.2em] uppercase">Your Position</h3>
            <div className="grid grid-cols-2 gap-4">
              <ChoiceButton label="Pro (Aff)" active={selectedSide === 'Pro'} onClick={() => setSelectedSide('Pro')} />
              <ChoiceButton label="Con (Neg)" active={selectedSide === 'Con'} onClick={() => setSelectedSide('Con')} />
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-600 tracking-[0.2em] uppercase">Speaking Order</h3>
            <div className="grid grid-cols-3 gap-3">
              <ChoiceButton label="1st" active={selectedOrder === '1st'} onClick={() => setSelectedOrder('1st')} />
              <ChoiceButton label="2nd" active={selectedOrder === '2nd'} onClick={() => setSelectedOrder('2nd')} />
              <ChoiceButton label="Random" active={selectedOrder === 'Random'} onClick={() => setSelectedOrder('Random')} />
            </div>
          </section>
        </main>
        <div className="p-6 pb-12">
          <button onClick={() => setStep('style')} className="w-full bg-blue-600 py-4 rounded-2xl font-bold active:scale-95 transition-all">Final Step</button>
        </div>
      </div>
    );
  }

  if (step === 'style') {
    return (
      <div className="flex flex-col h-full bg-[#101522]">
        <StepHeader title="Judge Level" onBack={() => setStep(mode === 'ai' ? 'role' : 'topic')} />
        <main className="flex-1 px-6 pt-6 space-y-4 overflow-y-auto">
          <h1 className="text-2xl font-bold font-display text-white mb-6">Who's Judging?</h1>
          {STYLES.map(s => (
            <button key={s.id} onClick={() => setSelectedStyle(s.id)} className={`w-full flex items-start gap-5 p-6 rounded-3xl border-2 transition-all text-left ${selectedStyle === s.id ? 'border-blue-600 bg-blue-600/10' : 'border-white/5 bg-[#192033]'}`}>
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedStyle === s.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}><span className="material-symbols-outlined">{s.icon}</span></div>
              <div><h3 className="font-bold text-lg text-white mb-1">{s.title}</h3><p className="text-xs text-slate-500 leading-relaxed font-medium">{s.desc}</p></div>
            </button>
          ))}
        </main>
        <div className="p-6 pb-12">
          <button onClick={() => { if (selectedStyle === DebateStyle.TECHNICAL) setStep('techConfig'); else handleEnterArena(); }} className="w-full bg-blue-600 py-4 rounded-2xl font-bold shadow-2xl shadow-blue-600/30 active:scale-95 transition-all uppercase tracking-widest text-sm">
            {selectedStyle === DebateStyle.TECHNICAL ? 'Configure Strategy' : 'Enter Arena'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#101522]">
      <StepHeader title="Technical Strategy" onBack={() => setStep('style')} />
      <main className="flex-1 px-6 pt-10 space-y-8">
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-600 tracking-[0.2em] uppercase">Debate Focus</h3>
          <div className="grid grid-cols-1 gap-4">
            <TechChoice active={selectedTechStrategy === 'Substance'} icon="data_object" title="Substance" desc="Standard flow-based technical debate." onClick={() => setSelectedTechStrategy('Substance')} />
            <TechChoice active={selectedTechStrategy === 'K (Kritik)'} icon="psychology_alt" title="Kritik (K)" desc="Argue against ethical/educational assumptions." onClick={() => setSelectedTechStrategy('K (Kritik)')} />
          </div>
        </section>
      </main>
      <div className="p-6 pb-12">
        <button onClick={handleEnterArena} className="w-full bg-blue-600 py-4 rounded-2xl font-bold shadow-2xl shadow-blue-600/30 active:scale-95 transition-all uppercase tracking-widest text-sm">Enter Arena</button>
      </div>
    </div>
  );
};

const TechChoice: React.FC<{ active: boolean; icon: string; title: string; desc: string; onClick: () => void }> = ({ active, icon, title, desc, onClick }) => (
  <button onClick={onClick} className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${active ? 'border-blue-600 bg-blue-600/10' : 'border-white/5 bg-[#192033]'}`}>
    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}><span className="material-symbols-outlined">{icon}</span></div>
    <div><span className="font-bold text-base block text-white">{title}</span><span className="text-xs text-slate-500">{desc}</span></div>
  </button>
);

const ModeCard: React.FC<{ active: boolean; icon: string; title: string; desc: string; onClick: () => void }> = ({ active, icon, title, desc, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-6 p-7 rounded-3xl border-2 transition-all text-left ${active ? 'border-blue-600 bg-blue-600/10' : 'border-white/5 bg-[#192033]'}`}>
    <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}><span className="material-symbols-outlined text-3xl">{icon}</span></div>
    <div><h3 className="font-bold text-xl text-white mb-1">{title}</h3><p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p></div>
  </button>
);

const ChoiceButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`py-4 rounded-2xl border-2 font-bold transition-all text-sm ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-white/5 bg-[#192033] text-slate-500'}`}>{label}</button>
);

export default Setup;
