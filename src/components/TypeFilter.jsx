import React from 'react';
import { motion } from 'framer-motion';
import { typeTranslations } from '../data/typeMeta';
import { typeIconHd } from '../utils/sprites';

const MAX_TYPES = 2;

// Paleta vibrante del filtro (HEX completos, sin capas grises semitransparentes).
const FILTER_COLORS = {
  rock: '#C7A64A',
  ground: '#E6B75C',
  ghost: '#8B62C9',
  bug: '#92C61F',
  psychic: '#F4589B',
  electric: '#F2B705',
  dragon: '#8A63F2',
  ice: '#4FC3F7',
  grass: '#3DA224',
  steel: '#7E97B8',
  fire: '#FF421C',
  water: '#3499FF',
  fairy: '#F07ABE',
  dark: '#8A6270',
  normal: '#A8A878',
  poison: '#A83FC4',
  fighting: '#E04A2F',
  flying: '#8F83E8',
};

const darken = (hex, amount = 0.3) => {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(value.slice(offset, offset + 2), 16);
    return Math.max(0, Math.round(channel * (1 - amount)));
  });
  return `#${channels.map((n) => n.toString(16).padStart(2, '0')).join('')}`;
};

const TypeFilter = ({ selectedTypes = [], onToggleType, onClear, onDone }) => {
  const types = Object.keys(FILTER_COLORS);
  const atMax = selectedTypes.length >= MAX_TYPES;

  return (
    <div>
      <div className="grid grid-cols-4 justify-items-center gap-3 sm:grid-cols-6">
        {types.map((type) => {
          const order = selectedTypes.indexOf(type);
          const isSelected = order >= 0;
          const disabled = atMax && !isSelected;
          const label = typeTranslations[type] || type;
          const color = FILTER_COLORS[type];
          const shadowColor = darken(color, 0.38);

          return (
            <motion.button
              key={type}
              type="button"
              disabled={disabled}
              whileHover={disabled ? undefined : { y: -2 }}
              whileTap={disabled ? undefined : { scale: 0.95, y: 0 }}
              onClick={() => onToggleType(type)}
              aria-label={`Filtrar por ${label}`}
              aria-pressed={isSelected}
              title={disabled ? `Máximo ${MAX_TYPES} tipos` : label}
              className={`type-filter-button relative flex aspect-square w-full max-w-[88px] items-center justify-center rounded-[20px] border border-white/20 ${
                disabled
                  ? 'cursor-not-allowed opacity-40'
                  : isSelected
                    ? 'z-10 scale-[1.04] ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                    : 'hover:brightness-110'
              }`}
              style={{
                backgroundColor: color,
                boxShadow: isSelected
                  ? `0 10px 22px -6px ${shadowColor}, 0 3px 8px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.35)`
                  : `0 6px 14px -5px ${shadowColor}, 0 2px 5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.28)`,
              }}
            >
              <img
                src={typeIconHd(type)}
                alt=""
                aria-hidden="true"
                draggable="false"
                className="type-filter-icon h-1/2 w-1/2 object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
              />
              {isSelected && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-slate-900 shadow-lg">
                  {order + 1}
                </span>
              )}
              <span className="sr-only">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onClear}
          disabled={selectedTypes.length === 0}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          Limpiar
        </button>
        <span className="text-center text-[11px] text-white/50">
          {selectedTypes.length}/{MAX_TYPES} tipos
          {selectedTypes.length === MAX_TYPES && ' · deben tener ambos'}
        </span>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-[0_6px_16px_rgba(56,189,248,0.3)] transition hover:bg-sky-400 active:scale-95"
        >
          Listo
        </button>
      </div>
    </div>
  );
};

export default TypeFilter;
