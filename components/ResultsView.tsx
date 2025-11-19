
import React, { useState, useEffect } from 'react';
import { DishResult } from '../types';
import { generateSpeech, generateDishImage, replyToExcuse } from '../services/geminiService';

interface Props {
  result: DishResult;
  dishName: string;
  onClose: () => void;
}

const ResultsView: React.FC<Props> = ({ result, dishName, onClose }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);
  
  // Excuse State
  const [excuseMode, setExcuseMode] = useState<number | null>(null); // Index of review being disputed
  const [excuseText, setExcuseText] = useState('');
  const [isSendingExcuse, setIsSendingExcuse] = useState(false);
  // Store local updates to reviews (adding AI replies)
  const [localReviews, setLocalReviews] = useState(result.reviews);

  useEffect(() => {
    let active = true;
    if (dishName) {
      generateDishImage(dishName, result.description).then(url => {
        if (active && url) setImageUrl(url);
      });
    }
    setTimeout(() => setShowScore(true), 800);
    return () => { active = false; };
  }, [dishName, result.description]);

  const playReview = async (text: string, index: number) => {
    if (playingIndex !== null) return; 
    setPlayingIndex(index);

    try {
      const voices = ['Puck', 'Kore', 'Fenrir'];
      const voice = voices[index % voices.length];
      const audioBufferData = await generateSpeech(text, voice);

      if (audioBufferData.byteLength === 0) {
        setPlayingIndex(null);
        return;
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const byteView = new Uint8Array(audioBufferData);
      const dataInt16 = new Int16Array(byteView.buffer);
      
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => setPlayingIndex(null);
      source.start();
    } catch (error) {
      console.error(error);
      setPlayingIndex(null);
    }
  };

  const handleShare = async () => {
      const text = `Я приготував "${dishName}" в Кулінарному Алхіміку! Оцінка: ${result.totalScore.toFixed(1)}/10.\n"${result.description}"`;
      if (navigator.share) {
          await navigator.share({ title: dishName, text });
      } else {
          await navigator.clipboard.writeText(text);
          alert("Рецепт скопійовано!");
      }
  };

  const sendExcuse = async (index: number) => {
     if (!excuseText.trim()) return;
     setIsSendingExcuse(true);
     const review = localReviews[index];
     
     // Pass review.text as the originalReview context
     const reply = await replyToExcuse(review.criticName, review.persona, dishName, excuseText, review.text);
     
     setLocalReviews(prev => prev.map((r, i) => i === index ? { ...r, reply } : r));
     setExcuseMode(null);
     setExcuseText('');
     setIsSendingExcuse(false);
  };

  if (!result) return null;

  const isSuccess = result.totalScore >= 3;
  const getScoreColor = (score: number) => {
      if (score >= 8.5) return 'text-game-success drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]';
      if (score >= 5.0) return 'text-game-accent drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]';
      return 'text-game-danger drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse"></div>
      
      {/* Radial Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] rounded-full blur-[150px] opacity-20 ${isSuccess ? 'bg-game-success' : 'bg-game-danger'}`}></div>

      <div className="relative z-10 w-full max-w-7xl h-full md:h-[90vh] md:rounded-3xl border border-white/10 bg-game-surface/80 backdrop-blur-2xl flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* LEFT: PRESENTATION */}
        <div className="w-full md:w-5/12 p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-b from-transparent to-black/40">
            
            {/* DISH IMAGE */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-1 bg-gradient-to-br from-white/20 to-transparent mb-8 group">
                <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slow opacity-50"></div>
                <div className="w-full h-full rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
                   {imageUrl ? (
                      <img src={imageUrl} alt={dishName} className="w-full h-full object-cover animate-scale-in hover:scale-110 transition-transform duration-[10s]" />
                   ) : (
                      <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center animate-pulse">
                          <span className="text-4xl">✨</span>
                      </div>
                   )}
                </div>
                {/* Score Badge Overlay */}
                <div className={`
                   absolute -bottom-4 -right-4 md:bottom-0 md:right-0 rotate-12
                   glass-panel p-4 rounded-2xl border border-white/20 transform transition-all duration-700 shadow-2xl z-20
                   ${showScore ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
                `}>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center mb-1">Рейтинг</div>
                    <div className={`text-6xl font-tech font-black ${getScoreColor(result.totalScore)}`}>
                        {result.totalScore.toFixed(1)}
                    </div>
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-display text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-lg max-w-md leading-tight mb-2">
                {dishName}
            </h1>
            <p className="text-slate-400 text-sm text-center max-w-xs italic mb-6">"{result.description}"</p>
            
            <div className="flex gap-3 w-full max-w-xs">
                <div className={`flex-1 flex flex-col items-center py-3 rounded-xl border border-white/5 ${result.rewardGold < 0 ? 'bg-game-danger/10' : 'bg-game-surface'}`}>
                    <span className={`font-bold text-xl ${result.rewardGold < 0 ? 'text-game-danger' : 'text-game-accent'}`}>
                      {result.rewardGold > 0 ? '+' : ''}{result.rewardGold}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Золото</span>
                </div>
                <div className={`flex-1 flex flex-col items-center py-3 rounded-xl border border-white/5 ${result.rewardXp < 0 ? 'bg-game-danger/10' : 'bg-game-surface'}`}>
                    <span className={`font-bold text-xl ${result.rewardXp < 0 ? 'text-game-danger' : 'text-game-primary'}`}>
                      {result.rewardXp > 0 ? '+' : ''}{result.rewardXp}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Досвід</span>
                </div>
            </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className="w-full md:w-7/12 flex flex-col bg-black/20">
            
            {/* TAB HEADER (Visual) */}
            <div className="flex border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-20">
                <div className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-widest text-white border-b-2 border-game-primary bg-white/5">
                   Вердикт Критиків
                </div>
            </div>

            {/* REVIEWS */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {localReviews.map((rev, idx) => (
                    <div key={idx} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                        <div className="flex gap-4 group">
                            <div className="flex flex-col items-center gap-2">
                               <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-xl bg-black/40 shadow-lg">
                                   👤
                               </div>
                               <div className={`text-xs font-bold px-2 py-0.5 rounded ${rev.score >= 5 ? 'bg-game-success text-black' : 'bg-game-danger text-white'}`}>
                                 {rev.score.toFixed(1)}
                               </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                                {/* Speech Bubble */}
                                <div className="glass-panel p-4 rounded-2xl rounded-tl-none border border-white/5 relative transition-all hover:border-white/20">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-game-primary font-bold text-sm">{rev.criticName}</span>
                                        <button onClick={() => playReview(rev.text, idx)} className="text-slate-500 hover:text-white transition-colors">
                                            {playingIndex === idx ? '🔊' : '🔈'}
                                        </button>
                                    </div>
                                    <p className="text-slate-200 text-sm leading-relaxed">"{rev.text}"</p>
                                    
                                    {/* EXCUSE BUTTON */}
                                    {!rev.reply && excuseMode !== idx && (
                                       <button 
                                         onClick={() => setExcuseMode(idx)}
                                         className="text-[10px] text-slate-500 hover:text-game-accent mt-2 underline decoration-dashed underline-offset-4"
                                       >
                                          Виправдатися
                                       </button>
                                    )}
                                </div>

                                {/* REPLY AREA */}
                                {rev.reply && (
                                    <div className="ml-8 animate-slide-up">
                                        <div className="bg-game-primary/10 border border-game-primary/30 p-3 rounded-xl rounded-tr-none text-right">
                                            <p className="text-xs text-game-highlight italic">"{rev.reply}"</p>
                                        </div>
                                    </div>
                                )}

                                {/* INPUT AREA */}
                                {excuseMode === idx && (
                                    <div className="glass-panel p-2 rounded-xl animate-scale-in flex gap-2 items-center">
                                        <input 
                                          autoFocus
                                          value={excuseText}
                                          onChange={(e) => setExcuseText(e.target.value)}
                                          placeholder="Ваше виправдання..."
                                          className="flex-1 bg-transparent text-sm text-white outline-none px-2"
                                          onKeyDown={(e) => e.key === 'Enter' && sendExcuse(idx)}
                                        />
                                        <button 
                                          onClick={() => sendExcuse(idx)}
                                          disabled={isSendingExcuse}
                                          className="bg-game-primary text-white text-xs px-3 py-1 rounded hover:bg-game-highlight disabled:opacity-50"
                                        >
                                           {isSendingExcuse ? '...' : '➤'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* RECIPE SECTION */}
                <div className="mt-8 pt-8 border-t border-white/10">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Рецепт Шефа</h3>
                        <button onClick={handleShare} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-white transition-colors flex items-center gap-1 border border-white/10">
                            📤 <span className="hidden sm:inline">Поділитись</span>
                        </button>
                     </div>
                     
                     <div className="space-y-6 relative pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        {result.steps.map((step, i) => (
                            <div key={i} className="relative flex items-start gap-4 group">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-lg shrink-0 group-hover:border-game-accent transition-colors">
                                   {step.icon}
                                </div>
                                <div className="pt-1">
                                   <h4 className="text-sm font-bold text-slate-200">{step.action}</h4>
                                   <p className="text-xs text-slate-500">{step.description}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-xl z-20">
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-white text-black font-display font-black text-xl uppercase tracking-[0.2em] rounded-xl hover:bg-game-accent hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    Далі
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ResultsView;
