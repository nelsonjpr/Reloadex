// Genera src/data/learnsets.json desde los scripts GML reales del juego.
// Fuentes: scripts/game-scripts/*.gml.txt (extraídos por extractGameScripts.py)
// y los DLL de texto descifrados (nombres de movimientos y objetos).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

const PROJECT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS = path.join(PROJECT, 'scripts', 'game-scripts');
const GAME_TEXT = 'D:/Juegos/Reloaded/data/text';
const OUT = path.join(PROJECT, 'src', 'data', 'learnsets.json');

const readScript = (name) => fs.readFileSync(path.join(SCRIPTS, `${name}.gml.txt`), 'utf8');

// Devuelve el contenido de la llave que empieza en `open`.
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

function parseLevelUp(src) {
  const out = new Map();
  const re = /if\(PK=(\d+)\)\{/g;
  let m;
  while ((m = re.exec(src))) {
    const body = blockAt(src, m.index + m[0].length - 1);
    // En Ataque_Nivel, NV es el nivel (o pseudo-nivel 200/201/202) y el valor
    // devuelto es el ID del movimiento. Se guarda como [ID movimiento, nivel],
    // el mismo formato que consume PokemonMovesPanel.jsx.
    const pairs = [...body.matchAll(/if\(NV=(\d+)\)return\((\d+)\);/g)]
      .map((p) => [Number(p[2]), Number(p[1])]);
    if (pairs.length) out.set(Number(m[1]), pairs);
  }
  return out;
}

function parseSwitchScript(src, key) {
  const out = new Map();
  const re = new RegExp(`if\\(${key}=(\\d+)\\)\\{switch\\(PK\\)\\{`, 'g');
  let m;
  while ((m = re.exec(src))) {
    const body = blockAt(src, m.index + m[0].length - 1);
    const ids = new Set();
    // El juego agrupa varios `case` antes de cada {return(true);exit;}.
    for (const group of body.split('{return(true);exit;}')) {
      for (const c of group.matchAll(/case (\d+):/g)) ids.add(Number(c[1]));
    }
    if (ids.size) out.set(Number(m[1]), [...ids].sort((a, b) => a - b));
  }
  return out;
}

function parseDt(src) {
  const out = new Map();
  const re = /if\(AT=(\d+)\)\{/g;
  let m;
  while ((m = re.exec(src))) {
    const body = blockAt(src, m.index + m[0].length - 1);
    const ids = [...body.matchAll(/PK=(\d+)/g)].map((p) => Number(p[1]));
    if (ids.length) out.set(Number(m[1]), [...new Set(ids)].sort((a, b) => a - b));
  }
  return out;
}

function parseEgg(src) {
  const out = new Map();
  const re = /if\((PK=\d+(?:\s*\|\|\s*PK=\d+)*)\)\{/g;
  let m;
  while ((m = re.exec(src))) {
    const body = blockAt(src, m.index + m[0].length - 1);
    const ats = [...body.matchAll(/AT=(\d+)/g)].map((p) => Number(p[1]));
    if (!ats.length) continue;
    for (const pk of m[1].matchAll(/PK=(\d+)/g)) {
      const id = Number(pk[1]);
      const set = out.get(id) || new Set();
      for (const at of ats) set.add(at);
      out.set(id, set);
    }
  }
  return out;
}

function parseIdReturn(src) {
  const out = new Map();
  for (const m of src.matchAll(/if\(argument0=(\d+)\)return\((\d+)\);/g)) {
    out.set(Number(m[1]), Number(m[2]));
  }
  return out;
}

// ---------- parseo ----------
const levelSrc = readScript('Ataque_Nivel');
const tmSrc = readScript('Ataque_MT');
const tutorSrc = readScript('Ataque_Tutor');
const dtSrc = readScript('Ataque_DT');
const eggSrc = readScript('AprendeAtaqueHuevo');
const itemToMove = parseIdReturn(readScript('MTAtack'));
const tutorToMove = parseIdReturn(readScript('IndiceTutor'));

const levelUp = parseLevelUp(levelSrc);
const tmRaw = parseSwitchScript(tmSrc, 'MK');
const tutorRaw = parseSwitchScript(tutorSrc, 'MV');
const dtRaw = parseDt(dtSrc);
const eggRaw = parseEgg(eggSrc);

console.log('[learnsets] bloques:', {
  nivel: levelUp.size,
  mt: tmRaw.size,
  tutor: tutorRaw.size,
  dt: dtRaw.size,
  huevo: eggRaw.size,
  itemToMove: itemToMove.size,
  tutorToMove: tutorToMove.size,
});

// ---------- catálogos en español ----------
const moveNames = decodeFile(`${GAME_TEXT}/es/txt_attack.dll`);
const moveDesc = decodeFile(`${GAME_TEXT}/es/txt_attack_desc.dll`);
const itemNames = decodeFile(`${GAME_TEXT}/es/txt_obj.dll`);
// La lista de tutores del juego viene en ANSI (Windows-1252); el descifrador
// solo arregla los DLL de texto, no este TXT.
const tutorNames = fs.readFileSync('D:/Juegos/Reloaded/data/attack_pkmn/Lista de Tutores.txt', 'latin1')
  .split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => l.replace(/^TM\d+\s*/, '').trim());

const moves = moveNames.map((n, i) => n || `Ataque ${i + 1}`);
const items = {};
for (const [id, name] of itemNames.entries()) if (name) items[id + 1] = name;

// La lista de tutores tiene dos nombres intercambiados (Voto Agua / Voto Planta)
// y varios alias de UI. El ID real lo da IndiceTutor, así que cuando el nombre
// de la lista no coincide con el move ID, se muestra el nombre del DLL.
const normalize = (value) => String(value || '')
  .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const moveIdsByName = new Map();
moves.forEach((name, i) => { if (name) moveIdsByName.set(normalize(name), i + 1); });
const tutorIndexToMove = new Map([...tutorToMove.entries()].map(([index, mv]) => [index, mv]));
const tutors = tutorNames.map((name, i) => {
  const index = i + 1;
  const moveId = tutorIndexToMove.get(index) ?? null;
  const listedMove = moveIdsByName.get(normalize(name));
  return {
    index,
    moveId,
    name: moveId && listedMove && listedMove !== moveId ? moves[moveId - 1] : name,
  };
});

// ---------- índice por Pokémon ----------
const byPokemon = {};
const ensure = (pk) => (byPokemon[pk] ||= { level: [], tm: [], tutor: [], dt: [], egg: [] });

for (const [pk, pairs] of levelUp) {
  for (const [lv, mv] of pairs) if (moves[mv - 1]) ensure(pk).level.push([lv, mv]);
}
for (const [itemId, pks] of tmRaw) {
  const mv = itemToMove.get(itemId);
  if (!mv || !moves[mv - 1]) continue;
  for (const pk of pks) ensure(pk).tm.push([mv, itemId]);
}
for (const [tutorMove, pks] of tutorRaw) {
  if (!moves[tutorMove - 1]) continue;
  const tIndex = [...tutorToMove.entries()].find(([, mv]) => mv === tutorMove)?.[0] ?? null;
  for (const pk of pks) ensure(pk).tutor.push([tutorMove, tIndex]);
}
for (const [mv, pks] of dtRaw) {
  if (!moves[mv - 1]) continue;
  for (const pk of pks) ensure(pk).dt.push([mv]);
}
for (const [pk, ats] of eggRaw) {
  for (const mv of ats) if (moves[mv - 1]) ensure(pk).egg.push([mv]);
}

for (const entry of Object.values(byPokemon)) {
  entry.level.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  for (const key of ['tm', 'tutor', 'dt', 'egg']) {
    entry[key] = [...new Set(entry[key].map((e) => JSON.stringify(e)))].map(JSON.parse);
  }
  entry.tm.sort((a, b) => a[1] - b[1]);
  entry.tutor.sort((a, b) => (a[1] ?? 999) - (b[1] ?? 999));
  entry.dt.sort((a, b) => a[0] - b[0]);
  entry.egg.sort((a, b) => a[0] - b[0]);
}

const result = {
  version: 1,
  source: 'GameMaker 8 gamedata: Ataque_Nivel, Ataque_MT, Ataque_Tutor, Ataque_DT, AprendeAtaqueHuevo',
  moves,
  moveDesc,
  items,
  tutors,
  byPokemon,
};
fs.writeFileSync(OUT, JSON.stringify(result));
console.log('[learnsets] escrito:', OUT, `${(fs.statSync(OUT).size / 1024 / 1024).toFixed(2)} MB`);
for (const id of [6, 280]) {
  const e = byPokemon[id];
  console.log(`[learnsets] PK=${id}:`, e
    ? Object.fromEntries(Object.entries(e).map(([k, v]) => [k, v.length]))
    : 'sin datos');
}
