// Script para generar datos de Pokémon desde PokeAPI
import fs from 'fs';
import https from 'https';

const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const getRegionFromGen = (gen) => {
  const regions = {
    '1': 'Kanto',
    '2': 'Johto',
    '3': 'Hoenn',
    '4': 'Sinnoh',
    '5': 'Teselia',
    '6': 'Kalos',
    '7': 'Alola',
    '8': 'Galar',
    '9': 'Paldea'
  };
  return regions[gen] || 'Desconocida';
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generatePokemonDatabase = async () => {
  const pokemon = [];
  const maxId = 1010; // Hasta Pokémon Gen 9
  
  console.log(`Generando datos de ${maxId} Pokémon...`);
  
  for (let i = 1; i <= maxId; i++) {
    try {
      const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const speciesData = await fetchData(data.species.url);
      
      // Obtener descripción en español
      const flavorEntry = speciesData.flavor_text_entries
        .find(entry => entry.language.name === 'es');
      const flavorText = flavorEntry 
        ? flavorEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ')
        : 'Sin descripción disponible';
      
      // Obtener generación
      const genNum = speciesData.generation.name.replace('generation-', '');
      
      // Procesar habilidades
      const abilities = data.abilities.map(a => ({
        name: a.ability.name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        hidden: a.is_hidden
      }));
      
      // Procesar tipos
      const types = data.types.map(t => t.type.name);
      
      const pokemonData = {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types: types,
        abilities: abilities,
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          spAttack: data.stats[3].base_stat,
          spDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat
        },
        height: data.height / 10,
        weight: data.weight / 10,
        description: flavorText,
        generation: parseInt(genNum),
        region: getRegionFromGen(genNum)
      };
      
      pokemon.push(pokemonData);
      console.log(`✓ ${i}/${maxId} - ${pokemonData.name}`);
      
    } catch (error) {
      console.error(`✗ Error en Pokémon ${i}:`, error.message);
    }
    
    // Delay para no sobrecargar la API
    await delay(100);
  }
  
  // Guardar archivo
  const outputPath = './src/data/pokemon_generated.json';
  fs.writeFileSync(outputPath, JSON.stringify(pokemon, null, 2));
  console.log(`\n¡Completado! ${pokemon.length} Pokémon guardados en ${outputPath}`);
};

generatePokemonDatabase().catch(console.error);
