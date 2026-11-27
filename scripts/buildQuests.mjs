// Genera el catálogo de misiones de Pokémon Reloaded desde la fuente real:
//  - txt_quests.dll (textos en español del juego)
//  - GML incrustado en el EXE: TituloMision, DescribeMision, ResolucionMision,
//    ObjetivosMision y TipoMision (extraídos con extractGameScripts.py).
// Regenerar con: node scripts/buildQuests.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SCRIPTS = path.join(HERE, 'game-scripts');
const TEXTS = 'D:/Juegos/Reloaded/data/text/es/txt_quests.dll';

const readGml = (name) => fs.readFileSync(path.join(SCRIPTS, `${name}.gml.txt`), 'utf8');
const LINES = decodeFile(TEXTS);
const line = (n) => String(LINES[Number(n) - 1] || '').trim();

// Los textos del juego usan $par1$/$par2$/$par3$ para contadores y nombres que
// se resuelven en ejecución. En la ficha se deja una lectura en español claro.
const OVERRIDES = new Map([
  ['Vencer a Líder $par1$', 'Vencer al líder de gimnasio'],
  ['El Profesor Abedul va a repoblar una zona con $par1$ salvajes.', 'El Profesor Abedul va a repoblar una zona con Pokémon salvajes.'],
  ['Ahora es posible encontrar $par1$ salvajes en la Región Star.', 'Ahora es posible encontrar Pokémon salvajes en la Región Star.'],
  ['Entregar al profesor un $par1$', 'Entregar al profesor el Pokémon indicado'],
  ['Traer un $par1$', 'Traer el Pokémon indicado'],
  ['Capturar a $par1$', 'Capturar el Pokémon indicado'],
  ['Mostrar $par1$ a Gordon', 'Mostrar el Pokémon indicado a Gordon'],
  ['Obtener $par1$', 'Obtener el objeto indicado'],
  ['Vencer a $par1$', 'Vencer al adversario indicado'],
]);

const resolveText = (raw) => {
  let value = String(raw || '').trim();
  if (OVERRIDES.has(value)) return OVERRIDES.get(value);
  // Contadores: «Encontrar paquetes ($par1$/5)» -> «Encontrar paquetes (5)».
  value = value.replace(/\(\$par1\$\/(\d+)\)/g, '($1)');
  value = value.replace(/\s*\(\$par1\$\/\$par2\$\)/g, '');

  let noun = 'objetivo';
  if (/salvajes/i.test(value)) noun = 'Pokémon salvaje';
  else if (/l[ií]der/i.test(value)) noun = 'líder';
  else if (/entrenadores|motoristas|team skull|ultraentes|enemigos/i.test(value)) noun = 'adversario';
  else if (/f[oó]siles/i.test(value)) noun = 'fósil';
  else if (/captur|entregar|mostrar|traer/i.test(value)) noun = 'Pokémon indicado';
  else if (/obtener|cristales|c[eé]lulas|anillos|pendientes|vasijas|pergaminos| cetros/i.test(value)) noun = 'objeto indicado';
  return value.replace(/\$par[123]\$/g, noun);
};

// Cada `if(QST=n)` del GML devuelve el número de línea del DLL. Se toma la
// primera rama; las variantes dinámicas comparten el mismo texto base.
function parseTextScript(name) {
  const src = readGml(name);
  const marks = [...src.matchAll(/if\(QST=(\d+)\)/g)];
  const result = new Map();
  marks.forEach((mark, index) => {
    const id = Number(mark[1]);
    if (result.has(id)) return;
    const end = index + 1 < marks.length ? marks[index + 1].index : src.length;
    const block = src.slice(mark.index + mark[0].length, end);
    const call = /ex\(9881,(\d+)\)/.exec(block);
    result.set(id, call ? resolveText(line(Number(call[1]))) : '');
  });
  return result;
}

const titles = parseTextScript('TituloMision');
const descriptions = parseTextScript('DescribeMision');
const resolutions = parseTextScript('ResolucionMision');

// Objetivos: `ObjetivosMision(QST, 0)` da el número de entradas, los índices
// positivos dan el texto y los negativos el tipo (1 normal, 2 opcional,
// 3 restricción). Algunas entradas tienen ramas anidadas; por eso se lee todo
// el bloque hasta el siguiente `if(OBJ=n)` y se toma la primera línea del DLL.
const goalsSrc = readGml('ObjetivosMision');
const splitAt = goalsSrc.indexOf('if(OBJ<0 && OBJ>=-(12))');
const positiveSrc = goalsSrc.slice(0, splitAt);
const negativeSrc = goalsSrc.slice(splitAt);
const countsSrc = positiveSrc.slice(
  positiveSrc.indexOf('if(OBJ=0){'),
  positiveSrc.indexOf('if(QST=1){', positiveSrc.indexOf('if(OBJ=0){')),
);
const counts = new Map(
  [...countsSrc.matchAll(/if\(QST=(\d+)\)return\((\d+)\)/g)]
    .map((match) => [Number(match[1]), Number(match[2])]),
);

function parseGoals(section) {
  const result = new Map();
  const marks = [...section.matchAll(/if\(QST=(\d+)\)\{/g)];
  marks.forEach((mark, index) => {
    const id = Number(mark[1]);
    if (result.has(id)) return;
    const end = index + 1 < marks.length ? marks[index + 1].index : section.length;
    const block = section.slice(mark.index + mark[0].length, end);
    const entries = new Map();
    const objMarks = [...block.matchAll(/if\(OBJ=(\d+)\)/g)];
    objMarks.forEach((objMark, objIndex) => {
      const objEnd = objIndex + 1 < objMarks.length ? objMarks[objIndex + 1].index : block.length;
      const chunk = block.slice(objMark.index + objMark[0].length, objEnd);
      const call = /ex\(9881,(\d+)\)/.exec(chunk);
      const value = /return\(\((\d+)\)\)/.exec(chunk);
      entries.set(Number(objMark[1]), call ? resolveText(line(Number(call[1]))) : value ? Number(value[1]) : null);
    });
    result.set(id, entries);
  });
  return result;
}

const goalTexts = parseGoals(positiveSrc);
const goalTypes = parseGoals(negativeSrc);
const KIND = { 1: 'objetivo', 2: 'opcional', 3: 'restriccion' };
const GROUPS = [
  { key: 'principales', label: 'Historia principal', prefix: 'Q' },
  { key: 'elite', label: 'Escuadrón Élite', prefix: 'E' },
  { key: 'frente', label: 'Retos del Frente', prefix: 'F' },
];

const groupFor = (id) => {
  if (id < 100) return { ...GROUPS[0], number: id };
  if (id < 2000) return { ...GROUPS[1], number: id - 1000 };
  return { ...GROUPS[2], number: id - 3000 };
};
const pad = (n) => String(n).padStart(3, '0');

const stats = { total: 0, principales: 0, elite: 0, frente: 0, objetivos: 0, opcionales: 0, restricciones: 0 };
const quests = [...titles.keys()].sort((a, b) => a - b).map((id) => {
  const group = groupFor(id);
  const totalGoals = counts.get(id) || 0;
  const goals = [];
  for (let index = 1; index <= totalGoals; index += 1) {
    const text = goalTexts.get(id)?.get(index);
    const kind = KIND[goalTypes.get(id)?.get(index)] || 'objetivo';
    if (!text) continue;
    goals.push({ text, kind });
    if (kind === 'opcional') stats.opcionales += 1;
    else if (kind === 'restriccion') stats.restricciones += 1;
    else stats.objetivos += 1;
  }
  stats.total += 1;
  stats[group.key === 'principales' ? 'principales' : group.key] += 1;
  return {
    id: `${group.prefix}${pad(group.number)}`,
    gameId: id,
    group: group.key,
    groupLabel: group.label,
    title: titles.get(id) || '',
    description: descriptions.get(id) || '',
    objectives: goals,
    resolution: resolutions.get(id) || '',
  };
});

const result = {
  version: 1,
  source: 'txt_quests.dll + GML del juego (TituloMision, DescribeMision, ObjetivosMision, ResolucionMision)',
  stats,
  groups: GROUPS,
  quests,
};

const outFile = path.join(ROOT, 'src/data/quests.json');
fs.writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);
console.log('[Reloadex] misiones generadas:', outFile);
console.log(stats);
for (const name of ['Caso Gripherial', 'Repoblación Inicial', 'Cafetería Primera Línea']) {
  const q = quests.find((candidate) => candidate.title === name);
  if (q) console.log(`  ${q.id} ${q.title}: ${q.objectives.length} pasos`);
}
