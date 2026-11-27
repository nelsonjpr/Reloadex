// Genera la lista de objetos que el juego permite equipar a un Pokémon,
// aplicando las mismas reglas que el script GML ObjetoPosibleAsignar.
// Regenerar con: node scripts/buildEquippableItems.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(
  path.join(ROOT, 'scripts/game-scripts-extra/ObjetoPosibleAsignar.gml.txt'),
  'utf8',
);

// Traduce las condiciones GML a JavaScript (solo se usan comparaciones y &&/||).
const toJs = (condition) => condition
  .replace(/argument0/g, 'ID')
  .replace(/<>/g, '!=')
  .replace(/(?<![<>!=])=(?!=)/g, '===');

const rules = [];
let pos = 0;
while (pos < source.length) {
  const start = source.indexOf('if(', pos);
  if (start < 0) break;
  let depth = 0;
  let end = start + 2;
  for (; end < source.length; end += 1) {
    if (source[end] === '(') depth += 1;
    else if (source[end] === ')' && --depth === 0) break;
  }
  const condition = source.slice(start + 3, end);
  let body = end + 1;
  while (/\s/.test(source[body] || '')) body += 1;
  const value = source.slice(body).match(/^return\((true|false)\)/);
  // eslint-disable-next-line no-new-func
  rules.push({ test: new Function('ID', `return (${toJs(condition)});`), value: value?.[1] === 'true' });
  pos = body + (value?.[0].length || 0);
}

// En GML cada regla hace "return", así que gana la primera que coincide.
const canEquip = (id) => {
  for (const rule of rules) if (rule.test(id)) return rule.value;
  return false;
};

const objectData = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/objectLocations.json'), 'utf8'));
const items = objectData.items
  .filter((item) => canEquip(item.id))
  .map((item) => ({ id: item.id, name: item.name, category: item.category || 'Objeto' }));

const outFile = path.join(ROOT, 'src/data/equippableItems.json');
fs.writeFileSync(outFile, `${JSON.stringify({ version: 1, source: 'GML ObjetoPosibleAsignar', count: items.length, items }, null, 2)}\n`);
console.log('[Reloadex] objetos equipables:', outFile, `(${items.length})`);
console.log(items.slice(0, 12).map((item) => `${item.id} ${item.name}`).join(' | '));
