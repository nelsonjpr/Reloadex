import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight, ArrowUp, Gem, Heart, Moon, Sparkles, Sun,
} from 'lucide-react';
import { pokemonData } from '../data/pokemonIndex';
import { formatId, spriteFallbacks, spriteUrl, typeColor } from '../utils/sprites';

// =============================================================
// Reloadex — línea evolutiva por métodos (sin líneas cruzadas)
// =============================================================
const memory = new Map(); // conserva el scroll al navegar entre eslabones

const EEVEE_ID = 133;
const EEVEE_GROUP_ORDER = ['piedras', 'reloaded'];

// Las 18 evoluciones de Eevee (8 clásicas + 10 de Reloaded) llegan ya con su
// piedra desde reloadex.json. Los tipos de las exclusivas se completan aquí
// cuando el dataset no los trae.
const eeveeTypesFor = (id) => ({
  505: ['grass'], 506: ['ghost'], 507: ['dragon'], 508: ['rock'],
  2054: ['flying'], 2055: ['bug'], 2056: ['ground'], 2057: ['fighting'],
  2058: ['fire'], 2059: ['steel'],
}[id] || ['normal']);

// Índice único: evita ~500.000 comparaciones lineales al construir el árbol.
const pokemonById = new Map(pokemonData.map((p) => [Number(p.id), p]));

export function normalizeLink(x) {
  if (x == null) return null;
  const rawId = typeof x === 'object' ? (x.id ?? x) : x;
  const id = Number(rawId);
  if (!Number.isFinite(id)) return null;
  const known = pokemonById.get(id);
  return {
    id,
    name: known?.name || (typeof x === 'object' ? x.name : null) || `Pokémon #${id}`,
    method: typeof x === 'object' ? (x.method || null) : null,
  };
}
const evolutionParents = new Map();

pokemonData.forEach((p) => {
  (Array.isArray(p.evolutions) ? p.evolutions : []).forEach((e) => {
    const targetId = Number(typeof e === 'object' ? e.id : e);
    if (!Number.isFinite(targetId)) return;
    const parents = evolutionParents.get(targetId) || [];
    parents.push({
      id: Number(p.id),
      name: p.name,
      method: typeof e === 'object' ? (e.method || null) : null,
    });
    evolutionParents.set(targetId, parents);
  });
});

const outgoingFor = (nodeId) => {
  const p = pokemonById.get(Number(nodeId));
  const links = (Array.isArray(p?.evolutions) ? p.evolutions : [])
    .map(normalizeLink)
    .filter((e) => e && Number(e.id) < 100000); // las variantes van en su propio botón
  return links.map((e) => {
    if (e.method) return e;
    const child = pokemonById.get(Number(e.id));
    const back = normalizeLink(child?.prevEvolution);
    if (back && Number(back.id) === Number(nodeId) && back.method) e.method = back.method;
    return e;
  });
};

const rootOf = (current, prevEvolution) => {
  const seen = new Set([Number(current.id)]);
  let cursor = normalizeLink(current) || { id: current.id, name: current.name, method: null };
  if (prevEvolution && !cursor.method) cursor.method = prevEvolution.method || null;
  for (let guard = 0; guard < 20; guard++) {
    const own = normalizeLink(pokemonById.get(Number(cursor.id))?.prevEvolution);
    const parent = (own && Number(own.id) !== Number(cursor.id))
      ? own
      : (evolutionParents.get(Number(cursor.id)) || [])[0];
    if (!parent || seen.has(Number(parent.id))) break;
    seen.add(Number(parent.id));
    cursor = normalizeLink(parent);
  }
  return cursor;
};

const childrenOf = new Map();
const simpleKey = (s) => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

const addEdge = (parentId, child, method, fromReverse = false) => {
  const pid = Number(parentId);
  const cid = Number(typeof child === 'object' ? child.id : child);
  if (!Number.isFinite(pid) || !Number.isFinite(cid) || pid === cid || cid >= 100000) return;
  const name = typeof child === 'object' ? child.name : null;
  const list = childrenOf.get(pid) || [];
  const existing = list.find((e) => Number(e.id) === cid);
  if (existing) {
    if (!existing.method && method) existing.method = method;
    return;
  }
  // Duplicados internos de Reloaded (Pikachu #891, #893…) se descartan cuando
  // llegan solo por prevEvolution. Las ramas explícitas se conservan.
  if (fromReverse && list.some((e) => simpleKey(e.name) === simpleKey(name))) return;
  list.push({ id: cid, name, method: method || null });
  childrenOf.set(pid, list);
};

pokemonData.forEach((p) => {
  outgoingFor(p.id).forEach((e) => addEdge(p.id, e, e.method));
  const back = normalizeLink(p.prevEvolution);
  if (back) addEdge(back.id, p, back.method, true);
});

function methodIcon(method) {
  const m = String(method || '').toLowerCase();
  if (/evoluci[oó]n de eevee/.test(m)) return Sparkles;
  if (/piedra|stone/.test(m)) return Gem;
  if (/\bd[íi]a\b|sol|sun/.test(m)) return Sun;
  if (/noche|luna|moon|night/.test(m)) return Moon;
  if (/intercambio|trade/.test(m)) return ArrowLeftRight;
  if (/felicidad|amistad|afecto|friend|happiness/.test(m)) return Heart;
  if (/nivel|nv\.?|level/.test(m)) return ArrowUp;
  return Sparkles;
}

function eeveeGroupFor(method) {
  const m = String(method || '').toLowerCase();
  if (/piedra/.test(m)) return { key: 'piedras', title: 'Piedras evolutivas', icon: Gem };
  return { key: 'reloaded', title: 'Evoluciones de Reloaded', icon: Sparkles };
}

function genericGroupFor(method) {
  const label = method || 'Evoluciones';
  return { key: simpleKey(label) || 'evolucion', title: label, icon: methodIcon(method) };
}

function buildGroups(current, prevEvolution, activeId) {
  const root = rootOf(current, prevEvolution);
  const rootId = Number(root.id);
  const isEevee = rootId === EEVEE_ID;
  const depth = new Map([[rootId, 0]]);
  const parent = new Map();
  const queue = [rootId];

  while (queue.length) {
    const id = queue.shift();
    (childrenOf.get(id) || []).forEach((child) => {
      const nextId = Number(child.id);
      if (depth.has(nextId)) return;
      depth.set(nextId, depth.get(id) + 1);
      parent.set(nextId, { id, method: child.method || null });
      queue.push(nextId);
    });
  }

  const nodeFor = (id) => {
    const p = pokemonById.get(id);
    const knownTypes = Array.isArray(p?.types) ? p.types : [];
    const types = isEevee && !knownTypes.length ? eeveeTypesFor(id) : knownTypes;
    const parentInfo = parent.get(id);
    const parentId = parentInfo ? Number(parentInfo.id) : null;
    return {
      id,
      name: p?.name || normalizeLink({ id })?.name || `Pokémon #${id}`,
      color: types.length ? typeColor(types[0]) : '#64748b',
      depth: depth.get(id) || 0,
      method: parentInfo?.method || null,
      parentId,
      parentName: parentId != null ? (pokemonById.get(parentId)?.name || null) : null,
      active: Number(id) === Number(activeId),
    };
  };

  const rootNode = nodeFor(rootId);
  const groupsById = new Map();

  [...depth.keys()]
    .filter((id) => id !== rootId)
    .sort((a, b) => (depth.get(a) - depth.get(b)) || (a - b))
    .forEach((id) => {
      const node = nodeFor(id);
      const group = isEevee ? eeveeGroupFor(node.method) : genericGroupFor(node.method);
      if (!groupsById.has(group.key)) {
        groupsById.set(group.key, { ...group, items: [] });
      }
      groupsById.get(group.key).items.push(node);
    });

  const groups = [...groupsById.values()].sort((a, b) => {
    if (!isEevee) return 0;
    return EEVEE_GROUP_ORDER.indexOf(a.key) - EEVEE_GROUP_ORDER.indexOf(b.key);
  });

  return { rootId, root: rootNode, groups };
}

const Sprite = ({ id, name, className = '', style }) => {
  const fallbacks = spriteFallbacks(id, false);
  return (
    <img
      src={spriteUrl(id, false)}
      alt={name}
      className={`object-contain pixelated ${className}`}
      style={style}
      onError={(e) => {
        const next = fallbacks.find((f) => !e.target.src.endsWith(f.split('/').pop()));
        if (next && !e.target.dataset.tried) {
          e.target.dataset.tried = '1';
          e.target.src = next;
        } else {
          e.target.style.visibility = 'hidden';
        }
      }}
    />
  );
};

export default function EvolutionTree({ pokemon, prevEvolution, onNavigate }) {
  const activeId = Number(pokemon?.id);
  const line = useMemo(
    () => buildGroups(pokemon, prevEvolution, activeId),
    [pokemon, prevEvolution, activeId],
  );
  const scroller = useRef(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;
    const saved = memory.get(line.rootId);
    if (saved) el.scrollTop = saved.top || 0;
    const onScroll = () => memory.set(line.rootId, { top: el.scrollTop });
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [line.rootId]);

  return (
    <div
      ref={scroller}
      className="evolution-grid max-h-[min(70vh,560px)] overflow-y-auto rounded-[28px] border border-white/10 bg-[#060c1b]/90 p-4 pr-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <header className="evo-anchor mb-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
        <button
          type="button"
          onClick={() => onNavigate(line.root.id)}
          title={`${line.root.name} · ${formatId(line.root.id)}`}
          className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-[#0a1226] shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-105 active:scale-95"
          style={{ borderColor: line.root.active ? '#ffffff' : `${line.root.color}cc` }}
        >
          <Sprite
            id={line.root.id}
            name={line.root.name}
            className="h-full w-full scale-[1.22] transform-gpu drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]"
          />
        </button>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            {formatId(line.root.id)}
          </p>
          <h4 className="truncate text-sm font-semibold tracking-[-0.03em] text-white">{line.root.name}</h4>
          <p className="text-[11px] text-white/45">Base de esta línea</p>
        </div>
      </header>

      <div className="evo-rail mb-4 h-px w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

      <div className="evo-groups grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {line.groups.map((group) => {
          const Icon = group.icon;
          const groupColor = group.items[0]?.color || '#38bdf8';
          const singleMethod = group.items.every(
            (item) => item.method === group.items[0]?.method,
          );
          return (
            <article
              key={group.key}
              className="evo-group premium-card rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
              style={{ '--card-shadow': `0 18px 40px -22px ${groupColor}77, 0 12px 26px -16px rgba(3, 10, 26, 0.85)` }}
            >
              <header className="evo-group__header mb-3 flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-sky-200 ring-1 ring-white/10"
                  style={{
                    color: groupColor,
                    background: `radial-gradient(circle at 30% 25%, ${groupColor}55 0%, ${groupColor}1f 55%, ${groupColor}0d 100%)`,
                  }}
                >
                  <Icon size={16} />
                </span>
                <h5 className="min-w-0 flex-1 truncate text-xs font-semibold tracking-[-0.02em] text-white">{group.title}</h5>
                <span className="pill bg-white/10 px-2 py-0.5 text-[10px] text-white/60 ring-1 ring-white/10">
                  {group.items.length}
                </span>
              </header>

              {singleMethod && group.items[0]?.method && (
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-white/45">
                  Método: {group.items[0].method}
                </p>
              )}

              <div className="evo-group__grid grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.items.map((item) => {
                  const MethodIcon = methodIcon(item.method);
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ y: -4, transition: { duration: 0.3, delay: 0 } }}
                      whileTap={{ scale: 0.97, transition: { duration: 0.18, delay: 0 } }}
                      onClick={() => onNavigate(item.id)}
                      title={`${item.name} · ${formatId(item.id)} · ${item.method || 'Evolución'}`}
                      className="evo-item premium-card group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/25 p-3 text-center"
                      style={{
                        borderColor: item.active ? `${item.color}aa` : undefined,
                        background: item.active ? `${item.color}22` : undefined,
                        '--card-shadow': item.active
                          ? `0 16px 34px -18px ${item.color}bb`
                          : `0 14px 30px -18px ${item.color}55`,
                        '--card-shadow-hover': `0 22px 44px -18px ${item.color}aa`,
                      }}
                    >
                      <span
                        className="evo-item__sprite flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-white/20 to-black/30 ring-1 ring-white/20"
                        style={{ boxShadow: `inset 0 1px 4px rgba(255,255,255,0.16), 0 0 14px ${item.color}44` }}
                      >
                        <Sprite
                          id={item.id}
                          name={item.name}
                          className="h-full w-full scale-[1.25] transform-gpu"
                          style={{ filter: `drop-shadow(0 3px 5px rgba(2,6,18,0.42)) drop-shadow(0 0 7px ${item.color}66)` }}
                        />
                      </span>
                      <span className="evo-item__name mt-1 text-[11px] font-semibold leading-tight tracking-[-0.02em] text-white">
                        {item.name}
                      </span>
                      <span className="evo-item__id font-mono text-[10px] text-white/45">
                        {formatId(item.id)}
                      </span>
                      {item.parentId !== line.rootId && item.parentName && (
                        <span className="evo-item__from text-[9px] leading-tight text-white/35">
                          desde {item.parentName}
                        </span>
                      )}
                      <span className="evo-method-pill pill mt-1 inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase text-white/80 ring-1 ring-white/15">
                        <MethodIcon size={10} style={{ color: item.color }} className="shrink-0" />
                        <span className="truncate">{item.method || 'Evolución'}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
