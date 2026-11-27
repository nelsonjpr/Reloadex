// Genera los datos de la ventana "Caras" desde la tabla verificada del truco
// F3 -> CARA. Los GIF de combate se copian de data\trainer del juego; los 14
// sprites que no tienen GIF suelto ya están exportados en public/caras/eNNN.png.
// Uso: npm run build:faces  (GAME_DIR puede apuntar a otra instalación)
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const gameDir = process.env.GAME_DIR
  || 'D:/reloaded/Proyecto Reloaded The Last Beta 1.9.2.2 Full';
const trainerDir = path.join(gameDir, 'data', 'trainer');
const csvPath = path.join(repo, 'scripts', 'data', 'faces.csv');
const outDir = path.join(repo, 'public', 'caras');
const jsonPath = path.join(repo, 'src', 'data', 'faces.json');

fs.mkdirSync(outDir, { recursive: true });

const readCsv = (file) => {
  const lines = fs.readFileSync(file, 'utf8').replace(/^\ufeff/, '').trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = !quoted;
      } else if (ch === ',' && !quoted) { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    const row = {};
    header.forEach((h, i) => { row[h] = cells[i]; });
    return row;
  });
};

// char2 338..351 no tienen GIF suelto: sus sprites se exportaron del EXE
// (spr_GreyBig ... spr_SegovienBig) y se guardan como e<sub>.png.
const EMBEDDED = new Set(['338', '339', '340', '341', '342', '343', '344', '345', '346', '347', '348', '349', '350', '351']);

const faces = [];
let copied = 0;
const missing = [];

for (const row of readCsv(csvPath)) {
  const principal = row.categoria === 'principal';
  const sub = row.subnumero;
  const id = Number(row.id_entrenador);
  const embedded = EMBEDDED.has(sub);
  const file = embedded ? `e${sub}.png` : `${principal ? 'p' : 'e'}${id}.gif`;
  const dest = path.join(outDir, file);

  if (embedded) {
    if (!fs.existsSync(dest)) missing.push(`${file} (exportado del EXE)`);
  } else {
    const src = path.join(trainerDir, row.archivo_gif);
    if (row.archivo_gif && fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      copied++;
    } else {
      missing.push(`${row.archivo_gif} (desde ${trainerDir})`);
    }
  }

  faces.push({
    n: principal ? Number(row.entrada_cara) : 10,
    sub: principal ? null : Number(sub),
    tipo: principal ? 'principal' : 'adicional',
    nombre: row.nombre,
    id,
    sprite: `/caras/${file}`,
    codigo: principal ? `CARA ${row.entrada_cara}` : `CARA 10 ${sub}`,
  });
}

fs.writeFileSync(jsonPath, `${JSON.stringify(faces, null, 2)}\n`, 'utf8');

console.log(`Caras: ${faces.length} entradas (10 principales + ${faces.length - 10} adicionales)`);
console.log(`GIF copiados: ${copied}; sprites embebidos verificados: ${EMBEDDED.size}`);
if (missing.length) {
  console.error(`Faltan ${missing.length} sprites:`);
  missing.forEach((item) => console.error(`  - ${item}`));
  process.exitCode = 1;
} else {
  console.log(`JSON: ${path.relative(repo, jsonPath)}`);
}
