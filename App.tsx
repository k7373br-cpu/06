
import React, { useState, useCallback, useEffect } from 'react';
import { AppScreen, Asset, Signal, UserStatus, SignalStatus, Language } from './types';
import Header from './components/Header';
import MainScreen from './components/MainScreen';
import AssetSelection from './components/AssetSelection';
import TimeframeSelection from './components/TimeframeSelection';
import AnalysisScreen from './components/AnalysisScreen';
import SignalResult from './components/SignalResult';
import { TRANSLATIONS, ASSETS } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.MAIN);
  const [lang, setLang] = useState<Language>('RU');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [history, setHistory] = useState<Signal[]>([]);
  const [lastFeedbackStatus, setLastFeedbackStatus] = useState<SignalStatus | null>(null);

  // Persistent States
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const saved = localStorage.getItem('bt_user_status');
    return (saved as UserStatus) || UserStatus.STANDARD;
  });

  const [signalsUsed, setSignalsUsed] = useState<number>(() => {
    const saved = localStorage.getItem('bt_signals_used');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastResetTime, setLastResetTime] = useState<number>(() => {
    const saved = localStorage.getItem('bt_last_reset');
    return saved ? parseInt(saved, 10) : Date.now();
  });

  const t = TRANSLATIONS[lang];
  
  // Logic constants
  const LIMIT = userStatus === UserStatus.VIP ? Infinity : (userStatus === UserStatus.ELITE ? 50 : 20);
  const COOLDOWN_24H = 24 * 60 * 60 * 1000;

  // Check and handle limits reset
  useEffect(() => {
    const now = Date.now();
    // Only Elite users get a reset every 24 hours
    // VIP has no limit so reset isn't strictly necessary but we keep it clean
    if (userStatus === UserStatus.ELITE || userStatus === UserStatus.VIP) {
      if (now - lastResetTime > COOLDOWN_24H) {
        setSignalsUsed(0);
        setLastResetTime(now);
      }
    }
    // Standard users NEVER get a reset.
  }, [lastResetTime, userStatus]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bt_user_status', userStatus);
    localStorage.setItem('bt_signals_used', signalsUsed.toString());
    localStorage.setItem('bt_last_reset', lastResetTime.toString());
  }, [userStatus, signalsUsed, lastResetTime]);

  const handleStart = () => {
    if (signalsUsed >= LIMIT) {
      alert(t.limitReached);
      return;
    }
    setScreen(AppScreen.ASSET_SELECTION);
  };

  const handleBack = () => {
    setScreen(AppScreen.MAIN);
    setLastFeedbackStatus(null);
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setScreen(AppScreen.TIMEFRAME_SELECTION);
  };

  const handleTimeframeSelect = (tf: string) => {
    setSelectedTimeframe(tf);
    setScreen(AppScreen.ANALYSIS);
  };

  const handleAnalysisComplete = useCallback(() => {
    if (!selectedAsset || !selectedTimeframe) return;
    
    let direction: 'BUY' | 'SELL';
    if (currentSignal && lastFeedbackStatus === 'FAILED') {
      direction = currentSignal.direction === 'BUY' ? 'SELL' : 'BUY';
    } else if (currentSignal && lastFeedbackStatus === 'CONFIRMED') {
      direction = currentSignal.direction;
    } else {
      direction = Math.random() > 0.5 ? 'BUY' : 'SELL';
    }

    const signal: Signal = {
      id: `INF-${Math.floor(Math.random() * 90000) + 10000}`,
      asset: selectedAsset,
      timeframe: selectedTimeframe,
      direction: direction,
      probability: Math.floor(Math.random() * 12) + 85,
      timestamp: Date.now(),
      status: 'PENDING'
    };
    
    setSignalsUsed(prev => prev + 1);
    setLastFeedbackStatus(null);
    setCurrentSignal(signal);
    setHistory(prev => [signal, ...prev]);
    setScreen(AppScreen.RESULT);
  }, [selectedAsset, selectedTimeframe, currentSignal, lastFeedbackStatus]);

  const handleFeedback = (status: SignalStatus) => {
    if (!currentSignal) return;
    setLastFeedbackStatus(status);
    const updatedSignal = { ...currentSignal, status };
    setCurrentSignal(updatedSignal);
    setHistory(prev => prev.map(s => s.id === updatedSignal.id ? updatedSignal : s));
  };

  const handleUpgrade = (password: string) => {
    if (password === '2741520') {
      setUserStatus(UserStatus.ELITE);
      setSignalsUsed(0);
      setLastResetTime(Date.now());
      return true;
    }
    if (password === '1448135') {
      setUserStatus(UserStatus.VIP);
      setSignalsUsed(0);
      setLastResetTime(Date.now());
      return true;
    }
    return false;
  };

  const handleResetElite = () => {
    if (userStatus === UserStatus.ELITE || userStatus === UserStatus.VIP) {
      setSignalsUsed(0);
      setLastResetTime(Date.now());
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header lang={lang} setLang={setLang} />
      <main className="flex-1 flex flex-col">
        {screen === AppScreen.MAIN && (
          <MainScreen 
            onStart={handleStart} 
            userStatus={userStatus} 
            onStatusToggle={() => {}}
            history={history}
            signalsUsed={signalsUsed}
            limit={LIMIT}
            t={t} 
            lang={lang} 
            onUpgrade={handleUpgrade}
            onResetElite={handleResetElite}
          />
        )}
        {screen === AppScreen.ASSET_SELECTION && (
          <AssetSelection 
            assets={ASSETS} 
            onSelect={handleAssetSelect} 
            onBack={handleBack} 
            userStatus={userStatus} 
            t={t} 
          />
        )}
        {screen === AppScreen.TIMEFRAME_SELECTION && selectedAsset && (
          <TimeframeSelection 
            asset={selectedAsset} 
            onSelect={handleTimeframeSelect} 
            onBack={handleBack} 
            t={t} 
          />
        )}
        {screen === AppScreen.ANALYSIS && selectedAsset && selectedTimeframe && (
          <AnalysisScreen 
            asset={selectedAsset} 
            timeframe={selectedTimeframe} 
            onComplete={handleAnalysisComplete} 
            t={t} 
          />
        )}
        {screen === AppScreen.RESULT && currentSignal && (
          <SignalResult 
            signal={currentSignal} 
            onBack={handleBack} 
            onFeedback={handleFeedback}
            onNewCycle={() => {
              if (signalsUsed >= LIMIT) {
                alert(t.limitReached);
                setScreen(AppScreen.MAIN);
              } else {
                setScreen(AppScreen.ANALYSIS);
              }
            }} 
            t={t} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
