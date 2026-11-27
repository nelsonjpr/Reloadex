import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Users,
  Shield,
  Zap,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { pokemonData, typeColors, typeTranslations } from '../data/pokemon';
import { safeTop } from '../utils/safeArea';

export function TeamBuilder({ onBack }) {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [showSelector, setShowSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar Pokémon disponibles
  const availablePokemon = useMemo(() => {
    if (!searchTerm) return pokemonData;
    return pokemonData.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.id.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  // Añadir Pokémon al equipo
  const addToTeam = (pokemon) => {
    if (selectedSlot !== null) {
      const newTeam = [...team];
      newTeam[selectedSlot] = pokemon;
      setTeam(newTeam);
      setShowSelector(false);
      setSelectedSlot(null);
      setSearchTerm('');
    }
  };

  // Remover Pokémon del equipo
  const removeFromTeam = (index) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  // Abrir selector para un slot específico
  const openSelector = (index) => {
    setSelectedSlot(index);
    setShowSelector(true);
  };

  // Calcular cobertura de tipos del equipo
  const getTypesCoverage = () => {
    const types = new Set();
    team.forEach(pokemon => {
      if (pokemon) {
        pokemon.types.forEach(type => types.add(type));
      }
    });
    return Array.from(types);
  };

  // Calcular estadísticas promedio del equipo
  const getTeamStats = () => {
    const activePokemon = team.filter(p => p !== null);
    if (activePokemon.length === 0) return null;

    const totalStats = activePokemon.reduce((acc, pokemon) => {
      const st = pokemon.stats || {};
      return {
        hp: acc.hp + (st.hp || 0),
        attack: acc.attack + (st.attack || 0),
        defense: acc.defense + (st.defense || 0),
        spAttack: acc.spAttack + (st.spAttack || 0),
        spDefense: acc.spDefense + (st.spDefense || 0),
        speed: acc.speed + (st.speed || 0)
      };
    }, { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 });

    return {
      hp: Math.round(totalStats.hp / activePokemon.length),
      attack: Math.round(totalStats.attack / activePokemon.length),
      defense: Math.round(totalStats.defense / activePokemon.length),
      spAttack: Math.round(totalStats.spAttack / activePokemon.length),
      spDefense: Math.round(totalStats.spDefense / activePokemon.length),
      speed: Math.round(totalStats.speed / activePokemon.length)
    };
  };

  // Guardar equipo en localStorage
  const saveTeam = () => {
    const teamData = team.map(p => p ? p.id : null);
    localStorage.setItem('pokemonTeam', JSON.stringify(teamData));
    alert('¡Equipo guardado exitosamente!');
  };

  // Cargar equipo desde localStorage
  const loadTeam = () => {
    const savedTeam = localStorage.getItem('pokemonTeam');
    if (savedTeam) {
      const teamIds = JSON.parse(savedTeam);
      const loadedTeam = teamIds.map(id => 
        id ? pokemonData.find(p => Number(p.id) === Number(id)) || null : null
      );
      setTeam(loadedTeam);
      alert('¡Equipo cargado exitosamente!');
    } else {
      alert('No hay equipo guardado');
    }
  };

  // Limpiar equipo
  const clearTeam = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el equipo?')) {
      setTeam(Array(6).fill(null));
    }
  };

  const teamCount = team.filter(p => p !== null).length;
  const teamStats = getTeamStats();
  const typesCoverage = getTypesCoverage();

  return (
    <div className="min-h-screen px-4 pb-[calc(env(safe-area-inset-bottom)+20px)] md:px-6" style={safeTop(16)}>
      {/* Botón Volver */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 glass-effect px-4 py-2 rounded-xl text-white hover:glass-hover transition-all mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
          Constructor de Equipo
        </h1>
        <p className="text-gray-400">Crea tu equipo perfecto de Pokémon</p>
      </motion.div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={saveTeam}
          disabled={teamCount === 0}
          className="glass-effect hover:glass-hover px-4 py-2 rounded-xl flex items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Download className="w-4 h-4" />
          Guardar
        </button>
        <button
          onClick={loadTeam}
          className="glass-effect hover:glass-hover px-4 py-2 rounded-xl flex items-center gap-2 text-white transition-all"
        >
          <Upload className="w-4 h-4" />
          Cargar
        </button>
        <button
          onClick={clearTeam}
          disabled={teamCount === 0}
          className="glass-effect hover:glass-hover px-4 py-2 rounded-xl flex items-center gap-2 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Limpiar
        </button>
      </div>

      {/* Contador de equipo */}
      <div className="glass-effect rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">
              Equipo: {teamCount}/6
            </span>
          </div>
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  team[i] ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slots del equipo */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {team.map((pokemon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl p-4 relative group"
          >
            {pokemon ? (
              <>
                {/* Botón eliminar */}
                <button
                  onClick={() => removeFromTeam(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Sprite */}
                <div className="relative mb-2">
                  <img
                    src={`/sprites/normal/${pokemon.id}.gif`}
                    alt={pokemon.name}
                    className="w-full h-24 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Info */}
                <h3 className="text-white font-bold text-center mb-1">
                  {pokemon.name}
                </h3>
                <p className="text-gray-400 text-xs text-center mb-2">
                  #{pokemon.id}
                </p>

                {/* Tipos */}
                <div className="flex gap-1 justify-center">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: typeColors[type] }}
                    >
                      {typeTranslations[type]}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <button
                onClick={() => openSelector(index)}
                className="w-full h-full min-h-[180px] flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors group"
              >
                <div className="p-4 bg-white/5 rounded-full mb-2 group-hover:bg-white/10 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-sm">Añadir Pokémon</span>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Estadísticas del equipo */}
      {teamStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Cobertura de tipos */}
          <div className="glass-effect rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">Cobertura de Tipos</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {typesCoverage.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: typeColors[type] }}
                >
                  {typeTranslations[type]}
                </span>
              ))}
            </div>
          </div>

          {/* Estadísticas promedio */}
          <div className="glass-effect rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white font-semibold">Estadísticas Promedio</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'PS', value: teamStats.hp, color: 'bg-red-500' },
                { label: 'Ataque', value: teamStats.attack, color: 'bg-orange-500' },
                { label: 'Defensa', value: teamStats.defense, color: 'bg-yellow-500' },
                { label: 'At. Esp.', value: teamStats.spAttack, color: 'bg-blue-500' },
                { label: 'Def. Esp.', value: teamStats.spDefense, color: 'bg-green-500' },
                { label: 'Velocidad', value: teamStats.speed, color: 'bg-pink-500' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="text-white font-semibold">{stat.value}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / 255) * 100}%` }}
                      className={`h-full ${stat.color}`}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal Selector */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSelector(false);
              setSelectedSlot(null);
              setSearchTerm('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-effect rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Seleccionar Pokémon
                </h2>
                <button
                  onClick={() => {
                    setShowSelector(false);
                    setSelectedSlot(null);
                    setSearchTerm('');
                  }}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Buscador */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass-dark rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              {/* Lista de Pokémon */}
              <div className="overflow-y-auto flex-1 -mx-2 px-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availablePokemon.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => addToTeam(pokemon)}
                      className="glass-dark hover:glass-hover rounded-xl p-3 transition-all group"
                    >
                      <img
                        src={`/sprites/normal/${pokemon.id}.gif`}
                        alt={pokemon.name}
                        loading="lazy"
                        className="w-full h-16 object-contain mb-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <p className="text-white text-sm font-semibold text-center mb-1">
                        {pokemon.name}
                      </p>
                      <p className="text-gray-400 text-xs text-center">
                        #{pokemon.id}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

