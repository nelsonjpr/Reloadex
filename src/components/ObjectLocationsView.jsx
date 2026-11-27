import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Gift, MapPin, Package, Search, User } from 'lucide-react';
import { objectLocations, objectLocationStats } from '../data/objectLocations';
import { giftsByItemId } from '../data/itemGifts';
import { safeTop } from '../utils/safeArea';

const normalize = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

// Los IDs de sala son internos del juego. Si algún dato antiguo todavía los
// trae como detalle, no se muestran: en pantalla solo ruta/lugar + método.
const visibleDetail = (detail) => {
  const value = String(detail || '').trim();
  return /^sala\s+\d+$/i.test(value) ? '' : value;
};

const ObjectLocationsView = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('todos');
  const [expanded, setExpanded] = useState(null);

  const categories = useMemo(() => {
    const counts = new Map();
    for (const item of objectLocations) {
      const key = item.category || 'Objeto';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [
      { key: 'todos', label: 'Todos', count: objectLocations.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'))
        .map(([key, count]) => ({ key, label: key, count })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return objectLocations.filter((item) => {
      if (category !== 'todos' && (item.category || 'Objeto') !== category) return false;
      if (!q) return true;
      if (normalize(item.name).includes(q) || String(item.id).includes(q)) return true;
      if ((giftsByItemId.get(item.id) || []).some((gift) =>
        normalize(gift.who).includes(q)
        || normalize(gift.where).includes(q)
        || normalize(gift.when).includes(q),
      )) return true;
      return (item.locations || []).some((loc) =>
        normalize(loc.zone).includes(q)
        || normalize(loc.detail).includes(q)
        || normalize(loc.method).includes(q),
      );
    });
  }, [search, category]);

  const withRoutes = filtered.filter((item) => item.locations?.length).length;

  return (
    <div className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <div className="mx-auto max-w-6xl px-4 pb-8" style={safeTop(24)}>
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl glass-effect transition hover:bg-white/10 active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Localización de objetos
              </h1>
              <p className="mt-0.5 text-xs font-normal tracking-[0.08em] text-white/50 sm:text-sm">
                Objetos registrados y rutas donde aparecen
              </p>
            </div>
          </div>
        </header>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar objeto, ruta o lugar…"
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d1528]/90 pl-11 pr-4 text-sm text-white placeholder-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          />
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              aria-pressed={category === cat.key}
              className={`pill shrink-0 px-3.5 py-2 text-[11px] font-bold transition ${
                category === cat.key ? 'bg-indigo-300 text-[#0b1220]' : 'bg-white/[0.07] text-white/65 hover:bg-white/10'
              }`}
            >
              {cat.label} <span className="opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="mb-5 text-center text-[11px] text-white/45 tabular-nums">
          Mostrando <span className="font-semibold text-indigo-300">{filtered.length}</span> de {objectLocationStats.total} objetos
          <span className="mx-2 opacity-40">·</span>
          <span className="font-semibold text-white/70">{withRoutes}</span> con ruta
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <div className="text-sm text-white/60">No se encontraron objetos</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 sm:gap-4">
            {filtered.map((item, index) => {
              const locations = item.locations || [];
              const isOpen = expanded === item.id;
              const visible = isOpen ? locations : locations.slice(0, 4);
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(index * 0.004, 0.25) }}
                  className="premium-card rounded-[24px] border border-white/[0.07] p-4 sm:p-5"
                  style={{
                    '--card-shadow': '0 18px 44px -24px rgba(129,140,248,0.35), 0 12px 30px -18px rgba(3,8,20,0.85)',
                    '--card-shadow-hover': '0 26px 58px -22px rgba(129,140,248,0.5), 0 16px 34px -16px rgba(3,8,20,0.9)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-200 ring-1 ring-indigo-300/25">
                      <Package size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-white">
                            {item.name}
                          </h2>
                          <p className="mt-0.5 font-mono text-[11px] text-white/40">#{String(item.id).padStart(4, '0')}</p>
                        </div>
                        <span className="pill shrink-0 bg-white/[0.07] px-2.5 py-1 text-[10px] font-bold text-white/65 ring-1 ring-white/10">
                          {item.category || 'Objeto'}
                        </span>
                      </div>

                      {locations.length ? (
                        <div className="mt-3 space-y-2">
                          {visible.map((loc, i) => (
                            <div
                              key={`${item.id}-${loc.zone}-${loc.detail}-${i}`}
                              className="flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.035] px-3 py-2.5"
                            >
                              <MapPin size={14} className="mt-0.5 shrink-0 text-indigo-300" />
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-white/90">{loc.zone}</p>
                                {(visibleDetail(loc.detail) || loc.method) && (
                                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/55">
                                    {[visibleDetail(loc.detail), loc.method].filter(Boolean).join(' · ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}

                          {locations.length > 4 && (
                            <button
                              type="button"
                              onClick={() => setExpanded(isOpen ? null : item.id)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold text-indigo-300 transition hover:bg-white/5"
                            >
                              {isOpen ? 'Ver menos' : `Ver todas las rutas (${locations.length})`}
                              <ChevronDown size={13} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                            </button>
                          )}
                        </div>
                      ) : null}

                      {(giftsByItemId.get(item.id) || []).length > 0 && (
                        <div className="mt-3 space-y-2">
                          {(giftsByItemId.get(item.id) || []).map((gift, giftIndex) => (
                            <div
                              key={`gift-${item.id}-${giftIndex}`}
                              className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5"
                            >
                              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200/80">
                                <Gift size={12} /> Te lo regalan
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-white/90">
                                <User size={13} className="shrink-0 text-amber-200/70" /> {gift.who}
                              </p>
                              <p className="mt-0.5 text-[11px] leading-relaxed text-white/55">
                                {gift.where}{gift.when ? ` · ${gift.when}` : ''}
                              </p>
                              {gift.quote && (
                                <p className="mt-1 line-clamp-2 text-[11px] italic leading-relaxed text-white/40">
                                  «{gift.quote}»
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectLocationsView;
