import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { abilities, searchAbilities, getPokemonByAbility } from '../data/abilities';
import { safeTop } from '../utils/safeArea';

const PAGE_SIZE = 60;

const AbilitiesView = ({ onBack }) => {
  const [expandedAbility, setExpandedAbility] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // La búsqueda se calcula una sola vez por cambio diferido, no en cada frame.
  const filteredAbilities = useMemo(
    () => (deferredSearch ? searchAbilities(deferredSearch) : abilities),
    [deferredSearch],
  );
  const visibleAbilities = filteredAbilities.slice(0, visibleCount);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [deferredSearch]);

  // Solo se consulta la lista completa de Pokémon cuando se abre una habilidad.
  const expandedPokemon = useMemo(
    () => (expandedAbility == null ? [] : getPokemonByAbility(expandedAbility)),
    [expandedAbility],
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div className="container mx-auto px-4 pb-8 max-w-4xl" style={safeTop(32)}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            aria-label="Volver"
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
            className="w-full pl-14 pr-4 py-4 rounded-2xl glass-dark text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
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
            {visibleAbilities.map((ability) => {
              const expanded = expandedAbility === ability.id;
              return (
                <div
                  key={`${ability.id}-${ability.name}`}
                  className="glass-effect deferred-card rounded-xl overflow-hidden"
                  style={{ '--deferred-height': '68px' }}
                >
                  <button
                    onClick={() => setExpandedAbility(expanded ? null : ability.id)}
                    aria-expanded={expanded}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <span className="font-semibold text-white text-left">{ability.name}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-white/60 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-white/10">
                      <p className="text-white/80 text-sm leading-relaxed mb-3">
                        {ability.description}
                      </p>
                      <div className="glass-dark rounded-lg p-3">
                        <div className="text-xs text-white/60 mb-2">Pokémon con esta habilidad:</div>
                        {expandedPokemon.length > 0 ? (
                          <div className="text-sm text-purple-300">
                            {expandedPokemon.join(', ')}
                          </div>
                        ) : (
                          <div className="text-sm text-white/40 italic">
                            Ninguno en la base de datos actual
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {visibleCount < filteredAbilities.length && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[11px] font-bold text-white/70 transition hover:bg-white/10 active:scale-95"
              >
                Mostrar {Math.min(PAGE_SIZE, filteredAbilities.length - visibleCount)} habilidades más
              </button>
            </div>
          )}

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
