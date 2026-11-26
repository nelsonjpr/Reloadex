import React from 'react';
import { motion } from 'framer-motion';

// Valores deben coincidir con los campos `generation` del dataset.
export const generations = [
  { id: 'Gen I', name: 'Gen I', region: 'Kanto', color: 'from-red-500 to-orange-500' },
  { id: 'Gen II', name: 'Gen II', region: 'Johto', color: 'from-yellow-500 to-amber-500' },
  { id: 'Gen III', name: 'Gen III', region: 'Hoenn', color: 'from-green-500 to-emerald-500' },
  { id: 'Gen IV', name: 'Gen IV', region: 'Sinnoh', color: 'from-blue-500 to-cyan-500' },
  { id: 'Gen V', name: 'Gen V', region: 'Teselia', color: 'from-indigo-500 to-purple-500' },
  { id: 'Gen VI', name: 'Gen VI', region: 'Kalos', color: 'from-purple-500 to-pink-500' },
  { id: 'Gen VII', name: 'Gen VII', region: 'Alola', color: 'from-orange-500 to-red-500' },
  { id: 'Gen VIII', name: 'Gen VIII', region: 'Galar', color: 'from-cyan-500 to-blue-500' },
  { id: 'Gen IX', name: 'Gen IX', region: 'Paldea', color: 'from-pink-500 to-rose-500' },
  { id: 'Gen Star', name: 'Gen Star', region: 'Región Star', color: 'from-violet-500 via-purple-500 to-fuchsia-500' },
];

const GenerationFilter = ({ selectedGeneration, onSelectGeneration }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectGeneration(null)}
        className={`rounded-2xl p-4 transition-all ${!selectedGeneration ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900' : 'glass-effect hover:bg-white/10'}`}
      >
        <div className="text-lg sm:text-xl font-bold mb-1 text-white/80">Todas</div>
        <div className="text-xs text-white/60">Sin filtro</div>
      </motion.button>
      {generations.map((gen) => {
        const isSelected = selectedGeneration === gen.id;
        return (
          <motion.button
            key={gen.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectGeneration(gen.id)}
            className={`rounded-2xl p-4 transition-all ${
              isSelected
                ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900'
                : 'glass-effect hover:bg-white/10'
            }`}
          >
            <div
              className={`text-center ${
                isSelected
                  ? `bg-gradient-to-r ${gen.color} bg-clip-text text-transparent font-bold`
                  : 'text-white/80'
              }`}
            >
              <div className="text-lg sm:text-xl font-bold mb-1">{gen.name}</div>
              <div className="text-xs text-white/60">{gen.region}</div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default GenerationFilter;
