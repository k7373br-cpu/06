
import React, { useState } from 'react';
import { Signal, SignalStatus } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, CheckCircle2, XCircle, ArrowLeft, Zap } from 'lucide-react';

interface SignalResultProps {
  signal: Signal;
  onBack: () => void;
  onFeedback: (status: SignalStatus) => void;
  onNewCycle: () => void;
  t: any;
}

const SignalResult: React.FC<SignalResultProps> = ({ signal, onBack, onFeedback, onNewCycle, t }) => {
  const [localStatus, setLocalStatus] = useState<SignalStatus>(signal.status);
  const isBuy = signal.direction === 'BUY';
  const displayName = signal.asset.name;

  const handleFeedback = (status: SignalStatus) => {
    setLocalStatus(status);
    onFeedback(status);
  };

  const accentColor = isBuy ? '#10b981' : '#f6465d';
  const shadowColor = isBuy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(246, 70, 93, 0.2)';

  return (
    <div className="flex-1 flex flex-col items-center justify-start sm:justify-center bg-[#050505] min-h-screen px-4 pt-6 pb-24 animate-soft-in select-none">
      <div className="w-full max-w-2xl bg-[#0b0e11] border border-white/5 rounded-[28px] p-6 md:p-14 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col items-center gap-8 mb-10 text-center">
          <div>
            <span className="text-[10px] font-black text-[#5e6673] uppercase tracking-[0.3em] mb-1 block">{t.assetAnalyzed}</span>
            <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              {displayName}
            </h2>
          </div>

          <div className="relative">
            <div 
              className="w-44 h-44 sm:w-64 sm:h-64 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700 relative"
              style={{ 
                borderColor: accentColor,
                boxShadow: `0 0 30px ${shadowColor}`,
                backgroundColor: 'rgba(0,0,0,0.1)'
              }}
            >
              {isBuy ? (
                <>
                  <TrendingUp size={48} style={{ color: accentColor }} className="mb-1" />
                  <span className="text-3xl font-black uppercase tracking-tighter" style={{ color: accentColor }}>{t.signalBuy}</span>
                </>
              ) : (
                <>
                  <TrendingDown size={48} style={{ color: accentColor }} className="mb-1" />
                  <span className="text-3xl font-black uppercase tracking-tighter" style={{ color: accentColor }}>{t.signalSell}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-black text-[#5e6673] uppercase tracking-widest">{t.timeframe}</span>
            <span className="text-2xl font-black text-white">{signal.timeframe}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-black text-[#5e6673] uppercase tracking-widest">{t.accuracyLabel}</span>
            <span className="text-2xl font-black text-[#f0b90b]">{signal.probability}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleFeedback('CONFIRMED')}
              className={`h-16 rounded-2xl border flex items-center justify-center gap-2 transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${
                localStatus === 'CONFIRMED' 
                  ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_35px_rgba(16,185,129,0.6)]' 
                  : 'border-white/5 bg-white/5 text-[#5e6673] hover:border-white/10'
              }`}
            >
              <CheckCircle2 size={18} />
              {t.confirmed}
            </button>
            
            <button 
              onClick={() => handleFeedback('FAILED')}
              className={`h-16 rounded-2xl border flex items-center justify-center gap-2 transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${
                localStatus === 'FAILED' 
                  ? 'bg-[#f6465d] border-[#f6465d] text-white shadow-[0_0_35px_rgba(246,70,93,0.6)]' 
                  : 'border-white/5 bg-white/5 text-[#5e6673] hover:border-white/10'
              }`}
            >
              <XCircle size={18} />
              {t.failed}
            </button>
          </div>

          <button 
            onClick={onNewCycle}
            className="h-16 mt-2 bg-[#f0b90b] text-black rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
          >
            <RefreshCw size={18} />
            {t.newCycle}
          </button>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="mt-8 flex items-center gap-3 text-[#5e6673] hover:text-[#f0b90b] transition-all font-black text-[10px] uppercase tracking-[0.4em] h-12"
      >
        <ArrowLeft size={14} />
        {t.backToMenu}
      </button>
    </div>
  );
};

export default SignalResult;
