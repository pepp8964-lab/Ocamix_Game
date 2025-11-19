
import React, { useState, useRef, useEffect } from 'react';
import { Ingredient, IngredientType, ItemRegistry } from '../types';
import { analyzeCustomIngredient } from '../services/geminiService';

interface Props {
  gold: number;
  inventory: { [id: string]: number };
  registry: ItemRegistry;
  onBuy: (item: Ingredient, qty: number) => void;
  onBack: () => void;
}

interface FlyingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
}

const Shop: React.FC<Props> = ({ gold, inventory, registry, onBuy, onBack }) => {
  const [mode, setMode] = useState<'buy' | 'create'>('buy');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Creation State
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewItem, setPreviewItem] = useState<Ingredient | null>(null);

  // Animation State
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [cartBump, setCartBump] = useState(false);
  
  const cartRef = useRef<HTMLDivElement>(null);
  const buyTabRef = useRef<HTMLButtonElement>(null); // Ref for flying to shop tab
  const previewRef = useRef<HTMLDivElement>(null);

  const allDisplayItems = Object.values(registry) as Ingredient[];
  
  // Sorting: Custom items (created by user) come FIRST, then sorted by price
  const sortedItems = allDisplayItems
    .filter(i => (activeTab === 'all' || i.type === activeTab) && !i.baseId)
    .sort((a, b) => {
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;
        // If both custom, newest first (assuming higher ID timestamp)
        if (a.isCustom && b.isCustom) return b.id.localeCompare(a.id);
        return a.price - b.price;
    });

  // Real-time preview analysis (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (customName.trim().length > 2) {
             // Just a quick heuristic for preview before full AI analysis
             // Real analysis happens on click
             setPreviewItem({
                id: 'preview',
                name: customName,
                emoji: '🪄', // Placeholder
                type: 'magic',
                price: customPrice,
                tier: 1,
                desc: 'Натисніть "Синтезувати" для аналізу',
                state: 'raw'
             });
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [customName, customPrice]);

  const handleBuyClick = (e: React.MouseEvent, item: Ingredient) => {
    if (gold < item.price) return;

    // Trigger Animation
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const cartRect = cartRef.current?.getBoundingClientRect();
    
    if (cartRect) {
        triggerFlyAnimation(item.emoji, rect.left, rect.top, cartRect.left - rect.left + 20, cartRect.top - rect.top + 20);
        
        // Cart bump effect
        setTimeout(() => {
            setCartBump(true);
            setTimeout(() => setCartBump(false), 200);
        }, 800);
    }

    onBuy(item, 1);
  };

  const triggerFlyAnimation = (emoji: string, startX: number, startY: number, tx: number, ty: number) => {
        const newItem: FlyingItem = {
            id: Date.now(),
            emoji: emoji,
            x: startX,
            y: startY,
            tx: tx,
            ty: ty,
        };
        setFlyingItems(prev => [...prev, newItem]);
        setTimeout(() => {
            setFlyingItems(prev => prev.filter(i => i.id !== newItem.id));
        }, 800);
  };

  const handleCreate = async () => {
    if (!customName.trim() || customPrice < 0) return;
    setIsAnalyzing(true);
    const analysis = await analyzeCustomIngredient(customName);
    
    const newItem: Ingredient = {
        id: `custom_${Date.now()}`,
        name: customName,
        emoji: analysis.emoji,
        type: analysis.type as IngredientType,
        price: customPrice,
        tier: analysis.tier as any,
        desc: 'Авторський інгредієнт',
        state: 'raw',
        isCustom: true
    };
    
    // Animate from Preview to "Buy" tab
    if (previewRef.current && buyTabRef.current) {
        const startRect = previewRef.current.getBoundingClientRect();
        const endRect = buyTabRef.current.getBoundingClientRect();
        triggerFlyAnimation(newItem.emoji, startRect.left + 100, startRect.top + 100, endRect.left - startRect.left, endRect.top - startRect.top);
    }

    onBuy(newItem, 1);
    setCustomName('');
    setPreviewItem(null);
    setIsAnalyzing(false);
    
    // Switch back to buy mode after animation
    setTimeout(() => setMode('buy'), 1000);
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-2 md:p-6 overflow-hidden bg-game-bg text-white relative">
      
      {/* Flying Items Layer */}
      {flyingItems.map(item => (
          <div 
            key={item.id}
            className="fixed z-[100] text-4xl pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ 
                left: item.x, 
                top: item.y,
                '--tx': `${item.tx}px`,
                '--ty': `${item.ty}px`,
                animation: 'fly 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards'
            } as any}
          >
            {item.emoji}
          </div>
      ))}

      <div className="glass-panel p-4 rounded-2xl flex justify-between items-center mb-6 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
         <button onClick={onBack} className="text-slate-300 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors">
            ← Меню
         </button>
         <div className="flex gap-2 p-1 bg-black/30 rounded-lg">
            <button ref={buyTabRef} onClick={() => setMode('buy')} className={`px-6 py-2 rounded-md font-bold transition-all text-sm uppercase ${mode === 'buy' ? 'bg-game-accent text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>Купувати</button>
            <button onClick={() => setMode('create')} className={`px-6 py-2 rounded-md font-bold transition-all text-sm uppercase ${mode === 'create' ? 'bg-game-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Створити</button>
         </div>
         <div ref={cartRef} className={`flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-game-accent/30 transition-transform ${cartBump ? 'scale-125 bg-game-accent text-black' : ''}`}>
             <span className="text-game-accent font-mono font-bold text-xl">{gold}</span>
             <span className="text-[10px] uppercase text-slate-500 font-bold">Золото</span>
         </div>
      </div>

      {mode === 'buy' ? (
        <div className="flex-1 flex flex-col overflow-hidden animate-slide-up">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide px-2">
               <button onClick={() => setActiveTab('all')} className={`px-4 py-1 rounded-full text-xs font-bold border transition-all ${activeTab === 'all' ? 'bg-white text-black border-white' : 'border-slate-700 text-slate-400 bg-black/20'}`}>ВСЕ</button>
               {['meat', 'veg', 'fruit', 'magic', 'tech', 'dungeon', 'weird'].map(t => (
                   <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1 rounded-full text-xs font-bold border uppercase transition-all ${activeTab === t ? 'bg-white text-black border-white' : 'border-slate-700 text-slate-400 bg-black/20'}`}>{t}</button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20 px-2">
                {sortedItems.map(item => {
                    const qty = inventory[item.id] || 0;
                    return (
                    <div key={item.id} className={`
                        glass-panel p-4 rounded-2xl flex flex-col relative group transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]
                        ${item.isCustom ? 'border-game-primary/70' : ''}
                        ${item.tier >= 4 ? 'border-game-highlight/50' : ''}
                    `}>
                        {item.isCustom && (
                            <div className="absolute -top-2 -left-2 bg-game-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                NEW
                            </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                             {qty > 0 && (
                                 <span className="bg-game-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    x{qty}
                                 </span>
                             )}
                             <span className="text-[10px] text-slate-500 uppercase font-bold border border-slate-700 px-1 rounded">{item.type}</span>
                        </div>

                        <div className="text-5xl mb-4 mt-4 self-center drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative">
                            {item.emoji}
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity"></div>
                        </div>
                        
                        <h3 className="font-bold text-sm leading-tight mb-1 text-slate-200">{item.name}</h3>
                        <p className="text-[10px] text-slate-400 mb-4 h-8 overflow-hidden leading-tight">{item.desc}</p>
                        
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="text-game-accent font-mono text-sm font-bold">{item.price} G</span>
                            <button 
                                onClick={(e) => handleBuyClick(e, item)}
                                disabled={gold < item.price}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wide transition-colors ${gold >= item.price ? 'bg-white text-black hover:bg-game-accent shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                            >
                                Купити
                            </button>
                        </div>
                    </div>
                )})}
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-8 items-start justify-center p-4 animate-scale-in overflow-y-auto">
            
            {/* LEFT: CREATION FORM */}
            <div className="glass-panel p-8 rounded-3xl w-full md:w-1/2 max-w-md relative overflow-hidden border border-game-primary/30 shadow-[0_0_50px_rgba(124,58,237,0.2)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-primary to-game-highlight"></div>
                <h2 className="text-3xl font-display mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Лабораторія</h2>
                <p className="text-center text-slate-400 text-xs mb-8">Синтез нових інгредієнтів</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs text-game-primary uppercase font-bold mb-2 tracking-wider">Назва продукту</label>
                        <input 
                            type="text" 
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Напр: Крипто-Цибуля"
                            className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-white focus:border-game-primary focus:ring-1 focus:ring-game-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-game-accent uppercase font-bold mb-2 tracking-wider">Вартість (Золото)</label>
                        <input 
                            type="number" 
                            value={customPrice}
                            onChange={(e) => setCustomPrice(Number(e.target.value))}
                            className="w-full bg-black/50 border border-slate-700 rounded-xl p-4 text-white focus:border-game-accent focus:ring-1 focus:ring-game-accent outline-none transition-all"
                        />
                    </div>

                    <button 
                        onClick={handleCreate}
                        disabled={isAnalyzing || !customName}
                        className="w-full bg-gradient-to-r from-game-primary to-game-highlight py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] mt-6 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        {isAnalyzing ? <span className="animate-spin">⏳</span> : '🪄'} 
                        {isAnalyzing ? 'Аналіз...' : 'Синтезувати'}
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-2">ШІ автоматично підбере іконку та категорію</p>
                </div>
            </div>

            {/* RIGHT: PREVIEW CARD */}
            <div className="w-full md:w-1/3 flex flex-col items-center" ref={previewRef}>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Попередній перегляд</h3>
                 <div className={`
                    w-full max-w-[250px] glass-panel p-6 rounded-3xl flex flex-col items-center relative transition-all duration-500 border border-white/10
                    ${customName ? 'opacity-100 scale-100' : 'opacity-50 scale-95 grayscale'}
                 `}>
                    <div className="text-6xl mb-6 mt-4 drop-shadow-2xl animate-float">
                        {previewItem?.emoji || '❓'}
                    </div>
                    <h3 className="font-bold text-xl text-white mb-2 text-center">{customName || 'Назва...'}</h3>
                    <p className="text-xs text-slate-400 mb-6 text-center">{previewItem?.desc || 'Опис з\'явиться тут...'}</p>
                    
                    <div className="w-full flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-game-accent font-mono text-lg font-bold">{customPrice} G</span>
                        <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1 rounded text-slate-300">
                             {previewItem?.type || 'TYPE'}
                        </span>
                    </div>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
