#!/usr/bin/env node
/**
 * Genera los datos de habilidades de Reloadex desde las fuentes reales del juego.
 *
 * Fuentes:
 *   - <GAME>/data/text/{es,en}/txt_abilities.dll
 *   - <GAME>/data/text/{es,en}/txt_abilities_desc.dll
 *   - <GAME>/data/text/{es,en}/ordenNameAbility.dll
 *   - scripts/game-scripts/PokemonHabilidad.gml.txt (script extraído del gamedata GM8)
 *
 * Salidas:
 *   - src/data/gameAbilities.json  (catálogo + asignación por ID del juego)
 *   - src/data/abilities.js        (catálogo usado por la vista de habilidades)
 *   - src/data/abilityNames.es.js  (clave inglesa del juego -> nombre español del juego)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, '..');
const GAME_DATA = process.env.RELOADEX_GAME_DATA || 'D:\\Juegos\\Reloaded\\data';
const TEXT_DIR = path.join(GAME_DATA, 'text');
const SCRIPT_FILE = path.join(__dirname, 'game-scripts', 'PokemonHabilidad.gml.txt');
const SRC_DATA = path.join(PROJECT, 'src', 'data');
const DATASET_FILE = path.join(SRC_DATA, 'reloadex.json');

const readText = (rel) => decodeFile(path.join(TEXT_DIR, rel));
const esNames = readText('es/txt_abilities.dll');
const enNames = readText('en/txt_abilities.dll');
const esDescriptions = readText('es/txt_abilities_desc.dll');
const orderEs = readText('es/ordenNameAbility.dll');
const orderEn = readText('en/ordenNameAbility.dll');

const EXPECTED = 314;
for (const [label, lines] of Object.entries({
  'es/txt_abilities.dll': esNames,
  'en/txt_abilities.dll': enNames,
  'es/txt_abilities_desc.dll': esDescriptions,
  'es/ordenNameAbility.dll': orderEs,
  'en/ordenNameAbility.dll': orderEn,
})) {
  if (lines.length !== EXPECTED) {
    throw new Error(`${label}: se esperaban ${EXPECTED} líneas y tiene ${lines.length}`);
  }
}

const sortPositions = (order) => {
  const positions = new Array(EXPECTED);
  order.forEach((line, index) => {
    const id = Number(line);
    if (id >= 1 && id <= EXPECTED) positions[id - 1] = index + 1;
  });
  return positions;
};
const sortEs = sortPositions(orderEs);
const sortEn = sortPositions(orderEn);

const catalog = esNames.map((name, index) => ({
  id: index + 1,
  key: enNames[index].trim(),
  name: name.trim(),
  description: (esDescriptions[index] || '').trim(),
  sortEs: sortEs[index] ?? index + 1,
  sortEn: sortEn[index] ?? index + 1,
}));

// Algunas claves históricas del dataset no coinciden exactamente con la clave
// del DLL (puntuación/case). Se conservan como alias, nunca como nombres nuevos.
const ALIASES = {
  'Dragons Maw': "Dragon's Maw",
  'Dragon,s Maw': "Dragon's Maw",
  'Rks System': 'RKS System',
  'Soul Heart': 'Soul-Heart',
  'Well Baked Body': 'Well-Baked Body',
  'Zero To Hero': 'Zero to Hero',
  'Cen Mode': 'Zen Mode',
  'quark Drive': 'Quark Drive',
  'quick Feet': 'Quick Feet',
  'quick Draw': 'Quick Draw',
  'queenly Majesty': 'Queenly Majesty',
};

// ---------- parser del script PokemonHabilidad ----------
const gml = fs.readFileSync(SCRIPT_FILE, 'utf8');
const firstStart = gml.indexOf('if(argument1<=LIM){');
const firstEndMarker = 'return(false);exit;}';
const firstEnd = gml.indexOf(firstEndMarker);
if (firstStart < 0 || firstEnd < firstStart) {
  throw new Error('No se encontraron los bloques principales de PokemonHabilidad.gml.txt');
}
const sections = [
  { source: gml.slice(0, firstStart), kind: 'special', label: 'especiales' },
  { source: gml.slice(firstStart, firstEnd), kind: 'primary', label: 'primarias' },
  { source: gml.slice(firstEnd + firstEndMarker.length), kind: 'hidden', label: 'ocultas' },
];

const matchParen = (text, openIndex) => {
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error('Paréntesis sin cerrar en PokemonHabilidad.gml.txt');
};

const idsFromCondition = (condition) => {
  const ids = [];
  const rangePattern = /PK\s*>=\s*(\d+)\s*&&\s*PK\s*<=\s*(\d+)/g;
  for (const match of condition.matchAll(rangePattern)) {
    const from = Number(match[1]);
    const to = Number(match[2]);
    for (let id = from; id <= to; id++) ids.push(id);
  }
  const rest = condition.replace(rangePattern, ' ');
  for (const match of rest.matchAll(/PK\s*=\s*(\d+)/g)) ids.push(Number(match[1]));
  return [...new Set(ids)];
};

const abilitiesFromExpression = (expression, kind) => {
  const expr = expression.trim();
  const direct = expr.match(/^(\d+)$/);
  if (direct) return [{ index: Number(direct[1]), hidden: kind === 'hidden' }];

  const ex = expr.match(/^ex\(8009\s*,\s*(FIRST|FIRST_OC)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (ex) {
    const hidden = kind === 'hidden' || ex[1].toUpperCase() === 'FIRST_OC';
    return [
      { index: Number(ex[2]), hidden },
      { index: Number(ex[3]), hidden },
    ];
  }

  throw new Error(`Expresión de habilidad no reconocida: ${expr}`);
};

const rawAssignments = new Map();
const ensureAssignment = (id) => {
  if (!rawAssignments.has(id)) {
    rawAssignments.set(id, { primary: [], hidden: [], override: false, source: null });
  }
  return rawAssignments.get(id);
};
const addAssignment = (id, entry, kind, source) => {
  // El juego devuelve 0 para "sin habilidad" (por ejemplo Missingnô, ID 1000).
  if (entry.index === 0) return;
  const assignment = ensureAssignment(id);
  if (assignment.override && source !== 'special') return;
  if (source === 'special') {
    assignment.override = true;
    assignment.primary = [entry];
    assignment.hidden = [];
    assignment.source = source;
    return;
  }
  const bucket = kind === 'hidden' ? assignment.hidden : assignment.primary;
  if (!bucket.some((x) => x.index === entry.index)) bucket.push(entry);
  if (!assignment.source) assignment.source = source;
};

for (const section of sections) {
  let cursor = 0;
  let parsed = 0;
  while (cursor < section.source.length) {
    const ifIndex = section.source.indexOf('if(', cursor);
    if (ifIndex < 0) break;
    const condOpen = ifIndex + 2;
    const condClose = matchParen(section.source, condOpen);
    const condition = section.source.slice(condOpen + 1, condClose);

    let after = condClose + 1;
    while (after < section.source.length && /\s/.test(section.source[after])) after++;
    if (!section.source.startsWith('return(', after)) {
      cursor = condClose + 1;
      continue;
    }

    const returnOpen = after + 6;
    const returnClose = matchParen(section.source, returnOpen);
    const expression = section.source.slice(returnOpen + 1, returnClose);

    const ids = idsFromCondition(condition);
    const entries = abilitiesFromExpression(expression, section.kind);
    for (const id of ids) {
      for (const entry of entries) addAssignment(id, entry, section.kind, section.source && section.label);
    }

    parsed++;
    cursor = returnClose + 1;
    while (cursor < section.source.length && section.source[cursor] === ';') cursor++;
  }
  console.log(`[PokemonHabilidad] ${section.label}: ${parsed} reglas`);
}

// El script del juego no contempla algunas entradas añadidas en Beta 1.9.2.2.
// Se completan solo con habilidades cuyo nombre existe en el DLL del juego,
// usando la asignación oficial de esas especies (las formas de Ogerpon y
// Terapagos conservan la habilidad de su forma base/transformación).
const CURATED_ASSIGNMENTS = {
  2379: [['Tablets of Ruin', false]],
  2380: [['Sword of Ruin', false]],
  2381: [['Vessel of Ruin', false]],
  2382: [['Beads of Ruin', false]],
  2385: [['Orichalcum Pulse', false]],
  2386: [['Hadron Engine', false]],
  2412: [['Toxic Chain', false], ['Guard Dog', true]],
  2413: [['Toxic Chain', false], ['Frisk', true]],
  2414: [['Toxic Chain', false], ['Technician', true]],
  2415: [['Defiant', false]],
  2416: [['Defiant', false]],
  2417: [['Defiant', false]],
  2418: [['Defiant', false]],
  2419: [['Tera Shift', false]],
  2420: [['Tera Shell', false]],
  2421: [['Teraform Zero', false]],
  100993: [['Soul-Heart', false]],
  102237: [['Unseen Fist', false]],
};

const assignments = {};
for (const [id, assignment] of [...rawAssignments].sort((a, b) => a[0] - b[0])) {
  const merged = new Map();
  for (const entry of [...assignment.primary, ...assignment.hidden]) {
    if (entry.index < 1 || entry.index > EXPECTED) {
      throw new Error(`ID ${id}: índice de habilidad ${entry.index} fuera de rango`);
    }
    if (!merged.has(entry.index)) {
      merged.set(entry.index, { id: entry.index, hidden: !!entry.hidden });
    }
  }
  if (merged.size) {
    assignments[id] = [...merged.values()].sort((a, b) => a.id - b.id);
  }
}

const assignmentSources = Object.fromEntries(Object.keys(assignments).map((id) => [id, 'game-script']));
const idByCatalogKey = new Map(catalog.map((a) => [a.key, a.id]));
for (const [rawId, list] of Object.entries(CURATED_ASSIGNMENTS)) {
  const id = Number(rawId);
  if (assignments[id]) continue;
  const resolved = list.map(([key, hidden]) => {
    const abilityId = idByCatalogKey.get(key);
    if (!abilityId) throw new Error(`Curaduría ${id}: "${key}" no existe en el DLL del juego`);
    return { id: abilityId, hidden };
  });
  assignments[id] = resolved;
  assignmentSources[id] = 'curated-official';
}

const sortedAssignments = Object.fromEntries(
  Object.entries(assignments).sort((a, b) => Number(a[0]) - Number(b[0])),
);
const sortedSources = Object.fromEntries(
  Object.entries(assignmentSources).sort((a, b) => Number(a[0]) - Number(b[0])),
);
const assignedIds = Object.keys(sortedAssignments).map(Number);
const totalAbilities = assignedIds.reduce((sum, id) => sum + sortedAssignments[id].length, 0);
const withHidden = assignedIds.filter((id) => sortedAssignments[id].some((a) => a.hidden)).length;
console.log(`[habilidades] ${assignedIds.length} IDs, ${totalAbilities} asignaciones, ${withHidden} con oculta`);

if (fs.existsSync(DATASET_FILE)) {
  const dataset = JSON.parse(fs.readFileSync(DATASET_FILE, 'utf8'));
  const pokemon = Array.isArray(dataset) ? dataset : (dataset.pokemon || dataset.data || []);
  const datasetIds = new Set(pokemon.map((p) => Number(p.id)));
  const unknown = assignedIds.filter((id) => !datasetIds.has(id));
  if (unknown.length) console.warn(`[PokemonHabilidad] IDs sin entrada en reloadex.json: ${unknown.join(', ')}`);
}

fs.mkdirSync(SRC_DATA, { recursive: true });
const gameAbilities = {
  catalog,
  aliases: ALIASES,
  assignments: sortedAssignments,
  assignmentSources: sortedSources,
};
fs.writeFileSync(
  path.join(SRC_DATA, 'gameAbilities.json'),
  `${JSON.stringify(gameAbilities, null, 2)}\n`,
  'utf8',
);

const catalogForUi = [...catalog]
  .sort((a, b) => a.sortEs - b.sortEs || a.id - b.id)
  .map(({ id, key, name, description, sortEs, sortEn }) => ({ id, key, name, description, sortEs, sortEn }));

const abilitiesSource = `// GENERADO desde los DLL del juego y PokemonHabilidad.gml.txt. No editar a mano.
// Regenerar con: node scripts/buildAbilities.mjs
import reloadexData from './reloadex.json';
import { abilityId } from './abilityNames.es';

const POKEMON = Array.isArray(reloadexData)
  ? reloadexData
  : (reloadexData.pokemon || reloadexData.data || []);

export const abilities = ${JSON.stringify(catalogForUi, null, 2)};

const ABILITY_BY_ID = new Map(abilities.map((a) => [a.id, a]));

export const getAbility = (value) => {
  const id = abilityId(value);
  return id ? (ABILITY_BY_ID.get(id) || null) : null;
};

export const getPokemonByAbility = (value) => {
  const id = abilityId(value);
  if (!id) return [];
  const names = POKEMON
    .filter((p) => Array.isArray(p.abilities) && p.abilities.some((a) => {
      if (typeof a === 'object' && a != null) {
        return (a.id != null ? Number(a.id) : abilityId(a.key || a.name)) === id;
      }
      return abilityId(a) === id;
    }))
    .map((p) => (/unown/i.test(p.name) ? 'Unown' : p.name))
    .filter(Boolean);
  // Las formas alternativas comparten nombre (Unown, Rotom, ...): se muestra una sola vez.
  return [...new Set(names)];
};

export const searchAbilities = (query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return abilities;
  return abilities.filter((a) => (
    a.name.toLowerCase().includes(q)
    || a.key.toLowerCase().includes(q)
    || a.description.toLowerCase().includes(q)
  ));
};

export const getAbilitiesByLetter = () => {
  const grouped = {};
  for (const ability of abilities) {
    const firstLetter = ability.name[0].toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(ability);
  }
  return grouped;
};
`;
fs.writeFileSync(path.join(SRC_DATA, 'abilities.js'), abilitiesSource, 'utf8');

const idByKey = new Map();
for (const ability of catalog) {
  if (!idByKey.has(ability.key)) idByKey.set(ability.key, ability.id);
}
for (const [alias, target] of Object.entries(ALIASES)) {
  const id = idByKey.get(target);
  if (id) idByKey.set(alias, id);
}
const nameByKey = new Map();
for (const ability of catalog) {
  if (!nameByKey.has(ability.key)) nameByKey.set(ability.key, ability.name);
}
for (const [alias, target] of Object.entries(ALIASES)) {
  const name = nameByKey.get(target);
  if (name) nameByKey.set(alias, name);
}
const nameById = new Map(catalog.map((a) => [a.id, a.name]));

const namesSource = `// GENERADO desde los DLL del juego. No editar a mano.
// Regenerar con: node scripts/buildAbilities.mjs
export const ABILITY_NAMES_ES = ${JSON.stringify(Object.fromEntries(nameByKey), null, 2)};

export const ABILITY_IDS_BY_KEY = ${JSON.stringify(Object.fromEntries(idByKey), null, 2)};

export const ABILITY_NAMES_BY_ID = ${JSON.stringify(Object.fromEntries(nameById), null, 2)};

const normalizeAbilityKey = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\\u0300-\\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '');

const ID_BY_KEY = new Map(Object.entries(ABILITY_IDS_BY_KEY));
const ID_BY_NORMALIZED_KEY = new Map(
  [...ID_BY_KEY].map(([key, id]) => [normalizeAbilityKey(key), id]),
);

export function abilityId(value) {
  if (value == null) return null;
  if (typeof value === 'number' || /^\\d+$/.test(String(value))) {
    const id = Number(value);
    return ABILITY_NAMES_BY_ID[id] ? id : null;
  }
  const raw = String(value).trim();
  if (ID_BY_KEY.has(raw)) return ID_BY_KEY.get(raw);
  return ID_BY_NORMALIZED_KEY.get(normalizeAbilityKey(raw)) || null;
}

export const abilityNameEs = (value) => {
  if (value == null) return value;
  if (typeof value === 'object') {
    const id = value.id != null ? Number(value.id) : abilityId(value.key || value.name);
    return ABILITY_NAMES_BY_ID[id] || value.name || value.key || value;
  }
  const id = abilityId(value);
  return id ? ABILITY_NAMES_BY_ID[id] : value;
};
`;
fs.writeFileSync(path.join(SRC_DATA, 'abilityNames.es.js'), namesSource, 'utf8');

console.log(`[habilidades] ${catalog.length} nombres/descripciones reales -> src/data/abilities.js`);
console.log(`[habilidades] asignación por ID -> src/data/gameAbilities.json`);
