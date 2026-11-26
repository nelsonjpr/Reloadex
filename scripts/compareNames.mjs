import fs from 'node:fs';
import { decodeFile } from './decodeReloaded.mjs';
const names = decodeFile('D:/Juegos/Reloaded/data/text/es/txt_pkmn.dll');
const data = JSON.parse(fs.readFileSync('D:/Trabajo/Reloadex/src/data/reloadex.json','utf8'));
const norm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
let mismatches = [];
for (let id=1; id<=1000; id++) {
  const game = names[id-1];
  const entry = data.find(p=>Number(p.id)===id);
  if (!game || !entry) { mismatches.push([id, game, entry?.name]); continue; }
  if (norm(game) !== norm(entry.name)) mismatches.push([id, game, entry.name]);
}
console.log('mismatches', mismatches.length, 'de 1000');
console.log(mismatches.slice(0,80).map(x=>x.join(' | ')).join('\n'));
console.log('... últimos 20:');
console.log(mismatches.slice(-20).map(x=>x.join(' | ')).join('\n'));
console.log('\nnames[995..1005]:', names.slice(995,1006).map((n,i)=>`${996+i}: ${n}`).join(' | '));
