
import React from 'react';
import { Language } from '../types';

interface EconomicCalendarProps {
  lang: Language;
  onBack: () => void;
  t: any;
}

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ lang, onBack, t }) => {
  // lang=1 для русского, lang=9 для английского
  const investingLang = lang === 'RU' ? '1' : '9';

  return (
    <div className="flex-1 w-full bg-[#050505] animate-soft-in overflow-hidden flex flex-col relative h-full">
      <div className="flex-1 w-full relative">
        <iframe 
          src={`https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=day&timeZone=16&lang=${investingLang}`} 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowTransparency={true} 
          marginWidth={0} 
          marginHeight={0}
          title="Economic Calendar"
          className="w-full h-full border-none bg-[#050505]"
        />
      </div>
    </div>
  );
};

export default EconomicCalendar;
