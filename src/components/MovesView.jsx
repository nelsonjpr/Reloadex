import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft, Zap } from 'lucide-react';
import { moves, moveCategories } from '../data/moves';
import { safeTop } from '../utils/safeArea';

const MovesView = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('MT');
  const [expandedMove, setExpandedMove] = useState(null);

  const categoryNames = {
    MO: 'Máquinas Ocultas',
    MT: 'Máquinas Técnicas',
    DT: 'Discos Técnicos',
    TM_TUTOR: 'Tutores'
  };

  const categoryColors = {
    MO: 'from-blue-500 to-cyan-500',
    MT: 'from-purple-500 to-pink-500',
    DT: 'from-orange-500 to-red-500',
    TM_TUTOR: 'from-green-500 to-emerald-500'
  };

  const currentMoves = moves[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div className="container mx-auto px-4 pb-8 max-w-6xl" style={safeTop(32)}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Movimientos</h1>
            <p className="text-white/60">Base de datos completa de movimientos</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {moveCategories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedMove(null);
              }}
              className={`p-4 rounded-2xl transition-all ${
                selectedCategory === cat
                  ? `bg-gradient-to-r ${categoryColors[cat]} text-white shadow-lg`
                  : 'glass-effect text-white/70 hover:text-white'
              }`}
            >
              <div className="text-sm font-bold">{categoryNames[cat]}</div>
              <div className="text-xs opacity-80">{moves[cat].length} movimientos</div>
            </motion.button>
          ))}
        </div>

        {/* Moves List */}
        <div className="glass-dark rounded-3xl p-6">
          <div className="space-y-2">
            {currentMoves.map((move) => (
              <motion.div
                key={move.id}
                layout
                className="glass-effect rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedMove(expandedMove === move.id ? null : move.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-left">
                      <span className="text-sm font-bold text-purple-400">{move.id}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{move.name}</div>
                      {move.type && (
                        <div className="text-xs text-white/60 capitalize">{move.type} • {move.category}</div>
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedMove === move.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-white/60" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedMove === move.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-white/10">
                        <p className="text-white/80 text-sm mb-3">{move.description}</p>
                        <div className="grid grid-cols-2 gap-3">
                          {move.power && (
                            <div className="glass-dark rounded-lg p-2">
                              <div className="text-xs text-white/60">Potencia</div>
                              <div className="font-bold text-purple-400">{move.power}</div>
                            </div>
                          )}
                          {move.accuracy && (
                            <div className="glass-dark rounded-lg p-2">
                              <div className="text-xs text-white/60">Precisión</div>
                              <div className="font-bold text-purple-400">{move.accuracy}%</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovesView;
