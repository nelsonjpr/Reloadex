import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeFile } from './decodeReloaded.mjs';

// Traducción ID -> línea de texto exacta que usa el juego.
// Fuente: GML extraído del EXE (`scripts/extractGameScripts.py`):
//   GetOrdenDex, GetOrdenDexEspecial y NumeroPokemonEspecial.
// `Dex_Info`, `Dex_especie`, `Dex_altura` y `Dex_peso` hacen:
//   PK = ex(7788, id); si PK = 0 o PK > 945, PK = ex(7789, id);
//   y leen la línea PK (1-based) del DLL correspondiente.
// Esto evita las correlaciones por nombre/ID que asignaban descripciones
// ajenas (por ejemplo, la de Groudon a Marowak de Alola).

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_DIR = path.join(HERE, 'game-scripts');
const TEXT_DIR = 'D:/Juegos/Reloaded/data/text';

const readScript = (name) => fs.readFileSync(path.join(SCRIPT_DIR, `${name}.gml.txt`), 'utf8');
const normalSrc = readScript('GetOrdenDex');
const specialSrc = readScript('GetOrdenDexEspecial');
const numeroSrc = readScript('NumeroPokemonEspecial');

const gameInfo = decodeFile(`${TEXT_DIR}/es/dex_info.dll`).map((s) => String(s || '').trim());
const gameSpecies = decodeFile(`${TEXT_DIR}/es/dex_espec.dll`).map((s) => String(s || '').trim());
const gameHeights = decodeFile(`${TEXT_DIR}/zz/dex_height_m.dll`).map((s) => String(s || '').trim());
const gameWeights = decodeFile(`${TEXT_DIR}/zz/dex_weight_kg.dll`).map((s) => String(s || '').trim());

const readBalanced = (text, start) => {
  let depth = 0;
  for (let j = start; j < text.length; j++) {
    if (text[j] === '(') depth++;
    else if (text[j] === ')') {
      depth--;
      if (depth === 0) return { inner: text.slice(start + 1, j), end: j + 1 };
    }
  }
  return { inner: text.slice(start + 1), end: text.length };
};
// Las condiciones tienen paréntesis anidados, p. ej.
// `if(argument0=891 || (argument0>=893 && argument0<=897))return(25);`
// Por eso se balancea cada bloque en vez de usar una regex simple.
const parseStatements = (text) => {
  const out = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith('if(', i)) {
      const cond = readBalanced(text, i + 2);
      let j = cond.end;
      while (/\s/.test(text[j] || '')) j++;
      if (text.startsWith('return(', j)) {
        const expr = readBalanced(text, j + 6);
        out.push({ cond: cond.inner, expr: expr.inner });
        i = expr.end + 1;
        continue;
      }
    }
    if (text.startsWith('return(', i)) {
      const expr = readBalanced(text, i + 6);
      out.push({ cond: 'true', expr: expr.inner });
      i = expr.end + 1;
      continue;
    }
    i++;
  }
  return out;
};

const CMP = /^argument0\s*(>=|<=|>|<|=)\s*(-?\d+)$/;
const testCond = (cond, id) => cond === 'true' || cond.replace(/[()]/g, '').split('||').some((alt) => alt.split('&&').every((part) => {
  const m = part.trim().match(CMP);
  if (!m) return false;
  const v = Number(m[2]);
  if (m[1] === '=') return id === v;
  if (m[1] === '>') return id > v;
  if (m[1] === '<') return id < v;
  if (m[1] === '>=') return id >= v;
  if (m[1] === '<=') return id <= v;
  return false;
}));

const evalExpr = (expr, id, special, normal) => {
  const e = expr.trim();
  let m = e.match(/^ex\(7788,(.+)\)$/);
  if (m) return normal ? normal(evalExpr(m[1], id, special, normal)) : 0;
  m = e.match(/^ex\(8811,(.+)\)$/);
  if (m) return special(evalExpr(m[1], id, special, normal));
  m = e.match(/^argument0(?:([+-])(\d+))?$/);
  if (m) return m[1] === '-' ? id - Number(m[2]) : m[1] === '+' ? id + Number(m[2]) : id;
  if (/^\(?-?\d+\)?$/.test(e)) return Number(e.replace(/[()]/g, ''));
  return 0;
};

const run = (text, id, special = null, normal = null) => {
  for (const st of parseStatements(text)) {
    if (testCond(st.cond, id)) return evalExpr(st.expr, id, special, normal);
  }
  return 0;
};

const numeroPokemonEspecial = (id) => {
  if (!Number.isFinite(id) || id <= 0 || id > 500000) return 0;
  if (id > 200000) return numeroPokemonEspecial(id - 200000);
  if (id > 150000) return numeroPokemonEspecial(id - 150000);
  if (id > 100000) return numeroPokemonEspecial(id - 100000);
  if (id > 1000 && id <= 2000) return numeroPokemonEspecial(id - 1000);
  if (id > 3000 && id <= 4000) return numeroPokemonEspecial(id - 1000);
  return run(numeroSrc, id, numeroPokemonEspecial);
};
const getOrdenDex = (id) => run(normalSrc, id);
const getOrdenDexEspecial = (id) => run(specialSrc, id, numeroPokemonEspecial, getOrdenDex);

export const dexLineForId = (id) => {
  // El juego ignora GetOrdenDex cuando devuelve 0 o más de 945.
  let pk = getOrdenDex(Number(id));
  if (!(pk > 0 && pk <= 945)) pk = getOrdenDexEspecial(Number(id));
  return pk > 0 && pk <= gameInfo.length ? pk : null;
};

const measurement = (s) => {
  if (!s) return null;
  const m = String(s).match(/([\d.,]+)\s*(m|kg|lb|ft)/i);
  return m ? Number(m[1].replace(',', '.')) : null;
};

export const dexTextForId = (id) => {
  const line = dexLineForId(id);
  if (!line) return { line: null, description: null, species: null, height: null, weight: null };
  return {
    line,
    description: gameInfo[line - 1] || null,
    species: gameSpecies[line - 1] || null,
    height: measurement(gameHeights[line - 1]),
    weight: measurement(gameWeights[line - 1]),
  };
};

export const dexTextCounts = () => ({
  info: gameInfo.length,
  species: gameSpecies.length,
  heights: gameHeights.length,
  weights: gameWeights.length,
});
