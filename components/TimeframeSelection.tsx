
import React from 'react';
import { Clock, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Asset } from '../types';
import { TIMEFRAMES } from '../constants';

interface TimeframeSelectionProps {
  asset: Asset;
  onSelect: (timeframe: string) => void;
  onBack: () => void;
  t: any;
}

const TimeframeSelection: React.FC<TimeframeSelectionProps> = ({ asset, onSelect, onBack, t }) => {
  return (
    <div className="max-w-xl mx-auto px-6 py-12 flex flex-col gap-10 animate-soft-in">
      <div className="space-y-6 text-center">
         <div className="inline-flex items-center gap-3 bg-[#1e2329] px-5 py-2 rounded-full border border-[#2d3139] shadow-sm">
           <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
           <span className="text-sm font-bold text-white tracking-wide">{asset.name}</span>
         </div>
         <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight uppercase">{t.selectTfTitle}</h2>
            <p className="text-[#848e9c] text-sm font-medium">{t.tfDesc}</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TIMEFRAMES.map((tf, index) => (
          <button
            key={tf}
            onClick={() => onSelect(tf)}
            className="bt-card h-14 flex items-center justify-center font-bold text-xs text-slate-300 hover:text-[#10b981] transition-all active:scale-95 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Кнопка НАЗАД снизу посередине */}
      <div className="flex justify-center mt-12 animate-fade-in">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#848e9c] hover:text-[#10b981] transition-all font-bold text-[12px] uppercase tracking-[0.3em] border border-[#2d3139] px-10 py-4 rounded-md bg-[#0b0e11] hover:bg-[#1e2329] active:scale-95"
        >
          <ArrowLeft size={16} />
          {t.backToMenu}
        </button>
      </div>
    </div>
  );
};

export default TimeframeSelection;
