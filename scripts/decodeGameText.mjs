import fs from 'node:fs';

const base = 'D:/Juegos/Reloaded/data/text';
// mapeo inicial por frecuencia (dex_info)
const plainOrder = [' ', 'e', 'a', 'o', 's', 'l', 'n', 't', 'r', 'i', 'd', 'c', 'u', 'm', 'p', 'b', 'y', 'v', 'g', 'f', 'h', 'q', 'j', 'z', 'ñ'];
const freq = new Map();
for (const x of fs.readFileSync(`${base}/es/dex_info.dll`)) freq.set(x, (freq.get(x) || 0) + 1);
const encOrder = [...freq].filter(([x]) => x !== 10 && x !== 13).sort((x, y) => y[1] - x[1]).map(([x]) => x);
const map = new Map();
encOrder.forEach((e, i) => { if (i < plainOrder.length) map.set(e, plainOrder[i]); });

function decode(file, n = 400) {
  const b = fs.readFileSync(file);
  let out = '';
  for (let i = 0; i < Math.min(n, b.length); i++) {
    const x = b[i];
    out += x === 13 ? '' : (x === 10 ? '\n' : (map.get(x) ?? `{${x.toString(16)}}`));
  }
  return out;
}

for (const rel of ['es/txt_pkmn.dll', 'es/txt_abilities.dll', 'zz/dex_height_m.dll', 'zz/dex_weight_kg.dll', 'es/dex_info.dll']) {
  console.log(`===== ${rel}`);
  console.log(decode(`${base}/${rel}`, rel.startsWith('es/dex') ? 1200 : 600));
}
