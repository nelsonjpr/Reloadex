import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader } from 'lucide-react';

const PokemonDataGenerator = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const generateData = async () => {
    setLoading(true);
    const pokemon = [];
    const maxId = 1010; // Hasta Pokémon Gen 9

    for (let i = 1; i <= maxId; i++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        if (!response.ok) continue;
        
        const data = await response.json();
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        
        const flavorText = speciesData.flavor_text_entries
          .find(entry => entry.language.name === 'es')?.flavor_text
          .replace(/\n/g, ' ') || 'Sin descripción disponible';
        
        const generation = speciesData.generation.name.replace('generation-', '');
        
        const pokemonData = {
          id: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          types: data.types.map(t => t.type.name),
          abilities: data.abilities.map(a => {
            const abilityName = a.ability.name
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            return abilityName;
          }),
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
          generation: `Gen ${generation.toUpperCase()}`,
          region: getRegionFromGen(generation)
        };
        
        pokemon.push(pokemonData);
        setProgress(Math.round((i / maxId) * 100));
        setStatus(`Cargando ${pokemonData.name}... (${i}/${maxId})`);
        
      } catch (error) {
        console.error(`Error loading Pokemon ${i}:`, error);
      }
      
      // Delay para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setLoading(false);
    setStatus('¡Completado!');
    
    // Descargar como JSON
    const dataStr = JSON.stringify(pokemon, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pokemon_full_data.json';
    link.click();
    
    if (onComplete) {
      onComplete(pokemon);
    }
  };

  const getRegionFromGen = (gen) => {
    const regions = {
      'i': 'Kanto', '1': 'Kanto',
      'ii': 'Johto', '2': 'Johto',
      'iii': 'Hoenn', '3': 'Hoenn',
      'iv': 'Sinnoh', '4': 'Sinnoh',
      'v': 'Teselia', '5': 'Teselia',
      'vi': 'Kalos', '6': 'Kalos',
      'vii': 'Alola', '7': 'Alola',
      'viii': 'Galar', '8': 'Galar',
      'ix': 'Paldea', '9': 'Paldea'
    };
    return regions[gen] || 'Desconocida';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-dark rounded-3xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Generador de Base de Datos
        </h2>
        
        {!loading ? (
          <>
            <p className="text-white/60 mb-6">
              Haz clic para descargar datos completos de los primeros 1010 Pokémon desde la PokeAPI
            </p>
            <button
              onClick={generateData}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all mx-auto"
            >
              <Download size={20} />
              <span>Generar Datos</span>
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader size={24} className="text-purple-400 animate-spin" />
              <span className="text-white font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white/60 text-sm">{status}</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PokemonDataGenerator;
