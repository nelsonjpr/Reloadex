import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para obtener todos los IDs de sprites disponibles
function getAllSpriteIds() {
  const spritesPath = path.join(__dirname, '../public/sprites/normal');
  const files = fs.readdirSync(spritesPath);
  
  const ids = files
    .filter(file => file.endsWith('.gif'))
    .map(file => parseInt(file.replace('.gif', '')))
    .filter(id => !isNaN(id))
    .sort((a, b) => a - b);
  
  console.log(`✅ Encontrados ${ids.length} sprites en la carpeta`);
  return ids;
}

// Función para obtener datos de PokeAPI
async function fetchPokemonData(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const species = await fetch(data.species.url).then(r => r.json());
    
    // Obtener descripción en español
    const flavorText = species.flavor_text_entries
      .find(entry => entry.language.name === 'es')?.flavor_text
      .replace(/\n/g, ' ') || 'Sin descripción disponible.';
    
    // Obtener generación
    const genNumber = species.generation.url.split('/').slice(-2)[0];
    const genMap = {
      '1': 'Gen I', '2': 'Gen II', '3': 'Gen III', 
      '4': 'Gen IV', '5': 'Gen V', '6': 'Gen VI',
      '7': 'Gen VII', '8': 'Gen VIII', '9': 'Gen IX'
    };
    
    // Obtener región
    const regionMap = {
      '1': 'Kanto', '2': 'Johto', '3': 'Hoenn',
      '4': 'Sinnoh', '5': 'Teselia', '6': 'Kalos',
      '7': 'Alola', '8': 'Galar', '9': 'Paldea'
    };
    
    // Nombre en español
    const nameEs = species.names.find(n => n.language.name === 'es')?.name || data.name;
    
    return {
      id: data.id,
      name: nameEs,
      types: data.types.map(t => t.type.name),
      height: data.height / 10,
      weight: data.weight / 10,
      description: flavorText,
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        spAttack: data.stats[3].base_stat,
        spDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat
      },
      abilities: data.abilities.map(a => a.ability.name),
      generation: genMap[genNumber] || `Gen ${genNumber}`,
      region: regionMap[genNumber] || 'Desconocida'
    };
  } catch (error) {
    console.error(`❌ Error con ID ${id}:`, error.message);
    return null;
  }
}

// Función para procesar en lotes
async function processBatch(ids, batchSize = 50) {
  const allPokemon = [];
  const totalBatches = Math.ceil(ids.length / batchSize);
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    
    console.log(`\n📦 Procesando lote ${batchNumber}/${totalBatches} (IDs ${batch[0]} - ${batch[batch.length - 1]})`);
    
    const promises = batch.map(id => fetchPokemonData(id));
    const results = await Promise.all(promises);
    
    const validResults = results.filter(r => r !== null);
    allPokemon.push(...validResults);
    
    console.log(`   ✅ ${validResults.length}/${batch.length} exitosos`);
    
    // Guardar progreso cada lote
    saveProgress(allPokemon);
    
    // Pequeña pausa entre lotes para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return allPokemon;
}

// Guardar progreso
function saveProgress(pokemonArray) {
  const outputPath = path.join(__dirname, '../src/data/pokemon_generated.js');
  
  const fileContent = `// Pokémon generados automáticamente desde PokeAPI
// Total: ${pokemonArray.length} Pokémon
// Fecha: ${new Date().toLocaleString()}

export const pokemonData = ${JSON.stringify(pokemonArray, null, 2)};

// Colores por tipo
export const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

export const typeTranslations = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};
`;
  
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`💾 Guardado progreso: ${pokemonArray.length} Pokémon`);
}

// Función principal
async function main() {
  console.log('🚀 Iniciando generación de datos de Pokémon...\n');
  
  // Obtener todos los IDs de sprites
  const spriteIds = getAllSpriteIds();
  
  // Filtrar solo IDs válidos de Pokémon (1-1010 aproximadamente)
  const validIds = spriteIds.filter(id => id >= 1 && id <= 1025);
  
  console.log(`📊 Total de Pokémon a procesar: ${validIds.length}`);
  console.log(`🎯 Rango de IDs: ${validIds[0]} - ${validIds[validIds.length - 1]}\n`);
  
  // Procesar todos
  const allPokemon = await processBatch(validIds, 50);
  
  console.log('\n✅ ¡Generación completada!');
  console.log(`📝 Total generados: ${allPokemon.length} Pokémon`);
  console.log(`📂 Archivo: src/data/pokemon_generated.js`);
}

// Ejecutar
main().catch(console.error);
