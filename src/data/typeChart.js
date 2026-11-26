// =============================================================
// Tabla de efectividad de tipos (daño recibido)
// CHART[atacante][defensor]. Moderna, con Hada y Acero.
// =============================================================
export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
  'steel', 'fairy',
];

const CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, dragon: 0.5, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, grass: 2, ice: 2, fighting: 2, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, dragon: 0.5, dark: 0.5, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

// Devuelve el multiplicador con el que cada tipo ATACANTE daña al Pokémon.
export function effectivenessFor(defendingTypes) {
  const defense = (Array.isArray(defendingTypes) && defendingTypes.length ? defendingTypes : ['normal'])
    .map((t) => String(t).toLowerCase());
  const out = {};
  for (const attacker of ALL_TYPES) {
    let multiplier = 1;
    for (const defender of defense) multiplier *= CHART[attacker]?.[defender] ?? 1;
    out[attacker] = multiplier;
  }
  return out;
}

// Agrupa debilidades (>1) y fortalezas (<1), de mayor a menor impacto.
export function effectivenessGroups(defendingTypes) {
  const entries = Object.entries(effectivenessFor(defendingTypes))
    .filter(([, multiplier]) => multiplier !== 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
  return {
    weaknesses: entries.filter(([, m]) => m > 1),
    resistances: entries.filter(([, m]) => m < 1),
  };
}

export const formatMultiplier = (m) => `x${Number.isInteger(m) ? m : String(m)}`;
