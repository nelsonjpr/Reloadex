import React from 'react';
import { motion } from 'framer-motion';
import { typeColors } from '../data/pokemon';

// Iconos de tipos simulados con emojis/símbolos
const typeIcons = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  ice: '❄️',
  fighting: '🥊',
  poison: '☠️',
  ground: '⛰️',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚙️',
  fairy: '✨'
};

const TypeFilter = ({ selectedType, onSelectType }) => {
  const types = Object.keys(typeColors);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {types.map((type) => {
        const isSelected = selectedType === type;
        return (
          <motion.button
            key={type}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectType(type)}
            className={`aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-2 sm:p-4 transition-all ${
              isSelected 
                ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-105' 
                : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: isSelected ? typeColors[type] : `${typeColors[type]}40`,
            }}
          >
            <div className="text-2xl sm:text-3xl mb-1">{typeIcons[type]}</div>
            <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight ${
              isSelected ? 'text-white' : 'text-white/80'
            }`}>
              {type.slice(0, 5)}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default TypeFilter;
