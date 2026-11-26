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

// grito. Los gritos pueden ir con relleno (001.wav) o sin él (1.wav); megas -> base.
export const cryUrl = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n)) return null;
  return `/cries/${n}.wav`;
};

export const cryFallbacks = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n)) return [];
  const padded = `/cries/${String(n).padStart(3, '0')}.wav`;
  const out = [padded];
  if (n >= 100000) { out.push(cryUrl(baseFormId(n)), `/cries/${String(baseFormId(n)).padStart(3, '0')}.wav`); }
  return out;
};

export const typeColor = (type) => typeColors[type] || '#777777';
export const typeName = (type) => typeTranslations[type] || type || '?';

// stats siempre presentes (defensivo)
export const EMPTY_STATS = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
export const safeStats = (p) => ({ ...EMPTY_STATS, ...(p?.stats || {}) });
