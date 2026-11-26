import fs from 'node:fs';
import { decodeFile } from './decodeReloaded.mjs';
const base = 'D:/Juegos/Reloaded/data/text';
for (const rel of ['zz/ordenPokemonExtended.dll','es/ordenNamePokemon.dll','es/ordenNameAbility.dll']) {
  const lines = decodeFile(`${base}/${rel}`);
  console.log(`===== ${rel}: ${lines.length} líneas`);
  console.log(lines.slice(0,30).map((l,i)=>`${i+1}: ${l}`).join('\n'));
  console.log('... últimas:', lines.slice(-10).map((l,i)=>`${lines.length-10+i+1}: ${l}`).join(' | '));
}
