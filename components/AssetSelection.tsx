
import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Activity, Zap } from 'lucide-react';
import { Asset, AssetType, UserStatus } from '../types';
import { TAB_ICONS } from '../constants';

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

  const isVip = userStatus === UserStatus.VIP;

  const isMarketClosed = useMemo(() => {
    const day = new Date().getDay();
    return day === 6 || day === 0;
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => 
      a.type === activeTab && 
      (a.name.toLowerCase().includes(search.toLowerCase()) || 
       (t[a.name] && t[a.name].toLowerCase().includes(search.toLowerCase())))
    );
  }, [activeTab, search, assets, t]);

  const handleAssetClick = (asset: Asset) => {
    const isForex = asset.type === AssetType.FOREX;
    const isForexClosed = isForex && isMarketClosed;
    const isLocked = !isForex && !isVip;
    
    if (isForexClosed || isLocked) return;
    onSelect(asset);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-5 pb-24 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-[#f0b90b]" />
           <span className="text-[9px] font-black text-[#5e6673] uppercase tracking-[0.2em]">Neural Engine Ready</span>
        </div>
        <div className="text-[9px] font-black text-[#848e9c] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
           {userStatus} ACCESS
        </div>
      </div>

      <h2 className="text-2xl font-black text-white tracking-tight uppercase px-1">{t.selectAssetTitle}</h2>

      {/* Tabs with horizontal scroll on mobile */}
      <div className="flex flex-col gap-4 animate-soft-in">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          {Object.values(AssetType).map((type) => {
            const isTabLocked = type !== AssetType.FOREX && !isVip;
            const isActive = activeTab === type;
            
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-2 px-5 h-11 rounded-xl whitespace-nowrap transition-all duration-300 border ${
                  isActive ? 'bg-[#f0b90b] border-[#f0b90b] text-black shadow-lg' : 'bg-[#1e2329] border-[#2d3139] text-[#848e9c]'
                }`}
              >
                {TAB_ICONS[type]}
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {type}
                  {isTabLocked && ' 🔒'}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Search */}
        <div className="relative w-full group px-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-[#5e6673]" size={14} />
          </div>
          <input 
            type="text" 
            placeholder={t.searchAsset} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1e2329] border border-[#2d3139] rounded-xl h-12 pl-11 pr-4 text-white focus:outline-none focus:border-[#f0b90b]/40 text-xs font-bold uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Grid - 2 columns on mobile, fixed height for consistency */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 animate-fade-in px-1">
        {filteredAssets.map((asset, index) => {
          const isForex = asset.type === AssetType.FOREX;
          const isForexClosed = isForex && isMarketClosed;
          const isLocked = !isForex && !isVip;
          
          return (
            <button
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              disabled={isForexClosed || isLocked}
              className={`bg-[#0b0e11] border border-[#1e2329] h-20 rounded-xl flex flex-col items-center justify-center text-center transition-all animate-soft-in relative ${
                (isForexClosed || isLocked) ? 'opacity-25 grayscale' : 'active:bg-[#1e2329]'
              }`}
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              <div className="flex flex-col items-center gap-0.5">
                 {isForexClosed && <span className="text-[7px] font-black text-[#f6465d] uppercase leading-none">CLOSED</span>}
                 {isLocked && <span className="text-[7px] font-black text-amber-500 uppercase leading-none">VIP</span>}
                 <span className={`text-base font-black tracking-tight uppercase ${isForexClosed || isLocked ? 'text-gray-600' : 'text-white'}`}>
                   {t[asset.name] || asset.name}
                 </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Back Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] border border-[#2d3139] px-10 h-14 rounded-xl bg-[#0b0e11] shadow-2xl"
          >
            <ArrowLeft size={16} />
            {t.backToMenu}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetSelection;
