import React, { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Smile, Terminal, Users } from 'lucide-react';
import {
  FACE_SEARCH_INDEX, extraFaces, normalizeFaceText, principalFaces,
} from '../data/faces';
import { safeTop } from '../utils/safeArea';

const PAGE_SIZE = 60;

const FILTERS = [
  { key: 'todos', label: 'Todas', count: FACE_SEARCH_INDEX.length },
  { key: 'principal', label: 'Principales', count: principalFaces.length },
  { key: 'adicional', label: 'Adicionales', count: extraFaces.length },
];

const FaceCard = memo(function FaceCard({ face, index }) {
  const [error, setError] = useState(false);
  const numero = face.n === 10 ? `10·${face.sub}` : String(face.n);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.004, 0.2) }}
      className="premium-card group rounded-2xl border border-white/[0.07] p-2.5 text-center sm:p-3"
      style={{
        '--card-shadow': '0 14px 34px -24px rgba(251,113,133,0.35), 0 10px 26px -18px rgba(3,8,20,0.85)',
        '--card-shadow-hover': '0 22px 48px -22px rgba(251,113,133,0.5), 0 14px 30px -16px rgba(3,8,20,0.9)',
      }}
    >
      <div className="relative mx-auto flex aspect-square w-full max-w-[96px] items-center justify-center overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/[0.06]">
        {error ? (
          <Smile size={26} className="text-white/25" />
        ) : (
          <img
            src={face.sprite}
            alt={face.nombre}
            loading="lazy"
            onError={() => setError(true)}
            className="pixelated h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        <span className="pill bg-rose-400/10 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-200 ring-1 ring-rose-300/20">
          {numero}
        </span>
        <span className="font-mono text-[10px] text-white/35">#{face.id}</span>
      </div>
      <p className="mt-1 truncate text-[12px] font-semibold text-white/90" title={face.nombre}>
        {face.nombre}
      </p>
      <p className="truncate font-mono text-[9px] text-white/30" title={face.codigo}>
        {face.codigo}
      </p>
    </motion.button>
  );
});

const CarasView = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [filter, setFilter] = useState('todos');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [deferredSearch, filter]);

  const results = useMemo(() => {
    const q = normalizeFaceText(deferredSearch.trim());
    return FACE_SEARCH_INDEX.filter((face) => {
      if (filter !== 'todos' && face.tipo !== filter) return false;
      return !q || face.search.includes(q);
    });
  }, [deferredSearch, filter]);

  const visible = results.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+28px)]">
      <div className="max-w-6xl mx-auto px-4 pb-8" style={safeTop(28)}>
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="w-10 h-10 shrink-0 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">Caras</h1>
            <p className="text-xs sm:text-sm text-white/60">
              Los 361 personajes del truco <span className="font-mono text-rose-200">CARA</span>
            </p>
          </div>
        </div>

        <div className="glass-dark rounded-2xl border border-white/[0.06] p-4 mb-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-400/10 text-rose-200 ring-1 ring-rose-300/20">
              <Terminal size={16} />
            </span>
            <div className="min-w-0 text-[12px] leading-relaxed text-white/65">
              <p>
                En el juego: <span className="font-mono text-white/90">F3 → CARA</span> y elige
                del <span className="font-mono text-white/90">0 al 9</span>. Para los demás,
                escribe <span className="font-mono text-white/90">10</span> y luego del{' '}
                <span className="font-mono text-white/90">1 al 351</span>.
              </p>
              <p className="mt-1 text-white/45">
                Aquí el número aparece debajo de cada sprite: <span className="font-mono">10·N</span> = cara 10, número N.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <label className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, número o ID…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-rose-300/40"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`pill px-3 py-1.5 text-[11px] font-bold transition ${
                  filter === item.key
                    ? 'bg-rose-400/20 text-rose-100 ring-1 ring-rose-300/30'
                    : 'bg-white/[0.06] text-white/55 ring-1 ring-white/10 hover:text-white/80'
                }`}
              >
                {item.label} <span className="opacity-50">{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/35">
          <Users size={13} /> {results.length} resultados
        </p>

        {results.length === 0 ? (
          <div className="glass-effect rounded-2xl px-4 py-12 text-center text-sm text-white/50">
            No hay caras para «{search}».
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-8">
              {visible.map((face, index) => (
                <FaceCard key={`${face.tipo}-${face.id}`} face={face} index={index} />
              ))}
            </div>
            {visibleCount < results.length && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="pill bg-white/[0.07] px-5 py-2.5 text-[12px] font-bold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  Cargar más ({results.length - visibleCount})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CarasView;
