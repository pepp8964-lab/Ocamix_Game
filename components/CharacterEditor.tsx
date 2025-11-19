
import React from 'react';
import { CHAR_HEADS, CHAR_BODIES, CHAR_HANDS, CHAR_BGS } from '../constants';
import { CharacterAppearance } from '../types';

interface Props {
  appearance: CharacterAppearance;
  onChange: (newApp: CharacterAppearance) => void;
  onBack: () => void;
}

const CharacterEditor: React.FC<Props> = ({ appearance, onChange, onBack }) => {

  const updatePart = (part: keyof CharacterAppearance, value: string) => {
    onChange({ ...appearance, [part]: value });
  };

  return (
    <div className="h-screen flex flex-col bg-game-bg text-white p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white px-4 py-2 bg-white/10 rounded-lg backdrop-blur border border-white/5 hover:border-white/20 transition-all">← Меню</button>
        <h2 className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-highlight">Стиль Шефа</h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center justify-center">
        
        {/* PREVIEW CARD */}
        <div className="relative group perspective-1000">
            {/* Background Glows */}
            <div className={`absolute inset-0 blur-[60px] opacity-50 ${appearance.bg.includes('slate') ? 'bg-blue-600' : appearance.bg.replace('bg-gradient-to-br from-', 'bg-').replace(' to-', '-500 bg-')}`}></div>
            
            <div className={`
               w-80 h-[450px] lg:w-96 lg:h-[500px] rounded-3xl border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]
               relative overflow-hidden transition-all duration-500 shrink-0 flex flex-col
               ${appearance.bg}
            `}>
               {/* Card Texture */}
               <div className="absolute inset-0 particle-bg opacity-20"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10"></div>
               
               {/* Character Composite */}
               <div className="flex-1 relative flex items-center justify-center mt-10 animate-float">
                  {/* Body Layer */}
                  <div className="text-[140px] absolute top-20 z-10 drop-shadow-2xl">{appearance.body}</div>
                  {/* Head Layer */}
                  <div className="text-[110px] absolute top-0 z-20 drop-shadow-2xl filter brightness-110">{appearance.head}</div>
                  {/* Hand Layer - With slight rotation and offset */}
                  <div className="text-[80px] absolute right-4 top-32 z-30 drop-shadow-2xl rotate-[15deg] animate-pulse-fast">{appearance.hand}</div>
               </div>

               {/* Card Footer Info */}
               <div className="relative z-40 p-6 bg-black/40 backdrop-blur-md border-t border-white/10">
                   <div className="text-xs text-game-accent font-bold uppercase tracking-widest mb-1">Гранд-Шеф</div>
                   <div className="h-1 w-12 bg-gradient-to-r from-game-primary to-transparent mb-2"></div>
                   <div className="text-[10px] text-slate-400">
                      Легендарний кулінар, здатний перетворити сміття на делікатес.
                   </div>
               </div>

               {/* Holographic Overlay */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md bg-game-surface/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 overflow-y-auto max-h-[40vh] lg:max-h-[80vh] shadow-2xl">
           <div className="space-y-8">
              {[
                { label: 'Обличчя', list: CHAR_HEADS, key: 'head' },
                { label: 'Одяг', list: CHAR_BODIES, key: 'body' },
                { label: 'Інструмент', list: CHAR_HANDS, key: 'hand' },
              ].map((section) => (
                <div key={section.key}>
                   <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-1">
                       <h3 className="text-xs text-game-primary uppercase font-bold tracking-wider">{section.label}</h3>
                       <span className="text-[10px] text-slate-500">{section.list.length} доступно</span>
                   </div>
                   <div className="grid grid-cols-5 gap-2">
                      {section.list.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => updatePart(section.key as any, item.emoji)}
                          className={`
                            aspect-square rounded-xl flex items-center justify-center text-2xl border transition-all duration-200
                            ${appearance[section.key as keyof CharacterAppearance] === item.emoji 
                                ? 'bg-white/10 border-game-primary shadow-[0_0_15px_rgba(124,58,237,0.4)] scale-110' 
                                : 'bg-black/30 border-transparent hover:bg-white/5 hover:scale-105'}
                          `}
                        >
                           {item.emoji}
                        </button>
                      ))}
                   </div>
                </div>
              ))}

              <div>
                 <h3 className="text-xs text-game-primary uppercase font-bold mb-3 tracking-wider border-b border-white/5 pb-1">Аура</h3>
                 <div className="flex flex-wrap gap-3">
                    {CHAR_BGS.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => updatePart('bg', bg.class)}
                        className={`
                            w-12 h-12 rounded-full border-2 shadow-inner transition-transform duration-300
                            ${bg.class} 
                            ${appearance.bg === bg.class 
                                ? 'border-white scale-110 ring-2 ring-offset-2 ring-offset-black ring-game-primary' 
                                : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}
                        `}
                      />
                    ))}
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default CharacterEditor;