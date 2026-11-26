import React from 'react';
import { motion } from 'framer-motion';
import { typeColors, typeTranslations } from '../data/pokemon';

const PokemonCard = ({ pokemon, onClick }) => {
  const primaryType = pokemon.types[0];
  const bgColor = typeColors[primaryType];

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer group relative"
    >
      {/* Card con efecto glass */}
      <div className="glass-dark rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
        {/* Header con número */}
        <div 
          className="px-6 py-3 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${bgColor}99 0%, ${bgColor}66 100%)`
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white/70">#{String(pokemon.id).padStart(3, '0')}</span>
            <div className="flex gap-1">
              {pokemon.types.map((type) => (
                <div
                  key={type}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColors[type] }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sprite Container */}
        <div className="relative p-6">
          {/* Círculo de fondo */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-10"
            style={{
              background: `radial-gradient(circle, ${bgColor} 0%, transparent 70%)`
            }}
          />
          
          {/* Sprite */}
          <div className="relative z-10 flex justify-center">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              src={`/sprites/normal/${Number(pokemon.id)}.gif`}
              alt={pokemon.name}
              className="w-32 h-32 object-contain pixelated drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          {/* Nombre */}
          <h3 className="text-2xl font-bold text-white mb-3 text-shadow">
            {pokemon.name}
          </h3>

          {/* Tipos */}
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-lg"
                style={{ backgroundColor: typeColors[type] }}
              >
                {typeTranslations[type]}
              </span>
            ))}
          </div>

          {/* Stats preview mini */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="glass-effect rounded-lg py-2">
              <div className="text-xs text-white/60">HP</div>
              <div className="text-sm font-bold">{(pokemon.stats?.hp ?? 0)}</div>
            </div>
            <div className="glass-effect rounded-lg py-2">
              <div className="text-xs text-white/60">ATK</div>
              <div className="text-sm font-bold">{(pokemon.stats?.attack ?? 0)}</div>
            </div>
            <div className="glass-effect rounded-lg py-2">
              <div className="text-xs text-white/60">DEF</div>
              <div className="text-sm font-bold">{(pokemon.stats?.defense ?? 0)}</div>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default PokemonCard;
