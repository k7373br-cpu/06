
import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Lock, Trophy, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { Signal, UserStatus, Language, Asset } from '../types';
import Logo from './Logo';

interface MainScreenProps {
  onStart: () => void;
  onAssetSelect: (asset: Asset) => void;
  history: Signal[];
  userStatus: UserStatus;
  onStatusToggle: () => void;
  signalsUsed: number;
  limit: number;
  t: any;
  lang: Language;
  onUpgrade: (password: string) => boolean;
  onResetElite: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ 
  onStart, 
  userStatus, 
  signalsUsed, 
  limit, 
  t, 
  lang, 
  onUpgrade 
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const isVip = userStatus === UserStatus.VIP;
  const isElite = userStatus === UserStatus.ELITE;
  const isStandard = userStatus === UserStatus.STANDARD;
  const isLimitReached = signalsUsed >= limit && !isVip;

  useEffect(() => {
    if (!isLimitReached || isStandard) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const lastReset = parseInt(localStorage.getItem('bt_last_reset') || now.toString(), 10);
      const resetInterval = 12 * 60 * 60 * 1000;
      const nextReset = lastReset + resetInterval;
      const difference = nextReset - now;

      if (difference <= 0) return '00:00:00';

      const h = Math.floor(difference / (1000 * 60 * 60));
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [isLimitReached, isStandard]);

  const config = isVip ? {
      label: t.statusVip,
      icon: <Trophy size={20} className="text-[#0088ff]" />,
      bg: 'bg-gradient-to-br from-[#0088ff]/10 to-[#0b0e11] border-[#0088ff]/30',
      textColor: 'text-[#0088ff]'
    } : isElite ? {
      label: t.statusElite,
      icon: <ShieldCheck size={20} className="text-[#0088ff]" />,
      bg: 'bg-gradient-to-br from-[#0088ff]/5 to-[#0b0e11] border-[#0088ff]/20',
      textColor: 'text-[#0088ff]'
    } : {
      label: t.statusStandard,
      icon: <Zap size={20} className="text-[#0088ff]" fill="#0088ff" />,
      bg: 'bg-gradient-to-br from-[#0088ff]/5 to-[#0b0e11] border-[#0088ff]/20',
      textColor: 'text-[#0088ff]'
    };

  const handleUpgradeSubmit = () => {
    if (onUpgrade(password)) {
      setShowUpgradeModal(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const displayLimit = isVip ? t.unlimited : `${Math.max(0, limit - signalsUsed)} / ${limit}`;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-[calc(20px+env(safe-area-inset-bottom))] animate-soft-in min-h-0 touch-pan-y">
      <div className="px-5 py-6 flex flex-col gap-5">
        
        {isLimitReached ? (
          <div className="relative overflow-hidden bg-[#0b0e11] border-2 border-[#0088ff]/30 rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-2xl pulse-blue animate-soft-in">
            <div className="w-20 h-20 rounded-[2.5rem] bg-[#0088ff]/10 flex items-center justify-center border border-[#0088ff]/30 mb-2">
              <Lock size={40} className="text-[#0088ff]" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-[#0088ff] uppercase tracking-tighter">{t.limitReached}</h2>
              {isStandard ? (
                <p className="text-white/70 text-[13px] font-bold uppercase leading-relaxed max-w-[260px]">
                  {t.supportMessage}
                </p>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">{t.resetIn}</span>
                  <span className="text-3xl font-['JetBrains_Mono'] font-bold text-white tracking-tighter tabular-nums">
                    {timeLeft}
                  </span>
                </div>
              )}
            </div>

            <a 
              href="https://t.me/INFINITY_TRAFFLC" 
              target="_blank" 
              className="w-full h-14 bg-[#0088ff] text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shimmer-btn relative overflow-hidden"
            >
              <HelpCircle size={18} />
              {t.supportSupport}
            </a>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-[#0b0e11] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center gap-8 shadow-2xl pulse-blue group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0088ff]/10 blur-[60px] rounded-full group-hover:bg-[#0088ff]/20 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Logo size="lg" t={t} />
              <p className="text-white/40 text-[12px] font-semibold text-center leading-relaxed max-w-[240px]">
                {t.heroDesc}
              </p>
            </div>

            <button 
              onClick={onStart}
              className="group/btn w-full h-[88px] bg-[#0088ff] text-white rounded-[2rem] font-black flex items-center justify-between shadow-xl active:scale-95 transition-all overflow-hidden relative shimmer-btn"
            >
              <div className="flex flex-col items-start pl-8 uppercase leading-tight relative z-10">
                <span className="text-[20px] tracking-tight">{t.startBtn}</span>
                <span className="text-[20px] tracking-tight">{t.analysisBtn}</span>
              </div>
              <div className="h-full w-[70px] flex items-center justify-center bg-black/10 border-l border-white/10 relative z-10">
                <div className="w-10 h-10 rounded-[1.25rem] border-2 border-white flex items-center justify-center transition-transform group-hover/btn:scale-110 duration-300">
                  <ArrowRight size={20} strokeWidth={3} />
                </div>
              </div>
            </button>
          </div>
        )}

        <div className={`flex flex-col rounded-[2rem] border overflow-hidden shadow-lg transition-all hover:translate-y-[-2px] duration-300 ${config.bg}`}>
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t.statusLabel}</span>
                <span className={`text-2xl font-black uppercase tracking-tight ${config.textColor}`}>
                  {config.label}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 shadow-inner">
                {config.icon}
              </div>
            </div>

            <div className="h-[1px] bg-white/5 w-full" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t.limitsLabel}</span>
                <div className="flex items-center gap-2">
                  {isVip && <span className={`text-3xl font-sans ${config.textColor}`}>∞</span>}
                  <span className={`${isVip ? 'text-xl' : 'text-3xl'} font-['JetBrains_Mono'] font-bold ${config.textColor} uppercase tabular-nums`}>
                    {displayLimit}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 h-10 rounded-xl bg-[#0088ff] text-white text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,136,255,0.25)] border border-white/10 relative overflow-hidden shimmer-btn"
              >
                {t.changeStatus}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0b0e11] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{t.community}</span>
          </div>
          <div className="flex flex-col">
            {[
              { label: t.supportCenter, url: 'https://t.me/INFINITY_TRAFFLC' },
              { label: t.officialChannel, url: 'https://t.me/+deTR3GcaUKM2NjA6' }
            ].map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center justify-between px-6 h-16 border-b border-white/5 last:border-0 active:bg-white/[0.03] transition-all hover:bg-white/[0.01]"
              >
                <span className="text-[12px] font-bold text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">{link.label}</span>
                <ArrowRight size={16} className="text-[#0088ff] transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 animate-soft-in">
          <div className="w-full max-w-md bg-[#0b0e11] border border-white/10 rounded-[2.5rem] p-8 relative shadow-2xl safe-pb mb-4">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
            <div className="flex flex-col items-center gap-6 pt-2">
              <div className="w-16 h-16 rounded-[1.5rem] bg-[#0088ff]/10 flex items-center justify-center border border-[#0088ff]/20 shadow-inner"><Lock size={28} className="text-[#0088ff]" /></div>
              <div className="text-center">
                <h3 className="text-xl font-black uppercase tracking-tight">{t.modalTitle}</h3>
                <p className="text-[11px] font-semibold text-white/40 uppercase mt-2">{t.enterPw}</p>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••" 
                className={`w-full h-16 bg-black border-2 rounded-[1.5rem] text-center text-3xl font-mono transition-all ${error ? 'border-red-500 animate-shake' : 'border-white/10 focus:border-[#0088ff]'}`} 
              />
              <button onClick={handleUpgradeSubmit} className="w-full h-14 bg-[#0088ff] text-white rounded-2xl font-black uppercase text-sm active:scale-95 transition-all shimmer-btn relative overflow-hidden">
                {t.modalConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainScreen;
