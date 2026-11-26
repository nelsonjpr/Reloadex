import fs from 'node:fs';
const base = 'D:/Juegos/Reloaded/data/text/es';
const b = fs.readFileSync(`${base}/dex_info.dll`);
const freq = new Map();
for (const x of b) freq.set(x, (freq.get(x) || 0) + 1);
const top = [...freq].sort((a, b) => b[1] - a[1]).slice(0, 25)
  .map(([x, n]) => `${x.toString(16).padStart(2, '0')} '${x >= 32 && x < 127 ? String.fromCharCode(x) : '.'}' ${n}`);
console.log('frecuencias dex_info:', top.join(' | '));

const a = fs.readFileSync(`${base}/txt_abilities.dll`);
const fa = new Map();
for (const x of a) fa.set(x, (fa.get(x) || 0) + 1);
console.log('frecuencias habilidades:', [...fa].sort((x, y) => y[1] - x[1]).slice(0, 20)
  .map(([x, n]) => `${x.toString(16).padStart(2, '0')}'${x >= 32 && x < 127 ? String.fromCharCode(x) : '.'}':${n}`).join(' '));

// intentar mapeo por frecuencia: espacio, e, a, o, s, l, n, t, r, i, d, c, u, m, p, b, y, v, g, f, h, q, j, z, ñ
const plainOrder = [' ', 'e', 'a', 'o', 's', 'l', 'n', 't', 'r', 'i', 'd', 'c', 'u', 'm', 'p', 'b', 'y', 'v', 'g', 'f', 'h', 'q', 'j', 'z', 'ñ'];
const encOrder = [...freq].filter(([x]) => x !== 10 && x !== 13).sort((x, y) => y[1] - x[1]).map(([x]) => x);
const map = new Map();
encOrder.forEach((e, i) => { if (i < plainOrder.length) map.set(e, plainOrder[i]); });
let decoded = '';
for (let i = 0; i < 600; i++) {
  const x = b[i];
  decoded += x === 10 ? '\n' : (map.get(x) ?? '?');
}
console.log('\n--- decoding por frecuencia ---\n' + decoded);

// buscar patrones de cifrado César simple considerando solo letras ASCII
for (let k = 1; k < 26; k++) {
  let out = '';
  for (let i = 0; i < 100; i++) {
    const x = b[i];
    if (x >= 65 && x <= 90) out += String.fromCharCode(((x - 65 - k + 26) % 26) + 65);
    else if (x >= 97 && x <= 122) out += String.fromCharCode(((x - 97 - k + 26) % 26) + 97);
    else out += String.fromCharCode(x);
  }
  const score = (out.match(/[a-zA-Z ]/g) || []).length;
  if (/[a-zA-Z]{6}/.test(out)) console.log('rot', k, JSON.stringify(out.slice(0, 70)));
}
