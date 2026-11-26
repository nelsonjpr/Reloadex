import fs from 'node:fs';
const base = 'D:/Juegos/Reloaded/data/text';
const lines = (f) => fs.readFileSync(f, 'latin1').split(/\r?\n/);
const names = lines(`${base}/es/txt_pkmn.dll`).slice(0, 40);
console.log('líneas txt_pkmn (hex):');
names.slice(0, 15).forEach((l, i) => console.log(i + 1, JSON.stringify(l), [...l].map(c => c.charCodeAt(0).toString(16)).join(' ')));

const known = ['Bulbasaur','Ivysaur','Venusaur','Charmander','Charmeleon','Charizard','Squirtle','Wartortle','Blastoise','Caterpie','Metapod','Butterfree','Weedle','Kakuna','Beedrill','Pidgey','Pidgeotto','Pidgeot','Rattata','Raticate','Spearow','Fearow','Ekans','Arbok','Pikachu','Raichu','Sandshrew','Sandslash','Nidoran♀','Nidorina','Nidoqueen','Nidoran♂','Nidorino','Nidoking','Clefairy','Clefable','Vulpix','Ninetales','Jigglypuff','Wigglytuff'];
const map = new Map(); // encoded byte -> plain char
const conflicts = [];
for (let i = 0; i < Math.min(known.length, names.length); i++) {
  const enc = names[i], plain = known[i];
  if (enc.length !== plain.length) { conflicts.push(`longitud ${i+1}: enc=${enc.length} plain=${plain.length} ${JSON.stringify(enc)} vs ${plain}`); continue; }
  for (let j = 0; j < enc.length; j++) {
    const e = enc.charCodeAt(j), p = plain[j];
    if (map.has(e) && map.get(e) !== p) conflicts.push(`conflicto ${i+1}.${j}: enc ${e.toString(16)}='${enc[j]}' -> ${map.get(e)} vs ${p}`);
    else map.set(e, p);
  }
}
console.log('\nconflictos:', conflicts.slice(0, 30).join('\n') || 'NINGUNO');
console.log('mapa:', [...map].sort((a,b)=>a[0]-b[0]).map(([e,p])=>`${e.toString(16)}->${p}`).join(' '));

function decode(file, n = 1500) {
  const b = fs.readFileSync(file);
  let out = '';
  for (let i = 0; i < Math.min(n, b.length); i++) {
    const x = b[i];
    out += x === 13 ? '' : (x === 10 ? '\n' : (map.get(x) ?? `{${x.toString(16)}}`));
  }
  return out;
}
console.log('\n===== dex_info decoded');
console.log(decode(`${base}/es/dex_info.dll`, 1800));
console.log('\n===== txt_abilities decoded');
console.log(decode(`${base}/es/txt_abilities.dll`, 900));
console.log('\n===== dex_weight_kg decoded');
console.log(decode(`${base}/zz/dex_weight_kg.dll`, 500));
console.log('\n===== dex_height_m decoded');
console.log(decode(`${base}/zz/dex_height_m.dll`, 300));
