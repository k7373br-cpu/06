
import React, { useState } from 'react';
import { Crown, ArrowRight, Zap, Activity, X, User, Lock, Send } from 'lucide-react';
import { Signal, UserStatus, Language } from '../types';
import TradingViewWidget from './TradingViewWidget';

interface MainScreenProps {
  onStart: () => void;
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

const MainScreen: React.FC<MainScreenProps> = ({ onStart, userStatus, signalsUsed, limit, t, lang, onUpgrade, onResetElite }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const isElite = userStatus === UserStatus.ELITE;
  const isVip = userStatus === UserStatus.VIP;
  
  const getStatusConfig = () => {
    if (isVip) return {
      label: t.statusVip || "VIP",
      icon: <Zap size={14} className="animate-pulse" />,
      bg: 'bg-[#f0b90b]/10 border-[#f0b90b]/40',
      textColor: 'text-[#f0b90b]'
    };
    if (isElite) return { 
      label: t.statusElite || "ВЕРИФИЦИРОВАН", 
      icon: <Crown size={14} />, 
      bg: 'bg-[#1a1408] border-[#c08d2e]', 
      textColor: 'text-[#f59e0b]'
    };
    return {
      label: t.statusStandard || "СТАНДАРТ",
      icon: <User size={14} />,
      bg: 'bg-slate-500/10 border-slate-500/20',
      textColor: 'text-slate-500'
    };
  };

  const config = getStatusConfig();

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

  const displayLimit = `${Math.max(0, limit - signalsUsed)} / ${limit}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 select-none pb-20">
      {/* Главный баннер - более компактный на мобильных */}
      <div className="relative overflow-hidden bg-[#0b0e11] border border-white/5 rounded-[24px] p-6 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 animate-soft-in shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0b90b]/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Zap size={10} className="text-[#f0b90b] fill-[#f0b90b]" />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">{t.heroTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tighter leading-tight uppercase">
            {t.heroAccent.split(' ')[0]} <span className="text-[#f0b90b]">{t.heroAccent.split(' ')[1]}</span>
          </h2>
          <p className="text-[#848e9c] text-xs sm:text-lg leading-relaxed font-bold">
            {t.heroDesc}
          </p>
        </div>

        <button 
          onClick={onStart}
          className="relative group w-full md:w-auto overflow-hidden h-16 md:h-20 px-10 bg-[#f0b90b] text-black rounded-xl font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-xl uppercase tracking-[0.2em] text-[11px]"
        >
          {t.startBtn}
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>

      {/* Карточки - перестроены для мобильных */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-soft-in stagger-1">
        {/* Status Card */}
        <div className="bt-card p-6 flex flex-col justify-between h-44 group relative overflow-hidden transition-all duration-500 rounded-3xl">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black text-[#848e9c] uppercase tracking-[0.2em]">{t.statusLabel}</span>
            <div className={`p-2 bg-white/5 rounded-xl ${config.textColor}`}>
              {isVip ? <Zap size={16} /> : (isElite ? <Crown size={16} /> : <Activity size={16} />)}
            </div>
          </div>
          <div className="relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 font-black uppercase text-[10px] tracking-widest ${config.bg} ${config.textColor}`}>
              {config.icon}
              {config.label}
            </div>
          </div>
          {!isVip ? (
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="relative z-10 w-full text-[10px] font-black text-[#f0b90b] uppercase tracking-[0.2em] flex items-center justify-between border-t border-white/5 pt-4"
            >
              ОТКРЫТЬ ДОСТУП
              <ArrowRight size={12} />
            </button>
          ) : (
            <div className="relative z-10 w-full text-[10px] font-black text-[#f0b90b] uppercase tracking-[0.2em] flex items-center justify-between border-t border-white/5 pt-4">
               VIP СТАТУС: БЕЗЛИМИТ
               <Zap size={12} />
            </div>
          )}
        </div>

        {/* Limits Card */}
        <div className="bt-card p-6 flex flex-col justify-between h-44 rounded-3xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#848e9c] uppercase tracking-[0.2em]">{t.limitsLabel}</span>
            <Activity size={16} className="text-[#f0b90b]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black uppercase tracking-tighter ${isVip ? 'text-[#f0b90b]' : 'text-white'}`}>
              {isVip ? 'БЕЗЛИМИТНО' : displayLimit}
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full h-1.5 bg-[#1e2329] rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${isVip ? 'bg-[#f0b90b]' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`} 
                 style={{ width: isVip ? '100%' : `${(Math.max(0, limit - signalsUsed) / limit) * 100}%` }}
               ></div>
            </div>
            <p className="text-[8px] font-black text-[#848e9c] uppercase tracking-[0.2em] text-right">
              {isVip ? 'UNRESTRICTED' : (isElite ? 'RESETS 24H' : 'NO RESET')}
            </p>
          </div>
        </div>

        {/* Telegram Card */}
        <a 
          href="https://t.me/INFINITY_TRAFFLC" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bt-card p-6 flex flex-col justify-between h-44 rounded-3xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#848e9c] uppercase tracking-[0.2em]">COMMUNITY</span>
            <Send size={16} className="text-[#f0b90b]" />
          </div>
          <div className="w-full text-[10px] font-black text-[#f0b90b] uppercase tracking-[0.2em] flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
            TELEGRAM CHANNEL
            <ArrowRight size={12} />
          </div>
        </a>
      </div>

      <div className="animate-soft-in stagger-2 mt-4">
        <TradingViewWidget lang={lang} />
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0b0e11] border border-white/10 rounded-[24px] p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-[#5e6673] p-2"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center gap-5 pt-4">
              <div className="w-12 h-12 rounded-full bg-[#f0b90b]/10 flex items-center justify-center border border-[#f0b90b]/20">
                <Lock size={24} className="text-[#f0b90b]" />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{t.modalTitle}</h3>
                <p className="text-[9px] font-black text-[#5e6673] uppercase tracking-[0.2em] mt-1">{t.enterPw}</p>
              </div>

              <div className="w-full">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className={`w-full bg-[#1e2329] border ${error ? 'border-red-500' : 'border-[#2d3139]'} rounded-xl h-14 text-center text-xl font-mono text-white focus:outline-none focus:border-[#f0b90b] transition-all`}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpgradeSubmit()}
                />
              </div>

              <button 
                onClick={handleUpgradeSubmit}
                className="w-full h-14 bg-[#f0b90b] text-black rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all"
              >
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
