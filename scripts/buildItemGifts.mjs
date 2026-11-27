// Extrae de la guía real de Pokémon Reloaded incluida en la app (src/data/guide.json)
// los objetos que entregan personajes, con quién, dónde y en qué momento.
// Regenerar con: node scripts/buildItemGifts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/guide.json'), 'utf8'));
const objectData = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/objectLocations.json'), 'utf8'));

const normalize = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const GIFTS_RE = /(regala|regalan|regalara|regalarnos|entrega|entregara|entregan|nos da|te da|nos dara|te dara|recompensa|recompensara|recibiras|recibiremos|obtendras|conseguid|nos entregan|nos otorga|nos entrega)/i;

// Extrae al personaje que entrega el objeto de la frase anterior al verbo.
const whoFrom = (text, verbIndex) => {
  const before = text.slice(Math.max(0, verbIndex - 150), verbIndex);
  const patterns = [
    /(?:conoceremos a|conocemos a|hablar con|habla con|encontraremos a|nos encontramos con|vuelve a casa para hablar con)\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+){0,2})/gi,
    /\b([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ]+){0,2})\s+(?:nos|te)\s+(?:recompens|entreg|regal|da\b|dara)/gi,
    /\b(un investigador|una investigadora|un ciudadano|una ciudadana|un senor|una senora|el pescador|la recepcionista|el profesor|el director|la directora|un recluta|los reclutas|un amigo|una amiga)\b/gi,
  ];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    let last = null;
    while ((match = pattern.exec(before))) last = match;
    if (last) return last[1].trim();
  }
  return null;
};

const items = objectData.items
  .filter((item) => item.name && item.name.length >= 4)
  .map((item) => ({ id: item.id, name: item.name, key: normalize(item.name) }))
  .sort((a, b) => b.key.length - a.key.length);

const gifts = new Map();

for (const chapter of guide.chapters || []) {
  for (const section of chapter.sections || []) {
    for (const block of section.blocks || []) {
      const original = String(block.text || '');
      if (!GIFTS_RE.test(original)) continue;
      const text = normalize(original);
      for (const item of items) {
        let from = 0;
        let found = false;
        while (!found) {
          const at = text.indexOf(item.key, from);
          if (at < 0) break;
          from = at + item.key.length;
          // Palabra completa (evita "Despertar" dentro de "despertar y capturar").
          const beforeChar = text[at - 1];
          const afterChar = text[at + item.key.length];
          if (/[\p{L}\p{N}]/u.test(beforeChar || '') || /[\p{L}\p{N}]/u.test(afterChar || '')) continue;

          const windowStart = Math.max(0, at - 130);
          const windowText = text.slice(windowStart, at + item.key.length + 40);
          const verb = GIFTS_RE.exec(windowText);
          if (!verb) continue;
          found = true;

          const where = String(section.heading || chapter.title || '').trim();
          const when = String(chapter.title || chapter.part || '').trim();
          const key = `${item.id}:${normalize(where)}`;
          if (gifts.has(key)) continue;

          gifts.set(key, {
            itemId: item.id,
            itemName: item.name,
            // La ventana normalizada conserva la longitud: se usa el texto
            // original para recuperar el nombre con sus mayúsculas.
            who: whoFrom(original.slice(windowStart, at + item.key.length + 40), verb.index) || 'Un personaje del juego',
            where,
            when,
            region: String(chapter.region || ''),
            quote: original.length > 260 ? `${original.slice(0, 257)}…` : original,
            source: 'Guía de Pokémon Reloaded incluida en la app',
          });
        }
      }
    }
  }
}

const result = {
  version: 1,
  source: 'src/data/guide.json ( guía real del juego )',
  count: gifts.size,
  gifts: [...gifts.values()].sort((a, b) => a.itemName.localeCompare(b.itemName, 'es')),
};

const outFile = path.join(ROOT, 'src/data/itemGifts.json');
fs.writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);
console.log('[Reloadex] regalos de objetos extraídos:', outFile, `(${result.count})`);
for (const gift of result.gifts.filter((g) => /master ball|cuchara|supercaña/i.test(g.itemName)).slice(0, 8)) {
  console.log(`  ${gift.itemName} — ${gift.who} — ${gift.where} — ${gift.when}`);
}
