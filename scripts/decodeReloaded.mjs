import fs from 'node:fs';

// Descifrador de los archivos de texto de Pokémon Reloaded.
// Sustitución monoalfabética fija; las vocales acentuadas van como 39 4F <vocal> 7C.
const SIMPLE = {
  '21':'f','22':'b','24':'P','26':'y','28':'N','2a':'v','2b':'S','31':'n','33':'c','34':' ','36':'i','37':'p',
  '3b':'I','3d':'l','3e':'E','3f':'z','40':'A','41':'t','43':'x','44':'W','46':'k','47':'s','48':'J','49':'g',
  '4c':'C','4d':'r','52':'R','57':'o','59':'d','5a':'w','5c':'u','5d':'V','67':'M','69':'m','6a':'K','74':'F',
  '75':'e','76':'B','7a':'h','7b':'q','7d':'a','79':'H','73':'L','2f':'D','6c':'.','5e':'j','3a':'T','56':'O',
  '55':'G','38':'C','6b':'U','68':'4','64':'0','77':'2','25':'6','51':'9','5f':'8','65':'7','4b':'1','4a':'.',
  '66':'3','4e':'5','3c':'-','27':',','2d':'?','20':'!','45':'Y','54':'D','23':'?','6d':'?','5b':'X','78':'-',
};
const VOWELS = { '7d':'á', '75':'é', '36':'í', '57':'ó', '5c':'ú', '31':'ñ' };
const map = new Map(Object.entries(SIMPLE).map(([k, v]) => [parseInt(k, 16), v]));

export function decodeReloaded(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i];
    if (x === 0x39 && buf[i + 1] === 0x4f && buf[i + 3] === 0x7c && VOWELS[buf[i + 2].toString(16)]) {
      out += VOWELS[buf[i + 2].toString(16)]; i += 3; continue;
    }
    if (x === 13) continue;
    if (x === 10) { out += '\n'; continue; }
    out += map.get(x) ?? `\u0001${x.toString(16)}\u0002`;
  }
  return out;
}

export function decodeFile(file) {
  return decodeReloaded(fs.readFileSync(file)).split('\n').filter((l, i, a) => l !== '' || i < a.length - 1);
}

if (process.argv[1] && process.argv[1].endsWith('decodeReloaded.mjs')) {
  const base = 'D:/Juegos/Reloaded/data/text';
  for (const rel of ['es/txt_pkmn.dll', 'es/dex_info.dll', 'zz/dex_height_m.dll', 'zz/dex_weight_kg.dll', 'es/dex_espec.dll']) {
    const lines = decodeFile(`${base}/${rel}`);
    console.log(`${rel}: ${lines.length} líneas`);
    console.log('  primeras:', JSON.stringify(lines.slice(0, 8)));
    console.log('  últimas :', JSON.stringify(lines.slice(-5)));
  }
}
