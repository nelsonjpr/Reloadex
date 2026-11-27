#!/usr/bin/env node
/**
 * buildReloadexData.mjs
 *
 * Construye el dataset profesional de "Reloadex" (Pokédex de Pokémon Reloaded).
 *
 * Fuente de verdad (ground truth), en orden:
 *   1. Carpeta de sprites del juego:  <GAME>/data/pkmn            -> qué Pokémon EXISTEN y sus IDs
 *      Carpeta shiny:                  <GAME>/data/pkmn_shiny
 *      Carpeta de gritos (fuente actualizada por el usuario):
 *        D:\\reloaded\\Proyecto Reloaded The Last Beta 1.9.2.2 Full\\data\\audio\\grito
 *   2. Sprites/gritos ya empaquetados en la app: public/sprites/*, public/cries
 *   3. Datos base ya presentes en la app (src/data/pokemon.js) para nombre/tipos/stats,
 *      SIEMPRE marcados con su procedencia (no se disfraza de "verificado Reloaded").
 *
 * Honestidad de procedencia (no se inventa nada):
 *   - id / sprite / shiny / cry / baseForm / nombre / descripción / categoría / altura / peso:
 *     verificables en disco (textos del juego descifrados).
 *   - types/stats: heredados del dataset anterior; Reloaded no expone esa tabla en archivos legibles.
 *
 * Uso:
 *   node scripts/buildReloadexData.mjs
 *   RELOADEX_GAME_DATA="D:\\Juegos\\Reloaded\\data" node scripts/buildReloadexData.mjs
 *   RELOADEX_CRIES_DATA="D:\\...\\data\\audio\\grito" node scripts/buildReloadexData.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, '..');
const GAME_DATA = process.env.RELOADEX_GAME_DATA || 'D:\\Juegos\\Reloaded\\data';
// Los gritos de la serie extraídos por fans se mantienen en esta carpeta, que el
// usuario actualiza. Se sincroniza a public/cries en cada build de datos.
const CRIES_SOURCE = process.env.RELOADEX_CRIES_DATA
  || 'D:\\reloaded\\Proyecto Reloaded The Last Beta 1.9.2.2 Full\\data\\audio\\grito';
const PUBLIC = path.join(PROJECT, 'public');
const SRC_DATA = path.join(PROJECT, 'src', 'data');

const OUT_JSON = path.join(SRC_DATA, 'reloadex.json');
// El informe de procedencia es un artefacto derivado; se permite redirigirlo para
// regenerar solo reloadex.json sin tocar otros archivos del repositorio.
const OUT_REPORT = process.env.RELOADEX_PROVENANCE_OUT || path.join(SRC_DATA, 'reloadex.provenance.json');
const TEXT_DIR = path.join(GAME_DATA, 'text');

// ---------- helpers ----------
const numericIdsFromDir = (dir, exts = ['.gif', '.png', '.wav']) => {
  const ids = new Set();
  let names = [];
  if (!fs.existsSync(dir)) return { ids, names };
  names = fs.readdirSync(dir);
  for (const n of names) {
    const ext = path.extname(n).toLowerCase();
    if (!exts.includes(ext)) continue;
    const base = path.basename(n, ext);
    if (/^\d+$/.test(base)) ids.add(Number(base));
  }
  return { ids, names };
};

const idSetHas = (set, id) => set.has(Number(id));

// Convierte un grito del juego (WAV estéreo con carátula) a MP3 mono 96 kbps.
// El MP3 es ~10 veces más liviano y es lo que se empaqueta en el APK.
const toMp3 = (src, dst) => {
  const ext = path.extname(src).toLowerCase();
  if (ext === '.mp3') {
    fs.copyFileSync(src, dst);
    return true;
  }
  const ffmpeg = process.env.RELOADEX_FFMPEG || 'ffmpeg';
  const result = spawnSync(ffmpeg, [
    '-nostdin', '-loglevel', 'error', '-y',
    '-i', src, '-vn', '-ac', '1', '-b:a', '96k', dst,
  ], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.warn(`[gritos] No se pudo convertir ${path.basename(src)}: ${result.stderr || result.error}`);
    return false;
  }
  return true;
};

// Sincroniza los gritos de la carpeta del usuario a public/cries, siempre como MP3.
// Se conservan los archivos ya empaquetados (formas especiales antiguas) y se
// sobrescriben solo los nombres que existen en la fuente nueva.
const syncCries = () => {
  const dest = path.join(PUBLIC, 'cries');
  if (!fs.existsSync(CRIES_SOURCE)) {
    console.warn(`[gritos] No se encontró la carpeta fuente: ${CRIES_SOURCE}`);
  } else {
    fs.mkdirSync(dest, { recursive: true });
  }
  let copied = 0;
  if (fs.existsSync(CRIES_SOURCE)) {
    for (const name of fs.readdirSync(CRIES_SOURCE)) {
      const ext = path.extname(name).toLowerCase();
      if (!['.wav', '.mp3', '.ogg'].includes(ext)) continue;
      const src = path.join(CRIES_SOURCE, name);
      if (!fs.statSync(src).isFile()) continue;
      const dst = path.join(dest, `${path.basename(name, ext)}.mp3`);
      if (toMp3(src, dst)) copied++;
    }
  }
  // Los WAV/OGG que ya estuvieran en public también pasan a MP3 y se eliminan.
  if (fs.existsSync(dest)) {
    for (const name of fs.readdirSync(dest)) {
      const ext = path.extname(name).toLowerCase();
      if (ext !== '.wav' && ext !== '.ogg') continue;
      const src = path.join(dest, name);
      const dst = path.join(dest, `${path.basename(name, ext)}.mp3`);
      if (toMp3(src, dst)) fs.unlinkSync(src);
    }
  }
  return copied;
};

const syncedCries = syncCries();

const isPlaceholderName = (name, id) => {
  if (!name) return true;
  const n = String(name).trim().toLowerCase();
  return (
    n === `forma especial #${id}`.toLowerCase() ||
    n === `pokémon #${id}`.toLowerCase() ||
    n === `pokemon #${id}`.toLowerCase() ||
    n.startsWith('forma especial #')
  );
};

const cleanAbility = (a) => {
  if (!a) return null;
  if (typeof a === 'object') {
    return { name: String(a.name || '').trim(), hidden: !!a.hidden };
  }
  let s = String(a).trim();
  let hidden = false;
  // formatos del proyecto original: "Nombre (Oculta)"
  const m = s.match(/^(.*?)\s*\((oculta|hidden)\)\s*$/i);
  if (m) { s = m[1].trim(); hidden = true; }
  return s ? { name: s, hidden } : null;
};

// Catálogo y asignación reales, generados por scripts/buildAbilities.mjs desde
// los DLL de habilidades y el script PokemonHabilidad del propio juego.
const GAME_ABILITIES = JSON.parse(fs.readFileSync(path.join(SRC_DATA, 'gameAbilities.json'), 'utf8'));
const ABILITY_BY_ID = new Map(GAME_ABILITIES.catalog.map((a) => [a.id, a]));
const ABILITY_ID_BY_KEY = new Map();
for (const a of GAME_ABILITIES.catalog) {
  if (!ABILITY_ID_BY_KEY.has(a.key)) ABILITY_ID_BY_KEY.set(a.key, a.id);
}
for (const [alias, target] of Object.entries(GAME_ABILITIES.aliases || {})) {
  const id = ABILITY_ID_BY_KEY.get(target);
  if (id) ABILITY_ID_BY_KEY.set(alias, id);
}
const ABILITY_ID_BY_NORMALIZED_KEY = new Map(
  [...ABILITY_ID_BY_KEY].map(([key, id]) => [
    String(key).toLowerCase().replace(/[^a-z0-9]/g, ''),
    id,
  ]),
);
const GAME_ASSIGNMENTS = new Map(
  Object.entries(GAME_ABILITIES.assignments || {}).map(([id, list]) => [Number(id), list]),
);
const normalizeAbilityKey = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '');
const abilityIdFromRaw = (raw) => {
  if (raw == null) return null;
  if (typeof raw === 'number' || /^\d+$/.test(String(raw))) {
    const id = Number(raw);
    return ABILITY_BY_ID.has(id) ? id : null;
  }
  const key = String(raw).trim();
  if (ABILITY_ID_BY_KEY.has(key)) return ABILITY_ID_BY_KEY.get(key);
  return ABILITY_ID_BY_NORMALIZED_KEY.get(normalizeAbilityKey(key)) || null;
};
const displayAbilities = (list) => [...new Map((list || [])
  .filter((a) => a && ABILITY_BY_ID.has(a.id))
  .map((a) => [a.id, { id: a.id, hidden: !!a.hidden }])).values()]
  .sort((a, b) => a.id - b.id)
  .map((a) => {
    const gameAbility = ABILITY_BY_ID.get(a.id);
    return { id: a.id, key: gameAbility.key, name: gameAbility.name, hidden: a.hidden };
  });

// Orden de resolución: ID exacto del juego -> ID base -> otro ID con el mismo
// nombre del juego -> habilidades heredadas (solo para entradas que el script
// PokemonHabilidad no contempla, como formas/Gigamax añadidos después).
const abilitiesForGameId = (id, name, baseForm, existing) => {
  let raw = GAME_ASSIGNMENTS.get(Number(id));
  let source = raw ? 'game-script' : null;
  if (!raw && baseForm != null) {
    raw = GAME_ASSIGNMENTS.get(Number(baseForm));
    if (raw) source = 'game-script-base';
  }
  if (!raw && name && typeof gameIdByName === 'object') {
    const byNameId = gameIdByName.get(normName(name));
    if (byNameId != null) {
      raw = GAME_ASSIGNMENTS.get(byNameId);
      if (raw) source = 'game-script-name';
    }
  }
  if (!raw && Array.isArray(existing)) {
    raw = existing
      .map(cleanAbility)
      .filter(Boolean)
      .map((a) => {
        const abilityId = abilityIdFromRaw(a.id ?? a.key ?? a.name);
        return abilityId ? { id: abilityId, hidden: a.hidden } : null;
      })
      .filter(Boolean);
    source = 'dataset-cache';
  }
  const curatedSource = (GAME_ABILITIES.assignmentSources || {})[id];
  if (curatedSource) source = curatedSource;
  return { abilities: displayAbilities(raw), source };
};

const num = (v, d = null) => (Number.isFinite(Number(v)) ? Number(v) : d);

const cleanLink = (x) => {
  if (x == null) return null;
  const rawId = typeof x === 'object' ? (x.id ?? x) : x;
  const id = num(rawId);
  if (id == null) return null;
  const name = typeof x === 'object' ? x.name : null;
  const method = typeof x === 'object' ? (x.method || null) : null;
  return { id, name: name || null, method: method || null };
};

// ---------- 2b. textos REALES de Reloaded (archivos .dll cifrados por sustitución) ----------
const readText = (rel) => {
  try { return decodeFile(path.join(TEXT_DIR, rel)); } catch { return []; }
};
const gameNames = readText('es/txt_pkmn.dll');
const gameInfo = readText('es/dex_info.dll');
const gameHeights = readText('zz/dex_height_m.dll');
const gameWeights = readText('zz/dex_weight_kg.dll');
const gameSpecies = readText('es/dex_espec.dll');

// txt_pkmn.dll: el nombre se toma de su LÍNEA CANÓNICA, no de una correlación
// ciega con el ID en los demás archivos de texto:
//   IDs 1..1000       -> idx = id - 1
//   IDs 2001..2425    -> idx = id - 1001
//   variantes Mega/Gigamax -> idx = txt_pkmn.indexOf(nombre exacto)
// textIndexForId se conserva solo para resolver enlaces evolutivos heredados.
const textIndexForId = (id) => {
  const n = Number(id);
  if (n >= 1 && n <= 1000) return n - 1;
  if (n >= 2001 && n <= 2425) return n - 1001;
  return -1;
};
const canonicalNameLine = (id, name) => {
  const n = Number(id);
  if (n >= 100000 && name) {
    const exact = gameNames.indexOf(name);
    if (exact >= 0) return exact;
  }
  if (n >= 1 && n <= 1000) return n - 1;
  if (n >= 2001 && n <= 2425) return n - 1001;
  if (name) {
    const exact = gameNames.indexOf(name);
    if (exact >= 0) return exact;
  }
  return -1;
};
const gameNameForId = (id) => {
  const i = canonicalNameLine(id);
  return i >= 0 ? (gameNames[i] || null) : null;
};
const measurement = (s) => {
  if (!s) return null;
  const m = String(s).match(/([\d.,]+)\s*(m|kg|lb|ft)/i);
  return m ? Number(m[1].replace(',', '.')) : null;
};

// dex_info.dll, dex_height_m.dll, dex_weight_kg.dll y dex_espec.dll están
// desalineados respecto a txt_pkmn.dll. La línea se resuelve por NOMBRE y se
// reutiliza para descripción, altura, peso y categoría (misma name-line).
const wordKey = (s) => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// Coincidencia exacta de palabra (no substring) dentro de un rango de líneas.
// Se elige la línea donde el nombre aparece antes: evita confundir "Burmy" con
// la descripción de Wormadam, que menciona a Burmy al principio.
const nameHitInInfo = (from, to, key) => {
  if (!key) return -1;
  let best = -1;
  let bestPos = Infinity;
  for (let k = Math.max(0, from); k <= Math.min(to, gameInfo.length - 1); k++) {
    const pos = ` ${wordKey(gameInfo[k])} `.indexOf(` ${key} `);
    if (pos >= 0 && pos < bestPos) { bestPos = pos; best = k; }
  }
  return best;
};
const megaNameStart = gameNames.findIndex((x) => /^mega /i.test(x || ''));
// Anclas verificadas en el juego:
//   txt_pkmn[1425] "Mega Venusaur" <-> dex_info[945]
//   txt_pkmn[494]  "Pikablue"      <-> dex_info[914]
const MEGA_INFO_OFFSET = 480;
const megaInfoStart = megaNameStart >= 0 ? megaNameStart - MEGA_INFO_OFFSET : -1;
const CUSTOM_INFO_START = 900; // bloque de descripciones añadidas (Pikablue, Eeveon, ...)
const CUSTOM_INFO_END = megaInfoStart >= 0 ? megaInfoStart - 1 : gameInfo.length - 1;
// Pistas literales del objeto/efecto cuando el nombre no basta (Mega Pikablue).
const KEYWORD_HINTS = new Map([
  ['megapikablue', ['energía de la megaevolución', 'pikablue']],
]);
const keywordHit = (flatKey) => {
  const hints = KEYWORD_HINTS.get(flatKey) || [];
  if (!hints.length) return -1;
  const keys = hints.map(wordKey);
  return gameInfo.findIndex((line) => keys.every((k) => wordKey(line).includes(k)));
};
const infoLineForName = (name, nameLine) => {
  if (!name) return -1;
  const key = wordKey(name);
  const flatKey = key.replace(/ /g, '');

  if (/^mega /i.test(name)) {
    const exact = nameHitInInfo(0, gameInfo.length - 1, key);
    if (exact >= 0) return exact;
    const hinted = keywordHit(flatKey);
    if (hinted >= 0) return hinted;
    const baseKey = wordKey(name.replace(/^mega\s+/i, ''));
    const baseHit = nameHitInInfo(megaInfoStart, gameInfo.length - 1, baseKey);
    if (baseHit >= 0) return baseHit;
    // Las descripciones mega siguen el mismo orden que sus nombres en txt_pkmn.
    const positional = nameLine - MEGA_INFO_OFFSET;
    if (megaNameStart >= 0 && nameLine >= megaNameStart && positional >= 0 && positional < gameInfo.length) {
      return positional;
    }
    return -1;
  }
  // dex_info no contiene descripciones Gigamax: no se inventa una descripción.
  if (/gigamax/i.test(name)) return -1;

  // Solo los nombres propios de Reloaded (bloques 493..944 y 1000..1424 de
  // txt_pkmn) tienen su descripción desplazada al bloque añadido 900..944.
  // El resto de nombres (oficiales) conserva su línea canónica: buscar el nombre
  // en dex_info daría falsos positivos (p. ej., Wormadam menciona a Burmy).
  const isCustomLine = (nameLine >= 493 && nameLine <= 944)
    || (nameLine >= 1000 && nameLine <= 1424);
  if (isCustomLine && gameNames.indexOf(name) === nameLine) {
    const hit = nameHitInInfo(CUSTOM_INFO_START, CUSTOM_INFO_END, key);
    if (hit >= 0) return hit;
  }
  // Sin coincidencia por nombre se mantiene la name-line canónica (Urshifu,
  // Annihilape...), nunca una línea calculada desde el ID.
  return nameLine >= 0 && nameLine < gameInfo.length ? nameLine : -1;
};

// nombre de archivo EXACTO de cada grito (los base van con ceros: 001.mp3).
// Se prefiere el nombre del juego; si la app empaquetó otro nombre, se añade como respaldo.
const cryFileById = new Map();
for (const dir of [CRIES_SOURCE, path.join(PUBLIC, 'cries')]) {
  if (!fs.existsSync(dir)) continue;
  for (const n of fs.readdirSync(dir)) {
    const m = /^(\d+)\.(wav|mp3|ogg)$/i.exec(n);
    if (m && !cryFileById.has(Number(m[1]))) cryFileById.set(Number(m[1]), n);
  }
}
const baseOfVariant = (id) => {
  const n = Number(id);
  if (n >= 200000) return n - 200000;
  if (n >= 150000) return n - 150000;
  if (n >= 100000) return n - 100000;
  return n;
};

// ---------- 1. cargar dataset actual de la app (procedencia, no verdad absoluta) ----------
// Se lee la copia ORIGINAL (no el pokemon.js reescrito que ya importa reloadex.json).
const backupPath = path.join(SRC_DATA, 'pokemon.original.backup.js');
const pokemonJsPath = fs.existsSync(backupPath) ? backupPath : path.join(SRC_DATA, 'pokemon.js');
const mod = await import(pathToFileURL(pokemonJsPath).href + `?t=${Date.now()}`);
const existing = Array.isArray(mod.pokemonData) ? mod.pokemonData : [];

const normName = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

// El descifrador de Reloaded escribe algunas letras como "?" (Quilava ->
// "?uilava") y usa grafías propias (Capdos -> Zapdos). Estos alias permiten
// emparejar la ficha heredada por NOMBRE, nunca por el ID del hueco.
const GAME_NAME_ALIASES = new Map([
  ['nidoranh', 'nidoran♀'], ['nidoranm', 'nidoran♂'],
  ['farfetchd', "farfetch'd"], ['sirfetchd', "sirfetch'd"],
  ['porygonc', 'porygon-z'], ['capdos', 'zapdos'],
  ['cebstrika', 'zebstrika'], ['cigzagoon', 'zigzagoon'],
  ['cangoose', 'zangoose'], ['cubat', 'zubat'],
  ['cygarde', 'zygarde'], ['cacian', 'zacian'],
  ['camazenta', 'zamazenta'], ['cweilous', 'zweilous'],
]);
const gameNameKey = (value) => {
  const raw = String(value || '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/['’,]/g, '')
    .replace(/^\?u/, 'qu').replace(/^\?w/, 'qw')
    .replace(/[^a-z0-9]/g, '');
  return GAME_NAME_ALIASES.get(raw) ? normName(GAME_NAME_ALIASES.get(raw)) : raw;
};

// Tipos confirmados por textos del juego para criaturas exclusivas de Reloaded.
// Pikablue es la evolución de Pikachu (txt_menu.dll:473 y dex_info.dll:915) y
// sus movimientos propios Pikaturbo/Pikatormenta son descargas eléctricas.
// Drakeon y Duneon están confirmados literalmente en txt_dialog.dll.
const CURATED_GAME_TYPES = new Map([
  ['pikablue', { types: ['electric'], source: 'game-evolution-inferred' }],
  ['megapikablue', { types: ['electric'], source: 'game-evolution-inferred' }],
  ['drakeon', { types: ['dragon'], source: 'game-dialog-confirmed' }],
  ['duneon', { types: ['ground'], source: 'game-dialog-confirmed' }],
]);

// El backup con línea evolutiva (primeras generaciones) es el único dataset interno
// que registra METHODS de evolución. Se usa solo como dato heredado, nunca inventado.
const legacyEvoPath = path.join(SRC_DATA, 'pokemon_backup.js');
const legacyEvoMod = fs.existsSync(legacyEvoPath)
  ? await import(pathToFileURL(legacyEvoPath).href + `?t=${Date.now()}`)
  : { pokemonData: [] };
const legacyEvolutionById = new Map(
  (Array.isArray(legacyEvoMod.pokemonData) ? legacyEvoMod.pokemonData : [])
    .map((p) => [num(p.id), p])
    .filter(([id]) => id != null),
);

// pokemonFull.js registra más métodos de evolución (p. ej. las 8 ramas de Eevee).
// Se importa quitando su dependencia extensionless para que Node pueda leerlo.
const fullEvoSource = fs.readFileSync(path.join(SRC_DATA, 'pokemonFull.js'), 'utf8')
  .replace(/^import .*$/gm, '')
  .replace(/^export \{[^}]*\};$/gm, '');
const fullEvoUrl = `data:text/javascript;base64,${Buffer.from(fullEvoSource).toString('base64')}`;
const fullEvoMod = await import(fullEvoUrl);
const fullEvolutionById = new Map(
  (Array.isArray(fullEvoMod.fullPokemonData) ? fullEvoMod.fullPokemonData : [])
    .map((p) => [num(p.id), p])
    .filter(([id]) => id != null),
);
const fullEvolutionByName = new Map(
  (Array.isArray(fullEvoMod.fullPokemonData) ? fullEvoMod.fullPokemonData : [])
    .map((p) => [normName(p.name), p])
    .filter(([key]) => key),
);
const fullEvolutionByGameName = new Map();
for (const p of (Array.isArray(fullEvoMod.fullPokemonData) ? fullEvoMod.fullPokemonData : [])) {
  const key = gameNameKey(p.name);
  if (key && !fullEvolutionByGameName.has(key)) fullEvolutionByGameName.set(key, p);
}

// CORRECCIÓN de un error del backup interno: el ID 979 del backup era "Annihilape",
// pero en Reloaded 979 es "Tapu Fini" (txt_pkmn.dll). El ID real de Annihilape es 2357.
{
  const primeape = legacyEvolutionById.get(57);
  if (primeape && Array.isArray(primeape.evolutions)) {
    primeape.evolutions = primeape.evolutions.map((e) => {
      const link = cleanLink(e);
      return link && /annihilape/i.test(link.name || '') ? { ...link, id: 2357 } : e;
    });
  }
  const annihilape = legacyEvolutionById.get(2357);
  if (annihilape) annihilape.prevEvolution = { id: 57, name: 'Primeape', method: 'Furia 20x' };
}

// Eevee: el propio juego confirma 18 especies evolutivas por piedras
// (dex_info.dll:133 y txt_dialog.dll:14712). La correspondencia piedra -> especie
// está en la wiki oficial del juego; los nombres/IDs de las piedras se contrastaron
// con txt_obj.dll (es/en). ID 738 = Sylveon; 2054-2059 son los IDs de sprite de
// Aereon...Titaneon (en txt_pkmn.dll ocupan las líneas 1054-1059).
const EEVEE_STONE_EVOLUTIONS = [
  [134, 'Piedra Agua'],
  [135, 'Piedra Trueno'],
  [136, 'Piedra Fuego'],
  [196, 'Piedra Solar'],
  [197, 'Piedra Lunar'],
  [470, 'Piedra Hoja'],
  [471, 'Piedra Hielo'],
  [738, 'Piedra Ninfa'],
  [505, 'Piedra Día'],
  [506, 'Piedra Noche'],
  [507, 'Piedra Alba'],
  [508, 'Piedra Mineral'],
  [2054, 'Piedra Celeste'],
  [2055, 'Piedra Bicho'],
  [2056, 'Piedra Desierto'],
  [2057, 'Piedra Marte'],
  [2058, 'Piedra Venus'],
  [2059, 'Piedra Metálica'],
];

const byId = new Map();
for (const p of existing) {
  const id = num(p.id);
  if (id == null) continue;
  if (!byId.has(id)) byId.set(id, []);
  byId.get(id).push(p);
}
const pickExisting = (id) => {
  const arr = byId.get(Number(id)) || [];
  // preferir entrada con nombre real (no placeholder)
  return arr.find((p) => !isPlaceholderName(p.name, id)) || arr[0] || null;
};

const existingByName = new Map();
const existingByGameName = new Map();
for (const p of existing) {
  const key = normName(p.name);
  if (!key || existingByName.has(key)) continue;
  existingByName.set(key, p);
  const gameKey = gameNameKey(p.name);
  if (gameKey && !existingByGameName.has(gameKey)) existingByGameName.set(gameKey, p);
}

// ---------- 2. ground truth de IDs desde el juego + lo empaquetado ----------
const gameNormal = numericIdsFromDir(path.join(GAME_DATA, 'pkmn'));
const gameShiny = numericIdsFromDir(path.join(GAME_DATA, 'pkmn_shiny'));
const gameCries = numericIdsFromDir(CRIES_SOURCE, ['.wav', '.mp3', '.ogg']);

const appNormal = numericIdsFromDir(path.join(PUBLIC, 'sprites', 'normal'));
const appShiny = numericIdsFromDir(path.join(PUBLIC, 'sprites', 'shiny'));
const appCries = numericIdsFromDir(path.join(PUBLIC, 'cries'), ['.wav', '.mp3', '.ogg']);

// IDs de existencia: sprites NORMALES del juego + app + datos previos. (El shiny NO crea Pokémon nuevos.)
const normalIds = new Set([...gameNormal.ids, ...appNormal.ids].filter((n) => Number.isFinite(n)));
const cryIds = new Set([
  ...gameCries.ids, ...appCries.ids,
  ...appCries.names.map((n) => path.basename(n, path.extname(n))).filter((b) => /^\d+$/.test(b)).map(Number),
].map(Number));

// shiny: el juego lo guarda como 1000+ID (1.gif -> 1001.gif); la app también tiene
// copias renombradas a ID base. Se comprueban ambos nombres y se recuerda el real
// para pedir siempre un archivo que exista.
const shinyRaw = new Set([...gameShiny.ids, ...appShiny.ids].map(Number));
const shinyFileFor = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n)) return null;
  if (shinyRaw.has(n)) return `${n}.gif`;
  if (shinyRaw.has(1000 + n)) return `${1000 + n}.gif`;
  return null;
};
const hasShinyFor = (id) => !!shinyFileFor(id);

// ---------- 3. construir entradas ----------
const allIds = new Set();
for (const id of normalIds) allIds.add(id);
for (const id of byId.keys()) allIds.add(id);
allIds.delete(0); // 0.gif / huevo no son un Pokémon

const baseIds = [...allIds].filter((id) => id < 100000).sort((a, b) => a - b);
const baseNameById = new Map();
for (const id of baseIds) {
  const gname = gameNameForId(id);
  const ex = pickExisting(id);
  if (gname) baseNameById.set(id, gname);
  else if (ex && !isPlaceholderName(ex.name, id)) baseNameById.set(id, ex.name);
}

// ID real en Reloaded para un nombre del juego (útil cuando el ID cambió en el juego).
const gameIdByName = new Map();
gameNames.forEach((name, i) => {
  const id = i < 1000 ? i + 1 : i + 1001;
  const key = normName(name);
  if (key && !gameIdByName.has(key)) gameIdByName.set(key, id);
});
for (const [id, name] of baseNameById) {
  const key = normName(name);
  if (key && !gameIdByName.has(key)) gameIdByName.set(key, id);
}

// Emparejar las variantes reales del juego (Mega / Gigamax) con sus IDs de sprite.
const variantNames = new Map();
{
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const megaList = gameNames.filter((n) => /^mega /i.test(n));
  const gigaList = gameNames.filter((n) => /gigamax/i.test(n));
  const byBase = new Map();
  for (const id of allIds) {
    if (id < 100000) continue;
    const base = baseOfVariant(id);
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(id);
  }
  for (const [base, ids] of byBase) {
    const bn = gameNameForId(base) || baseNameById.get(base);
    if (!bn) continue;
    const nb = norm(bn);
    const candidates = [
      ...megaList.filter((n) => norm(n).includes(nb)),
      ...gigaList.filter((n) => norm(n).includes(nb)),
    ];
    const unique = [...new Set(candidates)];
    ids.sort((a, b) => a - b).forEach((id, i) => {
      const found = unique[i];
      if (found) variantNames.set(id, { name: found, label: /gigamax/i.test(found) ? 'Gigamax' : 'Mega evolución' });
    });
  }
}

const entries = [];
const stats = { total: 0, base: 0, mega: 0, forme: 0, unknownNames: 0, withStats: 0, withShiny: 0, withCry: 0 };

for (const id of [...allIds].sort((a, b) => a - b)) {
  const ex = pickExisting(id);
  const hasNormal = idSetHas(normalIds, id);
  const hasShiny = hasShinyFor(id);
  const hasCry = idSetHas(cryIds, id);

  // forma
  let form = 'base';
  let baseForm = null;
  if (id >= 100000) {
    // esquema Reloaded: +100000 mega, +150000 mega2 (X/Y), +200000 forma
    const offset = id >= 200000 ? 200000 : id >= 150000 ? 150000 : 100000;
    const candidateBase = id - offset;
    baseForm = baseIds.includes(candidateBase) ? candidateBase : null;
    form = baseForm != null && offset !== 200000 ? 'mega' : 'forme';
  } else if (id >= 2001 && id < 100000) {
    form = 'forme'; // registrados en el juego; naturaleza exacta sin verificar
  }

  // nombre: PRIMERO el nombre real del juego (txt_pkmn.dll descifrado)
  let name = null;
  let nameSource = 'unknown';
  let formLabel = null;
  const gname = gameNameForId(id);
  const variant = variantNames.get(id);
  if (gname) {
    name = gname;
    nameSource = 'reloaded-game-text';
  } else if (variant) {
    name = variant.name;
    formLabel = variant.label;
    nameSource = 'reloaded-game-text';
  } else if (ex && !isPlaceholderName(ex.name, id)) {
    name = ex.name;
    nameSource = 'official-base'; // datos heredados, solo cuando Reloaded no da nombre
  } else if (form === 'mega' && baseForm != null && baseNameById.get(baseForm)) {
    name = `Mega ${baseNameById.get(baseForm)}`;
    nameSource = 'inferred-mega';
  }
  if (!formLabel) formLabel = id >= 200000 ? 'Forma' : id >= 100000 ? 'Mega evolución' : null;
  if (!name) { nameSource = 'unknown'; stats.unknownNames++; }

  // dato real: solo si la entrada heredada NO es placeholder
  const exReal = ex && !isPlaceholderName(ex.name, id) ? ex : null;
  const baseReal = baseForm != null ? pickExisting(baseForm) : null;
  const baseRealOK = baseReal && !isPlaceholderName(baseReal.name, baseForm) ? baseReal : null;
  // Reloaded reutiliza los IDs oficiales con otros nombres (495 es Pikablue,
  // no Snivy). La ficha por ID solo vale cuando el NOMBRE coincide; si no,
  // se busca por nombre y se deja sin type cuando no existe esa ficha.
  const isCustomGameId = id >= 2001 && id < 100000;
  const nameMatchesLegacy = !!exReal && gameNameKey(exReal.name) === gameNameKey(name);
  const byName = existingByGameName.get(gameNameKey(name))
    || (isCustomGameId ? existingByName.get(normName(name)) : null) || null;
  const baseGameName = baseForm != null ? baseNameById.get(baseForm) : null;
  const baseTypeEntry = baseGameName ? (existingByGameName.get(gameNameKey(baseGameName)) || null) : null;

  // tipos (no están en los textos legibles del juego: se marcan como heredados)
  let types = null;
  let typesSource = 'unknown';
  const typeEntry = byName || (nameMatchesLegacy ? exReal : null) || baseTypeEntry;
  if (Array.isArray(typeEntry?.types) && typeEntry.types.length) {
    types = typeEntry.types.map((t) => String(t).toLowerCase());
    typesSource = byName ? 'official-name-matched'
      : (nameMatchesLegacy && exReal ? 'official-base'
        : (baseTypeEntry ? 'inferred-base' : 'unknown'));
  }
  // Tipos verificados/inferidos de los propios textos del juego, solo cuando
  // no existe ficha oficial con ese nombre (no se heredan del hueco de ID).
  const curated = CURATED_GAME_TYPES.get(gameNameKey(name));
  if (curated && (!typeEntry || !Array.isArray(typeEntry.types) || !typeEntry.types.length)) {
    types = [...curated.types];
    typesSource = curated.source;
  }
  // No se inventa el tipo Normal para las criaturas exclusivas del juego.
  if (!types) types = [];

  // stats (no están en los textos legibles del juego)
  const statEntry = (byName?.stats ? byName : null) || (exReal?.stats ? exReal : null)
    || (baseTypeEntry?.stats ? baseTypeEntry : null)
    || (form !== 'base' && baseRealOK?.stats ? baseRealOK : null);
  const s = statEntry?.stats || null;
  const statsObj = s ? {
    hp: num(s.hp, 0), attack: num(s.attack, 0), defense: num(s.defense, 0),
    spAttack: num(s.spAttack ?? s.specialAttack, 0), spDefense: num(s.spDefense ?? s.specialDefense, 0),
    speed: num(s.speed, 0),
  } : null;
  const statsSource = statsObj
    ? (byName?.stats ? 'official-name-matched'
      : (nameMatchesLegacy && exReal?.stats ? 'official-base'
        : (exReal?.stats ? 'inferred-slot' : 'inferred-base')))
    : 'unknown';

  const abilityEntry = byName || (nameMatchesLegacy ? exReal : null) || null;
  const resolvedAbilities = abilitiesForGameId(id, name, baseForm, abilityEntry?.abilities);
  const abilities = resolvedAbilities.abilities;

  // línea evolutiva: datos heredados internos, con IDs remapeados a los del juego.
  const legacy = (nameMatchesLegacy
    ? (legacyEvolutionById.get(id) || fullEvolutionById.get(id))
    : null)
    || fullEvolutionByGameName.get(gameNameKey(name))
    || (isCustomGameId ? fullEvolutionByName.get(normName(name)) : null)
    || null;
  const resolveLink = (x) => {
    const link = cleanLink(x);
    if (!link) return null;
    const currentName = baseNameById.get(link.id) || gameNames[textIndexForId(link.id)];
    if (!allIds.has(link.id) || normName(currentName) !== normName(link.name)) {
      const gameId = gameIdByName.get(normName(link.name));
      if (gameId != null) link.id = gameId;
    }
    link.name = baseNameById.get(link.id) || gameNames[textIndexForId(link.id)] || link.name;
    return link;
  };
  let prevEvolution = legacy?.prevEvolution ? resolveLink(legacy.prevEvolution) : null;
  if (!prevEvolution && form === 'mega' && baseForm != null) {
    prevEvolution = { id: baseForm, name: baseNameById.get(baseForm) || null, method: null };
  }
  let evolutions = (Array.isArray(legacy?.evolutions) ? legacy.evolutions : [])
    .map(resolveLink)
    .filter(Boolean);

  // Reloaded registra dos Urshifu distintos (2236 y 2237) a partir de Kubfu (2235).
  // No hay método legible en los archivos del juego: se muestra la rama, sin inventar objeto.
  if (id === 2235 && evolutions.length === 0) {
    evolutions = [2236, 2237].map((target) => resolveLink({ id: target, name: baseNameById.get(target), method: null }));
  }
  if ((id === 2236 || id === 2237) && !prevEvolution) {
    prevEvolution = resolveLink({ id: 2235, name: baseNameById.get(2235), method: null });
  }

  // Eevee: 18 evoluciones por piedra, sin felicidad/amistad ni nivel.
  if (id === 133) {
    evolutions = EEVEE_STONE_EVOLUTIONS
      .map(([target, method]) => resolveLink({
        id: target,
        name: baseNameById.get(target) || gameNames[textIndexForId(target)] || null,
        method,
      }))
      .filter(Boolean);
  }
  const eeveeStone = EEVEE_STONE_EVOLUTIONS.find(([target]) => target === id);
  if (eeveeStone && !prevEvolution) {
    prevEvolution = resolveLink({ id: 133, name: 'Eevee', method: eeveeStone[1] });
  }

  const moves = Array.isArray(legacy?.moves) ? legacy.moves.slice() : [];

  // descripción / altura / peso / categoría: resueltos por NOMBRE (name-line),
  // nunca por la correlación directa ID -> índice de texto.
  const nameLine = canonicalNameLine(id, name);
  const ti = infoLineForName(name, nameLine);
  const description = ti >= 0 ? (gameInfo[ti] || null) : null;
  const height = ti >= 0 ? measurement(gameHeights[ti]) : null;
  const weight = ti >= 0 ? measurement(gameWeights[ti]) : null;
  const species = ti >= 0 ? (gameSpecies[ti] || null) : null;
  const cryRaw = cryFileById.get(id);
  // Los gritos se empaquetan como MP3 (mucho más livianos que el WAV del juego).
  const cryFile = cryRaw ? cryRaw.replace(/\.(wav|ogg)$/i, '.mp3') : null;

  const entry = {
    id,
    name: name || `Pokémon #${id}`,
    nameSource,
    displayName: name || `Pokémon #${id}`,
    types,
    typesSource,
    stats: statsObj,
    statsSource,
    abilities,
    abilitiesSource: resolvedAbilities.source,
    moves,
    prevEvolution,
    evolutions,
    evolutionKnown: !!legacy,
    height,
    weight,
    species,
    description,
    generation: (byName?.generation || (nameMatchesLegacy ? exReal?.generation : null)) || null,
    region: (byName?.region || (nameMatchesLegacy ? exReal?.region : null)) || null,
    form,
    baseForm,
    formLabel: form === 'base' ? null : formLabel,
    formName: form === 'mega' ? formLabel : null,
    sprite: {
      normal: hasNormal,
      shiny: hasShiny,
      shinyFile: shinyFileFor(id),
      cry: !!cryFile,
      cryFile,
    },
    source: nameSource === 'reloaded-game-text' ? 'reloaded-game-text' : (exReal ? 'merged' : 'reloaded-structure'),
  };

  // enlazar mega <-> base
  if (form === 'mega' && baseForm != null) entry.baseFormName = baseNameById.get(baseForm) || null;

  entries.push(entry);
  stats.total++;
  if (form === 'base') stats.base++; else if (form === 'mega') stats.mega++; else stats.forme++;
  if (statsObj) stats.withStats++;
  if (hasShiny) stats.withShiny++;
  if (cryFile) stats.withCry++;
}

// enlazar megas en la forma base (evolución/mega)
const megasByBase = new Map();
for (const e of entries) {
  if (e.form === 'mega' && e.baseForm != null) {
    if (!megasByBase.has(e.baseForm)) megasByBase.set(e.baseForm, []);
    megasByBase.get(e.baseForm).push(e.id);
  }
}
for (const e of entries) {
  const megas = megasByBase.get(e.id);
  if (megas && megas.length) e.megaEvolutions = megas;
}

// Variantes: base + todas sus formas reales (mega / Gigamax / forma).
// El método solo se muestra cuando viene del nombre del juego; nunca se inventa.
const entryById = new Map(entries.map((e) => [e.id, e]));
const variantsByBase = new Map();
for (const e of entries) {
  if (e.baseForm == null) continue;
  if (!variantsByBase.has(e.baseForm)) variantsByBase.set(e.baseForm, []);
  variantsByBase.get(e.baseForm).push(e);
}
for (const [baseId, forms] of variantsByBase) {
  const base = entryById.get(baseId);
  const all = [base, ...forms].filter(Boolean);
  const links = all.map((e) => ({
    id: e.id,
    name: e.name,
    form: e.form,
    label: e.form === 'base' ? 'Base' : (e.formLabel || (e.form === 'mega' ? 'Mega evolución' : 'Forma')),
    method: e.form === 'base' || e.nameSource !== 'reloaded-game-text' ? null : (e.formLabel || null),
  }));
  for (const e of all) e.variants = links;
}

const knownIds = new Set(entries.map((e) => e.id));
const orphanCryIds = [...cryIds].filter((id) => !knownIds.has(id)).sort((a, b) => a - b);

// ---------- 4. escribir ----------
fs.writeFileSync(OUT_JSON, JSON.stringify(entries, null, 2));
const provenance = {
  generatedAt: new Date().toISOString(),
  gameDataDir: GAME_DATA,
  criesSourceDir: CRIES_SOURCE,
  syncedCries,
  note:
    'IDs, sprites, shiny (nombre real <ID+1000>.gif), baseForm, nombres, descripciones, categoría, altura y peso son verificables en disco ' +
    '(textos del juego descifrados). Los gritos se toman de la carpeta de audio que mantiene el usuario y se sincronizan a public/cries. ' +
    'types/stats siguen siendo datos heredados; el juego no expone esa tabla en archivos legibles. ' +
    'Los tipos se resuelven por NOMBRE del juego: cuando Reloaded reutiliza un ID con otro nombre no se copia el tipo del hueco, y las criaturas exclusivas sin ficha oficial se dejan sin tipo. ' +
    'El enlace Primeape -> Annihilape se corrigió al ID real 2357 (979 es Tapu Fini en Reloaded). ' +
    'Los gritos huérfanos no se asignan a ningún Pokémon porque no tienen sprite/entrada en el juego.',
  counts: stats,
  sources: {
    gameNormalSprites: gameNormal.ids.size,
    gameShinySprites: gameShiny.ids.size,
    gameCries: gameCries.ids.size,
    appNormalSprites: appNormal.ids.size,
    appShinySprites: appShiny.ids.size,
    appCries: appCries.ids.size,
    existingEntries: existing.length,
    gameTextNames: gameNames.length,
    gameTextDescriptions: gameInfo.length,
    orphanCryIds,
  },
};
fs.writeFileSync(OUT_REPORT, JSON.stringify(provenance, null, 2));

console.log('[Reloadex] dataset generado:', OUT_JSON);
console.log(JSON.stringify(provenance.counts, null, 2));
console.log('fuentes:', JSON.stringify(provenance.sources, null, 2));
