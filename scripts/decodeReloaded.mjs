import fs from 'node:fs';

// Descifrador de los textos de Pokémon Reloaded.
// La tabla se extrajo del propio juego (script interno `ValuesAdjustment6`) y
// las secuencias &{...} del script `SpecialChars`; no es una tabla aproximada.
const BYTE = {
  '20':'$','21':'f','22':'b','23':'?','24':'P','25':'6','26':'y','27':"'",'28':'N','29':'^',
  '2a':'v','2b':'S','2c':'%','2d':':','2e':']','2f':'D','30':'`','31':'n','32':'*','33':'c',
  '34':' ','35':'>','36':'i','37':'p','38':'Z','39':'&','3a':'T','3b':'I','3c':'=','3d':'l',
  '3e':'E','3f':'z','40':'A','41':'t','42':'_','43':'x','44':'W','45':'Y','46':'k','47':'s',
  '48':'J','49':'g','4a':',','4b':'1','4c':'C','4d':'r','4e':'4','4f':'{','50':'/','51':'9',
  '52':'R','53':'|','54':'!','55':'G','56':'O','57':'o','58':'[','59':'d','5a':'w','5b':'X',
  '5c':'u','5d':'V','5e':'j','5f':'8','60':')','61':';','62':'+','63':'<','64':'0','65':'7',
  '66':'3','67':'M','68':'5','69':'m','6a':'K','6b':'U','6c':'.','6d':'Q','6e':'"','6f':'\\',
  '70':'(','71':'@','72':'~','73':'L','74':'F','75':'e','76':'B','77':'2','78':'-','79':'H',
  '7a':'h','7b':'q','7c':'}','7d':'a','7e':'#',
};

const SPECIAL = {
  n:'ñ', N:'Ñ', a:'á', e:'é', i:'í', o:'ó', u:'ú', A:'Á', E:'É', I:'Í', O:'Ó', U:'Ú',
  aa:'à', AA:'À', ee:'è', EE:'È', e2:'ê', E2:'Ê', uu:'ü', UU:'Ü',
  C:'Ç', c:'ç', '?':'¿', '!':'¡', E1:'€', o1:'º', a1:'ª',
  c1:'’', c2:'´', '.':'…', i1:'¬', u2:'¨', ss:'§',
};

export function decodeReloaded(buf) {
  let out = '';
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i];
    if (x === 0x39 && buf[i + 1] === 0x4f) { // &{
      let j = i + 2;
      while (j < buf.length && buf[j] !== 0x7c) j++;
      if (j < buf.length && j - i <= 8) {
        let tag = '';
        for (let k = i + 2; k < j; k++) tag += BYTE[buf[k].toString(16)] ?? `<${buf[k].toString(16)}>`;
        out += SPECIAL[tag] ?? `{${tag}}`;
        i = j;
        continue;
      }
    }
    if (x === 13) continue;
    if (x === 10) { out += '\n'; continue; }
    out += BYTE[x.toString(16)] ?? `<${x.toString(16)}>`;
  }
  return out;
}

export function decodeFile(file) {
  return decodeReloaded(fs.readFileSync(file))
    .split('\n')
    .filter((l, i, a) => l !== '' || i < a.length - 1);
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
