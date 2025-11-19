import React, { useEffect, useState } from 'react';

const FUN_MESSAGES = [
  "Уговариваем помидоры не взрываться...",
  "Обучаем ИИ дегустировать виртуальную еду...",
  "Добавляем щепотку магии...",
  "Ищем самого злого критика...",
  "Разогреваем антиматерию...",
  "Шинкуем данные...",
  "Генерируем вкусный запах...",
];

const LoadingScreen: React.FC = () => {
  const [message, setMessage] = useState(FUN_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = FUN_MESSAGES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % FUN_MESSAGES.length;
        return FUN_MESSAGES[nextIndex];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-brand-primary rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-brand-accent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce-slow">
          👨‍🍳
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-display text-white mb-4 text-center animate-pulse">
        Шеф работает...
      </h2>
      <p className="text-brand-light/70 text-center max-w-md min-h-[3rem]">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;
