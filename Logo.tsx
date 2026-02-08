
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'lg';
  t: any;
}

const Logo: React.FC<LogoProps> = ({ size = 'sm', t }) => {
  const isLarge = size === 'lg';
  const logoSize = isLarge ? 50 : 22;
  const textSize = isLarge ? 'text-3xl' : 'text-base';
  const spacing = isLarge ? 'gap-3' : 'gap-2';

  return (
    <div className={`flex items-center ${spacing} relative select-none`}>
      {/* SVG Icon part */}
      <svg width={logoSize} height={logoSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="100%" stopColor="#0077ff" />
          </linearGradient>
          <filter id="neonBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Breathing Outer Circle */}
        <circle 
          cx="50" cy="50" r="45" 
          stroke="url(#brandGradient)" 
          strokeWidth="3" 
          strokeDasharray="15 10" 
          opacity="0.6"
          className="animate-logo-circle" 
        />
        <circle 
          cx="50" cy="50" r="45" 
          stroke="#0088ff" 
          strokeWidth="2" 
          className="animate-circle-glow" 
        />
        
        {/* Dynamic Frequency Bars */}
        <rect x="28" y="70" width="7" height="15" rx="1.5" fill="url(#brandGradient)" className="animate-bar" style={{ animationDelay: '0s' }} />
        <rect x="38" y="70" width="7" height="25" rx="1.5" fill="url(#brandGradient)" className="animate-bar" style={{ animationDelay: '0.2s' }} />
        <rect x="48" y="70" width="7" height="20" rx="1.5" fill="url(#brandGradient)" className="animate-bar" style={{ animationDelay: '0.4s' }} />
        <rect x="58" y="70" width="7" height="35" rx="1.5" fill="url(#brandGradient)" className="animate-bar" style={{ animationDelay: '0.6s' }} />
        
        {/* Animated Quantum Path */}
        <path 
          d="M25 60 L40 45 L55 55 L75 30" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M25 60 L40 45 L55 55 L75 30" 
          stroke="#00f2ff" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="quantum-path"
          filter="url(#neonBlur)"
        />
        
        {/* Arrow Tip */}
        <path 
          d="M65 30 L75 30 L75 40" 
          stroke="url(#brandGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#neonBlur)"
        />
        
        {/* Floating Energy Nodes */}
        <circle cx="25" cy="60" r="3.5" fill="white" className="animate-energy-dot" style={{ animationDelay: '0s' }} />
        <circle cx="40" cy="45" r="3.5" fill="white" className="animate-energy-dot" style={{ animationDelay: '0.5s' }} />
        <circle cx="55" cy="55" r="3.5" fill="white" className="animate-energy-dot" style={{ animationDelay: '1s' }} />
      </svg>
      
      {/* Text part */}
      <div className={`flex flex-row items-center gap-2 ${isLarge ? 'leading-none' : 'leading-tight'}`}>
        <span className={`${textSize} font-black uppercase tracking-tighter silver-liquid whitespace-nowrap`}>
          {t.brand}
        </span>
        
        <div className="relative">
          {/* Falling Water Drop with Splash FX */}
          <div className={`water-drop animate-drip ${isLarge ? 'left-[46px] -top-1' : 'left-[26px] -top-0.5'}`} />
          <div className={`splash-fx ${isLarge ? 'left-[38px] top-6' : 'left-[18px] top-4'}`} />
          
          <span className={`${textSize} font-black uppercase tracking-tighter wet-effect whitespace-nowrap relative`}>
            {t.brandTraffic}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
