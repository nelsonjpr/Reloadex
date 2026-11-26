import fs from 'node:fs';
import { decodeFile } from './decodeReloaded.mjs';
const base = 'D:/Juegos/Reloaded/data/text';
const names = decodeFile(`${base}/es/txt_pkmn.dll`);
const info = decodeFile(`${base}/es/dex_info.dll`);
const spec = decodeFile(`${base}/es/dex_espec.dll`);
const h = decodeFile(`${base}/zz/dex_height_m.dll`);
const w = decodeFile(`${base}/zz/dex_weight_kg.dll`);
console.log('conteos', {names:names.length, info:info.length, spec:spec.length, h:h.length, w:w.length});
for (const i of [0,5,6,999,1000,1001,1005,1050,1200,1237,1238,1300,1500,1556]) {
  console.log(i+1, 'name=', JSON.stringify(names[i]), '| info=', JSON.stringify((info[i]||'').slice(0,80)), '| h=', h[i], '| w=', w[i]);
}
console.log('\nnombres que contienen Mega/Gigamax:');
names.forEach((n,i)=>{ if(/mega|gigamax/i.test(n)) console.log(i+1, n); });
console.log('\núltimos 25 nombres:');
names.slice(-25).forEach((n,i)=>console.log(names.length-25+i+1, n));
