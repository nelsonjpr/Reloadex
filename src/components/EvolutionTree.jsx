import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight, ArrowUp, ChevronRight, Gem, GitBranch, Heart,
  Moon, Sparkles, Sun,
} from 'lucide-react';
import { pokemonData } from '../data/pokemonIndex';
import { formatId, spriteFallbacks, spriteUrl, typeColor } from '../utils/sprites';

// =============================================================
// Reloadex — línea evolutiva horizontal con ramificaciones
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

const displayMethod = (method) => String(method || 'Evolución')
  .replace(/\b[Nn][Vv]\s*:\s*/, 'Nv. ')
  .replace(/\s+/g, ' ')
  .trim();

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
      if (!groupsById.has(group.key)) groupsById.set(group.key, { ...group, items: [] });
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

function EvolutionNode({ node, onNavigate, compact = false, branchColor = null }) {
  return (
    <div
      className={`relative flex shrink-0 flex-col items-center text-center ${compact ? 'w-[96px]' : 'w-[78px]'}`}
      data-active={node.active ? 'true' : 'false'}
    >
      <motion.button
        type="button"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate(node.id)}
        title={`${node.name} · ${formatId(node.id)}`}
        aria-label={`Ver ${node.name}`}
        className="relative flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full bg-[var(--surface-strong)] transition-shadow"
        style={{
          border: `3px solid ${node.active ? '#ffffff' : node.color}`,
          boxShadow: `0 0 18px ${node.color}77, inset 0 0 0 1px rgba(255,255,255,0.08)`,
        }}
      >
        <Sprite
          id={node.id}
          name={node.name}
          className="h-full w-full scale-[1.18] transform-gpu"
          style={{ filter: `drop-shadow(0 3px 5px rgba(2,6,18,0.45)) drop-shadow(0 0 6px ${node.color}55)` }}
        />
      </motion.button>
      {branchColor && (
        <span
          className="absolute left-full top-[39px] h-[2px] w-3 rounded-full"
          style={{ background: `${branchColor}cc`, boxShadow: `0 0 8px ${branchColor}66` }}
        />
      )}
      <span className="mt-2 w-full truncate text-[11px] font-semibold leading-tight tracking-[-0.02em] text-white">
        {node.name}
      </span>
      {!compact && (
        <span className="mt-0.5 font-mono text-[9px] text-white/40">{formatId(node.id)}</span>
      )}
    </div>
  );
}

function Connector({ method, color }) {
  const Icon = methodIcon(method);
  return (
    <div className="relative flex h-12 w-[82px] shrink-0 items-center sm:w-[104px]">
      <span
        className="h-[2px] w-full rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}88` }}
      />
      <span
        className="pill absolute left-1/2 top-1/2 flex max-w-[96px] -translate-x-1/2 -translate-y-1/2 items-center gap-1 border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/85"
        style={{ background: 'var(--surface-strong)', borderColor: `${color}66` }}
      >
        <Icon size={10} style={{ color }} className="shrink-0" />
        <span className="truncate">{displayMethod(method)}</span>
      </span>
      <ChevronRight
        size={16}
        className="absolute -right-1.5 top-1/2 -translate-y-1/2"
        style={{ color, filter: `drop-shadow(0 0 5px ${color}aa)` }}
      />
    </div>
  );
}

// Rama horizontal de una bifurcación: la línea sale del tronco y llega al
// círculo del Pokémon, con la píldora del método apoyada sobre esa línea.
function BranchConnector({ method, color }) {
  const Icon = methodIcon(method);
  return (
    <div className="relative h-[100px] w-[112px] shrink-0">
      <span
        className="absolute left-0 h-[2px] w-[112px] rounded-full"
        style={{ top: 39, background: color, boxShadow: `0 0 8px ${color}88` }}
      />
      <ChevronRight
        size={14}
        className="absolute -translate-y-1/2"
        style={{ top: 39, left: 105, color, filter: `drop-shadow(0 0 5px ${color}aa)` }}
      />
      <span
        className="pill absolute flex max-w-[104px] -translate-x-1/2 -translate-y-1/2 items-center gap-1 border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/85"
        style={{ top: 39, left: 56, background: 'var(--surface)', borderColor: `${color}66` }}
      >
        <Icon size={10} style={{ color }} className="shrink-0" />
        <span className="truncate">{displayMethod(method)}</span>
      </span>
    </div>
  );
}

function BranchNode({ node, childMap, onNavigate, compact = false }) {
  const children = childMap.get(node.id) || [];

  if (!children.length) {
    return <EvolutionNode node={node} onNavigate={onNavigate} compact={compact} />;
  }

  // Cadena simple: se mantiene el conector recto de siempre.
  if (children.length === 1) {
    const child = children[0];
    return (
      <div className={`flex gap-3 ${compact ? 'items-start' : 'items-center'}`}>
        <EvolutionNode node={node} onNavigate={onNavigate} compact={compact} />
        <Connector method={child.method} color={child.color} />
        <BranchNode node={child} childMap={childMap} onNavigate={onNavigate} compact={compact} />
      </div>
    );
  }

  // Bifurcación: el padrecentrado a la izquierda, tronco vertical y una rama
  // horizontal por cada evolución apilada a la derecha. Sin líneas cruzadas.
  return (
    <div className={`flex ${compact ? 'items-start' : 'items-center'}`}>
      <EvolutionNode
        node={node}
        onNavigate={onNavigate}
        compact={compact}
        branchColor={node.color}
      />
      <div className="relative ml-3 flex flex-col">
        {children.map((child, index) => (
          <div key={child.id} className="relative flex items-start pb-3 last:pb-0">
            {/* Cada fila dibuja su trozo de tronco; juntas forman una línea
                continua desde el centro de la primera hasta la última. */}
            <span
              className="absolute left-0 w-[2px] rounded-full"
              style={{
                top: index === 0 ? 39 : 0,
                bottom: index === children.length - 1 ? 'calc(100% - 39px)' : 0,
                background: `${node.color}cc`,
                boxShadow: `0 0 8px ${node.color}66`,
              }}
            />
            <BranchConnector method={child.method} color={child.color} />
            <BranchNode node={child} childMap={childMap} onNavigate={onNavigate} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EvolutionTree({ pokemon, prevEvolution, onNavigate }) {
  const activeId = Number(pokemon?.id);
  const line = useMemo(
    () => buildGroups(pokemon, prevEvolution, activeId),
    [pokemon, prevEvolution, activeId],
  );

  const childMap = useMemo(() => {
    const nodes = new Map([[line.rootId, line.root]]);
    line.groups.forEach((group) => group.items.forEach((item) => nodes.set(item.id, item)));
    const map = new Map();
    nodes.forEach((node) => {
      if (node.parentId == null) return;
      const list = map.get(node.parentId) || [];
      list.push(node);
      map.set(node.parentId, list);
    });
    return map;
  }, [line]);

  const scroller = useRef(null);
  const scrollFrame = useRef(0);
  const memoryKey = `${line.rootId}:${activeId}`;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;

    const saved = memory.get(memoryKey);
    if (saved) {
      el.scrollLeft = saved.left || 0;
      el.scrollTop = saved.top || 0;
    } else {
      const active = el.querySelector('[data-active="true"]');
      if (active) {
        el.scrollLeft = Math.max(0, active.offsetLeft - el.clientWidth / 2 + active.offsetWidth / 2);
        el.scrollTop = Math.max(0, active.offsetTop - el.clientHeight / 2 + active.offsetHeight / 2);
      }
    }

    // Con rAF se escribe como mucho una vez por frame durante el scroll.
    const onScroll = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = window.requestAnimationFrame(() => {
        scrollFrame.current = 0;
        memory.set(memoryKey, { left: el.scrollLeft, top: el.scrollTop });
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (scrollFrame.current) window.cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
    };
  }, [memoryKey]);

  return (
    <section className="app-card rounded-[20px] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-2xl ring-1 ring-white/10"
          style={{ background: `${line.root.color}1f`, color: line.root.color }}
        >
          <GitBranch size={18} />
        </span>
        <h3 className="text-base font-semibold tracking-[-0.03em] text-white">Línea evolutiva</h3>
      </div>

      <div
        ref={scroller}
        className="evolution-grid max-h-[min(60vh,480px)] overflow-auto pb-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="relative mx-auto flex w-max items-center gap-3 px-1 py-2">
          <LineageBranch node={line.root} childMap={childMap} onNavigate={onNavigate} />
        </div>
      </div>
    </section>
  );
}
