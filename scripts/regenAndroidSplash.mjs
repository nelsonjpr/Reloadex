// Regenera ÚNICAMENTE los splash.png nativos de Android con el mismo tratamiento
// que el splash web: degradado morado y logo ampliado y centrado.
// No toca iconos ni ningún otro recurso.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
const logoPath = path.join(root, 'public', 'logo-ui.png');
const logo = await sharp(logoPath).png().toBuffer();

const dirs = (await fs.readdir(resDir)).filter((dir) => dir.startsWith('drawable'));
let generated = 0;

for (const dir of dirs) {
  const target = path.join(resDir, dir, 'splash.png');
  try {
    await fs.access(target);
  } catch {
    continue;
  }

  const { width, height } = await sharp(target).metadata();
  if (!width || !height) continue;

  // Antes el logo ocupaba el 20 % del ancho; ahora el 42 % del lado corto.
  const logoWidth = Math.min(width, height, Math.max(96, Math.floor(Math.min(width, height) * 0.42)));
  const resized = await sharp(logo).resize({ width: logoWidth }).png().toBuffer();
  const glowRadius = Math.round(logoWidth * 0.78);

  const background = Buffer.from(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">` +
      '<defs><radialGradient id="fondo" cx="50%" cy="38%" r="78%">' +
      '<stop offset="0%" stop-color="#3b1a6b"/>' +
      '<stop offset="52%" stop-color="#160b2c"/>' +
      '<stop offset="100%" stop-color="#080d1a"/>' +
      '</radialGradient></defs>' +
      `<rect width="100%" height="100%" fill="url(#fondo)"/>` +
      `<circle cx="50%" cy="50%" r="${glowRadius}" fill="#a855f7" fill-opacity="0.16"/>` +
      '</svg>',
  );

  await sharp(background)
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(target);
  generated += 1;
}

console.log(`[Reloadex] splash nativos regenerados: ${generated} (fondo morado, logo 42 %)`);
