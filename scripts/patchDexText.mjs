#!/usr/bin/env node
/**
 * Aplica a reloadex.json la descripción/categoría/altura/peso exacta del juego.
 * Solo toca esos cuatro campos: el resto del dataset se conserva intacto.
 * La fuente es el mapa ID -> línea de GetOrdenDex / GetOrdenDexEspecial,
 * extraído del EXE con scripts/extractGameScripts.py.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dexTextForId } from './dexTextMap.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', 'src', 'data', 'reloadex.json');
const pokemon = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const fields = ['description', 'species', 'height', 'weight'];
let changedEntries = 0;
let changedFields = 0;
const examples = [];

for (const p of pokemon) {
  const text = dexTextForId(p.id);
  const next = {
    description: text.description || null,
    species: text.species || null,
    height: text.height,
    weight: text.weight,
  };
  const before = {};
  let touched = false;
  for (const key of fields) {
    if (p[key] !== next[key]) {
      before[key] = p[key];
      p[key] = next[key];
      touched = true;
      changedFields++;
    }
  }
  if (touched) {
    changedEntries++;
    if (examples.length < 12) examples.push({ id: p.id, name: p.name, line: text.line, before: before.description?.slice(0, 80) || null, after: next.description?.slice(0, 110) || null });
  }
}

fs.writeFileSync(OUT, `${JSON.stringify(pokemon, null, 2)}\n`);
console.log(JSON.stringify({ total: pokemon.length, changedEntries, changedFields, examples }, null, 2));
