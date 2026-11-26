// Script mejorado para generar datos de Pokémon desde PokeAPI
// Características: Guarda progresivamente, puede reanudar, manejo de errores
import fs from 'fs';
import https from 'https';

const OUTPUT_FILE = './src/data/pokemon_generated.json';
const PROGRESS_FILE = './src/data/.generation_progress.json';

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
    '1': 'Kanto', '2': 'Johto', '3': 'Hoenn', '4': 'Sinnoh', '5': 'Teselia',
    '6': 'Kalos', '7': 'Alola', '8': 'Galar', '9': 'Paldea'
  };
  return regions[gen] || 'Desconocida';
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loadProgress = () => {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
      console.log(`📂 Progreso encontrado: ${progress.lastId} Pokémon completados`);
      return progress;
    }
  } catch (e) {
    console.log('⚠️  Error leyendo progreso, empezando desde cero');
  }
  return { lastId: 0, pokemon: [] };
};

const saveProgress = (lastId, pokemon) => {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ lastId, pokemon }, null, 2));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pokemon, null, 2));
};

const generatePokemonDatabase = async () => {
  const progress = loadProgress();
  let pokemon = progress.pokemon || [];
  const startId = progress.lastId + 1;
  const maxId = 1010;
  
  console.log(`🚀 Generando datos de Pokémon...`);
  console.log(`📍 Comenzando desde ID: ${startId}`);
  console.log(`🎯 Objetivo: ${maxId} Pokémon\n`);
  
  let consecutiveErrors = 0;
  
  for (let i = startId; i <= maxId; i++) {
    try {
      const data = await fetchData(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const speciesData = await fetchData(data.species.url);
      
      const flavorEntry = speciesData.flavor_text_entries
        .find(entry => entry.language.name === 'es');
      const flavorText = flavorEntry 
        ? flavorEntry.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ')
        : 'Sin descripción disponible';
      
      const genNum = speciesData.generation.name.replace('generation-', '');
      
      const abilities = data.abilities.map(a => ({
        name: a.ability.name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        hidden: a.is_hidden
      }));
      
      const pokemonData = {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types: data.types.map(t => t.type.name),
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
      consecutiveErrors = 0;
      
      const percentage = Math.round((i / maxId) * 100);
      console.log(`✓ ${i}/${maxId} (${percentage}%) - ${pokemonData.name}`);
      
      if (i % 50 === 0) {
        saveProgress(i, pokemon);
        console.log(`💾 Progreso guardado: ${pokemon.length} Pokémon`);
      }
      
    } catch (error) {
      consecutiveErrors++;
      console.error(`✗ Error en Pokémon ${i}: ${error.message}`);
      
      if (consecutiveErrors > 3) {
        console.log('⏸️  Pausando 5 segundos...');
        await delay(5000);
        consecutiveErrors = 0;
      }
    }
    
    await delay(consecutiveErrors > 0 ? 200 : 100);
  }
  
  saveProgress(maxId, pokemon);
  console.log(`\n✅ ¡Completado! ${pokemon.length} Pokémon guardados en ${OUTPUT_FILE}`);
  
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
    console.log('🧹 Archivo de progreso limpiado');
  }
};

generatePokemonDatabase().catch(console.error);
