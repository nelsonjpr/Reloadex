import React, { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, CheckCircle2, ChevronDown, ListChecks, LockKeyhole,
  Search, ScrollText, Sparkles, Trophy, Users,
} from 'lucide-react';
import {
  QUEST_SEARCH_INDEX, normalizeQuestText, questGroups, questStats,
} from '../data/quests';
import { safeTop } from '../utils/safeArea';

// Igual que en objetos: la lista se entrega en tandas para no montar las 144
// fichas completas de golpe en pantallas pequeñas.
const PAGE_SIZE = 40;
const PREVIEW_OBJECTIVES = 4;

const KIND_INFO = {
  objetivo: { label: 'Objetivo', icon: ListChecks, color: 'text-indigo-200', bg: 'bg-indigo-400/10 ring-indigo-300/20' },
  opcional: { label: 'Opcional', icon: Sparkles, color: 'text-amber-200', bg: 'bg-amber-300/10 ring-amber-300/20' },
  restriccion: { label: 'Restricción', icon: LockKeyhole, color: 'text-rose-200', bg: 'bg-rose-400/10 ring-rose-300/20' },
};

const GROUP_ICONS = { principales: ScrollText, elite: Users, frente: Trophy };

const QuestCard = memo(function QuestCard({ quest }) {
  const [open, setOpen] = useState(false);
  const objectives = quest.objectives || [];
  const visible = open ? objectives : objectives.slice(0, PREVIEW_OBJECTIVES);

  return (
    <article
      className="premium-card deferred-card rounded-[24px] border border-white/[0.07] p-4 sm:p-5"
      style={{
        '--deferred-height': '210px',
        '--card-shadow': '0 18px 44px -24px rgba(129,140,248,0.35), 0 12px 30px -18px rgba(3,8,20,0.85)',
        '--card-shadow-hover': '0 26px 58px -22px rgba(129,140,248,0.5), 0 16px 34px -16px rgba(3,8,20,0.9)',
      }}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/15 font-mono text-[11px] font-bold text-indigo-200 ring-1 ring-indigo-300/25">
          {quest.id}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-white">{quest.title}</h2>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                {quest.groupLabel}
              </p>
            </div>
            <span className="pill shrink-0 bg-white/[0.07] px-2.5 py-1 text-[10px] font-bold text-white/65 ring-1 ring-white/10">
              {objectives.length} pasos
            </span>
          </div>

          {quest.description && (
            <p className="mt-3 text-[13px] leading-relaxed text-white/70">{quest.description}</p>
          )}

          {objectives.length > 0 && (
            <div className="mt-3 space-y-2">
              {visible.map((objective, i) => {
                const info = KIND_INFO[objective.kind] || KIND_INFO.objetivo;
                const Icon = info.icon;
                return (
                  <div
                    key={`${quest.id}-${i}`}
                    className="flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-[var(--surface-strong)] px-3 py-2.5"
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg ring-1 ${info.bg} ${info.color}`}>
                      <Icon size={12} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white/90">{objective.text}</p>
                      <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${info.color}`}>
                        {info.label}
                      </p>
                    </div>
                  </div>
                );
              })}
              {objectives.length > PREVIEW_OBJECTIVES && (
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold text-indigo-300 transition hover:bg-white/5"
                >
                  {open ? 'Ver menos' : `Ver los ${objectives.length} pasos`}
                  <ChevronDown size={13} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
              )}
            </div>
          )}

          {quest.resolution && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-2.5">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-200/80" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200/80">Resolución</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-white/65">{quest.resolution}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
});

const QuestsView = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [group, setGroup] = useState('todos');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [deferredSearch, group]);

  const filters = useMemo(() => {
    const counts = new Map();
    for (const item of QUEST_SEARCH_INDEX) counts.set(item.group, (counts.get(item.group) || 0) + 1);
    return [
      { key: 'todos', label: 'Todas', count: QUEST_SEARCH_INDEX.length },
      ...questGroups.map((item) => ({
        key: item.key,
        label: item.label,
        count: counts.get(item.key) || 0,
        icon: GROUP_ICONS[item.key],
      })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = normalizeQuestText(deferredSearch);
    const result = [];
    for (const entry of QUEST_SEARCH_INDEX) {
      if (group !== 'todos' && entry.group !== group) continue;
      if (q && !entry.haystack.includes(q)) continue;
      result.push(entry.quest);
    }
    return result;
  }, [deferredSearch, group]);

  const visibleQuests = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
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
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Misiones</h1>
              <p className="mt-0.5 text-xs font-normal tracking-[0.08em] text-white/50 sm:text-sm">
                Todas las misiones de Pokémon Reloaded y qué hacer en cada una
              </p>
            </div>
          </div>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {[
            { label: 'Historia', value: questStats.principales },
            { label: 'Escuadrón Élite', value: questStats.elite },
            { label: 'Frente', value: questStats.frente },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/[0.07] bg-[var(--surface-strong)] px-3 py-2.5 text-center">
              <p className="text-lg font-semibold tabular-nums text-indigo-200">{item.value}</p>
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white/45">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar misión, objetivo o lugar…"
            className="h-12 w-full rounded-2xl border border-white/10 bg-[var(--surface)] pl-11 pr-4 text-sm text-white placeholder-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          />
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setGroup(item.key)}
                aria-pressed={group === item.key}
                className={`pill flex shrink-0 items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold transition ${
                  group === item.key ? 'bg-indigo-300 text-[#0b1220]' : 'bg-white/[0.07] text-white/65 hover:bg-white/10'
                }`}
              >
                {Icon && <Icon size={13} />}
                {item.label} <span className="opacity-60">{item.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-5 text-center text-[11px] text-white/45 tabular-nums">
          Mostrando <span className="font-semibold text-indigo-300">{visibleQuests.length}</span> de{' '}
          <span className="font-semibold text-white/70">{filtered.length}</span> misiones
          {filtered.length !== questStats.total && (
            <><span className="mx-2 opacity-40">·</span>{questStats.total} registradas</>
          )}
          {search !== deferredSearch && <span className="ml-2 text-indigo-300/70">Buscando…</span>}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <div className="text-sm text-white/60">No se encontraron misiones</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {visibleQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>

            {visibleQuests.length < filtered.length && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="h-11 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 px-6 text-xs font-bold text-white shadow-[0_14px_30px_-14px_rgba(129,140,248,0.8)] transition active:scale-95"
                >
                  Cargar {Math.min(PAGE_SIZE, filtered.length - visibleQuests.length)} más
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE * 2)}
                  className="rounded-xl px-4 py-1.5 text-[11px] font-semibold text-white/50 transition hover:text-white/80"
                >
                  Cargar 80
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestsView;
