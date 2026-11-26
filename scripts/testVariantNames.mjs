import fs from 'node:fs';
import { decodeFile } from './decodeReloaded.mjs';
const names = decodeFile('D:/Juegos/Reloaded/data/text/es/txt_pkmn.dll');
const data = JSON.parse(fs.readFileSync('D:/Trabajo/Reloadex/src/data/reloadex.json','utf8'));
const gameNameForId = (id) => id <= 1000 ? names[id-1] : id >= 2001 && id <= 2425 ? names[id-1001] : null;
const norm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const megaNames = names.filter(n => /^mega /i.test(n));
const gigaNames = names.filter(n => /gigamax/i.test(n));
let mapped=0, unmapped=[];
for (const p of data.filter(p=>Number(p.id)>=100000)) {
  const id=Number(p.id), base=id>=200000?id-200000:id>=150000?id-150000:id-100000;
  const bn=gameNameForId(base);
  if (!bn) { unmapped.push([id,base,'sin nombre base']); continue; }
  const nb=norm(bn);
  const candidates = (id>=200000?gigaNames:megaNames).filter(n=>norm(n).includes(nb));
  let pick=null;
  if (candidates.length) {
    pick = id>=150000 && id<200000 ? (candidates[1]||candidates[0]) : candidates[0];
  }
  if (pick) { mapped++; console.log(id,'<-',pick,'(base',bn+')'); }
  else unmapped.push([id,base,bn]);
}
console.log('mapeadas',mapped,'sin mapear',unmapped.length);
console.log(unmapped.slice(0,80).map(x=>x.join(' | ')).join('\n'));
