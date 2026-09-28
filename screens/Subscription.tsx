
import React from 'react';
import { Screen } from '../types';

interface SubscriptionProps {
  navigate: (s: Screen) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ navigate }) => {
  return (
    <div className="flex flex-col h-full bg-[#101522] text-white overflow-y-auto pb-32">
      <header className="sticky top-0 z-50 bg-[#101522]/90 backdrop-blur-md flex items-center justify-between p-4 px-6 border-b border-white/5">
        <button onClick={() => navigate('profile')} className="flex items-center justify-center size-10 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold font-display">Arbiter Access</h1>
        <div className="size-10"></div>
      </header>

      <main className="p-6 space-y-8 flex flex-col items-center text-center">
        <div className="pt-12 pb-6">
          <div className="size-24 bg-blue-600/10 rounded-[32px] flex items-center justify-center text-blue-500 mx-auto mb-6 border border-blue-600/20">
             <span className="material-symbols-outlined text-5xl">celebration</span>
          </div>
          <h2 className="text-4xl font-black font-display tracking-tight mb-2">Arbiter is Free</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            We've decided to unlock all premium features for everyone. Practice without limits.
          </p>
        </div>

        <div className="w-full max-w-md p-8 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-600/20">
          <h3 className="text-xl font-bold mb-6">Unlocked Features</h3>
          <ul className="space-y-4 text-left">
            <FeatureItem text="Unlimited AI Sparring Rounds" />
            <FeatureItem text="Unlimited Live Judging Sessions" />
            <FeatureItem text="Advanced Technical K-Strategies" />
            <FeatureItem text="Full Research Library Access" />
            <FeatureItem text="Priority Voice Synthesis" />
          </ul>
          <button 
            onClick={() => navigate('home')}
            className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold mt-8 shadow-lg active:scale-95 transition-all"
          >
            Start Practicing
          </button>
        </div>

        <div className="bg-[#192033] rounded-[32px] p-8 border border-white/5 w-full max-w-md">
           <h4 className="font-bold font-display mb-4">Why free?</h4>
           <p className="text-xs text-slate-400 leading-relaxed">
             Our mission is to democratize elite debate education. By making Arbiter free, we ensure that every student, regardless of their school's budget, can access world-class coaching.
           </p>
        </div>
      </main>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center gap-3 text-sm font-medium">
    <span className="material-symbols-outlined text-white bg-white/20 rounded-full p-0.5 text-[14px]">check</span>
    {text}
  </li>
);

export default Subscription;
