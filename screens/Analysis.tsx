
import React, { useState } from 'react';
import { Screen, DebateResult, SpeechSlotId } from '../types';

interface AnalysisProps {
  result: DebateResult | null;
  navigate: (screen: Screen) => void;
}

const Analysis: React.FC<AnalysisProps> = ({ result, navigate }) => {
  const [showTranscript, setShowTranscript] = useState(false);
  if (!result) return <div className="p-20 text-center">No data found.</div>;

  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (result.score / 100) * circumference;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate('home')} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold font-display">Debate Analysis</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <main className="flex flex-col px-4 pt-8">
        {/* Score Circle */}
        <section className="flex flex-col items-center gap-6 mb-8">
          <div className="relative flex items-center justify-center">
            <svg className="size-48">
              <circle className="text-slate-200 dark:text-slate-800" cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" />
              <circle 
                className="text-primary transition-all duration-1000 ease-out" 
                cx="96" cy="96" r="80" 
                stroke="currentColor" strokeWidth="12" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 96 96)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tighter">{result.score}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">out of 100</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold font-display">{result.rank} Debater</h3>
            <p className="text-slate-500 text-sm mt-1">{result.insights}</p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-3 gap-3 mb-8">
          <MetricBadge label="Structure" value={`${result.metrics.structure}%`} icon="account_tree" color="text-primary" />
          <MetricBadge label="Rebuttal" value={`${result.metrics.rebuttal}%`} icon="forum" color="text-orange-500" />
          <MetricBadge label="Evidence" value={`${result.metrics.evidence}%`} icon="verified" color="text-emerald-500" />
        </section>

        {/* AI Insight Card */}
        <section className="mb-8">
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 flex gap-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white">smart_toy</span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-primary font-display">AI Coach Insights</h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                "{result.insights}"
              </p>
            </div>
          </div>
        </section>

        {/* Highlighted Arguments */}
        <section className="space-y-4 mb-8">
          <h2 className="text-xl font-bold font-display">Review Key Arguments</h2>
          {result.argumentReview.map((arg, idx) => (
            <div key={idx} className="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 overflow-hidden">
              <div className="p-4">
                <p className="text-sm italic text-slate-600 dark:text-slate-400">"{arg.text}"</p>
              </div>
              <div className={`p-4 ${arg.type === 'strength' ? 'bg-emerald-500/10 border-t border-emerald-500/20' : 'bg-red-500/10 border-t border-red-500/20'}`}>
                <div className="flex items-start gap-2">
                  <span className={`material-symbols-outlined text-sm mt-0.5 ${arg.type === 'strength' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {arg.type === 'strength' ? 'check_circle' : 'warning'}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${arg.type === 'strength' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {arg.label}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-tight">{arg.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Detailed Metrics */}
        <section className="space-y-5 pb-10">
           <h3 className="text-lg font-bold font-display">Metric Breakdown</h3>
           <ProgressBar label="Vocab Diversity" value={result.metrics.vocabulary} />
           <ProgressBar label="Emotional Appeal (Pathos)" value={result.metrics.pathos} />
           <ProgressBar label="Logical Consistency (Logos)" value={result.metrics.logos} />
        </section>

        {/* Transcript Section */}
        {result.transcript && (
          <section className="mb-10">
            <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm">Round Transcript</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Review all speeches</p>
                </div>
              </div>
              <span className={`material-symbols-outlined transition-transform ${showTranscript ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {showTranscript && (
              <div className="mt-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {Object.entries(result.transcript).map(([id, text]) => (
                  <div key={id} className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-1">{id.replace('_', ' ')}</h5>
                    <div className="p-5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap select-text">
                      {text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 ios-blur bg-background-light/90 dark:bg-background-dark/90 border-t border-slate-200 dark:border-slate-800 flex gap-3 z-50">
        <button onClick={() => navigate('home')} className="flex-1 h-12 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">home</span>
          Dashboard
        </button>
        <button onClick={() => navigate('setup')} className="flex-[2] h-12 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[20px]">replay</span>
          Try Rematch
        </button>
      </div>
    </div>
  );
};

const MetricBadge: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-surface-dark p-4 border border-slate-200 dark:border-white/5">
    <span className={`material-symbols-outlined ${color}`}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    <span className="text-lg font-bold">{value}</span>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-bold">{value}/100</span>
    </div>
    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default Analysis;
