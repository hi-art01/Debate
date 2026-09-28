
import React, { useState } from 'react';
import { Screen } from '../types';

interface ForgotPasswordProps {
  onNavigate: (s: Screen) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send reset link to email
    setSubmitted(true);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display p-6">
      <header className="mb-12">
        <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-slate-500 font-bold">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Login
        </button>
      </header>

      <main className="max-w-md mx-auto w-full">
        {!submitted ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white" 
                  placeholder="orator@debate.edu" 
                  type="email" 
                />
              </div>
              <button 
                className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 transition-colors" 
                type="submit"
              >
                Send Instructions
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6 pt-12">
            <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
               <span className="material-symbols-outlined text-4xl">mark_email_read</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We've sent a password reset link to <span className="font-bold text-white">{email}</span>. Please check your inbox.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('login')}
              className="w-full bg-slate-800 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Return to Login
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ForgotPassword;
