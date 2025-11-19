
import React, { useState } from 'react';
import { Ingredient, ToolType, Critic, ProcessingState, ItemRegistry } from '../types';
import { PROCESSED_ITEMS, COOKING_ACTIONS, PROCESSING_RULES, ALL_ITEMS } from '../constants';
import CookingMinigame from './CookingMinigame';

interface Props {
  inventory: { [id: string]: number };
  registry: ItemRegistry;
  critics: Critic[];
  waterLevel: number;
  onConsumeItem: (id: string) => void;
  onUseWater: (amount: number) => void;
  onRefillWater: () => void;
  onFinishDish: (ingredients: Ingredient[]) => void;
  onExit: () => void;
}

const Kitchen: React.FC<Props> = ({ 
  inventory, registry, critics, waterLevel, 
  onConsumeItem, onUseWater, onRefillWater, onFinishDish, onExit 
}) => {
  const [workstationItem, setWorkstationItem] = useState<Ingredient | null>(null);
  const [platedItems, setPlatedItems] = useState<Ingredient[]>([]);
  const [activeMinigame, setActiveMinigame] = useState<ToolType | null>(null);
  
  const [pendingTransformation, setPendingTransformation] = useState<{
     successItem: Ingredient, 
     failItem: Ingredient 
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('meat');

  const generateProcessedItem = (item: Ingredient, tool: ToolType): Ingredient => {
     const suffixMap: Record<string, {suffix: string, state: ProcessingState}> = {
        [ToolType.KNIFE]: { suffix: 'Нарізаний', state: 'chopped' },
        [ToolType.PAN]: { suffix: 'Смажений', state: 'fried' },
        [ToolType.POT]: { suffix: 'Варений', state: 'boiled' },
        [ToolType.OVEN]: { suffix: 'Запечений', state: 'baked' },
        [ToolType.BLENDER]: { suffix: 'Збитий', state: 'blended' },
        [ToolType.MAGIC_WAND]: { suffix: 'Чарівний', state: 'magic_infused' },
        [ToolType.HANDS]: { suffix: 'Пом\'ятий', state: 'seasoned' },
        [ToolType.FREEZER]: { suffix: 'Заморожений', state: 'frozen' },
        [ToolType.HAMMER]: { suffix: 'Відбитий', state: 'smashed' },
        [ToolType.GRATER]: { suffix: 'Натертий', state: 'grated' },
        [ToolType.MICROWAVE]: { suffix: 'Радіоактивний', state: 'radiated' },
     };

     const cfg = suffixMap[tool] || { suffix: 'Оброблений', state: 'raw' };
     return {
        ...item,
        id: `${item.id}_${cfg.state}`,
        name: `${cfg.suffix} ${item.name.toLowerCase()}`,
        state: cfg.state,
        baseId: item.id,
        price: Math.ceil(item.price * 1.2)
     };
  };

  const handleInventoryClick = (itemId: string) => {
    if (workstationItem) {
      alert("Стіл зайнятий! Приберіть продукт.");
      return;
    }
    if (inventory[itemId] > 0) {
      // Lookup in registry FIRST, then fallback to ALL_ITEMS constant
      const itemDef = registry[itemId] || ALL_ITEMS.find(i => i.id === itemId);
      if (itemDef) {
        onConsumeItem(itemId);
        setWorkstationItem({ ...itemDef }); 
      }
    }
  };

  const handleToolClick = (tool: ToolType) => {
    if (!workstationItem) return;

    let rule = PROCESSING_RULES.find(r => r.inputId === workstationItem.id && r.tool === tool);
    if (!rule) {
        rule = PROCESSING_RULES.find(r => r.inputCategory === workstationItem.type && r.tool === tool);
    }

    if (tool === ToolType.POT && waterLevel < 20) {
       alert("Немає води! Натисніть на індикатор води.");
       return;
    }
    if (tool === ToolType.POT) onUseWater(20);

    let successItem: Ingredient;
    let failItem: Ingredient = PROCESSED_ITEMS.find(i => i.id === 'burnt_food')!;

    if (rule && rule.outputId) {
        // Try to find output in registry or PROCESSED list
        successItem = registry[rule.outputId] || ALL_ITEMS.find(i => i.id === rule?.outputId) || PROCESSED_ITEMS.find(i => i.id === rule?.outputId)!;
        
        if (rule.failureOutputId) {
             failItem = registry[rule.failureOutputId] || ALL_ITEMS.find(i => i.id === rule.failureOutputId) || failItem;
        }
    } else {
        successItem = generateProcessedItem(workstationItem, tool);
        // Custom logic for tech items exploding
        if ((workstationItem.type === 'tech' || workstationItem.type === 'office') && tool === ToolType.POT) {
           successItem = PROCESSED_ITEMS.find(i => i.id === 'wet_electronics')!;
        }
    }

    setPendingTransformation({ successItem, failItem });
    setActiveMinigame(tool);
  };

  const finishMinigame = (success: boolean) => {
    if (!pendingTransformation) {
        setActiveMinigame(null);
        return;
    }
    setWorkstationItem(success ? pendingTransformation.successItem : pendingTransformation.failItem);
    setActiveMinigame(null);
    setPendingTransformation(null);
  };

  const addToPlate = () => {
    if (workstationItem) {
      setPlatedItems(prev => [...prev, workstationItem]);
      setWorkstationItem(null);
    }
  };

  // Retrieve items from inventory state using registry
  const myInventoryItems = Object.keys(inventory)
      .filter(id => inventory[id] > 0)
      .map(id => registry[id] || ALL_ITEMS.find(i => i.id === id))
      .filter(Boolean) as Ingredient[];

  return (
    <div className="h-screen flex flex-col bg-game-bg relative overflow-hidden">
      
      {/* MINIGAME OVERLAY - Fixed Position, High Z-Index */}
      {activeMinigame && (
        <CookingMinigame 
          tool={activeMinigame}
          onSuccess={() => finishMinigame(true)}
          onFailure={() => finishMinigame(false)}
        />
      )}

      {/* TOP HUD */}
      <div className="h-16 glass-panel border-b-0 flex items-center justify-between px-2 md:px-4 z-20 m-2 rounded-xl">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="bg-game-danger/20 text-game-danger border border-game-danger/50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-game-danger/40 uppercase tracking-wide">
            Вихід
          </button>
          <div className="flex -space-x-2 overflow-hidden pl-4">
            {critics.map(c => (
               <div key={c.id} className="relative w-10 h-10 rounded-full border-2 border-game-surface bg-slate-800 flex items-center justify-center text-xl shadow-md group cursor-pointer transition-transform hover:scale-110 hover:z-10">
                  {c.avatar}
                  <div className="absolute top-12 left-0 glass-panel text-white text-xs p-2 rounded w-48 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                    <span className="text-game-accent font-bold">{c.name}</span><br/>
                    {c.request || "Будь-що"}
                  </div>
               </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
             <div onClick={onRefillWater} className="w-24 md:w-32 h-8 bg-black/40 rounded-full border border-white/10 relative overflow-hidden cursor-pointer group">
              <div className="absolute top-0 left-0 bottom-0 bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${waterLevel}%` }} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow uppercase tracking-wider group-hover:scale-110 transition-transform">ВОДА {Math.round(waterLevel)}%</span>
           </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 gap-2 pt-0">
        
        {/* LEFT: PLATE (Mobile: Top, Desktop: Left) */}
        <div className="h-1/4 md:h-full md:w-1/4 glass-panel rounded-xl p-2 flex flex-row md:flex-col items-center gap-4 relative">
           <div className="w-24 h-24 md:w-56 md:h-56 rounded-full border-4 border-white/5 bg-black/20 flex items-center justify-center relative shadow-inner group shrink-0">
               <div className="absolute inset-0 rounded-full border border-white/10 opacity-50"></div>
               <div className="absolute inset-0 flex flex-wrap items-center justify-center content-center p-4">
                   {platedItems.map((item, i) => (
                      <span key={i} className="text-2xl md:text-4xl animate-float drop-shadow-lg" style={{animationDelay: `${i*0.3}s`}}>{item.emoji}</span>
                   ))}
               </div>
           </div>
           
           <div className="flex flex-col gap-2 w-full">
             <button 
               onClick={() => onFinishDish(platedItems)}
               disabled={platedItems.length === 0}
               className={`w-full py-2 md:py-4 rounded-xl font-display font-black tracking-[0.2em] shadow-lg transition-all text-sm md:text-lg uppercase
                 ${platedItems.length > 0 ? 'bg-game-success text-white animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
             >
               ПОДАТИ
             </button>
             <button onClick={() => setPlatedItems([])} className="text-xs text-slate-500 hover:text-game-danger text-center uppercase tracking-wide transition-colors">Очистити тарілку</button>
           </div>
        </div>

        {/* CENTER: WORKSTATION */}
        <div className="flex-1 glass-panel rounded-xl relative flex flex-col items-center justify-center p-4 overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
           
           {/* Workstation Slot */}
           <div className={`
              w-64 h-64 rounded-full border-2 border-dashed flex flex-col items-center justify-center relative transition-all z-10 mb-4
              ${workstationItem 
                 ? 'border-game-accent bg-game-accent/10 shadow-[0_0_50px_rgba(251,191,36,0.2)]' 
                 : 'border-white/10 bg-white/5'}
           `}>
              {!workstationItem ? (
                <span className="text-white/20 font-display text-sm uppercase tracking-widest">Робоча зона</span>
              ) : (
                <div className="flex flex-col items-center animate-scale-in">
                   <span className="text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] filter brightness-110">{workstationItem.emoji}</span>
                   <span className="mt-4 px-3 py-1 bg-black/80 rounded text-game-accent font-bold border border-game-accent/30 text-xs uppercase tracking-wide">
                      {workstationItem.name}
                   </span>
                   <div className="flex gap-3 mt-4 absolute -bottom-12">
                      <button onClick={addToPlate} className="bg-game-success hover:bg-game-success/80 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110 active:scale-95 border border-white/20">🍽️</button>
                      <button onClick={() => setWorkstationItem(null)} className="bg-game-danger hover:bg-game-danger/80 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110 active:scale-95 border border-white/20">🗑️</button>
                   </div>
                </div>
              )}
           </div>

           {/* TOOLS SCROLLER */}
           <div className="w-full mt-auto overflow-x-auto pb-2 scrollbar-hide z-10 pt-8">
             <div className="flex gap-3 px-4 min-w-max justify-center">
                {COOKING_ACTIONS.map(tool => (
                  <button 
                    key={tool.type}
                    onClick={() => handleToolClick(tool.type)}
                    disabled={!workstationItem}
                    className={`
                      flex flex-col items-center justify-center w-16 h-16 rounded-xl border transition-all relative group backdrop-blur-sm
                      ${workstationItem 
                         ? `bg-white/5 border-white/10 hover:bg-game-primary/20 hover:border-game-primary hover:-translate-y-2 cursor-pointer shadow-lg` 
                         : 'bg-black/20 border-transparent opacity-30'}
                    `}
                  >
                     <span className="text-2xl mb-1 filter drop-shadow-md">{tool.emoji}</span>
                     <span className="text-[8px] uppercase tracking-wider text-slate-300 font-bold">{tool.label}</span>
                  </button>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* BOTTOM: INVENTORY */}
      <div className="h-1/3 md:h-1/4 glass-panel rounded-xl m-2 mt-0 flex flex-col overflow-hidden">
         <div className="flex bg-black/30 px-2 pt-2 gap-1 overflow-x-auto scrollbar-hide border-b border-white/5">
            {['meat', 'veg', 'fruit', 'grain', 'spice', 'magic', 'tech', 'dungeon', 'cosmic', 'weird'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-t-lg text-[10px] font-bold uppercase whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-white/10 text-white border-t border-x border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {cat}
              </button>
            ))}
         </div>
         <div className="flex-1 p-3 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 overflow-y-auto content-start">
            {myInventoryItems.filter(i => i.type === selectedCategory).map(item => (
              <button
                key={item.id}
                onClick={() => handleInventoryClick(item.id)}
                className="relative aspect-square bg-black/40 rounded-lg border border-white/5 hover:border-game-accent hover:bg-white/5 flex flex-col items-center justify-center transition-all group"
              >
                 <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                 <span className="absolute top-1 right-1 bg-game-primary text-white text-[9px] px-1.5 py-0.5 rounded font-mono shadow">
                    {inventory[item.id]}
                 </span>
                 <span className="text-[9px] text-slate-400 w-full text-center truncate px-1 mt-1">{item.name}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Kitchen;