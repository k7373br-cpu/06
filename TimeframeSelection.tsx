
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Asset } from '../types';

interface TimeframeSelectionProps {
  asset: Asset;
  onSelect: (timeframe: string) => void;
  onBack: () => void;
  t: any;
}

const TimeframeSelection: React.FC<TimeframeSelectionProps> = ({ asset, onSelect, onBack, t }) => {
  // Use the timeframes array from translations provided via 't' prop
  const timeframes = t.timeframes || [];

  return (
    <div className="flex-1 flex flex-col bg-[#050505] animate-soft-in overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
        <div className="flex flex-col items-center gap-10 min-h-full">
           <div className="inline-flex items-center gap-2 bg-[#0b0e11] px-5 py-2.5 rounded-full border border-white/5 shadow-xl">
             <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
             <span className="text-[12px] font-black text-white/80 tracking-[0.2em] uppercase">{asset.name}</span>
           </div>
           
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">{t.selectTfTitle}</h2>
              <p className="text-white/30 text-[12px] font-bold uppercase tracking-widest">{t.tfDesc}</p>
           </div>

           <div className="grid grid-cols-3 gap-3 w-full max-w-sm pb-10">
             {/* Map through the timeframes from translation data */}
             {timeframes.map((tf: string) => (
               <button
                 key={tf}
                 onClick={() => onSelect(tf)}
                 className="h-20 flex items-center justify-center font-black text-[14px] text-white border border-white/5 rounded-2xl bg-[#0b0e11] active:border-[#0088ff] active:text-[#0088ff] active:scale-90 transition-all shadow-lg"
               >
                 {tf}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="px-6 py-6 safe-pb flex justify-center bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 shrink-0">
        <button onClick={onBack} className="btn-back-normal">
          <ArrowLeft size={20} className="text-[#0088ff]" strokeWidth={2.5} />
          <span>{t.backToMenu}</span>
        </button>
      </div>
    </div>
  );
};

export default TimeframeSelection;
