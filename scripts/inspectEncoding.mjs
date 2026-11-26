import fs from 'node:fs';

const base = 'D:/Juegos/Reloaded/data/text';
for (const rel of ['zz/dex_height_m.dll', 'es/txt_abilities.dll', 'es/ordenNamePokemon.dll', 'es/dex_info.dll']) {
  const b = fs.readFileSync(`${base}/${rel}`);
  console.log(`===== ${rel} (${b.length})`);
  for (let off = 0; off < Math.min(240, b.length); off += 16) {
    const chunk = b.slice(off, off + 16);
    const hex = [...chunk].map(x => x.toString(16).padStart(2, '0')).join(' ');
    const txt = [...chunk].map(x => x >= 32 && x < 127 ? String.fromCharCode(x) : '.').join('');
    console.log(off.toString(16).padStart(4, '0'), hex.padEnd(47), txt);
  }
  // periodicidad: autocorrelación de bytes
  for (const period of [2, 3, 4, 5, 8, 16, 32]) {
    let same = 0, total = 0;
    for (let i = period; i < Math.min(2000, b.length); i++) { total++; if (b[i] === b[i - period]) same++; }
    if (same / total > 0.1) console.log('  period', period, (same / total).toFixed(3));
  }
}
