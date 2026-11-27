import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight, Download, Pencil, Plus,
  Search, Sparkles, Trash2, Upload, Users, X, Zap,
} from 'lucide-react';
import { teamPokemon } from '../data/teamData';
import { equippableItems } from '../data/equippableItems';
import { typeColor, typeName, spriteUrl, spriteFallbacks } from '../utils/sprites';
import { calculateStats, STAT_KEYS, STAT_LABELS, statsTotal } from '../utils/pokemonStats';
import { loadTeams, saveTeams, createTeam, createSlot } from '../utils/teamStorage';
import { safeTop } from '../utils/safeArea';

const PAGE_SIZE = 24;
const MAX_TEAMS = 12;

const normalize = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const Sprite = ({ pokemon, shiny, className = '' }) => {
  const [src, setSrc] = useState(() => spriteUrl(pokemon?.id, shiny, pokemon?.shinyFile));
  useEffect(() => {
    setSrc(spriteUrl(pokemon?.id, shiny, pokemon?.shinyFile));
  }, [pokemon?.id, pokemon?.shinyFile, shiny]);
  const fallbacks = useMemo(
    () => spriteFallbacks(pokemon?.id, shiny, pokemon?.shinyFile),
    [pokemon?.id, pokemon?.shinyFile, shiny],
  );
  return (
    <img
      src={src}
      alt={pokemon?.name || ''}
      className={className}
      loading="lazy"
      onError={() => setSrc((current) => {
        const index = fallbacks.indexOf(current);
        return index >= 0 && index + 1 < fallbacks.length ? fallbacks[index + 1] : current;
      })}
    />
  );
};

const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center"
    onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
  >
    <motion.div
      initial={{ y: 28, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="max-h-[93vh] w-full max-w-3xl overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#0d1528] p-5 shadow-2xl sm:rounded-[30px] sm:p-6"
      style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
    >
      {children}
    </motion.div>
  </motion.div>
);

export function TeamBuilder({ onBack, onRegisterOverlayBack }) {
  const [store, setStore] = useState(loadTeams);
  const [renaming, setRenaming] = useState(false);
  const [selectorSlot, setSelectorSlot] = useState(null);
  const [configSlot, setConfigSlot] = useState(null);
  const [pending, setPending] = useState(null);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [typeFilter, setTypeFilter] = useState('todos');
  const [page, setPage] = useState(1);

  const activeTeam = store.teams.find((team) => team.id === store.activeId) || store.teams[0];
  const byId = useMemo(() => new Map(teamPokemon.map((p) => [p.id, p])), []);

  useEffect(() => { saveTeams(store); }, [store]);
  useEffect(() => { setPage(1); }, [deferredSearch, typeFilter]);

  // El back físico cierra primero el modal abierto, sin salir del creador.
  useEffect(() => {
    if (!onRegisterOverlayBack) return undefined;
    onRegisterOverlayBack(() => {
      if (configSlot !== null) {
        setConfigSlot(null);
        setPending(null);
        return true;
      }
      if (selectorSlot !== null) {
        setSelectorSlot(null);
        return true;
      }
      return false;
    });
    return () => onRegisterOverlayBack(null);
  }, [onRegisterOverlayBack, configSlot, selectorSlot]);

  const filtered = useMemo(() => {
    const q = normalize(deferredSearch);
    return teamPokemon.filter((p) => {
      if (typeFilter !== 'todos' && !(p.types || []).includes(typeFilter)) return false;
      if (!q) return true;
      return normalize(p.name).includes(q) || String(p.id).includes(q);
    });
  }, [deferredSearch, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const types = useMemo(() => [...new Set(teamPokemon.flatMap((p) => p.types || []))].sort(), []);

  const updateSlots = (slots) => {
    setStore((current) => ({
      ...current,
      teams: current.teams.map((team) => (team.id === current.activeId ? { ...team, slots } : team)),
    }));
  };

  const openSelector = (slotIndex) => {
    setSearch('');
    setTypeFilter('todos');
    setPage(1);
    setSelectorSlot(slotIndex);
  };

  const choosePokemon = (pokemon) => {
    const slot = activeTeam.slots[selectorSlot];
    setPending({
      pokemon,
      level: slot?.id === pokemon.id ? slot.level : 50,
      shiny: slot?.id === pokemon.id ? slot.shiny : false,
      ability: slot?.id === pokemon.id ? slot.ability : (pokemon.abilities?.[0]?.name || null),
      item: slot?.id === pokemon.id ? slot.item : null,
    });
    setConfigSlot(selectorSlot);
    setSelectorSlot(null);
  };

  const editSlot = (slotIndex) => {
    const slot = activeTeam.slots[slotIndex];
    const pokemon = byId.get(slot.id);
    if (!pokemon) return openSelector(slotIndex);
    setPending({
      pokemon,
      level: slot.level,
      shiny: slot.shiny,
      ability: slot.ability || pokemon.abilities?.[0]?.name || null,
      item: slot.item || null,
    });
    setConfigSlot(slotIndex);
  };

  const acceptSlot = () => {
    if (!pending || configSlot == null) return;
    const slots = [...activeTeam.slots];
    slots[configSlot] = createSlot(pending.pokemon, pending);
    updateSlots(slots);
    setConfigSlot(null);
    setPending(null);
  };

  const removeSlot = (slotIndex) => {
    const slots = [...activeTeam.slots];
    slots[slotIndex] = null;
    updateSlots(slots);
  };

  const addTeam = () => {
    if (store.teams.length >= MAX_TEAMS) return;
    const team = createTeam(store.teams.length + 1);
    setStore((current) => ({ activeId: team.id, teams: [...current.teams, team] }));
  };

  const deleteTeam = () => {
    if (store.teams.length <= 1) return;
    setStore((current) => {
      const teams = current.teams.filter((team) => team.id !== current.activeId);
      return { activeId: teams[0].id, teams };
    });
  };

  const renameTeam = (name) => {
    setStore((current) => ({
      ...current,
      teams: current.teams.map((team) => (
        team.id === current.activeId ? { ...team, name: name || team.name } : team
      )),
    }));
  };

  const exportTeams = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reloadex-equipos.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTeams = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed && Array.isArray(parsed.teams) && parsed.teams.length) setStore(parsed);
      } catch { /* archivo no válido: se ignora */ }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const teamTypes = useMemo(() => [...new Set(
    activeTeam.slots.filter(Boolean).flatMap((slot) => byId.get(slot.id)?.types || []),
  )], [activeTeam.slots, byId]);

  const pendingStats = pending ? calculateStats(pending.pokemon, pending.level) : null;

  return (
    <div className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+32px)]">
      <div className="mx-auto max-w-6xl px-4 pb-10" style={safeTop(24)}>
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
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Creador de equipos
              </h1>
              <p className="mt-0.5 text-xs tracking-[0.08em] text-white/50 sm:text-sm">
                Tu equipo de Pokémon Reloaded
              </p>
            </div>
            <button
              type="button"
              onClick={exportTeams}
              aria-label="Exportar equipos"
              className="flex h-11 w-11 items-center justify-center rounded-2xl glass-effect transition hover:bg-white/10 active:scale-95"
            >
              <Download size={18} />
            </button>
            <label
              aria-label="Importar equipos"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl glass-effect transition hover:bg-white/10 active:scale-95"
            >
              <Upload size={18} />
              <input type="file" accept="application/json" className="hidden" onChange={importTeams} />
            </label>
          </div>
        </header>

        {/* Pestañas de equipos */}
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {store.teams.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => setStore((current) => ({ ...current, activeId: team.id }))}
              className={`shrink-0 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition ${
                team.id === activeTeam.id
                  ? 'border-violet-300/40 bg-violet-500/25 text-white shadow-[0_6px_18px_rgba(139,92,246,0.25)]'
                  : 'border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/10'
              }`}
            >
              <Users size={13} className="mr-1.5 inline" />
              {team.name}
              <span className="ml-1.5 opacity-50">{team.slots.filter(Boolean).length}/6</span>
            </button>
          ))}
          {store.teams.length < MAX_TEAMS && (
            <button
              type="button"
              onClick={addTeam}
              aria-label="Nuevo equipo"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-white/20 text-white/60 transition hover:border-violet-300/50 hover:text-white"
            >
              <Plus size={17} />
            </button>
          )}
        </div>

        {/* Nombre del equipo */}
        <div className="mb-5 flex items-center gap-2">
          {renaming ? (
            <input
              autoFocus
              value={activeTeam.name}
              onChange={(event) => renameTeam(event.target.value)}
              onBlur={() => setRenaming(false)}
              onKeyDown={(event) => { if (event.key === 'Enter') setRenaming(false); }}
              className="h-10 w-full max-w-xs rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm font-semibold text-white outline-none focus:border-violet-300/50"
            />
          ) : (
            <button
              type="button"
              onClick={() => setRenaming(true)}
              className="group flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-white"
            >
              {activeTeam.name}
              <Pencil size={14} className="text-white/35 transition group-hover:text-violet-200" />
            </button>
          )}
          <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-white/50">
            {activeTeam.slots.filter(Boolean).length}/6
          </span>
          {store.teams.length > 1 && (
            <button
              type="button"
              onClick={deleteTeam}
              aria-label="Eliminar equipo"
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition hover:bg-rose-500/15 hover:text-rose-200"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Slots */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeTeam.slots.map((slot, index) => {
            const pokemon = slot ? byId.get(slot.id) : null;
            const stats = slot ? calculateStats(pokemon, slot.level) : null;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.2) }}
                className={`relative overflow-hidden rounded-[24px] border p-4 ${
                  pokemon
                    ? 'border-white/[0.08] bg-white/[0.035]'
                    : 'border-dashed border-white/15 bg-white/[0.02]'
                }`}
              >
                <p className="absolute right-4 top-3 text-[10px] font-bold tracking-[0.14em] text-white/25">
                  {index + 1}
                </p>
                {pokemon ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Sprite
                        pokemon={pokemon}
                        shiny={slot.shiny}
                        className="h-20 w-20 shrink-0 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-white">{pokemon.name}</p>
                        <p className="font-mono text-[11px] text-white/40">
                          #{String(pokemon.id).padStart(4, '0')}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {(pokemon.types || []).map((type) => (
                            <span
                              key={type}
                              className="rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white"
                              style={{ backgroundColor: typeColor(type) }}
                            >
                              {typeName(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="rounded-lg bg-violet-500/20 px-2 py-1 text-[11px] font-bold text-violet-100">
                        Nv. {slot.level}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] text-white/55">
                      <span>PS <b className="text-white/85">{stats.hp}</b></span>
                      <span>At <b className="text-white/85">{stats.attack}</b></span>
                      <span>De <b className="text-white/85">{stats.defense}</b></span>
                      <span>AtE <b className="text-white/85">{stats.spAttack}</b></span>
                      <span>DeE <b className="text-white/85">{stats.spDefense}</b></span>
                      <span>Ve <b className="text-white/85">{stats.speed}</b></span>
                    </div>
                    {(slot.item || slot.ability || slot.shiny) && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-white/50">
                        {slot.item && (
                          <span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-amber-100">
                            {slot.item}
                          </span>
                        )}
                        {slot.ability && (
                          <span className="rounded-md bg-sky-400/15 px-1.5 py-0.5 text-sky-100">
                            {slot.ability}
                          </span>
                        )}
                        {slot.shiny && <Sparkles size={13} className="text-yellow-300" />}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => editSlot(index)}
                        className="flex-1 rounded-xl bg-white/[0.07] py-2 text-[11px] font-bold text-white/80 transition hover:bg-white/[0.12]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        aria-label="Quitar Pokémon"
                        className="flex h-8 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/45 transition hover:bg-rose-500/20 hover:text-rose-200"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openSelector(index)}
                    className="flex h-full min-h-[184px] w-full flex-col items-center justify-center gap-2 text-white/40 transition hover:text-violet-200"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
                      <Plus size={22} />
                    </span>
                    <span className="text-xs font-semibold">Elige un Pokémon</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {teamTypes.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <Zap size={13} className="mr-1 text-white/40" />
            {teamTypes.map((type) => (
              <span
                key={type}
                className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: typeColor(type) }}
              >
                {typeName(type)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Selector de Pokémon */}
      <AnimatePresence>
        {selectorSlot !== null && (
          <Modal onClose={() => setSelectorSlot(null)}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  Elige un Pokémon
                </h2>
                <p className="mt-0.5 text-[11px] text-white/50">
                  Puesto {selectorSlot + 1} · {filtered.length} disponibles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectorSlot(null)}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-white/70"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mb-3">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" />
              <input
                autoFocus
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o número…"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white placeholder-white/35 outline-none focus:border-violet-300/40"
              />
            </div>

            <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setTypeFilter('todos')}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                  typeFilter === 'todos' ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-white/55'
                }`}
              >
                Todos
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white transition ${
                    typeFilter === type ? 'ring-2 ring-white/70' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: typeColor(type) }}
                >
                  {typeName(type)}
                </button>
              ))}
            </div>

            <div className="grid max-h-[46vh] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-6">
              {visible.map((pokemon) => (
                <button
                  key={pokemon.id}
                  type="button"
                  onClick={() => choosePokemon(pokemon)}
                  className="flex flex-col items-center rounded-2xl border border-white/[0.07] bg-white/[0.035] p-2 transition hover:border-violet-300/40 hover:bg-violet-500/15"
                >
                  <Sprite
                    pokemon={pokemon}
                    shiny={false}
                    className="h-14 w-14 object-contain"
                  />
                  <span className="mt-1 w-full truncate text-center text-[11px] font-semibold text-white/90">
                    {pokemon.name}
                  </span>
                  <span className="font-mono text-[9px] text-white/35">
                    #{String(pokemon.id).padStart(4, '0')}
                  </span>
                </button>
              ))}
              {visible.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-white/50">
                  No se encontraron Pokémon
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-white/55">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-xl px-3 py-2 transition hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft size={15} /> Anterior
              </button>
              <span className="tabular-nums">
                Página {currentPage} de {pageCount}
              </span>
              <button
                type="button"
                disabled={currentPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="flex items-center gap-1 rounded-xl px-3 py-2 transition hover:bg-white/10 disabled:opacity-30"
              >
                Siguiente <ChevronRight size={15} />
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Configuración del Pokémon */}
      <AnimatePresence>
        {configSlot !== null && pending && (
          <Modal onClose={() => { setConfigSlot(null); setPending(null); }}>
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-[22px] bg-white/[0.05] p-2">
                <Sprite
                  pokemon={pending.pokemon}
                  shiny={pending.shiny}
                  className="h-24 w-24 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-semibold tracking-[-0.03em] text-white">
                  {pending.pokemon.name}
                </h2>
                <p className="font-mono text-[11px] text-white/40">
                  #{String(pending.pokemon.id).padStart(4, '0')} · Puesto {configSlot + 1}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(pending.pokemon.types || []).map((type) => (
                    <span
                      key={type}
                      className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: typeColor(type) }}
                    >
                      {typeName(type)}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setConfigSlot(null); setPending(null); }}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-white/70"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nivel */}
            <div className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="team-level" className="text-xs font-bold uppercase tracking-[0.1em] text-white/55">
                  Nivel
                </label>
                <input
                  id="team-level-number"
                  type="number"
                  min="1"
                  max="100"
                  value={pending.level}
                  onChange={(event) => setPending((p) => ({
                    ...p,
                    level: Math.min(100, Math.max(1, Number(event.target.value) || 1)),
                  }))}
                  className="w-16 rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-center text-sm font-bold text-white outline-none"
                />
              </div>
              <input
                id="team-level"
                type="range"
                min="1"
                max="100"
                value={pending.level}
                onChange={(event) => setPending((p) => ({ ...p, level: Number(event.target.value) }))}
                className="w-full accent-violet-400"
              />
            </div>

            {/* Shiny */}
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-white/55">
                <Sparkles size={15} className="text-yellow-300" /> Shiny
              </span>
              <div className="flex gap-1 rounded-xl bg-black/25 p-1">
                {[false, true].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setPending((p) => ({ ...p, shiny: value }))}
                    className={`rounded-lg px-4 py-1.5 text-[11px] font-bold transition ${
                      pending.shiny === value ? 'bg-violet-500/40 text-white' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {value ? 'Sí' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Habilidad y objeto */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                  Habilidad
                </span>
                <select
                  value={pending.ability || ''}
                  onChange={(event) => setPending((p) => ({ ...p, ability: event.target.value || null }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#131d33] px-3 text-sm text-white outline-none focus:border-violet-300/40"
                >
                  {(pending.pokemon.abilities || []).map((ability) => (
                    <option key={ability.name} value={ability.name}>
                      {ability.name}{ability.hidden ? ' (oculta)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                  Objeto equipado
                </span>
                <select
                  value={pending.item || ''}
                  onChange={(event) => setPending((p) => ({ ...p, item: event.target.value || null }))}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#131d33] px-3 text-sm text-white outline-none focus:border-violet-300/40"
                >
                  <option value="">Ninguno</option>
                  {equippableItems.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Estadísticas calculadas */}
            <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">
                  Estadísticas en combate
                </p>
                <p className="text-[11px] font-semibold text-violet-200 tabular-nums">
                  Total {statsTotal(pendingStats)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                {STAT_KEYS.map((key) => (
                  <div key={key} className="flex items-center justify-between text-[12px]">
                    <span className="text-white/50">{STAT_LABELS[key]}</span>
                    <span className="font-semibold tabular-nums text-white/90">{pendingStats[key]}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-white/35">
                Cálculo original de Pokémon Reloaded (IV máximo, naturaleza neutral).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setConfigSlot(null); setPending(null); }}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] py-3 text-sm font-bold text-white/70 transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={acceptSlot}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.7)] transition hover:brightness-110 active:scale-[0.99]"
              >
                <Check size={17} /> Aceptar
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
