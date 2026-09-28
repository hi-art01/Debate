
import React, { useState, useEffect } from 'react';
// Fix: Corrected import path to parent directory for types
import { Screen, DebateStyle, DebateResult, DebateMode, TechnicalStrategy, UserAccount } from '../types';
// Fix: Corrected relative import paths for neighbor screens
import Home from './Home';
import Library from './Library';
import Timer from './Timer';
import Profile from './Profile';
import Arena from './Arena';
import Setup from './Setup';
import Analysis from './Analysis';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import CoinFlip from './CoinFlip';
import GrandCrossfire from './GrandCrossfire';
import EvidenceRules from './EvidenceRules';
import SpeechTiming from './SpeechTiming';
import FlowingStrategy from './FlowingStrategy';
import Subscription from './Subscription';
import LinkChains from './LinkChains';
import ImpactCalc from './ImpactCalc';
import KLayering from './KLayering';
import Theory101 from './Theory101';
import Topicality from './Topicality';
import Framing from './Framing';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('arbiter_current_user');
    if (savedEmail) {
      const users: UserAccount[] = JSON.parse(localStorage.getItem('arbiter_users') || '[]');
      const found = users.find(u => u.email === savedEmail);
      if (found) {
        setUser({ ...found, isPro: true }); 
        setCurrentScreen('home');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const users: UserAccount[] = JSON.parse(localStorage.getItem('arbiter_users') || '[]');
      const updatedUsers = users.map(u => u.email === user.email ? user : u);
      localStorage.setItem('arbiter_users', JSON.stringify(updatedUsers));
      localStorage.setItem('arbiter_current_user', user.email);
    }
  }, [user]);

  const [selectedStyle, setSelectedStyle] = useState<DebateStyle>(DebateStyle.LAY);
  const [selectedTechStrategy, setSelectedTechStrategy] = useState<TechnicalStrategy>('Substance');
  const [selectedMode, setSelectedMode] = useState<DebateMode>('ai');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<'Pro' | 'Con'>('Pro');
  const [selectedOrder, setSelectedOrder] = useState<'1st' | '2nd'>('1st');
  const [lastResult, setLastResult] = useState<DebateResult | null>(null);

  const [stats, setStats] = useState({
    won: 0,
    total: 0,
    avgLogic: 0,
    elo: 1000,
    history: [] as Array<{ title: string; time: string; status: 'WIN' | 'LOSS'; type: string }>
  });

  const getRank = (wins: number) => {
    if (wins < 2) return "Novice";
    if (wins < 5) return "Junior Varsity";
    if (wins < 10) return "Varsity";
    if (wins < 20) return "Elite";
    return "National Circuit";
  };

  const currentRank = getRank(stats.won);
  const winRate = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;

  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [prepMs, setPrepMs] = useState(180000);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [isPrepRunning, setIsPrepRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isStopwatchRunning || isPrepRunning) {
      interval = setInterval(() => {
        if (isStopwatchRunning) setStopwatchMs(s => s + 100);
        if (isPrepRunning) setPrepMs(s => (s > 0 ? s - 100 : 0));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning, isPrepRunning]);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleLogin = (loggedUser: UserAccount) => {
    setUser({ ...loggedUser, isPro: true }); 
    navigate('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('arbiter_current_user');
    setUser(null);
    navigate('login');
  };

  const handleFinishDebate = (result: DebateResult) => {
    if (selectedMode === 'full_round') {
      setLastResult(result);
      navigate('analysis');
      return;
    }
    const isWin = result.score >= 50;
    let eloChange = isWin ? Math.round(15 + (result.score - 50) * 0.7) : -12;

    setStats(prev => {
      const newTotal = prev.total + 1;
      const newWon = prev.won + (isWin ? 1 : 0);
      const newElo = Math.max(800, prev.elo + eloChange);
      const newAvgLogic = Math.round(((prev.avgLogic * prev.total) + result.metrics.logos) / newTotal);
      return {
        won: newWon,
        total: newTotal,
        avgLogic: newAvgLogic,
        elo: newElo,
        history: [{
          title: selectedMode === 'ai' ? `Sparring (${selectedSide})` : "Live Judge",
          time: "Just now",
          // Fix: Explicitly cast status to the union type 'WIN' | 'LOSS' to satisfy the state's type definition
          status: (isWin ? 'WIN' : 'LOSS') as 'WIN' | 'LOSS',
          type: selectedStyle.split(' ')[0].toUpperCase()
        }, ...prev.history].slice(0, 10)
      };
    });

    if (user) {
      setUser({ 
        ...user, 
        totalRounds: user.totalRounds + 1 
      });
    }
    setLastResult(result);
    navigate('analysis');
  };

  const renderScreen = () => {
    if (!user && currentScreen !== 'login' && currentScreen !== 'forgot_password') return <Login onLogin={handleLogin} onNavigate={navigate} />;

    switch (currentScreen) {
      case 'home': return <Home navigate={navigate} fullName={user?.name || ''} hasActivity={stats.total > 0} elo={stats.elo} rank={currentRank} winRate={winRate} />;
      case 'library': return <Library navigate={navigate} />;
      case 'timer': return <Timer navigate={navigate} stopwatchMs={stopwatchMs} setStopwatchMs={setStopwatchMs} prepMs={prepMs} setPrepMs={setPrepMs} isStopwatchRunning={isStopwatchRunning} setIsStopwatchRunning={setIsStopwatchRunning} isPrepRunning={isPrepRunning} setIsPrepRunning={setIsPrepRunning} />;
      case 'profile': return <Profile navigate={navigate} fullName={user?.name || ''} stats={{...stats, rank: currentRank}} isPro={true} onLogout={handleLogout} />;
      case 'setup': return <Setup user={user!} navigate={navigate} onWatchAd={() => {}} onStart={(style, mode, topic, side, order, techStrat) => { 
        setSelectedStyle(style); setSelectedMode(mode); setSelectedTopic(topic); setSelectedSide(side); setSelectedOrder(order);
        if (techStrat) setSelectedTechStrategy(techStrat);
        navigate('arena'); 
      }} />;
      case 'arena': return <Arena style={selectedStyle} mode={selectedMode} topic={selectedTopic} side={selectedSide} order={selectedOrder} techStrategy={selectedTechStrategy} onFinish={handleFinishDebate} onBack={() => navigate('setup')} />;
      case 'analysis': return <Analysis result={lastResult} navigate={navigate} />;
      case 'login': return <Login onLogin={handleLogin} onNavigate={navigate} />;
      case 'forgot_password': return <ForgotPassword onNavigate={navigate} />;
      case 'coinflip': return <CoinFlip navigate={navigate} />;
      case 'grandcrossfire': return <GrandCrossfire navigate={navigate} />;
      case 'evidencerules': return <EvidenceRules navigate={navigate} />;
      case 'speechtiming': return <SpeechTiming navigate={navigate} />;
      case 'flowingstrategy': return <FlowingStrategy navigate={navigate} />;
      case 'subscription': return <Subscription navigate={navigate} />;
      case 'linkchains': return <LinkChains navigate={navigate} />;
      case 'impactcalc': return <ImpactCalc navigate={navigate} />;
      case 'klayering': return <KLayering navigate={navigate} />;
      case 'theory101': return <Theory101 navigate={navigate} />;
      case 'topicality': return <Topicality navigate={navigate} />;
      case 'framing': return <Framing navigate={navigate} />;
      default: return <Home navigate={navigate} fullName={user?.name || ''} hasActivity={stats.total > 0} elo={stats.elo} rank={currentRank} winRate={winRate} />;
    }
  };

  const showNavbar = ['home', 'library', 'timer', 'profile'].includes(currentScreen);
  const librarySubScreens = ['library', 'coinflip', 'grandcrossfire', 'evidencerules', 'speechtiming', 'flowingstrategy', 'linkchains', 'impactcalc', 'klayering', 'theory101', 'topicality', 'framing'];

  return (
    <div className="flex flex-col min-h-screen bg-[#101522] transition-colors duration-300">
      <main className="flex-1 relative overflow-hidden">
        {renderScreen()}
      </main>
      
      {showNavbar && (
        <nav className="fixed bottom-0 left-0 right-0 ios-blur bg-[#101522]/90 border-t border-white/5 px-6 py-3 pb-8 z-50">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <NavButton icon="home" label="Home" active={currentScreen === 'home'} onClick={() => navigate('home')} />
            <NavButton icon="local_library" label="Library" active={librarySubScreens.includes(currentScreen)} onClick={() => navigate('library')} />
            <button onClick={() => navigate('setup')} className="flex items-center justify-center bg-blue-600 size-14 rounded-full -mt-12 shadow-xl shadow-blue-600/40 ring-4 ring-[#101522] active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-white text-3xl">swords</span>
            </button>
            <NavButton icon="schedule" label="Utilities" active={currentScreen === 'timer'} onClick={() => navigate('timer')} />
            <NavButton icon="person" label="Profile" active={currentScreen === 'profile' || currentScreen === 'subscription'} onClick={() => navigate('profile')} />
          </div>
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-500' : 'text-slate-500 hover:text-slate-200'}`}>
    <span className={`material-symbols-outlined text-[28px] ${active ? 'fill-1' : ''}`}>{icon}</span>
    <span className={`text-[10px] font-bold tracking-tight ${active ? 'text-blue-500' : 'text-slate-500'}`}>{label}</span>
  </button>
);

export default App;
