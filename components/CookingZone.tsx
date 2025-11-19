
import React, { useState } from 'react';
import { Ingredient, ActionType, IngredientType, Critic } from '../types';
import { INGREDIENTS, COOKING_ACTIONS } from '../constants';

interface Props {
  availableIngredients: string[]; 
  critics: Critic[];
  onCook: (ingredients: { ingredient: Ingredient; qty: number }[], actions: ActionType[]) => void;
  onAbort: () => void;
}

const Kitchen: React.FC<Props> = ({ availableIngredients, critics, onCook, onAbort }) => {
  const [activeTab, setActiveTab] = useState<IngredientType>('meat');
  const [selectedIngredients, setSelectedIngredients] = useState<{ ingredient: Ingredient; qty: number }[]>([]);
  const [actionSequence, setActionSequence] = useState<ActionType[]>([]);

  const myIngredients = INGREDIENTS.filter(ing => availableIngredients.includes(ing.id));

  const addIngredient = (ing: Ingredient) => {
    setSelectedIngredients(prev => {
      const existing = prev.find(p => p.ingredient.id === ing.id);
      if (existing) return prev.map(p => p.ingredient.id === ing.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ingredient: ing, qty: 1 }];
    });
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients(prev => prev.filter(p => p.ingredient.id !== id));
  };

  const addAction = (type: ActionType) => {
    if (actionSequence.length < 8) {
      setActionSequence(prev => [...prev, type]);
    }
  };

  const removeAction = (index: number) => {
    setActionSequence(prev => prev.filter((_, i) => i !== index));
  };

  const categories: { id: IngredientType; icon: string }[] = [
    { id: 'meat', icon: '🥩' },
    { id: 'veg', icon: '🥦' },
    { id: 'spice', icon: '🌶️' },
    { id: 'weird', icon: '☣️' },
    { id: 'magic', icon: '🔮' },
  ];

  // Can cook logic: at least 1 ingredient AND 1 action
  const canCook = selectedIngredients.length > 0 && actionSequence.length > 0;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col gap-2 p-2 max-w-6xl mx-auto">
      
      {/* TOP: HUD & CRITICS */}
      <div className="flex justify-between items-start gap-4 min-h-[80px]">
        <button onClick={onAbort} className="bg-red-900/50 hover:bg-red-700 text-red-200 px-3 py-2 rounded-lg border border-red-700/50 text-sm">
          🚪 ВЫЙТИ
        </button>
        
        <div className="flex-1 flex justify-center gap-4">
           {critics.map(c => (
             <div key={c.id} className="bg-slate-800/80 border border-slate-600 rounded-lg p-2 flex items-center gap-2 min-w-[140px] shadow-lg">
                <div className="text-2xl">{c.avatar}</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-amber-500">{c.name}</span>
                  <span className="text-[9px] text-slate-400 leading-tight">{c.preferences.slice(0,20)}...</span>
                </div>
             </div>
           ))}
        </div>

        <button 
          onClick={() => onCook(selectedIngredients, actionSequence)}
          disabled={!canCook}
          className={`
            px-6 py-3 rounded-lg font-display text-xl uppercase tracking-widest transition-all shadow-lg
            ${canCook 
              ? 'bg-green-600 hover:bg-green-500 text-white animate-pulse shadow-green-500/30 cursor-pointer' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}
          `}
        >
          СЕРВИРОВАТЬ!
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden">
        
        {/* LEFT: PANTRY (Compact) */}
        <div className="md:w-1/3 bg-slate-900/90 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
          <div className="flex bg-slate-950 p-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-1 py-2 text-xl rounded-lg transition-colors ${activeTab === cat.id ? 'bg-slate-700 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {cat.icon}
              </button>
            ))}
          </div>
          <div className="p-2 grid grid-cols-4 gap-2 overflow-y-auto content-start flex-1 scrollbar-hide">
            {myIngredients.filter(i => i.type === activeTab).map(ing => (
              <button
                key={ing.id}
                onClick={() => addIngredient(ing)}
                className="aspect-square bg-slate-800 rounded border border-slate-600 hover:border-amber-500 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
                title={ing.name}
              >
                {ing.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: POT (Visual Stack) */}
        <div className="md:w-1/3 bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 relative flex flex-col items-center justify-end p-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="text-9xl">🍲</span>
            </div>
            
            <div className="w-full flex flex-wrap-reverse justify-center gap-2 max-h-[300px] overflow-y-auto scrollbar-hide z-10 pb-10">
              {selectedIngredients.map((item, idx) => (
                 <div key={idx} className="animate-[fadeIn_0.3s] bg-slate-800 px-3 py-1 rounded-full border border-slate-600 flex items-center gap-2 shadow-md">
                    <span>{item.ingredient.emoji}</span>
                    <span className="text-xs font-bold">{item.ingredient.name}</span>
                    {item.qty > 1 && <span className="bg-amber-500 text-black text-[10px] px-1 rounded font-bold">x{item.qty}</span>}
                    <button onClick={() => removeIngredient(item.ingredient.id)} className="text-slate-500 hover:text-red-400 ml-1">×</button>
                 </div>
              ))}
              {selectedIngredients.length === 0 && <span className="text-slate-600 text-sm">Бросьте что-нибудь в котел...</span>}
            </div>
            
            <div className="absolute bottom-0 w-full h-2 bg-amber-500/20 blur-xl"></div>
        </div>

        {/* RIGHT: ACTIONS (Grid) */}
        <div className="md:w-1/3 bg-slate-900/90 rounded-xl border border-slate-700 p-2 grid grid-cols-2 gap-2 content-start overflow-y-auto">
           {COOKING_ACTIONS.map(act => (
             <button
               key={act.type}
               onClick={() => addAction(act.type)}
               className={`${act.color} bg-opacity-20 hover:bg-opacity-40 border border-white/10 hover:border-white/50 rounded-lg p-3 flex items-center gap-3 transition-all group`}
             >
               <span className="text-2xl group-hover:scale-125 transition-transform">{act.emoji}</span>
               <span className="text-xs font-bold text-slate-200">{act.type}</span>
             </button>
           ))}
        </div>

      </div>

      {/* BOTTOM: TIMELINE */}
      <div className="h-20 bg-slate-950 rounded-xl border border-slate-800 flex items-center px-4 gap-4 overflow-x-auto relative">
         <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
         <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
         
         <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mr-2">Timeline:</span>
         
         {actionSequence.map((act, idx) => {
           const def = COOKING_ACTIONS.find(a => a.type === act);
           return (
             <div key={idx} className="relative group flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-lg">
                  {def?.emoji}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 rounded-full text-[8px] flex items-center justify-center text-slate-400 border border-slate-700">
                  {idx+1}
                </div>
                <button 
                  onClick={() => removeAction(idx)}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-red-500 opacity-0 group-hover:opacity-100 text-xs hover:scale-125 transition-all"
                >
                  🗑️
                </button>
                {idx < actionSequence.length - 1 && <div className="absolute top-1/2 -right-4 w-4 h-[2px] bg-slate-800"></div>}
             </div>
           );
         })}
         
         {actionSequence.length === 0 && <span className="text-slate-600 text-xs italic">Выберите действия справа...</span>}
      </div>
    </div>
  );
};

export default Kitchen;
