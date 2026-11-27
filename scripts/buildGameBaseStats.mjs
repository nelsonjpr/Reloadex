// Extrae las stats base REALES de Pokémon Reloaded desde los scripts GML
// embebidos en el EXE: StatPSPokemon, StatATPokemon, StatDEFPokemon,
// StatATSpPokemon, StatDEFSpPokemon y StatVELPokemon.
// Regenerar con: node scripts/buildGameBaseStats.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS = path.join(ROOT, 'scripts/game-scripts-extra');
const STAT_SCRIPTS = {
  hp: 'StatPSPokemon',
  attack: 'StatATPokemon',
  defense: 'StatDEFPokemon',
  spAttack: 'StatATSpPokemon',
  spDefense: 'StatDEFSpPokemon',
  speed: 'StatVELPokemon',
};

const compileCondition = (cond) => {
  const js = cond
    .replace(/argument0/g, 'ID')
    .replace(/<>/g, '!=')
    // En GML "=" es igualdad; respeta >=, <=, != y ==.
    .replace(/(?<![<>!=])=(?!=)/g, '===');
  // eslint-disable-next-line no-new-func
  return new Function('ID', `return (${js});`);
};

const parseScript = (name) => {
  const src = fs.readFileSync(path.join(SCRIPTS, `${name}.gml.txt`), 'utf8');
  const rules = [];
  let pos = 0;
  while (pos < src.length) {
    const ifIndex = src.indexOf('if(', pos);
    if (ifIndex < 0) break;
    let depth = 0;
    let end = ifIndex + 2;
    for (; end < src.length; end += 1) {
      if (src[end] === '(') depth += 1;
      else if (src[end] === ')' && --depth === 0) break;
    }
    const condition = src.slice(ifIndex + 3, end);
    let body = end + 1;
    while (/\s/.test(src[body] || '')) body += 1;
    const assignment = src.slice(body).match(/^(base|argument0)=(-?\d+)/);
    if (assignment) {
      rules.push({
        type: assignment[1] === 'base' ? 'base' : 'alias',
        test: compileCondition(condition),
        value: Number(assignment[2]),
      });
      pos = body + assignment[0].length;
    } else {
      pos = end + 1;
    }
  }
  return rules;
};

const rules = Object.fromEntries(
  Object.entries(STAT_SCRIPTS).map(([key, name]) => [key, parseScript(name)]),
);

const baseFor = (key, id) => {
  let current = id;
  let base = -1;
  for (const rule of rules[key]) {
    if (!rule.test(current)) continue;
    if (rule.type === 'alias') current = rule.value;
    if (rule.type === 'base') base = rule.value;
  }
  return base;
};

const reloadex = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/reloadex.json'), 'utf8'));
const pokemon = Array.isArray(reloadex) ? reloadex : (reloadex.pokemon || reloadex.data || []);
const ids = [...new Set([
  ...pokemon.map((p) => Number(p.id)),
  ...Array.from({ length: 1000 }, (_, i) => i + 1),
])].filter((id) => Number.isFinite(id) && id > 0).sort((a, b) => a - b);

const stats = {};
for (const id of ids) {
  const entry = {};
  let complete = true;
  for (const key of Object.keys(STAT_SCRIPTS)) {
    const value = baseFor(key, id);
    if (value < 0) complete = false;
    entry[key] = value;
  }
  if (complete) stats[id] = entry;
}

const outFile = path.join(ROOT, 'src/data/gameBaseStats.json');
fs.writeFileSync(outFile, `${JSON.stringify({ version: 1, source: 'GML Stat*Pokemon scripts', stats })}\n`);
console.log('[Reloadex] stats base del juego extraídas:', outFile);
console.log('IDs completos:', Object.keys(stats).length, 'de', ids.length);
for (const id of [1, 6, 25, 150, 809, 1000]) {
  if (stats[id]) console.log(id, JSON.stringify(stats[id]));
}
