
import React, { useState } from 'react';
import { UserAccount, Screen } from '../types';

interface LoginProps {
  onLogin: (user: UserAccount) => void;
  onNavigate: (s: Screen) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users: UserAccount[] = JSON.parse(localStorage.getItem('arbiter_users') || '[]');
    
    if (isSignUp) {
      if (users.find(u => u.email === email)) {
        setError('User already exists. Please log in.');
        return;
      }
      const newUser: UserAccount = {
        email,
        name,
        password, // In a real app, this would be hashed
        isPro: false,
        credits: 1, // Start with 1 free round
        totalRounds: 0
      };
      users.push(newUser);
      localStorage.setItem('arbiter_users', JSON.stringify(users));
      onLogin(newUser);
    } else {
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        onLogin(found);
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto font-display">
      <header className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <button className="flex items-center text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back_ios</span>
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="h-1 w-12 bg-slate-300 dark:bg-slate-700 rounded-full absolute left-1/2 -translate-x-1/2 top-2 opacity-20"></div>
      </header>

      <main className="flex-1 px-6 pb-12 max-w-md mx-auto w-full">
        <div className="pt-6 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-gold" style={{ fontSize: '28px' }}>rewarded_ads</span>
            <span className="text-gold font-semibold tracking-widest text-xs uppercase">Elite Division</span>
          </div>
          <h2 className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-tight">
            {isSignUp ? 'Join the Arena' : 'Welcome Back'}
          </h2>
          <h1 className="text-slate-900 dark:text-white text-4xl font-bold leading-tight mt-1">
            {isSignUp ? 'Create Account' : 'Log In'}
          </h1>
          {error && <p className="text-red-500 text-sm font-bold mt-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
        </div>

        <form className="space-y-5" onSubmit={handleAction}>
          {isSignUp && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                  placeholder="Cicero Augustus" 
                  type="text" 
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              <input 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                placeholder="orator@debate.edu" 
                type="email" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              {!isSignUp && (
                <button 
                  type="button"
                  onClick={() => onNavigate('forgot_password')}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
              <input 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                placeholder="••••••••" 
                type={showPassword ? 'text' : 'password'} 
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <button 
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 mt-4 transition-colors" 
            type="submit"
          >
            {isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary dark:text-blue-400 font-bold hover:underline ml-1"
            >
              {isSignUp ? 'Log In' : 'Create Account'}
            </button>
          </p>
        </div>
      </main>
      <div className="w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2 opacity-40"></div>
    </div>
  );
};

export default Login;
