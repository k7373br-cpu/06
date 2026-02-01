
import React, { useEffect, useState } from 'react';
import { Brain, Cpu } from 'lucide-react';
import { Asset } from '../types';

interface AnalysisScreenProps {
  asset: Asset;
  timeframe: string;
  onComplete: () => void;
  t: any;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ asset, timeframe, onComplete, t }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000;
    const intervalTime = 16.67;
    const totalSteps = duration / intervalTime;
    const stepIncrement = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return Math.min(100, p + stepIncrement);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  const size = 240;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = 95; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-6 relative overflow-hidden select-none">
      
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="absolute w-[180px] h-[180px] rounded-full border border-white/5 bg-[#0b0e11] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-0" />
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="absolute inset-0 -rotate-90 z-10"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(240, 185, 11, 0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#f0b90b"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.1s linear',
              filter: 'drop-shadow(0 0 8px rgba(240, 185, 11, 0.6))'
            }}
          />
        </svg>

        <div className="relative z-20 flex items-center justify-center">
          <Brain 
            size={70} 
            className="text-[#f0b90b] drop-shadow-[0_0_20px_rgba(240,185,11,0.5)] animate-pulse" 
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-12 gap-3">
        <div className="flex items-center gap-2 text-[#5e6673] tracking-[0.4em] font-black text-[10px] uppercase">
          <Cpu size={14} className="text-[#f0b90b]" />
          {t.quantumProcessing}
        </div>
        
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
          {t.analysisActive.split(' ')[0]} <span className="text-[#f0b90b]">{t.analysisActive.split(' ')[1]}</span>
        </h2>
        
        <div className="mt-4 text-[#5e6673] font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
          <span>{asset.name}</span>
          <span className="w-1 h-1 rounded-full bg-[#5e6673]"></span>
          <span>{timeframe}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;
