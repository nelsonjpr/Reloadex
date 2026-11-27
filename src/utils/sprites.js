// =============================================================
// Helpers de sprites / gritos / IDs (Pokémon Reloaded)
// Los sprites del juego son GIF con nombre = ID sin rellenar: 1.gif, 100003.gif
// =============================================================
import { typeColors, typeTranslations } from '../data/pokemon';

export const formatId = (id) => {
  const n = Number(id);
  return Number.isFinite(n) ? `#${String(n).padStart(4, '0')}` : `#${id}`;
};

// base de una forma mega/variante (100003 -> 3 ; 150003 -> 3 ; 200006 -> 6)
export const baseFormId = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n) || n < 100000) return n;
  const offset = n >= 200000 ? 200000 : n >= 150000 ? 150000 : 100000;
  return n - offset;
};

// ruta de sprite. En Reloaded el shiny se guarda como 1000+ID (1 -> 1001).
export const spriteUrl = (id, shiny = false, shinyFile = null) => {
  const n = Number(id);
  if (shiny && shinyFile) return `/sprites/shiny/${shinyFile}`;
  const file = Number.isFinite(n) ? `${n}.gif` : `${id}.gif`;
  return `/sprites/${shiny ? 'shiny' : 'normal'}/${file}`;
};

// fallbacks para <img onError>
export const spriteFallbacks = (id, shiny = false, shinyFile = null) => {
  const n = Number(id);
  const list = [];
  if (shiny) {
    if (!shinyFile && Number.isFinite(n)) list.push(`/sprites/shiny/${1000 + n}.gif`);
    list.push(spriteUrl(id, false));
  }
  if (Number.isFinite(n) && n >= 100000) list.push(spriteUrl(baseFormId(id), shiny));
  return list;
};

// grito. MP3 mono empaquetado: los nombres pueden ir con relleno (001.mp3) o sin él (1.mp3); megas -> base.
export const cryUrl = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n)) return null;
  return `/cries/${n}.mp3`;
};

export const cryFallbacks = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n)) return [];
  const padded = `/cries/${String(n).padStart(3, '0')}.mp3`;
  const out = [padded];
  if (n >= 100000) { out.push(cryUrl(baseFormId(n)), `/cries/${String(baseFormId(n)).padStart(3, '0')}.wav`); }
  return out;
};

// Iconos originales extraídos del gamedata de Pokémon Reloaded (spr_gotype /
// spr_gobigtype). El nombre de archivo conserva el orden real del juego.
const TYPE_ICON_FILE = {
  normal: '01_normal',
  fire: '02_fuego',
  water: '03_agua',
  grass: '04_planta',
  electric: '05_electrico',
  rock: '06_roca',
  fighting: '07_lucha',
  ground: '08_tierra',
  psychic: '09_psiquico',
  poison: '10_veneno',
  bug: '11_bicho',
  ice: '12_hielo',
  dark: '13_siniestro',
  steel: '14_acero',
  flying: '15_volador',
  ghost: '16_fantasma',
  dragon: '17_dragon',
  fairy: '18_hada',
};

export const typeIcon = (type, big = false) => {
  const file = TYPE_ICON_FILE[type];
  return file ? `/icons/types/${big ? 'big' : 'small'}_${file}.png` : null;
};

// Iconos vectoriales 512x512 en blanco puro, usados en el filtro de tipos.
export const typeIconHd = (type) => (
  TYPE_ICON_FILE[type] ? `/icons/types/hd/${type}.svg` : null
);

export const typeColor = (type) => typeColors[type] || '#777777';
export const typeName = (type) => typeTranslations[type] || type || '?';

// stats siempre presentes (defensivo)
export const EMPTY_STATS = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
export const safeStats = (p) => ({ ...EMPTY_STATS, ...(p?.stats || {}) });
