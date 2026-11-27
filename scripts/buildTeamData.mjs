// Genera el índice ligero que usa el constructor de equipos:
// id, nombre, stats base reales del juego y habilidades reales. Evita cargar
// el dataset completo (2,3 MB) al abrir el selector de Pokémon.
// Regenerar con: node scripts/buildTeamData.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/reloadex.json'), 'utf8'));
const gameStats = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/gameBaseStats.json'), 'utf8')).stats;
const all = Array.isArray(source) ? source : (source.pokemon || source.data || []);

const pokemon = all.map((p) => {
  const id = Number(p.id);
  const stats = gameStats[id] || p.stats || {};
  return {
    id,
    name: String(p.name || ''),
    types: Array.isArray(p.types) ? p.types : [],
    shinyFile: p.sprite?.shinyFile ? String(p.sprite.shinyFile) : null,
    stats: {
      hp: Number(stats.hp) || 0,
      attack: Number(stats.attack) || 0,
      defense: Number(stats.defense) || 0,
      spAttack: Number(stats.spAttack) || 0,
      spDefense: Number(stats.spDefense) || 0,
      speed: Number(stats.speed) || 0,
    },
    statsSource: gameStats[id] ? 'game-gml' : 'reloadex-json',
    abilities: (Array.isArray(p.abilities) ? p.abilities : [])
      .map((a) => ({
        name: String(a?.name || ''),
        hidden: Boolean(a?.hidden),
      }))
      .filter((a) => a.name),
  };
});

const output = {
  version: 2,
  source: 'GML Stat*Pokemon + reloadex.json (habilidades y sprites)',
  count: pokemon.length,
  pokemon,
};

const outFile = path.join(ROOT, 'src/data/teamData.json');
fs.writeFileSync(outFile, `${JSON.stringify(output)}\n`);
console.log('[Reloadex] índice de equipos generado:', outFile, `(${pokemon.length} Pokémon)`);
const fromGame = pokemon.filter((p) => p.statsSource === 'game-gml').length;
console.log('Con stats base del juego:', fromGame);
