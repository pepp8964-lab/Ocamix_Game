import React, { useState, useEffect, useRef } from 'react';
import { ToolType } from '../types';

interface Props {
  tool: ToolType;
  onSuccess: () => void;
  onFailure: () => void;
}

// Categorize tools
const TIMING_TOOLS = [ToolType.PAN, ToolType.POT, ToolType.OVEN, ToolType.MICROWAVE, ToolType.FREEZER];
const MASHING_TOOLS = [ToolType.KNIFE, ToolType.BLENDER, ToolType.HANDS, ToolType.HAMMER, ToolType.GRATER, ToolType.MAGIC_WAND];

const CookingMinigame: React.FC<Props> = ({ tool, onSuccess, onFailure }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  
  // Game Settings
  const isTimingGame = TIMING_TOOLS.includes(tool);
  const targetZone = { start: 60, end: 85 }; // Green zone for timing
  const speed = isTimingGame ? 1.5 : 0; // Auto-fill speed
  const mashPower = 12; // How much progress per click

  const timerRef = useRef<number | null>(null);

  // --- TIMING GAME LOOP ---
  useEffect(() => {
    if (isTimingGame && status === 'playing') {
      timerRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleGameOver(false);
            return 100;
          }
          return prev + speed;
        });
      }, 20);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimingGame, status]);

  // --- HANDLE INTERACTION ---
  const handleAction = (e?: React.PointerEvent) => {
    if (e) e.preventDefault(); // Prevent touch scroll/zoom
    if (status !== 'playing') return;

    if (isTimingGame) {
      // STOP THE BAR
      if (progress >= targetZone.start && progress <= targetZone.end) {
        handleGameOver(true);
      } else {
        handleGameOver(false);
      }
    } else {
      // MASH TO FILL
      const newProgress = progress + mashPower;
      setProgress(newProgress);
      if (newProgress >= 100) {
        handleGameOver(true);
      }
    }
  };

  const handleGameOver = (won: boolean) => {
    setStatus(won ? 'won' : 'lost');
    if (timerRef.current) clearInterval(timerRef.current);

    // Delay to show result animation
    setTimeout(() => {
      if (won) onSuccess();
      else onFailure();
    }, 1000);
  };

  // --- TEXTS ---
  const getInstructions = () => {
    if (isTimingGame) return "Тисни, коли буде в ЗЕЛЕНІЙ зоні!";
    return "Тисни якомога ШВИДШЕ!";
  };

  const getButtonText = () => {
    if (status === 'won') return 'СМАЧНО!';
    if (status === 'lost') return 'ЗГОРІЛО!';
    if (isTimingGame) return 'СТОП!';
    return 'ТИСНИ!';
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center backdrop-blur-md animate-[fadeIn_0.2s]">
      
      {/* RESULT OVERLAY */}
      {status !== 'playing' && (
        <div className={`absolute inset-0 z-20 flex items-center justify-center bg-black/50 animate-[fadeIn_0.2s]`}>
           <div className={`text-8xl animate-[bounce_0.5s] ${status === 'won' ? 'scale-125' : 'rotate-12'}`}>
             {status === 'won' ? '✨' : '💥'}
           </div>
        </div>
      )}

      <div className="relative w-full max-w-md p-8 flex flex-col items-center gap-8 z-10">
        
        <h2 className="text-4xl font-display text-white uppercase text-center drop-shadow-lg">
          {status === 'playing' ? tool : (status === 'won' ? 'УСПІХ!' : 'ПРОВАЛ!')}
        </h2>

        {/* PROGRESS BAR CONTAINER */}
        <div className="w-full h-20 bg-slate-800 rounded-full border-4 border-slate-600 relative overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          
          {/* TARGET ZONE (Only for timing) */}
          {isTimingGame && (
            <div 
              className="absolute top-0 bottom-0 bg-green-500/30 border-x-4 border-green-500/50 z-10"
              style={{ left: `${targetZone.start}%`, width: `${targetZone.end - targetZone.start}%` }}
            >
               <div className="absolute inset-0 animate-pulse bg-green-400/10"></div>
            </div>
          )}

          {/* FILL BAR */}
          <div 
            className={`h-full transition-all duration-75 relative ${
              status === 'lost' ? 'bg-red-600' : 
              status === 'won' ? 'bg-green-500' : 
              isTimingGame ? 'bg-amber-500' : 'bg-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          >
             <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 shadow-[0_0_10px_white]"></div>
          </div>
        </div>

        <p className="text-slate-300 font-bold text-lg animate-pulse">
          {getInstructions()}
        </p>

        {/* ACTION BUTTON */}
        <button 
          onPointerDown={handleAction}
          disabled={status !== 'playing'}
          className={`
            w-48 h-48 rounded-full font-display font-black text-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]
            transition-all transform active:scale-95 select-none touch-manipulation
            border-8
            ${status === 'playing' 
               ? 'bg-game-primary border-game-highlight text-white hover:scale-105 cursor-pointer' 
               : status === 'won' 
                 ? 'bg-green-600 border-green-400 text-white scale-110'
                 : 'bg-red-600 border-red-400 text-white opacity-80'
            }
          `}
        >
          {getButtonText()}
        </button>

      </div>
    </div>
  );
};

export default CookingMinigame;