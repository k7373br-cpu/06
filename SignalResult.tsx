
import React, { useState, useEffect } from 'react';
import { Signal, SignalStatus } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, ArrowLeft, Brain } from 'lucide-react';
import Logo from './Logo';

interface SignalResultProps {
  signal: Signal;
  onBack: () => void;
  onFeedback: (status: SignalStatus) => void;
  onNewCycle: () => void;
  t: any;
}

const SignalResult: React.FC<SignalResultProps> = ({ signal, onBack, onFeedback, onNewCycle, t }) => {
  const [localStatus, setLocalStatus] = useState<SignalStatus>(signal.status);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLocalStatus(signal.status);
  }, [signal.status, signal.id]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => { 
            setIsAnalyzing(false); 
            setProgress(0);
            onNewCycle(); 
          }, 400);
          return 100;
        }
        return p + 3;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isAnalyzing, onNewCycle]);

  const handleLocalFeedback = (status: SignalStatus) => {
    if (isAnalyzing) return;
    setLocalStatus(status);
    onFeedback(status);
  };

  const isBuy = signal.direction === 'BUY';
  const accentColor = isBuy ? '#10b981' : '#f6465d';

  // Логика разделения текста на Основной и Подзаголовок для лучшего выравнивания
  const fullSignalText = isBuy ? t.signalBuy : t.signalSell;
  const parts = fullSignalText.split(' ');
  const mainText = parts[0];
  const subText = parts.length > 1 ? parts.slice(1).join(' ') : '';

  return (
    <div className="flex-1 flex flex-col items-center p-6 animate-soft-in overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-sm:max-w-[340px] bg-[#0b0e11] rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center shadow-2xl relative mb-10 group">
        
        <div className="absolute -inset-1 rounded-[2.5rem] z-[-1]" style={{ background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)` }} />
        
        <div className="flex flex-col items-center gap-4 mb-8 opacity-40 transition-opacity group-hover:opacity-60">
          <Logo size="sm" t={t} />
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">{signal.asset.name}</h2>
        </div>

        <div className="relative mb-10">
          {isAnalyzing ? (
            <div className="w-44 h-44 rounded-full border-2 border-[#0088ff]/10 flex flex-col items-center justify-center relative">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="#0088ff" 
                  strokeWidth="3" 
                  strokeDasharray="301" 
                  strokeDashoffset={301 - (progress/100)*301} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 0.1s linear' }} 
                />
              </svg>
              <Brain size={48} className="text-[#0088ff] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#0088ff] mt-4">{t.analyzing}</span>
            </div>
          ) : (
            <div 
              className="w-44 h-44 rounded-full border border-white/5 bg-black flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden text-center" 
              style={{ boxShadow: `0 0 60px ${accentColor}15` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
              <div className="animate-float mb-1">
                {isBuy ? 
                  <TrendingUp size={58} style={{ color: accentColor }} className="relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" /> : 
                  <TrendingDown size={58} style={{ color: accentColor }} className="relative z-10 drop-shadow-[0_0_10px_rgba(246,70,93,0.3)]" />
                }
              </div>
              
              <div className="flex flex-col items-center justify-center px-4 relative z-10 leading-none">
                <span className="text-[26px] font-black uppercase tracking-tighter" style={{ color: accentColor }}>
                  {mainText}
                </span>
                {subText && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mt-1" style={{ color: accentColor }}>
                    {subText}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          <div className="bg-black/40 rounded-2xl p-4 text-center border border-white/5">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">{t.timeframe}</span>
            <span className="text-xl font-black text-[#0088ff]">{signal.timeframe}</span>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 text-center border border-white/5">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">{t.accuracyLabel}</span>
            <span className="text-xl font-black" style={{ color: accentColor }}>{signal.probability}%</span>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleLocalFeedback('CONFIRMED')} 
              className={`relative overflow-hidden h-14 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${localStatus === 'CONFIRMED' ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30' : 'bg-white/5 border border-white/10 text-white/30'}`}
            >
              {localStatus === 'CONFIRMED' && <div className="ring-pulse w-full h-full" />}
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                className={`${localStatus === 'CONFIRMED' ? 'animate-icon-pop' : ''}`}
              >
                <polyline points="20 6 9 17 4 12" className={localStatus === 'CONFIRMED' ? 'animate-path-draw' : ''} />
              </svg>
              {t.confirmed}
            </button>

            <button 
              onClick={() => handleLocalFeedback('FAILED')} 
              className={`relative overflow-hidden h-14 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${localStatus === 'FAILED' ? 'bg-[#f6465d] text-white shadow-lg shadow-[#f6465d]/30' : 'bg-white/5 border border-white/10 text-white/30'}`}
            >
              {localStatus === 'FAILED' && <div className="ring-pulse w-full h-full" />}
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                className={`${localStatus === 'FAILED' ? 'animate-icon-pop' : ''}`}
              >
                <line x1="18" y1="6" x2="6" y2="18" className={localStatus === 'FAILED' ? 'animate-path-draw' : ''} />
                <line x1="6" y1="6" x2="18" y2="18" className={localStatus === 'FAILED' ? 'animate-path-draw' : ''} style={{ animationDelay: '0.1s' }} />
              </svg>
              {t.failed}
            </button>
          </div>
          
          <button 
            onClick={() => {
               setIsAnalyzing(true);
               setLocalStatus('PENDING');
            }} 
            disabled={isAnalyzing} 
            className="w-full h-16 bg-[#0088ff] text-white rounded-xl font-black uppercase text-[12px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#0088ff]/20 relative overflow-hidden shimmer-btn"
          >
            <RefreshCw size={20} className={isAnalyzing ? 'animate-spin' : ''} />
            {t.newCycle}
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center px-4 mt-2">
        <button onClick={onBack} className="btn-back-normal active:scale-95">
          <ArrowLeft size={20} className="text-[#0088ff]" strokeWidth={2.5} />
          <span>{t.backToMenu}</span>
        </button>
      </div>
    </div>
  );
};

export default SignalResult;
