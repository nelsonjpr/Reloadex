import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, X, ChevronUp, ChevronLeft, ChevronRight as ChevronRightIcon,
  Sparkles, Heart, Volume2,
} from 'lucide-react';
import { pokemonData, typeColors, typeTranslations } from '../data/pokemon';
import {
  spriteUrl, spriteFallbacks, cryUrl, cryFallbacks,
  formatId, typeColor, typeName,
} from '../utils/sprites';
import TypeFilter from './TypeFilter';
import GenerationFilter from './GenerationFilter';

// =============================================================
// Reloadex — Pokédex profesional (Pokémon Reloaded)
// =============================================================
const PAGE_SIZES = [30, 60, 120, 1000000];
const FAVORITES_KEY = 'reloadex:favorites';

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
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showGenFilter, setShowGenFilter] = useState(false);
  const [sort, setSort] = useState('id-asc');
  const [formFilter, setFormFilter] = useState('all'); // all | base | mega | forme
  const [pageSize, setPageSize] = useState(60);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites] = useState(loadFavorites);

  React.useEffect(() => {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites])); } catch { /* almacenamiento no disponible */ }
  }, [favorites]);

  React.useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => { setPage(1); }, [searchTerm, selectedType, selectedGeneration, sort, formFilter, pageSize]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const qNum = q.replace(/^#/, '');
    let list = pokemonData.filter((p) => {
      if (selectedType && !p.types.includes(selectedType)) return false;
      if (selectedGeneration && p.generation !== selectedGeneration) return false;
      if (formFilter !== 'all' && (p.form || 'base') !== formFilter) return false;
      if (!q) return true;
      return (
        (p.name || '').toLowerCase().includes(q) ||
        String(p.id).includes(qNum) ||
        (p.displayName || '').toLowerCase().includes(q) ||
        (p.baseFormName || '').toLowerCase().includes(q)
      );
    });
    const byName = (a, b) => (a.name || '').localeCompare(b.name || '', 'es');
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'id-desc': return Number(b.id) - Number(a.id);
        case 'name-asc': return byName(a, b);
        case 'name-desc': return byName(b, a);
        case 'bst-desc': return bst(b) - bst(a);
        case 'id-asc':
        default: return Number(a.id) - Number(b.id);
      }
    });
    return list;
  }, [searchTerm, selectedType, selectedGeneration, sort, formFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeFilters = (selectedType ? 1 : 0) + (selectedGeneration ? 1 : 0) + (formFilter !== 'all' ? 1 : 0);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+24px)]"
      style={{ backgroundImage: 'radial-gradient(circle at 50% -10%, rgba(56,189,248,0.08), transparent 45%)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
        {/* Header sticky */}
        <div className="sticky top-0 z-20 -mx-4 px-4 pt-3 pb-4 mb-4 bg-gradient-to-b from-[#080d1a] via-[#080d1a]/95 to-[#080d1a]/0 backdrop-blur-md border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <button onClick={onBack} aria-label="Volver"
                className="h-11 w-11 rounded-2xl glass-effect flex items-center justify-center hover:bg-white/10 active:scale-95 transition">
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img src="/logo.png" alt="Reloadex" className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/15" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Reloadex</h1>
                <p className="text-[11px] text-white/50 truncate">Pokédex de Pokémon Reloaded</p>
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
              className="w-full h-12 pl-11 pr-11 rounded-2xl bg-[#0d1528]/90 border border-white/10 text-white placeholder-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/40 transition"
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
            <button onClick={() => setShowTypeFilter(true)}
              className={`shrink-0 h-10 px-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${selectedType ? 'bg-sky-500/90 border-sky-300/40 text-white shadow-[0_6px_18px_rgba(56,189,248,0.28)]' : 'bg-[#0d1528]/80 border-white/10 text-white/80 hover:bg-white/10'}`}>
              <Filter size={15} /> {selectedType ? typeName(selectedType) : 'Tipo'}
            </button>
            <button onClick={() => setShowGenFilter(true)}
              className={`shrink-0 h-10 px-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition ${selectedGeneration ? 'bg-sky-500/90 border-sky-300/40 text-white shadow-[0_6px_18px_rgba(56,189,248,0.28)]' : 'bg-[#0d1528]/80 border-white/10 text-white/80 hover:bg-white/10'}`}>
              {selectedGeneration || 'Generación'}
            </button>
            <select value={formFilter} onChange={(e) => setFormFilter(e.target.value)} aria-label="Forma"
              className="shrink-0 h-10 px-3.5 rounded-2xl border border-white/10 bg-[#0d1528]/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50">
              <option value="all" className="text-black">Todas las formas</option>
              <option value="base" className="text-black">Base</option>
              <option value="mega" className="text-black">Mega</option>
              <option value="forme" className="text-black">Formas</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar"
              className="shrink-0 h-10 px-3.5 rounded-2xl border border-white/10 bg-[#0d1528]/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50">
              <option value="id-asc" className="text-black">ID ↑</option>
              <option value="id-desc" className="text-black">ID ↓</option>
              <option value="name-asc" className="text-black">Nombre A-Z</option>
              <option value="name-desc" className="text-black">Nombre Z-A</option>
              <option value="bst-desc" className="text-black">Estadisticas ↓</option>
            </select>
          </div>

          {activeFilters > 0 && (
            <button onClick={() => { setSelectedType(null); setSelectedGeneration(null); setFormFilter('all'); }}
              className="mt-2 text-[11px] text-sky-300 hover:text-sky-200 underline">Limpiar {activeFilters} filtro(s)</button>
          )}

          <div className="mt-2 text-center text-[11px] text-white/45 tabular-nums">
            Mostrando <span className="text-sky-300 font-semibold">{filtered.length}</span> de {pokemonData.length}
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {pageItems.map((pokemon, index) => (
              <PokemonRow
                key={pokemon.id}
                pokemon={pokemon}
                index={index}
                isFavorite={favorites.has(Number(pokemon.id))}
                onToggleFavorite={() => toggleFavorite(Number(pokemon.id))}
                onClick={() => onSelect && onSelect(pokemon)}
              />
            ))}
          </AnimatePresence>
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
              className="h-9 px-3 rounded-2xl text-xs glass-effect text-white bg-transparent focus:outline-none">
              {PAGE_SIZES.map((n) => <option key={n} value={n} className="text-black">{n >= 1000000 ? 'Todos' : `${n} por página`}</option>)}
            </select>
          </div>
        )}

        {/* Filtros (hojas) */}
        <AnimatePresence>
          {showTypeFilter && (
            <Sheet title="Filtrar por tipo" onClose={() => setShowTypeFilter(false)}>
              <TypeFilter selectedType={selectedType} onSelectType={(t) => { setSelectedType(t); setShowTypeFilter(false); }} />
            </Sheet>
          )}
          {showGenFilter && (
            <Sheet title="Filtrar por generación" onClose={() => setShowGenFilter(false)}>
              <GenerationFilter selectedGeneration={selectedGeneration} onSelectGeneration={(g) => { setSelectedGeneration(g); setShowGenFilter(false); }} />
            </Sheet>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-30 h-13 w-13 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg active:scale-90"
            style={{ height: 52, width: 52 }} aria-label="Subir">
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

function PokemonRow({ pokemon, index, isFavorite, onToggleFavorite, onClick }) {
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.12) }}
      className="group relative w-full min-h-[112px] overflow-hidden rounded-[28px] border border-white/[0.16]"
      style={{
        background: `linear-gradient(115deg, ${deep} 0%, ${vivid} 54%, ${light} 100%)`,
        boxShadow: '0 14px 32px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.22)',
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
            className="absolute -inset-2 rounded-full opacity-55 blur-xl transition group-hover:opacity-80"
            style={{ backgroundColor: light }}
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-white/25 to-black/30 shadow-[inset_0_2px_6px_rgba(255,255,255,0.16),0_6px_14px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:h-[88px] sm:w-[88px]">
            <div className="absolute inset-[3px] rounded-full border border-white/15" />
            <img
              key={`${pokemon.id}-${shiny}`}
              src={imgSrc}
              alt={pokemon.name}
              className="h-full w-full origin-center scale-[1.28] transform-gpu object-contain pixelated drop-shadow-[0_4px_6px_rgba(0,0,0,0.38)]"
              loading="lazy"
              onError={onImgError}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
            {formatId(pokemon.id)}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <h2 className="truncate text-lg font-extrabold leading-tight text-white drop-shadow-sm sm:text-xl">
              {pokemon.name}
            </h2>
            {(pokemon.form === 'mega' || pokemon.form === 'forme') && (
              <span className="pill shrink-0 bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25">
                {pokemon.form === 'mega' ? 'Mega' : 'Forma'}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(pokemon.types || []).map((t) => (
              <span
                key={t}
                className="pill bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-sm"
              >
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
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition active:scale-90 ${
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
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition active:scale-90 ${
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
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition hover:bg-white/25 active:scale-90 ${
                playing ? 'bg-white/35 shadow-[0_0_16px_rgba(255,255,255,0.35)]' : ''
              }`}
            >
              <Volume2 size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Sheet({ title, children, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div className="relative w-full sm:max-w-md max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 p-5 border border-white/10"
        initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center" aria-label="Cerrar"><X size={18} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
