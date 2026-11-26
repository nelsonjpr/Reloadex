import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer sprites disponibles
function getAvailableSprites() {
  const spritesPath = path.join(__dirname, '../public/sprites/normal');
  const files = fs.readdirSync(spritesPath);
  
  const spriteIds = files
    .filter(file => file.endsWith('.gif'))
    .map(file => file.replace('.gif', ''))
    .sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    });
  
  console.log(`✅ Total sprites encontrados: ${spriteIds.length}`);
  
  // Separar IDs normales de especiales
  const normalIds = spriteIds.filter(id => parseInt(id) < 10000);
  const specialIds = spriteIds.filter(id => parseInt(id) >= 100000);
  
  console.log(`   - IDs normales (1-9999): ${normalIds.length}`);
  console.log(`   - IDs especiales (100000+): ${specialIds.length}`);
  
  return { normalIds, specialIds, allIds: spriteIds };
}

// Obtener datos de PokeAPI solo para IDs normales válidos
async function fetchPokemonData(id) {
  try {
    const numId = parseInt(id);
    if (numId > 1025) return null; // PokeAPI solo hasta Gen 9
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${numId}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const species = await fetch(data.species.url).then(r => r.json());
    
    // Descripción en español
    const flavorText = species.flavor_text_entries
      .find(entry => entry.language.name === 'es')?.flavor_text
      .replace(/\n/g, ' ') || 'Pokémon único de Reloaded.';
    
    // Generación
    const genNumber = species.generation.url.split('/').slice(-2)[0];
    const genMap = {
      '1': 'Gen I', '2': 'Gen II', '3': 'Gen III', '4': 'Gen IV',
      '5': 'Gen V', '6': 'Gen VI', '7': 'Gen VII', '8': 'Gen VIII', '9': 'Gen IX'
    };
    
    // Región
    const regionMap = {
      '1': 'Kanto', '2': 'Johto', '3': 'Hoenn', '4': 'Sinnoh',
      '5': 'Teselia', '6': 'Kalos', '7': 'Alola', '8': 'Galar', '9': 'Paldea'
    };
    
    // Nombre en español
    const nameEs = species.names.find(n => n.language.name === 'es')?.name || data.name;
    
    return {
      id: id, // Usar el ID del sprite, no el de PokeAPI
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
      abilities: data.abilities.map(a => {
        const name = a.ability.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return a.is_hidden ? `${name} (Oculta)` : name;
      }),
      generation: genMap[genNumber] || `Gen ${genNumber}`,
      region: regionMap[genNumber] || 'Desconocida'
    };
  } catch (error) {
    return null;
  }
}

// Generar datos para IDs especiales (formas alternativas)
function generateSpecialFormData(id) {
  const baseId = parseInt(id.toString().substring(3)); // Quitar "100" del inicio
  
  return {
    id: id,
    name: `Forma Especial #${id}`,
    types: ['normal'],
    height: 1.0,
    weight: 10.0,
    description: 'Forma alternativa exclusiva de Pokémon Reloaded.',
    stats: {
      hp: 60,
      attack: 60,
      defense: 60,
      spAttack: 60,
      spDefense: 60,
      speed: 60
    },
    abilities: ['Adaptable'],
    generation: 'Gen Star',
    region: 'Reloaded'
  };
}

// Procesar en lotes
async function processBatch(ids, batchSize = 30) {
  const allPokemon = [];
  const totalBatches = Math.ceil(ids.length / batchSize);
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    
    console.log(`\n📦 Lote ${batchNumber}/${totalBatches} (IDs ${batch[0]} - ${batch[batch.length - 1]})`);
    
    const promises = batch.map(id => {
      const numId = parseInt(id);
      if (numId >= 100000) {
        // Forma especial
        return Promise.resolve(generateSpecialFormData(id));
      } else {
        // Pokémon normal
        return fetchPokemonData(id);
      }
    });
    
    const results = await Promise.all(promises);
    const validResults = results.filter(r => r !== null);
    allPokemon.push(...validResults);
    
    console.log(`   ✅ ${validResults.length}/${batch.length} procesados`);
    
    // Guardar progreso
    if (batchNumber % 5 === 0) {
      saveProgress(allPokemon);
    }
    
    // Pausa entre lotes
    if (parseInt(batch[0]) < 100000) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return allPokemon;
}

// Guardar progreso
function saveProgress(pokemonArray) {
  const outputPath = path.join(__dirname, '../src/data/pokemon.js');
  
  const fileContent = `// Pokémon de Reloaded - Generados automáticamente
// Basados en los sprites disponibles en /public/sprites/normal/
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
  console.log(`💾 Guardado: ${pokemonArray.length} Pokémon`);
}

// Main
async function main() {
  console.log('🚀 Corrigiendo base de datos de Pokémon...\n');
  
  const { normalIds, specialIds, allIds } = getAvailableSprites();
  
  console.log(`\n📊 Procesando ${allIds.length} sprites totales...`);
  
  // Procesar todos los IDs
  const allPokemon = await processBatch(allIds, 30);
  
  // Guardar final
  saveProgress(allPokemon);
  
  console.log('\n✅ ¡Corrección completada!');
  console.log(`📝 Total: ${allPokemon.length} Pokémon con sprites correctos`);
}

main().catch(console.error);
