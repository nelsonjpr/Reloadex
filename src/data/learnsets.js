// Learnsets reales extraídos del gamedata de Pokémon Reloaded.
// Generado por scripts/buildLearnsets.mjs. Se importa bajo demanda en la ficha.
import raw from './learnsets.json';

export const learnsets = raw.byPokemon;
export const moveName = (id) => raw.moves[Number(id) - 1] || `Ataque ${id}`;
export const moveDescription = (id) => raw.moveDesc[Number(id) - 1] || '';
export const moveItemName = (id) => raw.items[Number(id)] || `Objeto ${id}`;
export const tutorName = (index) => raw.tutors[Number(index) - 1]?.name || '';
export const learnsetMethods = [
  { key: 'level', label: 'Por nivel', short: 'Nivel' },
  { key: 'tm', label: 'MT / MO', short: 'MT/MO' },
  { key: 'tutor', label: 'Tutores', short: 'Tutor' },
  { key: 'dt', label: 'Discos técnicos', short: 'DT' },
  { key: 'egg', label: 'Movimientos huevo', short: 'Huevo' },
];

// Las formas y megas comparten learnset con su base; el juego usa el ID base en
// sus tablas interiores (ex(9888, PK, ...)).
export function pokemonLearnsetIds(pokemon) {
  const id = Number(pokemon?.id);
  const base = Number(pokemon?.baseForm);
  const ids = [];
  if (Number.isFinite(id) && learnsets[id]) ids.push(id);
  if (Number.isFinite(base) && base !== id && learnsets[base]) ids.push(base);
  const normalized = id > 200000 ? id - 200000 : id > 100000 ? id - 100000 : id;
  if (Number.isFinite(normalized) && normalized !== id && learnsets[normalized]) ids.push(normalized);
  return [...new Set(ids)];
}

export function getLearnset(pokemon) {
  const ids = pokemonLearnsetIds(pokemon);
  if (!ids.length) return null;
  const result = { level: [], tm: [], tutor: [], dt: [], egg: [], ids };
  for (const id of ids) {
    const source = learnsets[id];
    for (const key of ['level', 'tm', 'tutor', 'dt', 'egg']) {
      result[key].push(...(source[key] || []));
    }
  }
  const seen = { level: new Set(), tm: new Set(), tutor: new Set(), dt: new Set(), egg: new Set() };
  for (const key of ['level', 'tm', 'tutor', 'dt', 'egg']) {
    result[key] = result[key].filter((entry) => {
      const signature = JSON.stringify(entry);
      if (seen[key].has(signature)) return false;
      seen[key].add(signature);
      return true;
    });
  }
  result.level.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  result.tm.sort((a, b) => a[1] - b[1]);
  result.tutor.sort((a, b) => (a[1] ?? 999) - (b[1] ?? 999));
  result.dt.sort((a, b) => a[0] - b[0]);
  result.egg.sort((a, b) => a[0] - b[0]);
  return result;
}
