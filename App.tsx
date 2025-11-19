
import React, { useState, useEffect } from 'react';
import { LEVELS_XP, BASE_INGREDIENTS, ALL_ITEMS } from './constants';
import { Ingredient, GameState, DishResult, PlayerProfile, Critic, CharacterAppearance, ItemRegistry } from './types';
import Kitchen from './components/Kitchen';
import ResultsView from './components/ResultsView';
import CharacterEditor from './components/CharacterEditor';
import Shop from './components/Shop';
import { evaluateDish, generateCritics } from './services/geminiService';

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [loading, setLoading] = useState(false);
  
  // Initial Inventory: Some basics
  const initialInventory: { [id: string]: number } = {};
  BASE_INGREDIENTS.filter(i => i.tier === 1).slice(0,8).forEach(i => initialInventory[i.id] = 3);

  // Create a registry from constants
  const initialRegistry: ItemRegistry = {};
  ALL_ITEMS.forEach(item => initialRegistry[item.id] = item);

  const [itemRegistry, setItemRegistry] = useState<ItemRegistry>(initialRegistry);

  const [profile, setProfile] = useState<PlayerProfile>({
    gold: 150,
    xp: 0,
    level: 1,
    inventory: initialInventory,
    appearance: { head: '🙂', body: '👕', hand: '🔪', bg: 'bg-slate-700' },
    name: 'Шеф',
    water: 100,
  });
  
  const [roundCritics, setRoundCritics] = useState<Critic[]>([]);
  const [dishResult, setDishResult] = useState<DishResult | null>(null);
  
  // --- LOGIC ---

  useEffect(() => {
    const nextLevelXp = LEVELS_XP[profile.level];
    if (nextLevelXp && profile.xp >= nextLevelXp) {
      setProfile(p => ({ ...p, level: p.level + 1 }));
    }
  }, [profile.xp, profile.level]);

  const startRound = async () => {
    setLoading(true);
    try {
       const critics = await generateCritics(profile.level);
       setRoundCritics(critics);
       setGameState(GameState.KITCHEN);
    } catch (e) {
       console.error(e);
    } finally {
       setLoading(false);
    }
  };

  const handleBuy = (item: Ingredient, qty: number) => {
    // Register item if custom
    if (item.isCustom && !itemRegistry[item.id]) {
        setItemRegistry(prev => ({ ...prev, [item.id]: item }));
    }

    if (profile.gold >= item.price * qty) {
      setProfile(p => ({
        ...p,
        gold: p.gold - (item.price * qty),
        inventory: {
          ...p.inventory,
          [item.id]: (p.inventory[item.id] || 0) + qty
        }
      }));
    }
  };

  const handleConsumeItem = (id: string) => {
    setProfile(p => ({
      ...p,
      inventory: {
        ...p.inventory,
        [id]: Math.max(0, (p.inventory[id] || 0) - 1)
      }
    }));
  };

  const handleFinishDish = async (ingredients: Ingredient[]) => {
    setLoading(true);
    try {
      // Calculate Total Cost of Ingredients used
      const totalCost = ingredients.reduce((sum, ing) => {
          // Try to find base price if it's a processed item
          const basePrice = itemRegistry[ing.baseId || ing.id]?.price || ing.price || 10;
          return sum + basePrice;
      }, 0);

      const result = await evaluateDish(ingredients, roundCritics, totalCost);
      setDishResult(result);
      
      // Apply Rewards (Or Penalties if score < 3)
      let goldChange = result.rewardGold;
      let xpChange = result.rewardXp;
      
      if (result.totalScore < 3.0) {
          // Ensure penalties are actually negative
          if (goldChange > 0) goldChange = -goldChange;
          if (xpChange > 0) xpChange = -xpChange;
          
          // Minimum penalty
          goldChange = Math.min(goldChange, -10); 
          xpChange = Math.min(xpChange, -20);
      }

      setProfile(p => ({
         ...p,
         gold: p.gold + goldChange,
         xp: p.xp + xpChange
      }));
      setGameState(GameState.RESULT);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateAppearance = (newApp: CharacterAppearance) => {
     setProfile(p => ({...p, appearance: newApp}));
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-game-bg text-slate-100 font-sans selection:bg-game-primary selection:text-white overflow-hidden">
      
      {/* GLOBAL LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center backdrop-blur-md">
           <div className="w-20 h-20 border-4 border-game-primary border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(124,58,237,0.5)]"></div>
           <div className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-highlight animate-pulse">
               ГЕНЕРАЦІЯ...
           </div>
        </div>
      )}

      {/* Menu Overlay (Main Screen) */}
      {gameState === GameState.MENU && (
        <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 animate-pulse"></div>
           
           <div className={`w-56 h-56 rounded-3xl border-4 border-white/10 flex flex-col items-center justify-center mb-10 shadow-[0_0_80px_rgba(124,58,237,0.3)] ${profile.appearance.bg} relative overflow-hidden transition-all duration-500 animate-float`}>
               <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-white/20 to-transparent"></div>
               <div className="relative z-10 flex flex-col items-center mt-6">
                  <div className="text-[80px] leading-[0.6] z-20 drop-shadow-2xl relative top-2">{profile.appearance.head}</div>
                  <div className="text-[90px] leading-[0.6] z-10 relative">{profile.appearance.body}</div>
                  <div className="text-[50px] absolute -right-8 top-12 z-30 rotate-12">{profile.appearance.hand}</div>
               </div>
           </div>

           <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-4 text-center tracking-tighter">
             ALCHEMIST<br/><span className="text-game-primary">CHEF</span>
           </h1>
           
           <div className="flex gap-4 mb-10">
               <div className="px-4 py-1 rounded-full bg-game-surface border border-game-accent/30 text-game-accent font-mono text-sm shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                 LVL {profile.level}
               </div>
               <div className="px-4 py-1 rounded-full bg-game-surface border border-game-primary/30 text-game-primary font-mono text-sm shadow-[0_0_10px_rgba(124,58,237,0.2)]">
                 {profile.gold} G
               </div>
           </div>

           <div className="flex flex-col gap-4 w-72 z-10">
              <button onClick={startRound} className="holo-border bg-game-primary/20 hover:bg-game-primary/40 text-white font-bold py-4 rounded-xl backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] tracking-widest uppercase border border-game-primary/50">
                ПОЧАТИ ЗМІНУ
              </button>
              <button onClick={() => setGameState(GameState.SHOP)} className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-colors uppercase text-sm tracking-wider">
                МАГАЗИН
              </button>
              <button onClick={() => setGameState(GameState.CHARACTER)} className="bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-colors uppercase text-sm tracking-wider">
                ПЕРСОНАЖ
              </button>
           </div>
        </div>
      )}

      {gameState === GameState.SHOP && (
        <Shop 
            gold={profile.gold} 
            inventory={profile.inventory}
            registry={itemRegistry} 
            onBuy={handleBuy} 
            onBack={() => setGameState(GameState.MENU)} 
        />
      )}

      {gameState === GameState.CHARACTER && (
        <CharacterEditor 
           appearance={profile.appearance} 
           onChange={updateAppearance} 
           onBack={() => setGameState(GameState.MENU)} 
        />
      )}
      
      {gameState === GameState.KITCHEN && (
        <Kitchen 
          inventory={profile.inventory}
          registry={itemRegistry}
          critics={roundCritics}
          waterLevel={profile.water}
          onConsumeItem={handleConsumeItem}
          onUseWater={(amt) => setProfile(p => ({...p, water: Math.max(0, p.water - amt)}))}
          onRefillWater={() => setProfile(p => ({...p, water: 100}))}
          onFinishDish={handleFinishDish}
          onExit={() => setGameState(GameState.MENU)}
        />
      )}

      {gameState === GameState.RESULT && dishResult && (
        <ResultsView result={dishResult} dishName={dishResult.name} onClose={() => setGameState(GameState.MENU)} />
      )}
    </div>
  );
};

export default App;
