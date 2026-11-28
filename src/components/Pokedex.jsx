import React, { useDeferredValue, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronUp, ChevronLeft, ChevronRight as ChevronRightIcon,
  Sparkles, Heart, Volume2,
} from 'lucide-react';
import { pokemonData } from '../data/pokemonIndex';
import {
  spriteUrl, spriteFallbacks, cryUrl, cryFallbacks,
  formatId, typeColor, typeName, typeIcon,
} from '../utils/sprites';
import TypeFilter from './TypeFilter';
import GenerationFilter from './GenerationFilter';
import { safeTop } from '../utils/safeArea';

// =============================================================
// Reloadex — Pokédex profesional (Pokémon Reloaded)
// =============================================================
const PAGE_SIZES = [30, 60, 120, 1000000];
const FAVORITES_KEY = 'reloadex:favorites';

// Lista virtual: la tarjeta mide 124 px y hay 12 px de separación. Solo se
// montan las filas visibles (±4 de margen), aunque «Todos» tenga 1.561 Pokémon.
const ROW_HEIGHT = 124;
const ROW_GAP = 12;
const ROW_STRIDE = ROW_HEIGHT + ROW_GAP;
const OVERSCAN = 4;

// Índice precalculado una sola vez: evita ~6.000 toLowerCase() por pulsación
// y hace que ordenar por nombre no use Intl.Collator en cada comparación.
const SEARCH_INDEX = pokemonData.map((p) => {
  const name = (p.name || '').toLowerCase();
  return {
    id: String(p.id),
    idNum: Number(p.id),
    name,
    displayName: (p.displayName || '').toLowerCase(),
    baseFormName: (p.baseFormName || '').toLowerCase(),
    bst: bst(p),
  };
});

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.map(Number) : []);
  } catch {
    return new Set();
  }
};

const adjustColor = (hex, amount) => {
  const value = String(hex || '').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return '#64748b';
  const channel = (c) => Math.round(
    amount < 0 ? c * (1 + amount) : c + (255 - c) * amount,
  ).toString(16).padStart(2, '0');
  return `#${channel(parseInt(value.slice(0, 2), 16))}${channel(parseInt(value.slice(2, 4), 16))}${channel(parseInt(value.slice(4, 6), 16))}`;
};

export default function Pokedex({ onBack, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  // La respuesta del input va primero; el filtrado pesado se aplaza.
  const deferredSearch = useDeferredValue(searchTerm);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showGenFilter, setShowGenFilter] = useState(false);
  const [sort, setSort] = useState('id-asc');
  const [formFilter, setFormFilter] = useState('all'); // all | base | mega | forme
  const [pageSize, setPageSize] = useState(30);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const listRef = React.useRef(null);
  const scrollFrame = React.useRef(0);
  const [range, setRange] = useState({ start: 0, end: 24 });

  const toggleType = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return [prev[1], type];
      return [...prev, type];
    });
  };

  React.useEffect(() => {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites])); } catch { /* almacenamiento no disponible */ }
  }, [favorites]);

  React.useEffect(() => { setPage(1); }, [deferredSearch, selectedTypes, selectedGeneration, sort, formFilter, pageSize, favoritesOnly]);

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    const qNum = q.replace(/^#/, '');
    const indices = [];
    for (let i = 0; i < pokemonData.length; i += 1) {
      const p = pokemonData[i];
      if (selectedTypes.length && !selectedTypes.every((type) => p.types.includes(type))) continue;
      if (selectedGeneration && p.generation !== selectedGeneration) continue;
      if (formFilter !== 'all' && (p.form || 'base') !== formFilter) continue;
      if (favoritesOnly && !favorites.has(Number(p.id))) continue;
      if (q) {
        const s = SEARCH_INDEX[i];
        if (!s.name.includes(q) && !s.id.includes(qNum) && !s.displayName.includes(q) && !s.baseFormName.includes(q)) continue;
      }
      indices.push(i);
    }
    const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    indices.sort((ia, ib) => {
      const a = SEARCH_INDEX[ia];
      const b = SEARCH_INDEX[ib];
      switch (sort) {
        case 'id-desc': return b.idNum - a.idNum;
        case 'name-asc': return byName(a.name, b.name);
        case 'name-desc': return byName(b.name, a.name);
        case 'bst-desc': return b.bst - a.bst;
        case 'id-asc':
        default: return a.idNum - b.idNum;
      }
    });
    return indices.map((i) => pokemonData[i]);
  }, [deferredSearch, selectedTypes, selectedGeneration, sort, formFilter, favoritesOnly, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Recalcula qué filas tocan la pantalla. Se llama al hacer scroll, al rotar
  // el móvil y al cambiar de filtro/página; el DOM nunca pasa de ~20 tarjetas.
  const updateRange = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const listTop = el.getBoundingClientRect().top + window.scrollY;
    const first = Math.max(0, Math.floor((window.scrollY - listTop) / ROW_STRIDE));
    const count = Math.ceil(window.innerHeight / ROW_STRIDE) + OVERSCAN * 2;
    const start = Math.max(0, first - OVERSCAN);
    const end = Math.min(pageItems.length, start + count);
    setRange((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [pageItems.length]);

  React.useEffect(() => {
    const onScroll = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = window.requestAnimationFrame(() => {
        scrollFrame.current = 0;
        // Primero se lee el layout (updateRange) y después se programa React;
        // hacerlo al revés puede forzar un reflow dentro del propio frame.
        updateRange();
        setShowScrollTop((visible) => {
          const next = window.scrollY > 400;
          return visible === next ? visible : next;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [updateRange]);

  const activeFilters = selectedTypes.length + (selectedGeneration ? 1 : 0) + (formFilter !== 'all' ? 1 : 0) + (favoritesOnly ? 1 : 0);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      {/* Header sticky: capa superior, fondo sólido con glass para que nada se vea a través */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[var(--app-bg)] shadow-[0_16px_36px_-24px_rgba(3,10,26,0.95)]" style={safeTop(20)}>
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <button onClick={onBack} aria-label="Volver"
                className="h-11 w-11 rounded-2xl glass-effect flex items-center justify-center hover:bg-white/10 active:scale-95 transition">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img src="/logo-ui.png?v=2" alt="Reloadex" className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/15" />
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-[-0.035em] sm:text-2xl">Reloadex</h1>
                <p className="truncate text-[11px] font-normal tracking-[0.08em] text-white/50">Pokédex de Pokémon Reloaded</p>
              </div>
            </div>
            <span className="text-xs text-white/50 tabular-nums hidden sm:inline">{filtered.length} Pokémon</span>
          </div>

          {/* Buscador */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="search"
              inputMode="search"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Nombre o número…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-11 pr-11 rounded-2xl bg-[var(--surface)] border border-white/10 text-white placeholder-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/40 transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Barra de filtros/orden */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setFavoritesOnly((v) => !v)}
              aria-pressed={favoritesOnly}
              className={`shrink-0 h-10 px-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${favoritesOnly ? 'bg-rose-500/90 border-rose-300/40 text-white shadow-[0_6px_18px_rgba(244,63,94,0.30)]' : 'bg-[var(--surface)] border-white/10 text-white/80 hover:bg-white/10'}`}
            >
              <Heart size={15} fill={favoritesOnly ? 'currentColor' : 'none'} />
              Favoritos{favorites.size ? ` (${favorites.size})` : ''}
            </button>
            <button onClick={() => setShowTypeFilter(true)}
              className={`shrink-0 h-10 px-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${selectedTypes.length ? 'bg-sky-500/90 border-sky-300/40 text-white shadow-[0_6px_18px_rgba(56,189,248,0.28)]' : 'bg-[var(--surface)] border-white/10 text-white/80 hover:bg-white/10'}`}>
              <Filter size={15} /> {selectedTypes.length ? selectedTypes.map(typeName).join(' + ') : 'Tipo'}
            </button>
            <button onClick={() => setShowGenFilter(true)}
              className={`shrink-0 h-10 px-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${selectedGeneration ? 'bg-sky-500/90 border-sky-300/40 text-white shadow-[0_6px_18px_rgba(56,189,248,0.28)]' : 'bg-[var(--surface)] border-white/10 text-white/80 hover:bg-white/10'}`}>
              {selectedGeneration || 'Generación'}
            </button>
            <select value={formFilter} onChange={(e) => setFormFilter(e.target.value)} aria-label="Forma"
              className="shrink-0 h-10 px-3.5 rounded-2xl border border-white/10 bg-[var(--surface)] text-xs font-semibold text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-sky-400/50">
              <option value="all" className="bg-[var(--surface)] text-white">Todas las formas</option>
              <option value="base" className="bg-[var(--surface)] text-white">Base</option>
              <option value="mega" className="bg-[var(--surface)] text-white">Mega</option>
              <option value="forme" className="bg-[var(--surface)] text-white">Formas</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar"
              className="shrink-0 h-10 px-3.5 rounded-2xl border border-white/10 bg-[var(--surface)] text-xs font-semibold text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-sky-400/50">
              <option value="id-asc" className="bg-[var(--surface)] text-white">ID ↑</option>
              <option value="id-desc" className="bg-[var(--surface)] text-white">ID ↓</option>
              <option value="name-asc" className="bg-[var(--surface)] text-white">Nombre A-Z</option>
              <option value="name-desc" className="bg-[var(--surface)] text-white">Nombre Z-A</option>
              <option value="bst-desc" className="bg-[var(--surface)] text-white">Estadisticas ↓</option>
            </select>
          </div>

          {activeFilters > 0 && (
            <button onClick={() => { setSelectedTypes([]); setSelectedGeneration(null); setFormFilter('all'); setFavoritesOnly(false); }}
              className="mt-2 text-[11px] text-sky-300 hover:text-sky-200 underline">Limpiar {activeFilters} filtro(s)</button>
          )}

          <div className="mt-2 text-center text-[11px] text-white/45 tabular-nums">
            Mostrando <span className="text-sky-300 font-semibold">{filtered.length}</span> de {pokemonData.length}
          </div>
        </div>
      </header>

      {/* Lista: se separa del header sticky para que la primera tarjeta quede visible */}
      <main className="mx-auto max-w-3xl px-4 pt-5 pb-5 sm:pt-6 sm:pb-8">
        <div ref={listRef} className="relative w-full pt-1" style={{ height: pageItems.length * ROW_STRIDE + 4 }}>
          {pageItems.slice(
            Math.min(range.start, Math.max(0, pageItems.length - 1)),
            Math.max(range.end, Math.min(range.start, Math.max(0, pageItems.length - 1))),
          ).map((pokemon, i) => {
            const index = Math.min(range.start, Math.max(0, pageItems.length - 1)) + i;
            return (
              <div key={pokemon.id} className="absolute inset-x-0" style={{ top: index * ROW_STRIDE + 4, height: ROW_HEIGHT }}>
                <PokemonRow
                  pokemon={pokemon}
                  isFavorite={favorites.has(Number(pokemon.id))}
                  onToggleFavorite={() => toggleFavorite(Number(pokemon.id))}
                  onClick={() => onSelect && onSelect(pokemon)}
                />
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-white/60">No se encontraron Pokémon</div>
          </div>
        )}

        {/* Paginación */}
        {filtered.length > pageSize && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 w-10 rounded-2xl glass-effect flex items-center justify-center disabled:opacity-30 active:scale-95">
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm tabular-nums text-white/70">Página {safePage} / {totalPages}</span>
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-10 w-10 rounded-2xl glass-effect flex items-center justify-center disabled:opacity-30 active:scale-95">
                <ChevronRightIcon size={18} />
              </button>
            </div>
            <select value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))} aria-label="Por página"
              className="h-9 px-3 rounded-2xl text-xs glass-effect text-white focus:outline-none">
              {PAGE_SIZES.map((n) => <option key={n} value={n} className="bg-[var(--surface)] text-white">{n >= 1000000 ? 'Todos' : `${n} por página`}</option>)}
            </select>
          </div>
        )}

        {/* Filtros (hojas) */}
        <AnimatePresence>
          {showTypeFilter && (
            <Sheet title="Filtrar por tipo" onClose={() => setShowTypeFilter(false)} compact wide>
              <TypeFilter
                selectedTypes={selectedTypes}
                onToggleType={toggleType}
                onClear={() => setSelectedTypes([])}
                onDone={() => setShowTypeFilter(false)}
              />
            </Sheet>
          )}
          {showGenFilter && (
            <Sheet title="Filtrar por generación" onClose={() => setShowGenFilter(false)}>
              <GenerationFilter selectedGeneration={selectedGeneration} onSelectGeneration={(g) => { setSelectedGeneration(g); setShowGenFilter(false); }} />
            </Sheet>
          )}
        </AnimatePresence>
      </main>

      {/* Scroll top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-[60] h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center active:scale-90"
            style={{ boxShadow: '0 14px 34px -12px rgba(56,189,248,0.75), inset 0 1px 0 rgba(255,255,255,0.25)' }}
            aria-label="Subir">
            <ChevronUp size={26} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function bst(p) {
  const s = p.stats || {};
  return (s.hp || 0) + (s.attack || 0) + (s.defense || 0) + (s.spAttack || 0) + (s.spDefense || 0) + (s.speed || 0);
}

function PokemonRow({ pokemon, isFavorite, onToggleFavorite, onClick }) {
  const [shiny, setShiny] = useState(false);
  const [playing, setPlaying] = useState(false);
  const fallbackIndex = React.useRef(0);

  const base = typeColor(pokemon.types?.[0]);
  const deep = adjustColor(base, -0.66);
  const vivid = adjustColor(base, 0.04);
  const light = adjustColor(base, 0.3);
  const imgSrc = spriteUrl(pokemon.id, shiny, pokemon.sprite?.shinyFile);
  const fallbacks = spriteFallbacks(pokemon.id, shiny, pokemon.sprite?.shinyFile);
  const hasCry = !!(pokemon.sprite?.cry || pokemon.sprite?.cryFile);

  React.useEffect(() => { fallbackIndex.current = 0; }, [pokemon.id, shiny]);

  const onImgError = (e) => {
    const next = fallbacks[fallbackIndex.current++];
    if (next) e.target.src = next;
    else e.target.style.visibility = 'hidden';
  };

  const playCry = async (e) => {
    e.stopPropagation();
    const urls = [...new Set([
      ...(pokemon.sprite?.cryFile ? [`/cries/${pokemon.sprite.cryFile}`] : []),
      cryUrl(pokemon.id),
      ...cryFallbacks(pokemon.id),
    ].filter(Boolean))];
    for (const url of urls) {
      try {
        await new Audio(url).play();
        setPlaying(true);
        window.setTimeout(() => setPlaying(false), 600);
        return;
      } catch { /* se prueba la siguiente variante de nombre */ }
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="premium-card group relative h-[124px] w-full overflow-hidden rounded-[28px] border border-white/[0.16]"
      style={{
        background: `linear-gradient(115deg, ${deep} 0%, ${vivid} 54%, ${light} 100%)`,
        '--card-shadow': `0 18px 44px -22px ${deep}ee, 0 10px 28px -18px rgba(3, 8, 20, 0.85)`,
        '--card-shadow-hover': `0 26px 58px -20px ${vivid}bb, 0 14px 32px -16px rgba(3, 8, 20, 0.9)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 12%, rgba(255,255,255,0.34), transparent 42%), linear-gradient(0deg, rgba(0,0,0,0.22), transparent 58%)`,
        }}
      />
      <button
        type="button"
        onClick={onClick}
        aria-label={`Ver ${pokemon.name}`}
        className="absolute inset-0 z-10 rounded-[28px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      />

      <div className="pointer-events-none relative z-20 flex items-center gap-3 p-3.5 sm:gap-4 sm:p-4">
        <div className="relative shrink-0">
          <div
            className="absolute -inset-2 rounded-full opacity-45 transition group-hover:opacity-70"
            style={{ background: `radial-gradient(circle, ${light}aa, transparent 70%)` }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white/25 to-black/30 shadow-[inset_0_2px_6px_rgba(255,255,255,0.16),0_6px_14px_rgba(0,0,0,0.25)] sm:h-[88px] sm:w-[88px]">
            <div className="absolute inset-[3px] rounded-full border border-white/15" />
            <img
              key={`${pokemon.id}-${shiny}`}
              src={imgSrc}
              alt={pokemon.name}
              className="h-full w-full origin-center scale-[1.28] object-contain pixelated"
              loading="lazy"
              onError={onImgError}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="eyebrow font-mono text-white/60">
            {formatId(pokemon.id)}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <h2 className="truncate text-lg font-semibold leading-tight tracking-[-0.03em] text-white drop-shadow-sm sm:text-xl">
              {pokemon.name}
            </h2>
            {(pokemon.form === 'mega' || pokemon.form === 'forme') && (
              <span className="pill shrink-0 bg-white/20 px-2 py-0.5 text-[9px] uppercase text-white ring-1 ring-white/25">
                {pokemon.form === 'mega' ? 'Mega' : 'Forma'}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(pokemon.types || []).map((t) => (
              <span
                key={t}
                className="pill inline-flex items-center gap-1 bg-black/25 px-2.5 py-1 text-[10px] uppercase text-white ring-1 ring-white/20"
              >
                <img src={typeIcon(t)} alt="" aria-hidden="true" loading="lazy" className="h-3.5 w-3.5 object-contain pixelated" />
                {typeName(t)}
              </span>
            ))}
          </div>
        </div>

        <div className="pointer-events-auto ml-auto flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => { stop(e); setShiny((v) => !v); }}
            aria-label={shiny ? `Ver sprite normal de ${pokemon.name}` : `Ver sprite shiny de ${pokemon.name}`}
            aria-pressed={shiny}
            title="Shiny"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-90 ${
              shiny
                ? 'border-white/70 bg-yellow-300/90 text-slate-900 shadow-[0_0_16px_rgba(253,230,138,0.55)]'
                : 'border-white/25 bg-black/25 text-white hover:bg-white/25'
            }`}
          >
            <Sparkles size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => { stop(e); onToggleFavorite(); }}
            aria-label={isFavorite ? `Quitar ${pokemon.name} de favoritos` : `Añadir ${pokemon.name} a favoritos`}
            aria-pressed={isFavorite}
            title="Favorito"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-90 ${
              isFavorite
                ? 'border-white/60 bg-rose-500/90 text-white shadow-[0_0_16px_rgba(244,63,94,0.5)]'
                : 'border-white/25 bg-black/25 text-white hover:bg-white/25'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          {hasCry && (
            <button
              type="button"
              onClick={playCry}
              aria-label={`Escuchar grito de ${pokemon.name}`}
              title="Grito"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white transition hover:bg-white/25 active:scale-90 ${
                playing ? 'bg-white/35 shadow-[0_0_16px_rgba(255,255,255,0.35)]' : ''
              }`}
            >
              <Volume2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Sheet({ title, children, onClose, compact = false, wide = false }) {
  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <motion.div className={`relative w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-white/10 ${compact ? 'p-4' : 'p-5'}`}
        initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-4'}`}>
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="Cerrar"><X size={18} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
