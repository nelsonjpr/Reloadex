import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { abilities, searchAbilities, getPokemonByAbility } from '../data/abilities';

const AbilitiesView = ({ onBack }) => {
  const [expandedAbility, setExpandedAbility] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAbilities = searchTerm
    ? searchAbilities(searchTerm)
    : abilities;

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">Habilidades</h1>
            <p className="text-white/60">Base de datos completa de habilidades</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Buscar habilidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 rounded-2xl glass-dark text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Count */}
        <div className="text-center mb-6">
          <span className="glass-dark px-6 py-3 rounded-full text-sm font-semibold inline-block">
            <span className="text-white/60">Mostrando </span>
            <span className="text-purple-400 font-bold">{filteredAbilities.length}</span>
            <span className="text-white/60"> habilidades</span>
          </span>
        </div>

        {/* Abilities List */}
        <div className="glass-dark rounded-3xl p-6">
          <div className="space-y-2">
            {filteredAbilities.map((ability, index) => (
              <motion.div
                key={`${ability.name}-${index}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="glass-effect rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedAbility(expandedAbility === ability.name ? null : ability.name)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-white text-left">{ability.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedAbility === ability.name ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-white/60" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedAbility === ability.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-white/10">
                        <p className="text-white/80 text-sm leading-relaxed mb-3">
                          {ability.description}
                        </p>
                        {/* Pokémon con esta habilidad */}
                        <div className="glass-dark rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-2">Pokémon con esta habilidad:</div>
                          {(() => {
                            const pokemon = getPokemonByAbility(ability.name);
                            return pokemon.length > 0 ? (
                              <div className="text-sm text-purple-300">
                                {pokemon.join(', ')}
                              </div>
                            ) : (
                              <div className="text-sm text-white/40 italic">
                                Ninguno en la base de datos actual
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredAbilities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60">No se encontraron habilidades</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbilitiesView;
