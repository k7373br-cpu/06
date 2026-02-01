import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';
// Fix: TRANSLATIONS is defined in constants.tsx, not types.ts
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const t = (TRANSLATIONS as any)[lang];
  
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#2d3139] bg-[#0b0e11] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="font-extrabold text-base text-white tracking-tight leading-tight uppercase">
            {t.brand} <span className="text-[#f0b90b]">{t.brandTraffic}</span>
          </h1>
          <span className="text-[8px] font-bold text-[#848e9c] uppercase tracking-widest hidden sm:block">
            {t.aiQuantumCore}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center bg-[#1e2329] p-1 rounded-md border border-[#2d3139] w-[100px] h-[34px]">
          <div 
            className={`absolute top-1 bottom-1 w-[46px] bg-[#f0b90b] rounded transition-all duration-300 ease-out ${
              lang === 'RU' ? 'left-1' : 'left-[51px]'
            }`}
          />
          <button 
            onClick={() => setLang('RU')}
            className={`relative z-10 flex-1 text-[11px] font-black transition-colors duration-200 ${
              lang === 'RU' ? 'text-black' : 'text-[#848e9c] hover:text-white'
            }`}
          >
            RU
          </button>
          <button 
            onClick={() => setLang('EN')}
            className={`relative z-10 flex-1 text-[11px] font-black transition-colors duration-200 ${
              lang === 'EN' ? 'text-black' : 'text-[#848e9c] hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
        
        <div className="hidden sm:flex p-2 text-[#848e9c] hover:text-white transition-colors cursor-pointer">
          <Globe size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;