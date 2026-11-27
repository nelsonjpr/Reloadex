// Genera el índice ligero que usa el constructor de equipos:
// id, nombre, stats base y habilidades reales del juego. Evita cargar el
// dataset completo (2,3 MB) al abrir el selector de Pokémon.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/reloadex.json'), 'utf8'));
const all = Array.isArray(source) ? source : (source.pokemon || source.data || []);

const pokemon = all.map((p) => ({
  id: Number(p.id),
  name: String(p.name || ''),
  shinyFile: p.sprite?.shinyFile ? String(p.sprite.shinyFile) : null,
  stats: {
    hp: Number(p.stats?.hp) || 0,
    attack: Number(p.stats?.attack) || 0,
    defense: Number(p.stats?.defense) || 0,
    spAttack: Number(p.stats?.spAttack) || 0,
    spDefense: Number(p.stats?.spDefense) || 0,
    speed: Number(p.stats?.speed) || 0,
  },
  abilities: (Array.isArray(p.abilities) ? p.abilities : [])
    .map((a) => ({
      name: String(a?.name || ''),
      hidden: Boolean(a?.hidden),
    }))
    .filter((a) => a.name),
}));

const output = {
  version: 1,
  source: 'reloadex.json (stats base y habilidades del juego)',
  count: pokemon.length,
  pokemon,
};

const outFile = path.join(ROOT, 'src/data/teamData.json');
fs.writeFileSync(outFile, `${JSON.stringify(output)}\n`);
console.log('[Reloadex] índice de equipos generado:', outFile, `(${pokemon.length} Pokémon)`);
