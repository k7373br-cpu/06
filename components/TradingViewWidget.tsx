
import React, { useEffect, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface TradingViewWidgetProps {
  lang: Language;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ lang }) => {
  const container = useRef<HTMLDivElement>(null);
  const t = (TRANSLATIONS as any)[lang];

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "colorTheme": "dark",
        "locale": lang.toLowerCase(),
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "backgroundColor": "#0b0e11", // Цвет карточки приложения
        "gridLineColor": "#1e2329",
        "fontColor": "#848e9c",
        "width": "100%",
        "height": 700,
        "symbolsGroups": [
          {
            "name": lang === 'RU' ? "Валюты" : "Forex",
            "symbols": [
              { "name": "FX:AUDCAD" }, { "name": "FX:AUDCHF" }, { "name": "FX:AUDJPY" }, { "name": "FX:AUDNZD" }, { "name": "FX:AUDUSD" },
              { "name": "FX:CADCHF" }, { "name": "FX:CADJPY" }, { "name": "FX:CHFJPY" }, { "name": "FX:EURAUD" }, { "name": "FX:EURCAD" },
              { "name": "FX:EURCHF" }, { "name": "FX:EURGBP" }, { "name": "FX:EURJPY" }, { "name": "FX:EURNZD" }, { "name": "FX:EURSEK" },
              { "name": "FX:EURUSD" }, { "name": "FX:GBPCAD" }, { "name": "FX:GBPCHF" }, { "name": "FX:GBPJPY" }, { "name": "FX:GBPUSD" },
              { "name": "FX:NZDCAD" }, { "name": "FX:NZDJPY" }, { "name": "FX:USDCAD" }, { "name": "FX:USDCHF" }, { "name": "FX:USDCNH" },
              { "name": "FX:USDJPY" }, { "name": "FX:USDMXN" }, { "name": "FX:USDNOK" }, { "name": "FX:USDSGD" }
            ]
          },
          {
            "name": lang === 'RU' ? "Крипто" : "Crypto",
            "symbols": [
              { "name": "BINANCE:BNBUSDT", "displayName": "BNB/USDT" },
              { "name": "BINANCE:BTCUSDT", "displayName": "BTC/USDT" },
              { "name": "BINANCE:ETHUSDT", "displayName": "ETH/USDT" },
              { "name": "BINANCE:LTCUSDT", "displayName": "LTC/USDT" },
              { "name": "BYBIT:MNTUSDT", "displayName": "MNT/USDT" },
              { "name": "BINANCE:SOLUSDT", "displayName": "SOL/USDT" },
              { "name": "BINANCE:XAUTUSDT", "displayName": "XAUT/USDT" },
              { "name": "BINANCE:XRPUSDT", "displayName": "XRP/USDT" },
              { "name": "BINANCE:ZECUSDT", "displayName": "ZEC/USDT" }
            ]
          },
          {
            "name": lang === 'RU' ? "Металлы" : "Metals",
            "symbols": [
              { "name": "OANDA:XAUUSD", "displayName": lang === 'RU' ? "ЗОЛОТО" : "GOLD" },
              { "name": "OANDA:XAGUSD", "displayName": lang === 'RU' ? "СЕРЕБРО" : "SILVER" },
              { "name": "OANDA:XPTUSD", "displayName": lang === 'RU' ? "ПЛАТИНА" : "PLATINUM" },
              { "name": "OANDA:XPDUSD", "displayName": lang === 'RU' ? "ПАЛЛАДИЙ" : "PALLADIUM" }
            ]
          }
        ]
      });
      container.current.appendChild(script);
    }
  }, [lang]);

  return (
    <div className="relative group animate-soft-in">
      <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-[#0b0e11] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#10b981] animate-ping opacity-75"></div>
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e6e8ea]">{t.quantumFeed}</span>
           </div>
           <span className="text-[9px] font-black text-[#5e6673] uppercase tracking-widest">{t.realTime}</span>
        </div>

        <div className="h-[650px] overflow-hidden relative bg-[#0b0e11]">
          <div className="tradingview-widget-container" ref={container} style={{ height: '700px' }}>
            <div className="tradingview-widget-container__widget"></div>
          </div>
          {/* Плашка для скрытия копирайта TradingView внизу */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#0b0e11] z-10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default TradingViewWidget;
