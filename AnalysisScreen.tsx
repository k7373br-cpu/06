
import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import { Asset } from '../types';

interface AnalysisScreenProps {
  asset: Asset;
  timeframe: string;
  onComplete: () => void;
  t: any;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ onComplete, t }) => {
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

  const size = 260;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = 100; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] p-6 relative overflow-hidden select-none min-h-screen">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background dark circle */}
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[#111111] border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] z-0" />
        
        {/* Progress SVG */}
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="absolute inset-0 -rotate-90 z-10"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(0, 136, 255, 0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#0088ff"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.1s linear',
              filter: 'drop-shadow(0 0 12px rgba(0, 136, 255, 0.6))'
            }}
          />
        </svg>

        {/* Central Info */}
        <div className="relative z-20 flex flex-col items-center justify-center gap-2">
          <Brain 
            size={60} 
            className="text-[#0088ff] opacity-90" 
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 15px rgba(0, 136, 255, 0.4))' }}
          />
          <span className="text-white font-black text-xl tabular-nums tracking-tighter">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-[12px] font-black text-[#0088ff] uppercase tracking-[0.6em] animate-pulse">
          {t.analyzing}
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full bg-[#0088ff]" 
              style={{ animation: `bounce 1s infinite ${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisScreen;
