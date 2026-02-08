
import React from 'react';
import { Home, Newspaper } from 'lucide-react';
import { Language, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onHome: () => void;
  onCalendar: () => void;
  theme: Theme;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onHome, onCalendar }) => {
  const t = (TRANSLATIONS as any)[lang];
  
  return (
    <header className="flex items-center justify-between px-5 pt-[env(safe-area-inset-top)] pb-3 border-b border-white/5 bg-[#0b0e11]/90 backdrop-blur-2xl sticky top-0 z-[100] h-auto min-h-[74px]">
      <div className="flex items-center gap-2.5 mt-2">
        <button 
          onClick={onHome}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/70 active:scale-90 active:bg-[#0088ff]/20 transition-all"
        >
          <Home size={20} />
        </button>

        <button 
          onClick={onCalendar}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/70 active:scale-90 active:bg-[#0088ff]/20 transition-all"
        >
          <Newspaper size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <div className="relative flex items-center bg-black/40 p-1 rounded-2xl border border-white/5 w-[94px] h-[38px] overflow-hidden">
          <div 
            className={`absolute top-1 bottom-1 w-[42px] bg-[#0088ff] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              lang === 'RU' ? 'left-1' : 'left-[47px]'
            } shadow-[0_2px_8px_rgba(0,136,255,0.4)]`}
          />
          <button 
            onClick={() => setLang('RU')}
            className={`relative z-10 flex-1 text-[11px] font-black transition-colors duration-300 ${
              lang === 'RU' ? 'text-black' : 'text-white/40'
            }`}
          >
            RU
          </button>
          <button 
            onClick={() => setLang('EN')}
            className={`relative z-10 flex-1 text-[11px] font-black transition-colors duration-300 ${
              lang === 'EN' ? 'text-black' : 'text-white/40'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
