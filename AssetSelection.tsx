
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, Lock, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Asset, AssetType, UserStatus } from '../types';

interface AssetSelectionProps {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
  onBack: () => void;
  userStatus: UserStatus;
  t: any;
}

const AssetSelection: React.FC<AssetSelectionProps> = ({ assets, onSelect, onBack, userStatus, t }) => {
  const [activeTab, setActiveTab] = useState<AssetType>(AssetType.FOREX);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [livePrices, setLivePrices] = useState<Record<string, { price: string; lastTick: 'up' | 'down' | null; change: string }>>({});
  const [timeLeftObj, setTimeLeftObj] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const ITEMS_PER_PAGE = 10;

  const isForexClosed = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); 
    return day === 5 || day === 6 || day === 0;
  }, []);

  useEffect(() => {
    if (!isForexClosed) return;

    const updateTimer = () => {
      const now = new Date();
      const nextMonday = new Date();
      const currentDay = now.getDay();
      const daysToAdd = currentDay === 5 ? 3 : currentDay === 6 ? 2 : 1;
      
      nextMonday.setDate(now.getDate() + daysToAdd);
      nextMonday.setHours(0, 0, 0, 0);

      const diff = nextMonday.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeftObj({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeftObj({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [isForexClosed]);

  const METALS_MAPPING: Record<string, string> = {
    'm1': 'GC=F', 'm2': 'SI=F', 'm3': 'PL=F', 'm4': 'PA=F'  
  };

  const simulatePrice = useCallback((assetId: string) => {
    setLivePrices(prev => {
      const current = prev[assetId];
      if (!current) return prev;
      const val = parseFloat(current.price.replace(',', '.'));
      const jitter = (Math.random() - 0.5) * (val * 0.0001);
      const newVal = val + jitter;
      const precision = current.price.split(',')[1]?.length || 2;
      return {
        ...prev,
        [assetId]: {
          ...current,
          price: newVal.toFixed(precision).replace('.', ','),
          lastTick: jitter > 0 ? 'up' : 'down'
        }
      };
    });
  }, []);

  const fetchCryptoPrices = useCallback(async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      if (!response.ok) throw new Error('Binance error');
      const data = await response.json();
      if (Array.isArray(data)) {
        setLivePrices(prev => {
          const next = { ...prev };
          assets.forEach(asset => {
            if (asset.type === AssetType.CRYPTO) {
              const binanceSymbol = asset.name.replace('/', '');
              const ticker = data.find((t: any) => t.symbol === binanceSymbol);
              if (ticker) {
                const newPrice = parseFloat(ticker.price);
                const oldPrice = parseFloat((prev[asset.id]?.price || asset.price).replace(',', '.'));
                next[asset.id] = {
                  price: newPrice.toFixed(2).replace('.', ','),
                  lastTick: newPrice > oldPrice ? 'up' : newPrice < oldPrice ? 'down' : prev[asset.id]?.lastTick || null,
                  change: asset.change
                };
              } else { simulatePrice(asset.id); }
            }
          });
          return next;
        });
      }
    } catch (error) { assets.forEach(a => a.type === AssetType.CRYPTO && simulatePrice(a.id)); }
  }, [assets, simulatePrice]);

  const fetchMarketData = useCallback(async (type: AssetType) => {
    if (type === AssetType.FOREX && isForexClosed) return;
    const targetAssets = assets.filter(a => a.type === type);
    for (const asset of targetAssets) {
      try {
        let ticker = type === AssetType.METALS ? METALS_MAPPING[asset.id] : asset.name.replace('/', '') + '=X';
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const wrapper = await response.json();
        const data = JSON.parse(wrapper.contents);
        if (data.chart?.result) {
          const result = data.chart.result[0];
          const price = result.meta.regularMarketPrice;
          const precision = type === AssetType.FOREX ? 5 : 2;
          setLivePrices(prev => {
            const oldPrice = parseFloat((prev[asset.id]?.price || '0').replace(',', '.'));
            return {
              ...prev,
              [asset.id]: {
                price: price.toFixed(precision).replace('.', ','),
                lastTick: price > oldPrice ? 'up' : price < oldPrice ? 'down' : prev[asset.id]?.lastTick || null,
                change: asset.change
              }
            };
          });
        } else { simulatePrice(asset.id); }
      } catch (error) { simulatePrice(asset.id); }
    }
  }, [assets, simulatePrice, isForexClosed]);

  useEffect(() => {
    const initial: Record<string, any> = {};
    assets.forEach(a => initial[a.id] = { price: a.price, lastTick: null, change: a.change });
    setLivePrices(initial);
    fetchCryptoPrices();
    fetchMarketData(AssetType.FOREX);
    fetchMarketData(AssetType.METALS);
    const cryptoInterval = setInterval(fetchCryptoPrices, 8000);
    const forexInterval = setInterval(() => fetchMarketData(AssetType.FOREX), 45000);
    const metalsInterval = setInterval(() => fetchMarketData(AssetType.METALS), 60000);
    return () => {
      clearInterval(cryptoInterval);
      clearInterval(forexInterval);
      clearInterval(metalsInterval);
    };
  }, [assets, fetchCryptoPrices, fetchMarketData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  const isVip = userStatus === UserStatus.VIP;
  const filteredAssets = useMemo(() => {
    return assets.filter(a => a.type === activeTab && (t[a.name] || a.name).toLowerCase().includes(search.toLowerCase()));
  }, [activeTab, search, assets, t]);

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssets, currentPage]);

  const getTabName = (type: AssetType) => {
    switch (type) {
      case AssetType.FOREX: return t.typeForex;
      case AssetType.CRYPTO: return t.typeCrypto;
      case AssetType.METALS: return t.typeMetals;
      default: return type;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] animate-soft-in overflow-y-auto no-scrollbar pb-10">
      <div className="px-5 pt-6 pb-2 space-y-5">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {Object.values(AssetType).map((type) => {
            const isActive = activeTab === type;
            const isVipLocked = type !== AssetType.FOREX && !isVip;
            const isClosed = type === AssetType.FOREX && isForexClosed;
            return (
              <button 
                key={type} 
                onClick={() => setActiveTab(type)} 
                className={`flex-shrink-0 flex items-center gap-2 px-5 h-12 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 border ${
                  isActive 
                    ? 'bg-[#0088ff] border-[#0088ff] text-white shadow-[0_0_20px_rgba(0,136,255,0.3)]' 
                    : 'bg-[#0b0e11] border-white/5 text-white/40'
                }`}
              >
                {getTabName(type)}
                {isVipLocked && <Lock size={12} className="opacity-50" />}
                {isClosed && <Clock size={12} className="text-[#f6465d]" />}
              </button>
            );
          })}
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-white/20" size={16} />
          </div>
          <input 
            type="text" 
            placeholder={t.searchAsset} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full h-14 bg-black border border-white/5 rounded-2xl pl-12 pr-4 text-[13px] font-bold text-white placeholder:text-white/20 focus:border-[#0088ff]/30 transition-all outline-none" 
          />
        </div>
      </div>

      <div className="px-5 py-4 relative">
        {activeTab === AssetType.FOREX && isForexClosed ? (
          <div className="bg-[#0b0e11] rounded-[2.5rem] border border-[#f6465d]/20 p-10 flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f6465d]/5 blur-[60px] rounded-full" />
             
             <div className="w-16 h-16 rounded-[1.5rem] bg-[#f6465d]/10 flex items-center justify-center border border-[#f6465d]/20 animate-pulse">
                <Clock size={32} className="text-[#f6465d]" />
             </div>
             
             <div className="space-y-6 w-full">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{t.marketClosed}</h3>
                  <p className="text-[10px] font-black text-[#f6465d] uppercase tracking-[0.3em] opacity-80">{t.reopeningIn}</p>
                </div>
                
                <div className="flex justify-center items-center gap-2">
                  {[
                    { val: timeLeftObj.d, label: 'D' },
                    { val: timeLeftObj.h, label: 'H' },
                    { val: timeLeftObj.m, label: 'M' },
                    { val: timeLeftObj.s, label: 'S' }
                  ].map((item, idx) => (
                    <React.Fragment key={item.label}>
                      <div className="flex flex-col items-center gap-2 min-w-[54px]">
                        <div className="w-14 h-16 bg-black/60 rounded-xl border border-white/5 flex items-center justify-center shadow-inner overflow-hidden">
                          <span className="text-2xl font-['JetBrains_Mono'] font-bold text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            {item.val.toString().padStart(2, '0')}
                          </span>
                        </div>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{item.label}</span>
                      </div>
                      {idx < 3 && (
                        <div className="flex flex-col items-center pb-6">
                           <span className="text-xl font-bold text-[#f6465d] opacity-50">:</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-[#0b0e11] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
            {paginatedAssets.length > 0 ? paginatedAssets.map((asset) => {
              const isLocked = asset.type !== AssetType.FOREX && !isVip;
              const data = livePrices[asset.id];
              const currentPrice = data?.price || asset.price;
              const cleanChange = (data?.change || asset.change).replace(/[^\d,.]/g, '');
              const displayName = t[asset.name] || asset.name;
              
              return (
                <button 
                  key={asset.id} 
                  disabled={isLocked} 
                  onClick={() => onSelect({ ...asset, price: currentPrice })} 
                  className={`group w-full h-20 grid grid-cols-12 items-center px-6 border-b border-white/5 last:border-0 active:bg-white/[0.04] transition-all ${isLocked ? 'opacity-30 grayscale' : ''}`}
                >
                  <div className="col-span-6 flex flex-col items-start">
                    <span className="text-[15px] font-black tracking-tight text-white">{displayName}</span>
                    {isLocked && <span className="text-[8px] font-black text-[#0088ff] uppercase tracking-[0.2em] mt-0.5">{t.vipOnly}</span>}
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-[14px] font-['JetBrains_Mono'] font-bold tabular-nums text-[#0088ff]">{currentPrice}</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="inline-flex px-2 py-1 rounded-lg text-[10px] font-black bg-[#0088ff]/10 text-[#0088ff]">
                      {cleanChange}
                    </div>
                  </div>
                </button>
              );
            }) : (
              <div className="py-20 flex flex-col items-center opacity-20">
                 <Search size={40} />
                 <span className="text-[10px] font-black uppercase mt-4 tracking-widest">{t.noResults}</span>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && !(activeTab === AssetType.FOREX && isForexClosed) && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl bg-[#0b0e11] border border-white/5 flex items-center justify-center text-white/50 disabled:opacity-20"><ChevronLeft size={18} /></button>
            <div className="flex gap-1 bg-[#0b0e11] p-1 rounded-xl border border-white/5">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center ${currentPage === (i + 1) ? 'bg-[#0088ff] text-white' : 'text-white/20'}`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl bg-[#0b0e11] border border-white/5 flex items-center justify-center text-white/50 disabled:opacity-20"><ChevronRight size={18} /></button>
          </div>
        )}
      </div>

      <div className="px-6 py-10 flex justify-center">
        <button onClick={onBack} className="btn-back-normal active:scale-95">
          <ArrowLeft size={20} className="text-[#0088ff]" strokeWidth={2.5} />
          <span>{t.backToMenu}</span>
        </button>
      </div>
    </div>
  );
};

export default AssetSelection;
