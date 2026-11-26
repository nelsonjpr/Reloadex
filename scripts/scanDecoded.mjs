import fs from 'node:fs';
import path from 'node:path';
const base = 'D:/Juegos/Reloaded/data/text';
const map = new Map(Object.entries({
  '21':'f','22':'b','24':'P','26':'y','28':'N','2a':'v','2b':'S','31':'n','33':'c','34':' ','36':'i','37':'p',
  '3b':'I','3d':'l','3e':'E','3f':'z','40':'A','41':'t','43':'x','44':'W','46':'k','47':'s','48':'J','49':'g',
  '4c':'C','4d':'r','52':'R','57':'o','59':'d','5a':'w','5c':'u','5d':'V','67':'M','69':'m','6a':'K','74':'F',
  '75':'e','76':'B','7a':'h','7b':'q','7d':'a','79':'H','73':'L','2f':'D','6c':'.',
}).map(([k,v])=>[parseInt(k,16),v]));
const ACUTE = [0x39,0x4f,0x7d,0x7c];
function decode(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i++) {
    if (i + 3 < buf.length && ACUTE.every((b, j) => buf[i + j] === b)) { out += 'á'; i += 3; continue; }
    const x = buf[i];
    if (x === 13) continue;
    if (x === 10) { out += '\n'; continue; }
    out += map.get(x) ?? `\u0001${x.toString(16)}\u0002`;
  }
  return out;
}
for (const lang of ['es', 'en', 'zz']) {
  const dir = path.join(base, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.dll'))) {
    const text = decode(fs.readFileSync(path.join(dir, f)));
    const unknown = [...new Set([...text.matchAll(/\u0001([0-9a-f]+)\u0002/g)].map(m => m[1]))];
    const hits = ['huevo','evol','crec','grupo','paso','nivel','mega','forma','tama','peso','tipo','habi'].filter(k => text.toLowerCase().includes(k));
    console.log(`${lang}/${f}: ${text.length} chars, desconocidos=${unknown.join(',') || '-'}, claves=${hits.join(',') || '-'}`);
  }
}
console.log('\n===== dex_espec decoded (primeros 3000)');
console.log(decode(fs.readFileSync(`${base}/es/dex_espec.dll`)).slice(0, 3000));
console.log('\n===== txt_pkmn decoded (primeros 30 líneas)');
console.log(decode(fs.readFileSync(`${base}/es/txt_pkmn.dll`)).split('\n').slice(0,30).join('\n'));
