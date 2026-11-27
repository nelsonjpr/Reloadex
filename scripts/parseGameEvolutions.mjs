// Parsea las evoluciones reales de los scripts GML embebidos en el EXE de
// Pokémon Reloaded (extraídos por extractGameScripts.py).
// La tabla resultante se usa en buildReloadexData.mjs con prioridad sobre el
// backup heredado, excepto para Eevee (18 piedras, ya verificado).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS = path.join(HERE, 'game-scripts');
const GAME_TEXT = 'D:/Juegos/Reloaded/data/text';
const MENU = decodeFile(`${GAME_TEXT}/es/txt_menu.dll`);
const ITEMS = decodeFile(`${GAME_TEXT}/es/txt_obj.dll`);

const readGml = (name) => fs.readFileSync(path.join(SCRIPTS, `${name}.gml.txt`), 'utf8');

const rawMenuText = (id) => String(MENU[Number(id) - 1] || '').replace(/^#/, '').trim();
const menuText = (id) => rawMenuText(id)
  .replace(/\$par\d+\$/g, '').replace(/^\((.*)\)$/, '$1').trim();
const itemName = (id) => String(ITEMS[Number(id) - 1] || `Objeto ${id}`).trim();

// Los textos del juego se construyen con llamadas ex(...) anidadas. Se
// sustituyen de dentro hacia fuera para que ex(9875, plantilla, valor)
// reciba ya la plantilla resuelta (por ejemplo "Nv: $par1$").
function splitArgs(text) {
  const out = [];
  let depth = 0;
  let quoted = false;
  let current = '';
  for (const ch of text) {
    if (ch === '"') { quoted = !quoted; current += ch; continue; }
    if (!quoted && ch === '(') depth++;
    if (!quoted && ch === ')') depth--;
    if (!quoted && ch === ',' && depth === 0) { out.push(current); current = ''; continue; }
    current += ch;
  }
  out.push(current);
  return out;
}

// Convierte las expresiones de texto del juego a español legible.
function decodeMethod(raw) {
  let s = String(raw || '').trim();
  for (let pass = 0; pass < 10; pass++) {
    const before = s;
    s = s.replace(/ex\(([^()]*)\)/g, (_, args) => {
      const parts = splitArgs(args);
      const fn = parts[0];
      if (fn === '9868') return rawMenuText(parts[1]);
      if (fn === '8734') return itemName(parts[1]);
      // ex(8717) usa la numeración interna de objetos del juego (47 menos
      // que la línea de texto en txt_obj.dll).
      if (fn === '8717') return itemName(Number(parts[1]) - 47);
      if (fn === '9875') {
        const template = parts[1] || '';
        const value = parts.slice(2).join(',').replace(/"/g, '');
        return template.replace(/\$par\d+\$/g, value);
      }
      return '';
    });
    if (s === before) break;
  }
  s = s.replace(/\+/g, ' ').replace(/\s+/g, ' ')
    .replace(/\$par\d+\$/g, '').replace(/^#+|#+$/g, '').trim();
  return s || null;
}

function blockAt(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return '';
}

// Los bloques de evolución empiezan por if(PK=...) o por rangos if(PK>=... && PK<=...).
// Los `if` anidados de (79).EV no se confunden con el inicio de bloque.
function topBlocks(src) {
  const out = [];
  const re = /if\(PK(?:=|>=|<=)/g;
  let m;
  while ((m = re.exec(src))) {
    const brace = src.indexOf('{', m.index);
    if (brace < 0 || brace > m.index + 2000) continue;
    const condition = src.slice(m.index + 3, brace).trim();
    const body = blockAt(src, brace);
    out.push({ condition, body });
    re.lastIndex = brace + Math.max(1, body.length);
  }
  return out;
}

function idsFromCondition(condition) {
  const ids = [];
  for (const m of condition.matchAll(/PK=(\d+)/g)) ids.push(Number(m[1]));
  for (const m of condition.matchAll(/PK>=(\d+)\s*&&\s*PK<=(\d+)/g)) {
    const from = Number(m[1]);
    const to = Number(m[2]);
    if (to - from <= 1000) for (let i = from; i <= to; i++) ids.push(i);
  }
  return [...new Set(ids)];
}

const links = new Map(); // `${from}>${to}` -> { from, to, method }
function addLink(from, to, method, force = false) {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === to) return;
  const key = `${from}>${to}`;
  if (force || !links.has(key) || (!links.get(key).method && method)) {
    links.set(key, { from, to, method: method || null });
  }
}

// 1) Megas y Gigamax: la propia rama declara base -> forma con objeto.
for (const { condition, body } of topBlocks(readGml('Dex_mega_evolution'))) {
  const sources = idsFromCondition(condition);
  const targets = [...body.matchAll(/\bz\d?\.pkmn=(\d+)/g)].map((m) => Number(m[1]));
  const methods = [...body.matchAll(/\bf\d?\.str=([^;]+);/g)].map((m) => decodeMethod(m[1]));
  const method = methods.find(Boolean) || null;
  for (const to of targets) {
    if (to <= 100000) continue; // las formas normales ya vienen de la rama estándar
    // En una rama Mega el origen real es la forma base del propio destino
    // (100006 -> 6, 200006 -> 6), no todos los miembros de la familia.
    const megaBase = to > 200000 ? to - 200000 : to > 100000 ? to - 100000 : null;
    if (megaBase != null) addLink(megaBase, to, method);
    else for (const from of sources) addLink(from, to, method);
  }
}

// 2) Casos especiales (formas con objeto y transformaciones únicas).
for (const { condition, body } of topBlocks(readGml('Dex_evolution_especiales'))) {
  const sources = idsFromCondition(condition);
  const targets = [...body.matchAll(/\bz\d?\.pkmn=(\d+)/g)].map((m) => Number(m[1]));
  const methods = [...body.matchAll(/\bf\d?\.str=([^;]+);/g)].map((m) => decodeMethod(m[1]));
  const method = methods.find(Boolean) || null;
  for (const from of sources) for (const to of targets) addLink(from, to, method);
}

// 3) Cadenas estándar por nivel. El script primero crea los enlaces genéricos
//    (PK -> PK+1 / PK+2) y después sobrescribe el texto del método. En las
//    cadenas de tres, el bloque intermedio usa z1=PK-1, z2=PK, z3=PK+1: su
//    paso +1 es la SEGUNDA evolución, no la primera.
const standardLinks = [];
const standardMethodOverrides = new Map();
for (const { condition, body } of topBlocks(readGml('Dex_evolution_standar'))) {
  const sources = idsFromCondition(condition);
  const steps = [...body.matchAll(/\bz\d?\.pkmn=PK([+-]\d+)?/g)]
    .map((m) => (m[1] ? Number(m[1]) : 0));
  const methods = [...body.matchAll(/\bf\d?\.str=([^;]+);/g)]
    .map((m) => decodeMethod(m[1])).filter(Boolean);
  if (steps.length) {
    const unique = [...new Set(steps)].sort((a, b) => a - b);
    const hasPreviousStage = unique.includes(-1);
    for (const from of sources) {
      if (hasPreviousStage) {
        // Bloque intermedio: PK -> PK+1 corresponde a f2.
        if (unique.includes(1)) standardLinks.push({ from, to: from + 1, methodIndex: 1, method: methods[1] || methods[0] || 'Nv: ??' });
      } else {
        if (unique.includes(1)) standardLinks.push({ from, to: from + 1, methodIndex: 0, method: methods[0] || 'Nv: ??' });
        if (unique.includes(2)) standardLinks.push({ from: from + 1, to: from + 2, methodIndex: 1, method: methods[1] || methods[0] || 'Nv: ??' });
      }
    }
  } else if (methods.length) {
    for (const id of sources) standardMethodOverrides.set(id, methods);
  }
}
for (const link of standardLinks) {
  const override = standardMethodOverrides.get(link.from);
  const method = (override && (override[link.methodIndex] || override[0])) || link.method;
  addLink(link.from, link.to, method);
}

// 4) Enlaces operativos especiales: destino real cuando no basta con PK+1.
for (const { condition, body } of topBlocks(readGml('EvolutionConfirmation'))) {
  const sources = idsFromCondition(condition);
  const targets = [...body.matchAll(/(?:^|[^a-z])pk=(\d+)/g)].map((m) => Number(m[1]));
  for (const from of sources) for (const to of targets) addLink(from, to, null);
}

// 5) Ramas complejas: el destino y el método dependen de PK y del modo de
//    evolución ((79).EV). Se interpreta el GML en vez de leerlo con regex.
function closeAt(src, open, openCh, closeCh) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === openCh) depth++;
    else if (src[i] === closeCh) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function stmtEnd(src, from) {
  let quoted = false;
  for (let i = from; i < src.length; i++) {
    if (src[i] === '"') quoted = !quoted;
    if (!quoted && src[i] === ';') return i;
  }
  return src.length;
}

function parseStatements(src) {
  const out = [];
  let i = 0;
  const skipWs = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  const parseIf = () => {
    const close = closeAt(src, i + 2, '(', ')');
    const condition = src.slice(i + 3, close);
    i = close + 1;
    skipWs();
    let thenBody = '';
    if (src[i] === '{') {
      const end = closeAt(src, i, '{', '}');
      thenBody = src.slice(i + 1, end);
      i = end + 1;
    } else {
      const end = stmtEnd(src, i);
      thenBody = src.slice(i, end);
      i = end;
    }
    skipWs();
    let elseStmts = [];
    if (src.startsWith('else', i)) {
      i += 4;
      skipWs();
      if (src.startsWith('if(', i)) elseStmts = [parseIf()];
      else if (src[i] === '{') {
        const end = closeAt(src, i, '{', '}');
        elseStmts = parseStatements(src.slice(i + 1, end));
        i = end + 1;
      } else {
        const end = stmtEnd(src, i);
        elseStmts = parseStatements(src.slice(i, end));
        i = end;
      }
    }
    return { condition, then: parseStatements(thenBody), else: elseStmts };
  };
  while (i < src.length) {
    skipWs();
    if (i >= src.length) break;
    if (src[i] === ';' || src[i] === '}') { i++; continue; }
    if (src.startsWith('if(', i)) { out.push(parseIf()); continue; }
    const end = stmtEnd(src, i);
    const code = src.slice(i, end).trim();
    i = end;
    if (code) out.push({ code });
  }
  return out;
}

function substituteVars(expr, env) {
  let x = String(expr).trim()
    .replace(/\(79\)\.EV/g, String(env.EV))
    .replace(/\bPK\b/g, String(env.PK));
  x = x.replace(/\b[A-Za-z_][\w.]*\b/g, (key) => (key in env ? String(env[key]) : '0'));
  return x;
}

function evalCondition(condition, env) {
  const x = substituteVars(condition, env).replace(/(?<![<>=!])=(?!=)/g, '==');
  try { return Boolean(Function(`"use strict";return (${x})`)()); } catch { return false; }
}

function evalNumber(expr, env) {
  const x = substituteVars(expr, env);
  try {
    const n = Function(`"use strict";return (${x})`)();
    return Number.isFinite(n) ? n : null;
  } catch { return null; }
}

function collectComplexLinks(env) {
  for (const key of Object.keys(env)) {
    const match = /^(f\d*)\.p1$/.exec(key);
    if (!match) continue;
    const f = match[1];
    const p1 = env[`${f}.p1`];
    const p2 = env[`${f}.p2`];
    const method = env[`${f}.str`];
    if (!p1 || !p2 || typeof method !== 'string' || !method || method.includes('ex(')) continue;
    const from = /^\d+$/.test(p1) ? Number(p1) : env[`${p1}.pkmn`];
    const to = /^\d+$/.test(p2) ? Number(p2) : env[`${p2}.pkmn`];
    // Las megas se gestionan en Dex_mega_evolution; aquí solo la línea normal.
    if (!Number.isFinite(from) || !Number.isFinite(to) || from === to || to >= 100000) continue;
    addLink(from, to, method);
  }
}

function execComplex(stmts, env, collect) {
  for (const st of stmts) {
    if (st.condition !== undefined) {
      const branch = evalCondition(st.condition, env) ? st.then : st.else;
      if (execComplex(branch, env, collect)) return true;
      continue;
    }
    const code = st.code;
    if (/^(exit|return)\b/.test(code)) { collect(); return true; }
    const assignment = /^([A-Za-z_][\w.]*)\s*=\s*(.+)$/.exec(code);
    if (!assignment) continue;
    const [, lhs, rhs] = assignment;
    if (rhs.startsWith('instance_create(')) env[lhs] = lhs;
    else if (rhs.includes('ex(') || rhs.includes('"')) env[lhs] = decodeMethod(rhs) || rhs;
    else if (lhs.endsWith('.p1') || lhs.endsWith('.p2')) env[lhs] = rhs.trim();
    else {
      const n = evalNumber(rhs, env);
      if (n != null) env[lhs] = n;
    }
  }
  return false;
}

const complexBlocks = topBlocks(readGml('Dex_evolution_complex'))
  .map(({ condition, body }) => ({ ids: idsFromCondition(condition), stmts: parseStatements(body) }));
for (const { ids, stmts } of complexBlocks) {
  for (const PK of ids) {
    for (const EV of [0, ...Array.from({ length: 19 }, (_, i) => i + 1)]) {
      const env = { PK, EV };
      execComplex(stmts, env, () => collectComplexLinks(env));
      collectComplexLinks(env);
    }
  }
}

// 6) Ramas complejas verificadas una a una contra Dex_evolution_complex y los
//    textos del juego. Se guarda el método literal del GML.
const CURATED_GAME_LINKS = [
  [172, 25, 'Nv: 16'],
  [25, 26, 'Trueno'], [25, 2001, 'Piedra Lunar'], [25, 495, 'Piedra Día'],
  [280, 281, 'Nv: 20'], [281, 282, 'Nv: 30'], [281, 475, 'Piedra Alba+(Macho)'],
  [282, 100282, 'Gardevoirita'], [475, 100475, 'Galladita'],
  [129, 130, 'Nv: 20'], [147, 148, 'Nv: 30'], [148, 149, 'Nv: 55'],
  [236, 106, 'Ataque > Defensa'], [236, 107, 'Ataque < Defensa'], [236, 237, 'Ataque = Defensa'],
  [175, 176, 'Nv: 16'], [176, 468, 'Piedra Día'],
  [440, 113, 'Piedra Oval'], [113, 242, 'Nv: 42'], [446, 143, 'Nv: 25'],
  [2235, 2236, 'Nv: 36 + Gafas de Sol'], [2235, 2237, 'Nv: 36 + Agua Mística'],
  [155, 156, 'Nv: 14'], [156, 157, 'Nv: 36'],
  [393, 394, 'Nv: 16'], [394, 395, 'Nv: 36'],
  [495, 100495, 'Pikabluita'], [899, 891, 'Nv: 16'],
  [64, 65, 'Nv: 42 + Cuchara Torcida'], [93, 94, 'Nv: 42 + Hechizo'],
  [95, 208, 'Nv: 42 + Rev. Metálico'],
];
for (const [from, to, method] of CURATED_GAME_LINKS) addLink(from, to, method, true);

export const gameEvolutionById = new Map();
for (const { from, to, method } of links.values()) {
  if (!gameEvolutionById.has(from)) gameEvolutionById.set(from, { prevEvolution: [], evolutions: [] });
  if (!gameEvolutionById.has(to)) gameEvolutionById.set(to, { prevEvolution: [], evolutions: [] });
  gameEvolutionById.get(from).evolutions.push({ id: to, method });
  gameEvolutionById.get(to).prevEvolution.push({ id: from, method });
}

export const gameEvolutionStats = {
  links: links.size,
  sources: gameEvolutionById.size,
};
