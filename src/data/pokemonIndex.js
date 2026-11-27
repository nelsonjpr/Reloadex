// Índice ligero generado por scripts/buildReloadexData.mjs.
// Solo lo que necesitan la lista, el equipo y el árbol evolutivo:
// id, nombre, formas, tipos, generación, región, stats, sprite y evolución.
// La ficha cargará el dataset completo (reloadex.json) cuando se abra.
import rawIndex from './pokemonIndex.json';

export const pokemonData = rawIndex.map((p) => ({
  ...p,
  id: Number(p.id),
}));

export const getPokemonById = (id) =>
  pokemonData.find((p) => p.id === Number(id)) || null;
