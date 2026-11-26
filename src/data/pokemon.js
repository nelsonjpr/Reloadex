// =============================================================
// Reloadex — datos de Pokémon Reloaded
// =============================================================
// Fuente de verdad: Pokémon Reloaded (D:\Juegos\Reloaded).
//   - IDs y sprites/shiny/gritos verificados en disco.
//   - Dataset COMPLETO generado por scripts/buildReloadexData.mjs -> reloadex.json
//   - Nombres, descripciones, categoría, altura y peso vienen de los textos reales
//     del juego (descifrados en scripts/decodeReloaded.mjs).
//   - Types/stats siguen siendo datos heredados; el juego no expone esa tabla en
//     archivos legibles. Se marcan internamente, nunca se muestran en la interfaz.
//   Re-generar con:  node scripts/buildReloadexData.mjs
// =============================================================

import reloadexData from './reloadex.json';
import { pokemonData as officialData } from './pokemon.original.backup.js';

// La numeración de Reloadex es la de los sprites del juego. Las generaciones se
// derivan de esa numeración para que TODAS las entradas (formas y IDs propios)
// puedan filtrarse, incluso cuando el dataset heredado no traía región.
const GENERATION_RANGES = [
  { max: 151, generation: 'Gen I', region: 'Kanto' },
  { max: 251, generation: 'Gen II', region: 'Johto' },
  { max: 386, generation: 'Gen III', region: 'Hoenn' },
  { max: 493, generation: 'Gen IV', region: 'Sinnoh' },
  { max: 649, generation: 'Gen V', region: 'Teselia' },
  { max: 721, generation: 'Gen VI', region: 'Kalos' },
  { max: 809, generation: 'Gen VII', region: 'Alola' },
  { max: 905, generation: 'Gen VIII', region: 'Galar' },
  { max: 1000, generation: 'Gen IX', region: 'Paldea' },
];

export function generationForPokemon(p) {
  const id = Number(p?.baseForm ?? p?.id);
  if (id >= 2001) return 'Gen Star';
  const found = GENERATION_RANGES.find((r) => id <= r.max);
  return found ? found.generation : null;
}

export function regionForPokemon(p) {
  const id = Number(p?.baseForm ?? p?.id);
  if (id >= 2001) return 'Región Star';
  const found = GENERATION_RANGES.find((r) => id <= r.max);
  return found ? found.region : null;
}

// El juego reutiliza IDs de la Pokédex oficial con otros nombres (Pikablue
// ocupa el hueco 495, que en la lista oficial es Snivy). Copiar tipos por ID
// asignaba Planta a Pikablue. Aquí los tipos se resuelven por NOMBRE del juego.
const NAME_ALIASES = {
  'nidoran h.': 'nidoran♀',
  'nidoran m.': 'nidoran♂',
  'farfetch,d': "farfetch'd",
  'sirfetch,d': "sirfetch'd",
  'porygon-c': 'porygon-z',
  capdos: 'zapdos',
  cebstrika: 'zebstrika',
  cigzagoon: 'zigzagoon',
  cangoose: 'zangoose',
  cubat: 'zubat',
  cygarde: 'zygarde',
  cacian: 'zacian',
  camazenta: 'zamazenta',
  cweilous: 'zweilous',
};

const normalizeName = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const gameNameKey = (value) => {
  let key = normalizeName(value);
  if (NAME_ALIASES[key]) key = normalizeName(NAME_ALIASES[key]);
  return key.replace(/^\?u/, 'qu').replace(/^\?w/, 'qw');
};

const officialByName = new Map();
const officialById = new Map();
for (const entry of officialData) {
  const key = gameNameKey(entry.name);
  if (key && !officialByName.has(key)) officialByName.set(key, entry.types || []);
  officialById.set(Number(entry.id), entry);
}

const baseIdOf = (p) => {
  if (p?.baseForm != null) return Number(p.baseForm);
  const id = Number(p?.id);
  if (!Number.isFinite(id) || id < 100000) return id;
  return id - (id >= 200000 ? 200000 : id >= 150000 ? 150000 : 100000);
};

// El dataset ya trae los tipos resueltos por NOMBRE (y los pocos tipos
// confirmados por los textos del juego). Solo se calculan aquí si faltan.
// Nunca se cae al tipo del Pokémon oficial que ocupa el mismo ID.
const typesFor = (p) => {
  if (Array.isArray(p?.types) && p.types.length) return [...p.types];
  const key = gameNameKey(p.name);
  if (officialByName.has(key)) return [...officialByName.get(key)];
  const officialAtId = officialById.get(baseIdOf(p));
  if (officialAtId && gameNameKey(officialAtId.name) === key) return [...(officialAtId.types || [])];
  return [];
};

// IDs SIEMPRE numéricos. La generación/región se calcula para cada entrada.
export const pokemonData = reloadexData.map((p) => ({
  ...p,
  id: Number(p.id),
  types: typesFor(p),
  generation: p.generation || generationForPokemon(p),
  region: p.region || regionForPokemon(p),
}));

// Tipos (español). Coincide con los tipos de Reloaded; claves internas en inglés.
export const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const typeTranslations = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

// Compatibilidad con código antiguo
export const getPokemonById = (id) =>
  pokemonData.find((p) => Number(p.id) === Number(id)) || null;
