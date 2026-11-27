import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, ChevronDown, Compass, Filter, Flag,
  List, Map, Search, Sparkles, Sword, Trophy,
} from 'lucide-react';
import guideData from '../data/guide.json';
import { safeTop } from '../utils/safeArea';

// =============================================================
// Reloadex — Guía / Historia de Pokémon Reloaded
// Contenido extraído de la wiki oficial y ordenado por regiones.
// =============================================================
const KIND = {
  inicio: { label: 'Inicio', icon: BookOpen, color: '#818cf8' },
  medalla: { label: 'Medalla', icon: Trophy, color: '#fbbf24' },
  liga: { label: 'Liga', icon: Sword, color: '#fb7185' },
  misiones: { label: 'Misiones', icon: Compass, color: '#22d3ee' },
  final: { label: 'Final', icon: Flag, color: '#c084fc' },
};

const REGION_LABEL = { 'Antes de empezar': 'Inicio' };
const REGION_COLOR = {
  Inicio: '#818cf8',
  Star: '#fbbf24',
  Kanto: '#f97316',
  Johto: '#a3e635',
  Hoenn: '#22d3ee',
  Sinnoh: '#60a5fa',
  Teselia: '#f472b6',
  Kalos: '#34d399',
  Alola: '#c084fc',
  'Islas Cometa': '#38bdf8',
};

const normalize = (value) => String(value || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const chapterText = (chapter) => normalize([
  chapter.title,
  chapter.region,
  chapter.part,
  ...chapter.sections.flatMap((section) => [
    section.heading,
    ...section.blocks.map((block) => (
      block.type === 'table'
        ? block.rows.flat().join(' ')
        : block.text || (block.items || []).map((item) => item.text).join(' ')
    )),
  ]),
].join(' '));

const sectionKind = (section, chapter) => {
  const heading = normalize(section.heading);
  if (/medalla|gimnasio|lider/.test(heading)) return 'medalla';
  if (/liga|alto mando|campeon|combate final/.test(heading)) return 'liga';
  if (/mision|q0\d\d/.test(heading)) return 'misiones';
  if (/fin de la beta|volcan tormento/.test(heading)) return 'final';
  return chapter.kind;
};

const BlockView = ({ block }) => {
  if (block.type === 'note') {
    return (
      <div className="flex gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-3 py-2.5 text-xs leading-relaxed text-amber-100/90">
        <Sparkles size={14} className="mt-0.5 shrink-0 text-amber-300" />
        <span>{block.text}</span>
      </div>
    );
  }

  if (block.type === 'list') {
    return (
      <ul className="space-y-1.5 py-0.5">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm leading-relaxed text-white/80"
            style={{ paddingLeft: `${item.depth * 16}px` }}
          >
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'table') {
    return (
      <div className="-mx-1 overflow-x-auto rounded-xl border border-white/[0.07] bg-black/20">
        <table className="w-full min-w-[520px] border-collapse text-left text-xs text-white/80">
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 ? 'bg-white/[0.025]' : ''}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="whitespace-pre-wrap border-b border-r border-white/[0.05] px-3 py-2 align-top last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <p className="text-sm leading-relaxed text-white/80">{block.text}</p>;
};

const SectionView = ({ section, chapter }) => {
  const kind = sectionKind(section, chapter);
  const meta = KIND[kind] || KIND.inicio;
  const isMilestone = kind === 'medalla' || kind === 'liga' || kind === 'final';

  return (
    <section
      className={`relative rounded-2xl border p-4 sm:p-5 ${
        isMilestone
          ? 'border-white/[0.12] bg-white/[0.045]'
          : 'border-white/[0.06] bg-white/[0.025]'
      }`}
    >
      <div
        className="absolute inset-y-3 left-0 w-[3px] rounded-full"
        style={{ backgroundColor: meta.color, opacity: isMilestone ? 1 : 0.55 }}
      />
      <div className="mb-3 flex flex-wrap items-center gap-2 pl-2">
        <h3
          className={`text-base font-semibold tracking-[-0.02em] text-white sm:text-lg ${
            section.level >= 4 ? 'text-sm sm:text-base' : ''
          }`}
        >
          {section.heading}
        </h3>
        {isMilestone && (
          <span
            className="pill px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-950"
            style={{ backgroundColor: meta.color }}
          >
            {meta.label}
          </span>
        )}
      </div>
      <div className="space-y-3 pl-2">
        {section.blocks.map((block, i) => <BlockView key={i} block={block} />)}
      </div>
    </section>
  );
};

const GuiaView = ({ onBack }) => {
  const [region, setRegion] = useState('Star');
  const [phase, setPhase] = useState('Todo');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState('liga-star');
  const [indexOpen, setIndexOpen] = useState(false);

  const chapters = guideData.chapters;
  const index = useMemo(() => chapters.map((c) => ({ id: c.id, text: chapterText(c) })), []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return chapters.filter((chapter) => {
      if (region !== 'Todo') {
        const label = REGION_LABEL[chapter.region] || chapter.region;
        if (label !== region) return false;
      }
      if (phase !== 'Todo' && chapter.kind !== phase) return false;
      if (q) {
        const text = index.find((entry) => entry.id === chapter.id)?.text || '';
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [chapters, index, phase, query, region]);

  const jumpTo = (id) => {
    setRegion('Todo');
    setPhase('Todo');
    setQuery('');
    setOpen(id);
    setIndexOpen(false);
    window.setTimeout(() => {
      document.getElementById(`capitulo-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 90);
  };

  const regionOptions = ['Todo', ...guideData.regions.map((r) => REGION_LABEL[r] || r)];
  const phaseOptions = ['Todo', 'inicio', 'medalla', 'liga', 'misiones', 'final'];

  return (
    <div className="min-h-screen bg-[#080d1a] pb-[calc(env(safe-area-inset-bottom)+28px)]">
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:pb-8" style={safeTop(24)}>
        {/* Cabecera */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Volver"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl glass-effect text-white transition hover:bg-white/10 active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Guía
              </h1>
              <p className="mt-0.5 text-xs font-normal tracking-[0.08em] text-white/50 sm:text-sm">
                Guía completa de Pokémon Reloaded, capítulo por capítulo
              </p>
            </div>
          </div>
        </header>

        {/* Búsqueda + índice */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ruta, líder, objeto o medalla…"
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d1528]/90 pl-11 pr-4 text-sm text-white placeholder-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition"
            />
          </div>
          <button
            onClick={() => setIndexOpen(true)}
            aria-label="Abrir índice"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1528]/90 text-white/80 transition hover:bg-white/10 active:scale-95"
          >
            <List size={19} />
          </button>
        </div>

        {/* Filtros de región */}
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-thin">
          {regionOptions.map((option) => {
            const active = region === option;
            const color = REGION_COLOR[option] || '#94a3b8';
            return (
              <button
                key={option}
                onClick={() => setRegion(option)}
                className={`pill shrink-0 px-3.5 py-2 text-xs font-semibold tracking-wide transition active:scale-95 ${
                  active ? 'text-slate-950' : 'text-white/70 hover:text-white'
                }`}
                style={{
                  backgroundColor: active ? color : 'rgba(255,255,255,0.06)',
                  boxShadow: active ? `0 10px 24px -12px ${color}` : 'none',
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Filtros de fase */}
        <div className="-mx-4 mb-5 flex items-center gap-2 overflow-x-auto px-4 pb-1 scrollbar-thin">
          <Filter size={14} className="shrink-0 text-white/35" />
          {phaseOptions.map((option) => {
            const active = phase === option;
            const meta = KIND[option];
            const label = option === 'Todo' ? 'Todo' : meta.label;
            const color = meta?.color || '#f8fafc';
            return (
              <button
                key={option}
                onClick={() => setPhase(option)}
                className={`pill shrink-0 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition active:scale-95 ${
                  active ? 'text-slate-950' : 'text-white/55 hover:text-white'
                }`}
                style={{ backgroundColor: active ? color : 'rgba(255,255,255,0.05)' }}
              >
                {label}
              </button>
            );
          })}
          <span className="ml-auto shrink-0 text-[11px] tabular-nums text-white/40">
            {filtered.length} capítulos
          </span>
        </div>

        <div className="flex items-start gap-6">
          {/* Índice lateral (escritorio) */}
          <aside className="sticky top-6 hidden w-60 shrink-0 lg:block">
            <div className="glass-dark rounded-2xl border border-white/[0.06] p-3">
              <div className="mb-3 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                <Map size={14} /> Índice
              </div>
              <div className="max-h-[70vh] space-y-1 overflow-y-auto pr-1 scrollbar-thin">
                {chapters.map((chapter) => {
                  const meta = KIND[chapter.kind] || KIND.inicio;
                  const active = open === chapter.id;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => jumpTo(chapter.id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition ${
                        active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span className="min-w-0 flex-1 truncate">{chapter.title}</span>
                      <span className="text-[9px] text-white/30">
                        {(REGION_LABEL[chapter.region] || chapter.region).slice(0, 4)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Capítulos */}
          <main className="min-w-0 flex-1 space-y-3">
            {filtered.map((chapter, indexNumber) => {
              const meta = KIND[chapter.kind] || KIND.inicio;
              const Icon = meta.icon;
              const isOpen = open === chapter.id;
              return (
                <motion.article
                  key={chapter.id}
                  id={`capitulo-${chapter.id}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(indexNumber * 0.02, 0.25) }}
                  className="premium-card overflow-hidden rounded-[22px] border border-white/[0.07] scroll-mt-4"
                  style={{
                    '--card-shadow': `0 18px 44px -26px ${meta.color}66, 0 12px 30px -18px rgba(3,8,20,0.85)`,
                    '--card-shadow-hover': `0 26px 58px -22px ${meta.color}88, 0 16px 34px -16px rgba(3,8,20,0.9)`,
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : chapter.id)}
                    className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
                    >
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className="pill px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-950"
                          style={{ backgroundColor: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
                          {REGION_LABEL[chapter.region] || chapter.region} · {chapter.part}
                        </span>
                      </span>
                      <span className="block truncate text-base font-semibold tracking-[-0.025em] text-white sm:text-lg">
                        {chapter.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-white/45">
                        {chapter.sections.length} apartados
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-white/45"
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 border-t border-white/[0.06] bg-black/20 p-4 sm:p-5">
                          {chapter.sections.map((section, i) => (
                            <SectionView key={`${section.id}-${i}`} section={section} chapter={chapter} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] py-16 text-center">
                <div className="mb-3 text-4xl">🗺️</div>
                <p className="text-sm text-white/60">No hay capítulos con esos filtros.</p>
                <button
                  onClick={() => { setRegion('Todo'); setPhase('Todo'); setQuery(''); }}
                  className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Índice móvil */}
      <AnimatePresence>
        {indexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndexOpen(false)}
            className="fixed inset-0 z-[75] flex items-end bg-black/70 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full overflow-y-auto rounded-t-[26px] border border-white/10 bg-[#0b1120] p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Índice de la guía</h2>
                  <p className="text-[11px] text-white/45">Toca un capítulo para ir a él</p>
                </div>
                <button
                  onClick={() => setIndexOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
                  aria-label="Cerrar índice"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {chapters.map((chapter) => {
                  const meta = KIND[chapter.kind] || KIND.inicio;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => jumpTo(chapter.id)}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left text-xs text-white/80 transition active:scale-[0.98]"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span className="min-w-0 flex-1 truncate">{chapter.title}</span>
                      <span className="text-[9px] text-white/35">
                        {REGION_LABEL[chapter.region] || chapter.region}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuiaView;
