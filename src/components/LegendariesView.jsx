import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, MapPin, Search, Sparkles, X } from 'lucide-react';
import { legendaries } from '../data/legendaries';
import { spriteUrl, typeColor, typeName, typeIcon } from '../utils/sprites';

const gradientFor = (types = []) => {
  const primary = typeColor(types[0]);
  const secondary = typeColor(types[1] || types[0]);
  if (!types.length) return 'linear-gradient(135deg, #d97706 0%, #4f46e5 100%)';
  return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
};

const TypePills = ({ types }) => {
  if (!types?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {types.map((type) => (
        <span
          key={type}
          className="pill inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/25"
          style={{ backgroundColor: typeColor(type) }}
        >
          <img src={typeIcon(type)} alt="" aria-hidden="true" className="h-3.5 w-3.5 object-contain pixelated" />
          {typeName(type)}
        </span>
      ))}
    </div>
  );
};

const LegendariesView = ({ onBack }) => {
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return legendaries;
    return legendaries.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.dex.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <header className="mb-7">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="h-11 w-11 shrink-0 rounded-2xl glass-effect flex items-center justify-center hover:bg-white/10 active:scale-95 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Legendarios y singulares
              </h1>
              <p className="mt-0.5 text-xs font-normal tracking-[0.08em] text-white/50 sm:text-sm">
                Guía de localización de Pokémon Reloaded
              </p>
            </div>
          </div>
        </header>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, número o ubicación…"
            className="w-full h-12 pl-11 pr-4 rounded-2xl border border-white/10 bg-[#0d1528]/90 text-sm text-white placeholder-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300/40 transition"
          />
        </div>

        <div className="mb-6 text-center text-[11px] text-white/45 tabular-nums">
          Mostrando <span className="font-semibold text-amber-300">{filtered.length}</span> de {legendaries.length} en el orden de la guía
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {filtered.map((item, index) => (
            <motion.button
              key={`${item.dex}-${item.name}`}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.012, 0.35) }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
              onClick={() => setSelected(item)}
              className="premium-card group relative overflow-hidden rounded-[24px] border border-white/[0.07] text-left"
              style={{
                '--card-shadow': '0 18px 44px -24px rgba(245,158,11,0.35), 0 12px 30px -18px rgba(3,8,20,0.85)',
                '--card-shadow-hover': '0 26px 58px -22px rgba(245,158,11,0.5), 0 16px 34px -16px rgba(3,8,20,0.9)',
              }}
            >
              <div className="relative h-36 overflow-hidden sm:h-40" style={{ background: gradientFor(item.types) }}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 18px 18px, white 2px, transparent 0)',
                  backgroundSize: '36px 36px',
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={spriteUrl(item.spriteId)}
                    alt={item.name}
                    loading="lazy"
                    className="h-28 w-28 object-contain pixelated drop-shadow-[0_14px_16px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-32"
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                  />
                </div>
                <span className="pill absolute left-3 top-3 bg-black/30 px-2.5 py-1 font-mono text-[11px] font-bold text-white/90 ring-1 ring-white/25 backdrop-blur-md">
                  #{item.dex}
                </span>
                {item.level != null && (
                  <span className="pill absolute right-3 top-3 bg-black/30 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-white/25 backdrop-blur-md">
                    Nv. {item.level}
                  </span>
                )}
              </div>

              <div className="relative space-y-2.5 bg-[#0b1120] p-4 sm:p-5">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">{item.name}</h2>
                <TypePills types={item.types} />
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-amber-300" />
                  <p className="line-clamp-3 text-xs font-normal leading-relaxed text-white/65">{item.location}</p>
                </div>
                <span className="block pt-1 text-[11px] font-semibold tracking-[0.08em] text-amber-300/90">
                  VER GUÍA COMPLETA →
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <div className="text-sm text-white/60">No se encontraron legendarios</div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#0b1120] shadow-2xl sm:rounded-[28px]"
            >
              <div className="relative h-56 overflow-hidden sm:h-64" style={{ background: gradientFor(selected.types) }}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 18px 18px, white 2px, transparent 0)',
                  backgroundSize: '36px 36px',
                }} />
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/40 active:scale-95"
                >
                  <X size={20} />
                </button>
                <div className="relative z-[1] flex h-full flex-col items-center justify-center px-6 pt-4">
                  <span className="pill mb-2 bg-black/25 px-3 py-1 font-mono text-xs font-bold text-white/90 ring-1 ring-white/25">
                    #{selected.dex}
                  </span>
                  <img
                    src={spriteUrl(selected.spriteId)}
                    alt={selected.name}
                    className="h-36 w-36 object-contain pixelated drop-shadow-[0_18px_20px_rgba(0,0,0,0.5)] sm:h-40 sm:w-40"
                  />
                  <h2 className="mt-3 text-center text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                    {selected.name}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <TypePills types={selected.types} />
                  {selected.level != null && (
                    <span className="pill bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 ring-1 ring-white/15">
                      Nivel {selected.level}
                    </span>
                  )}
                </div>

                <section className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={17} className="text-amber-300" />
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">Localización</h3>
                  </div>
                  <p className="text-sm font-normal leading-relaxed text-white/90">{selected.location}</p>
                </section>

                <section className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs text-white/55">
                  <Sparkles size={15} className="shrink-0 text-amber-300" />
                  <span>Sigue los pasos de la guía; algunos legendarios requieren condiciones especiales antes de aparecer.</span>
                </section>

                <button
                  onClick={() => setSelected(null)}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 py-3.5 text-sm font-semibold text-slate-900 transition hover:brightness-110 active:scale-[0.98]"
                >
                  Cerrar guía
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LegendariesView;
