import React from 'react';
import { motion } from 'framer-motion';
import { typeColors, typeTranslations } from '../data/pokemon';
import { typeIcon } from '../utils/sprites';

const TypeFilter = ({ selectedType, onSelectType }) => {
  const types = Object.keys(typeColors);

  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
      {types.map((type) => {
        const isSelected = selectedType === type;
        const label = typeTranslations[type] || type;
        return (
          <motion.button
            key={type}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelectType(type)}
            aria-label={`Filtrar por ${label}`}
            aria-pressed={isSelected}
            title={label}
            className={`relative flex aspect-square items-center justify-center rounded-xl p-1 transition-all sm:rounded-2xl sm:p-1.5 ${
              isSelected
                ? 'z-10 scale-105 ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                : 'hover:scale-105 hover:brightness-110'
            }`}
            style={{
              backgroundColor: isSelected ? typeColors[type] : `${typeColors[type]}66`,
              boxShadow: isSelected ? `0 8px 18px -10px ${typeColors[type]}` : 'none',
            }}
          >
            <img
              src={typeIcon(type, true)}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain pixelated drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] sm:h-8 sm:w-8"
            />
            <span className="sr-only">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default TypeFilter;
