
import React, { useState } from 'react';
import { Screen } from '../types';

interface TimerProps {
  navigate: (screen: Screen) => void;
  stopwatchMs: number;
  setStopwatchMs: (val: number | ((prev: number) => number)) => void;
  prepMs: number;
  setPrepMs: (val: number | ((prev: number) => number)) => void;
  isStopwatchRunning: boolean;
  setIsStopwatchRunning: (val: boolean) => void;
  isPrepRunning: boolean;
  setIsPrepRunning: (val: boolean) => void;
}

const Timer: React.FC<TimerProps> = ({ 
  navigate, 
  stopwatchMs, setStopwatchMs, 
  prepMs, setPrepMs, 
  isStopwatchRunning, setIsStopwatchRunning, 
  isPrepRunning, setIsPrepRunning 
}) => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'prep' | 'coin'>('prep');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<'Heads' | 'Tails' | null>(null);

  const formatTime = (totalMs: number) => {
    const totalSeconds = Math.floor(totalMs / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getMsDisplay = (totalMs: number) => {
    return Math.floor((totalMs % 1000) / 100);
  };

  const handleReset = () => {
    if (activeTab === 'stopwatch') {
      setIsStopwatchRunning(false);
      setStopwatchMs(0);
    } else if (activeTab === 'prep') {
      setIsPrepRunning(false);
      setPrepMs(180000);
    } else {
      setFlipResult(null);
    }
  };

  const handleFlip = () => {
    setIsFlipping(true);
    setFlipResult(null);
    setTimeout(() => {
      const res = Math.random() > 0.5 ? 'Heads' : 'Tails';
      setFlipResult(res);
      setIsFlipping(false);
    }, 1000);
  };

  const currentMs = activeTab === 'stopwatch' ? stopwatchMs : prepMs;
  const isCurrentRunning = activeTab === 'stopwatch' ? isStopwatchRunning : isPrepRunning;
  
  const toggleCurrent = () => {
    if (activeTab === 'stopwatch') setIsStopwatchRunning(!isStopwatchRunning);
    else setIsPrepRunning(!isPrepRunning);
  };

  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between max-w-md mx-auto mb-8">
          <button onClick={() => navigate('home')} className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">UTILITIES</h1>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </button>
        </div>
        
        {/* Segmented Control */}
        <div className="flex p-1.5 bg-[#192033]/50 rounded-2xl max-w-sm mx-auto">
          <button 
            onClick={() => setActiveTab('stopwatch')}
            className={`flex-1 py-3 text-[11px] font-bold rounded-xl transition-all ${activeTab === 'stopwatch' ? 'bg-[#0f3bbd] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Stopwatch
          </button>
          <button 
            onClick={() => setActiveTab('prep')}
            className={`flex-1 py-3 text-[11px] font-bold rounded-xl transition-all ${activeTab === 'prep' ? 'bg-[#0f3bbd] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            3-Min Prep
          </button>
          <button 
            onClick={() => setActiveTab('coin')}
            className={`flex-1 py-3 text-[11px] font-bold rounded-xl transition-all ${activeTab === 'coin' ? 'bg-[#0f3bbd] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Coin Flip
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {activeTab !== 'coin' ? (
          <div className="flex flex-col items-center w-full">
            <div className="text-center mb-24">
              <div className="text-[7.5rem] font-light leading-none tracking-tighter opacity-90 font-mono inline-flex items-baseline">
                {formatTime(currentMs)}
                <span className="text-4xl font-medium opacity-40 ml-1">.{getMsDisplay(currentMs)}</span>
              </div>
            </div>

            <div className="w-full max-w-[320px] flex flex-col items-center gap-10">
              <button 
                onClick={toggleCurrent}
                className={`w-full py-6 rounded-full border-2 font-bold text-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  isCurrentRunning 
                  ? 'border-red-600/60 bg-red-600/5 text-blue-500' 
                  : 'border-blue-600/60 bg-blue-600/5 text-blue-500'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl ${isCurrentRunning ? 'fill-1' : ''}`}>
                  {isCurrentRunning ? 'pause' : 'play_arrow'}
                </span>
                {isCurrentRunning ? 'Pause' : 'Start'}
              </button>

              <button 
                onClick={handleReset}
                className="text-sm font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Reset Timer
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-sm space-y-12">
            <div className="text-center">
              <p className="text-slate-500 text-[11px] font-black tracking-[0.25em] uppercase mb-12">
                {flipResult ? `RESULT: ${flipResult}` : 'DECIDE SIDE/ORDER'}
              </p>
            </div>
            <div className="relative size-48">
               <div className={`w-full h-full rounded-full bg-gradient-to-tr from-[#0f3bbd] to-blue-400 border-8 border-white/10 flex items-center justify-center transition-all duration-500 ${isFlipping ? 'animate-bounce' : ''}`}>
                  <span className="text-white text-5xl font-black font-display uppercase tracking-tighter">
                    {isFlipping ? '?' : (flipResult ? flipResult[0] : 'PF')}
                  </span>
               </div>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={handleFlip}
                disabled={isFlipping}
                className="w-full bg-[#0f3bbd] hover:bg-blue-700 text-white font-bold h-16 rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">casino</span>
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Timer;
