// Cálculo de estadísticas por nivel usando las fórmulas REALES de Pokémon
// Reloaded, extraídas del GML del juego (scripts/game-scripts-extra):
//   PSPokemon / ATPokemon / DEFPokemon / ATSpPokemon / DEFSpPokemon / ShowStatVel
// El juego usa dígitos IV 0-9 y un dígito de naturaleza 0-9. Para un Pokémon
// "base" de la Pokédex se toma IV 9 (máximo) y naturaleza 5 (neutral).
export const STAT_KEYS = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];

export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  spAttack: 'At. Esp.',
  spDefense: 'Def. Esp.',
  speed: 'Velocidad',
};

const IV = 9;
const NATURE = 5;

const clampLevel = (level) => {
  const n = Number(level);
  if (!Number.isFinite(n)) return 50;
  return Math.min(100, Math.max(1, Math.round(n)));
};

const gameStat = (base, level, isHp) => {
  const nv = clampLevel(level);
  if (isHp) {
    let ps = 10 + (nv / 100) * (2 * base + ((NATURE - 1) * 31) / 9 + (IV * 63) / 9 + 100);
    if (nv > 100) ps += (nv - 100) * ps * 0.2;
    return Math.floor(ps);
  }
  const value = (0.9 + ((NATURE - 1 + IV) / 90))
    * (5 + (nv / 100) * (base * 2 + (IV * 31) / 9 + ((NATURE - 1) * 63) / 9));
  return Math.floor(value);
};

export const calculateStats = (pokemon, level = 50) => {
  const base = pokemon?.stats || {};
  const out = {};
  for (const key of STAT_KEYS) {
    out[key] = gameStat(Number(base[key]) || 0, level, key === 'hp');
  }
  return out;
};

export const statsTotal = (stats) => STAT_KEYS.reduce(
  (sum, key) => sum + (Number(stats?.[key]) || 0),
  0,
);
