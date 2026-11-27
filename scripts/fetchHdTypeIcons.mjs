#!/usr/bin/env node
/**
 * Descarga los iconos de tipo vectoriales (512x512) y los normaliza a blanco puro.
 * Se usan únicamente en el filtro de tipos de Reloadex.
 * Fuente: https://github.com/duiker101/pokemon-type-svg-icons (MIT)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'public', 'icons', 'types', 'hd');
const BASE = 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons';
const TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost',
  'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon',
  'dark', 'fairy',
];

fs.mkdirSync(OUT, { recursive: true });
for (const type of TYPES) {
  const response = await fetch(`${BASE}/${type}.svg`);
  if (!response.ok) throw new Error(`${type}: HTTP ${response.status}`);
  const svg = (await response.text())
    .replace(/fill="white"/g, 'fill="#FFFFFF"')
    .replace(/fill="#fff"/g, 'fill="#FFFFFF"');
  fs.writeFileSync(path.join(OUT, `${type}.svg`), svg, 'utf8');
}
console.log(`[iconos HD] ${TYPES.length} SVG blancos -> public/icons/types/hd/`);
