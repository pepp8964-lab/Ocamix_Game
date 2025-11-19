import React from 'react';
import { Ingredient } from '../types';

interface Props {
  ingredient: Ingredient;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientCard: React.FC<Props> = ({ ingredient, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group p-4 rounded-xl transition-all duration-300
        flex flex-col items-center justify-center gap-2
        border-2
        ${isSelected 
          ? 'border-brand-accent bg-brand-primary scale-105 shadow-[0_0_15px_rgba(233,69,96,0.6)]' 
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:scale-105 hover:border-white/30'}
      `}
    >
      <span className="text-4xl filter drop-shadow-lg group-hover:animate-bounce">
        {ingredient.emoji}
      </span>
      <span className={`text-xs font-bold text-center ${isSelected ? 'text-brand-accent' : 'text-gray-300'}`}>
        {ingredient.name}
      </span>
      
      {/* Type Badge */}
      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${ingredient.color}`} />
    </button>
  );
};

export default IngredientCard;
