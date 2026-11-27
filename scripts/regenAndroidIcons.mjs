// Regenera los iconos de Android desde assets/logo.png: el logo ocupa TODO el
// icono (a sangre), sin margen transparente ni fondo blanco.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
const logoPath = path.join(root, 'assets', 'logo.png');
const BACKGROUND = '#0b0f1a';

// Densidades Android y tamaño del icono legacy en px.
const densities = [
  ['ldpi', 36],
  ['mdpi', 48],
  ['hdpi', 72],
  ['xhdpi', 96],
  ['xxhdpi', 144],
  ['xxxhdpi', 192],
];

const fullBleed = async (size) =>
  sharp(logoPath)
    .resize(size, size, { fit: 'fill', position: 'centre' })
    .flatten({ background: BACKGROUND })
    .png()
    .toBuffer();

const circleMask = (size) =>
  Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>` +
      '</svg>',
  );

let generated = 0;
for (const [density, size] of densities) {
  const dir = path.join(resDir, `mipmap-${density}`);
  await fs.mkdir(dir, { recursive: true });
  const image = await fullBleed(size);
  await fs.writeFile(path.join(dir, 'ic_launcher.png'), image);
  await sharp(image)
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
    .png()
    .toFile(path.join(dir, 'ic_launcher_round.png'));
  generated += 2;

  // Adaptive icon: 108dp de canvas; el logo se usa a sangre también aquí.
  const dp = Math.round(size * 108 / 48);
  await fs.writeFile(path.join(dir, 'ic_launcher_foreground.png'), await fullBleed(dp));
  await sharp({
    create: { width: dp, height: dp, channels: 4, background: BACKGROUND },
  })
    .png()
    .toFile(path.join(dir, 'ic_launcher_background.png'));
  generated += 2;
}

// Android 8+ usa el adaptive icon; sin estos XML el launcher cae al PNG antiguo.
const adaptiveDir = path.join(resDir, 'mipmap-anydpi-v26');
await fs.mkdir(adaptiveDir, { recursive: true });
const adaptive = (name) =>
  `<?xml version="1.0" encoding="utf-8"?>\n` +
  '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n' +
  '    <background android:drawable="@mipmap/ic_launcher_background"/>\n' +
  '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n' +
  '</adaptive-icon>\n';
await fs.writeFile(path.join(adaptiveDir, 'ic_launcher.xml'), adaptive('ic_launcher'));
await fs.writeFile(path.join(adaptiveDir, 'ic_launcher_round.xml'), adaptive('ic_launcher_round'));

// Nada de blanco: el color de fondo del icono es el mismo que el de la app.
await fs.writeFile(
  path.join(resDir, 'values', 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BACKGROUND}</color>\n</resources>\n`,
);

console.log(`[Reloadex] iconos regenerados: ${generated} PNG + adaptive icons (logo a sangre, fondo ${BACKGROUND})`);
