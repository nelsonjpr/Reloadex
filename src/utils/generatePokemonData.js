// Script para generar datos de Pokémon automáticamente
// Este script se ejecutará para obtener datos de una API pública

export const fetchPokemonData = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    
    // Obtener descripción en español
    const flavorText = speciesData.flavor_text_entries
      .find(entry => entry.language.name === 'es')?.flavor_text
      .replace(/\n/g, ' ') || 'Sin descripción disponible';
    
    // Obtener generación
    const generation = speciesData.generation.name.replace('generation-', '');
    
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      types: data.types.map(t => t.type.name),
      abilities: data.abilities.map(a => a.ability.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        spAttack: data.stats[3].base_stat,
        spDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat
      },
      height: data.height / 10, // convertir a metros
      weight: data.weight / 10, // convertir a kg
      description: flavorText,
      generation: `Gen ${generation}`,
      region: getRegionFromGen(generation)
    };
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    return null;
  }
};

const getRegionFromGen = (gen) => {
  const regions = {
    'i': 'Kanto',
    '1': 'Kanto',
    'ii': 'Johto',
    '2': 'Johto',
    'iii': 'Hoenn',
    '3': 'Hoenn',
    'iv': 'Sinnoh',
    '4': 'Sinnoh',
    'v': 'Teselia',
    '5': 'Teselia',
    'vi': 'Kalos',
    '6': 'Kalos',
    'vii': 'Alola',
    '7': 'Alola',
    'viii': 'Galar',
    '8': 'Galar',
    'ix': 'Paldea',
    '9': 'Paldea'
  };
  return regions[gen] || 'Desconocida';
};

export const generatePokemonDatabase = async (maxId = 1000) => {
  const pokemon = [];
  for (let i = 1; i <= maxId; i++) {
    const data = await fetchPokemonData(i);
    if (data) {
      pokemon.push(data);
      console.log(`Loaded ${data.name} (${i}/${maxId})`);
    }
    // Delay para no sobrecargar la API
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  return pokemon;
};
