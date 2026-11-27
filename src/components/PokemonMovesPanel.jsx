import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X, BookOpen } from 'lucide-react';
import {
  getLearnset, learnsetMethods, moveDescription, moveItemName, moveName, tutorName,
} from '../data/learnsets';

// El peor caso (DT de Mew) tiene más de 800 entradas. Se entregan en tandas y
// cada fila decide si se abre, para que desplegar una no vuelva a renderizar
// las demás. `deferred-card` evita maquetar las que están fuera del panel.
const ENTRIES_PER_PAGE = 120;

const MoveEntry = memo(function MoveEntry({ entry, method, index, color, isOpen, onToggle }) {
  const [moveId, extra] = entry;
  const level = method === 'level' ? extra : null;
  const itemId = method === 'tm' ? extra : null;
  const tutorIndex = method === 'tutor' ? extra : null;
  const key = `${method}-${moveId}-${extra ?? index}`;
  const detail = method === 'tm'
    ? (itemId ? moveItemName(itemId) : '')
    : method === 'tutor'
      ? (tutorIndex ? tutorName(tutorIndex) : '')
      : '';

  return (
    <div
      className="glass-effect deferred-card overflow-hidden rounded-2xl"
      style={{ '--deferred-height': '70px' }}
    >
      <button
        type="button"
        onClick={() => onToggle(key)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-white/5"
      >
        {level != null && (
          <span
            className="pill shrink-0 px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums"
            style={{ background: `${color}26`, color }}
          >
            Nv. {level === 200 ? 'Evo.' : level === 201 ? 'Huevo' : level === 202 ? 'Evento' : level}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-white/90">
            {moveName(moveId)}
          </span>
          {detail && <span className="block truncate text-[10px] text-white/45">{detail}</span>}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-white/45 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <p className="border-t border-white/10 px-3.5 py-3 text-xs leading-5 text-white/65">
          {moveDescription(moveId) || 'Sin descripción en el juego.'}
        </p>
      )}
    </div>
  );
});

// Panel lazy de movimientos reales por Pokémon, con pestañas por método.
const PokemonMovesPanel = ({ pokemon, onClose, color = '#7dd3fc' }) => {
  const [method, setMethod] = useState('level');
  const [expanded, setExpanded] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ENTRIES_PER_PAGE);
  const learnset = useMemo(() => getLearnset(pokemon), [pokemon]);
  const entries = learnset?.[method] || [];

  useEffect(() => { setVisibleCount(ENTRIES_PER_PAGE); }, [method]);
  const toggleEntry = useCallback((key) => {
    setExpanded((current) => (current === key ? null : key));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="glass-dark mt-4 rounded-3xl border border-white/10 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: `${color}22`, color }}
          >
            <BookOpen size={17} />
          </span>
          <div>
            <h4 className="text-sm font-bold text-white">Movimientos de {pokemon.name}</h4>
            <p className="text-[11px] text-white/50">
              {learnset ? `Datos del juego · IDs ${learnset.ids.join(', ')}` : 'Sin learnset en el juego'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar movimientos"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
        >
          <X size={17} />
        </button>
      </div>

      {learnset ? (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {learnsetMethods.map((m) => {
              const count = learnset[m.key].length;
              const active = method === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => { setMethod(m.key); setExpanded(null); }}
                  aria-pressed={active}
                  className="pill min-h-[40px] px-2 text-[11px] font-bold transition sm:px-3 sm:text-xs"
                  style={active
                    ? { background: color, color: '#0b1220' }
                    : { background: `${color}18`, color: 'rgba(255,255,255,0.78)' }}
                >
                  {m.short}
                  <span className="ml-1 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          {entries.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-7 text-center text-sm text-white/55">
              No aprende movimientos por este método.
            </div>
          ) : (
            <>
              <div className="mt-4 max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
                {entries.slice(0, visibleCount).map((entry, i) => {
                  const key = `${method}-${entry[0]}-${entry[1] ?? i}`;
                  return (
                    <MoveEntry
                      key={key}
                      entry={entry}
                      method={method}
                      index={i}
                      color={color}
                      isOpen={expanded === key}
                      onToggle={toggleEntry}
                    />
                  );
                })}
              </div>
              {visibleCount < entries.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + ENTRIES_PER_PAGE)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-bold text-white/70 transition hover:bg-white/10"
                >
                  Mostrar {Math.min(ENTRIES_PER_PAGE, entries.length - visibleCount)} movimientos más
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/55">
          Este Pokémon no tiene aprendizajes registrados.
        </p>
      )}
    </motion.div>
  );
};

export default PokemonMovesPanel;
