// Genera la localización real de objetos desde los scripts GML del juego:
// CreateObjects (objetos en el suelo por sala) y NameLugar (sala -> lugar).
// Los nombres de objeto y lugar se leen de los DLL cifrados del juego.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SCRIPTS = path.join(HERE, 'game-scripts');
const TEXT = 'D:/Juegos/Reloaded/data/text';
const readGml = (name) => fs.readFileSync(path.join(SCRIPTS, `${name}.gml.txt`), 'utf8');

const ITEMS = decodeFile(`${TEXT}/es/txt_obj.dll`);
const PLACES = decodeFile(`${TEXT}/es/txt_places.dll`);
const itemName = (id) => String(ITEMS[Number(id) - 1] || `Objeto ${id}`).trim();
const placeName = (id) => String(PLACES[Number(id) - 1] || '').trim();

// ---------- sala -> lugar (NameLugar) ----------
// NameLugar encadena `if(argument0=(...))return(ex(9880, id));`. La primera
// rama que coincide gana, porque GML sale con return.
const nameLugar = readGml('NameLugar');
const roomToPlace = new Map();
{
  const re = /if\(argument0=/g;
  let match;
  while ((match = re.exec(nameLugar))) {
    let depth = 0;
    let close = match.index;
    for (; close < nameLugar.length; close++) {
      if (nameLugar[close] === '(') depth++;
      else if (nameLugar[close] === ')') {
        depth--;
        if (depth === 0) break;
      }
    }
    const condition = nameLugar.slice(match.index, close + 1);
    const next = nameLugar.indexOf('if(argument0=', close + 1);
    const body = nameLugar.slice(close + 1, next < 0 ? nameLugar.length : next);
    const placeMatch = /ex\(9880,(\d+)\)/.exec(body);
    if (!placeMatch) continue;
    const place = Number(placeMatch[1]);
    for (const id of condition.matchAll(/argument0=\((\d+)\)/g)) {
      const room = Number(id[1]);
      if (!roomToPlace.has(room)) roomToPlace.set(room, place);
    }
    for (const range of condition.matchAll(/argument0>=(\d+)\s*&&\s*argument0<=(\d+)/g)) {
      const from = Number(range[1]);
      const to = Number(range[2]);
      if (to - from > 2000) continue;
      for (let room = from; room <= to; room++) {
        if (!roomToPlace.has(room)) roomToPlace.set(room, place);
      }
    }
    re.lastIndex = Math.max(close + 1, next < 0 ? nameLugar.length : next);
  }
}

// ---------- objetos en el suelo (CreateObjects) ----------
const createObjects = readGml('CreateObjects');
const placements = [];
{
  const re = /if\(room=\((\d+)\)\)\{/g;
  let match;
  while ((match = re.exec(createObjects))) {
    let depth = 0;
    let close = match.index + match[0].length - 1;
    for (; close < createObjects.length; close++) {
      if (createObjects[close] === '{') depth++;
      else if (createObjects[close] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    const room = Number(match[1]);
    const body = createObjects.slice(match.index + match[0].length, close);
    const itemRe = /instance_create\((\d+),(\d+),\(\d+\)\);z\.NUM=(\d+);(?:z\.number=(\d+);)?z\.index=(\d+);/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(body))) {
      placements.push({
        room,
        x: Number(itemMatch[1]),
        y: Number(itemMatch[2]),
        num: Number(itemMatch[3]),
        qty: itemMatch[4] == null ? 1 : Number(itemMatch[4]),
        id: Number(itemMatch[5]),
      });
    }
    re.lastIndex = close + 1;
  }
}

const categoryOf = (name) => {
  const n = name.toLowerCase();
  if (/^mo\d|^mo /.test(n)) return 'MO';
  if (/^mt\d/.test(n)) return 'MT';
  if (n.includes('piedra')) return 'Piedra';
  if (n.includes('baya')) return 'Baya';
  if (n.includes('poción') || n.includes('pocion')) return 'Poción';
  if (n.includes('ita') && /mega|z$/i.test(n)) return 'Mega';
  if (/mapa|bici|caña|varita|linterna|credencial|llave|pase|amulet|hueso|perla|corona|tabla|cetro|arma/i.test(n)) return 'Clave';
  if (n.includes('muñeco') || n.includes('doll')) return 'Coleccionable';
  return 'Objeto';
};

const byItem = new Map();
for (const p of placements) {
  if (!byItem.has(p.id)) byItem.set(p.id, []);
  const place = roomToPlace.get(p.room);
  byItem.get(p.id).push({
    zone: place ? placeName(place) : '',
    place: place || null,
    detail: `Sala ${p.room}`,
    room: p.room,
    x: p.x,
    y: p.y,
    num: p.num,
    qty: p.qty,
    method: 'En el suelo',
    source: 'CreateObjects',
  });
}

const items = ITEMS.map((name, i) => {
  const id = i + 1;
  const locations = (byItem.get(id) || [])
    .filter((loc) => loc.zone)
    .sort((a, b) => a.zone.localeCompare(b.zone, 'es') || a.room - b.room || a.num - b.num);
  return { id, name: String(name).trim(), category: categoryOf(String(name)), locations };
});

const output = {
  version: 2,
  source: 'GameMaker gamedata (CreateObjects, NameLugar) + txt_obj.dll + txt_places.dll',
  stats: {
    items: items.length,
    withRoutes: items.filter((item) => item.locations.length).length,
    placements: placements.length,
    rooms: new Set(placements.map((p) => p.room)).size,
    roomsWithPlace: new Set(placements.filter((p) => roomToPlace.has(p.room)).map((p) => p.room)).size,
  },
  items,
};

const outFile = path.join(ROOT, 'src', 'data', 'objectLocations.json');
fs.writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`);
console.log('[Reloadex] localización de objetos generada:', outFile);
console.log(JSON.stringify(output.stats, null, 2));
