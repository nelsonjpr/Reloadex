import fs from 'node:fs';

const base = 'D:/Juegos/Reloaded/data/text';

function rtfToText(file) {
  const raw = fs.readFileSync(file, 'latin1');
  // quitar encabezado de fuentes/colores: todo hasta el primer grupo cerrado tras fonttbl
  let s = raw.replace(/\\fonttbl[\s\S]*?\}\}/, '');
  s = s.replace(/\\colortbl[^;]*;/g, '');
  s = s.replace(/\\stylesheet[\s\S]*?\}\}/, '');
  s = s.replace(/\\info[\s\S]*?\}\}/, '');
  s = s.replace(/\\([a-zA-Z]+)(-?\d+)?[ ]?/g, ' $1 ');
  s = s.replace(/[{}]/g, '\n');
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{2,}/g, '\n');
  return s;
}

for (const lang of ['es', 'en']) {
  const p = `${base}/${lang}/GruposHuevo.rtf`;
  const t = rtfToText(p);
  console.log(`===== ${p} (${t.length} chars)`);
  console.log(t.slice(0, 6000));
}
