import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, X, ChevronRight, ChevronUp } from 'lucide-react';
import Home from './components/Home';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import TypeFilter from './components/TypeFilter';
import GenerationFilter from './components/GenerationFilter';
import MovesView from './components/MovesView';
import AbilitiesView from './components/AbilitiesView';
import LegendariesView from './components/LegendariesView';
import { StoryView } from './components/StoryView';
import { TeamBuilder } from './components/TeamBuilder';
import { pokemonData, typeTranslations, typeColors } from './data/pokemon';

// Version timestamp para forzar recarga: 2024-11-26-12:30:00
function App() {
  // Cargar estado desde localStorage
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'home';
  });
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showGenFilter, setShowGenFilter] = useState(false);

  // Guardar vista actual en localStorage
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  // Scroll to top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtrar Pokémon
  const filteredPokemon = useMemo(() => {
    return pokemonData.filter(pokemon => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pokemon.id.toString().includes(searchTerm);
      const matchesType = !selectedType || pokemon.types.includes(selectedType);
      const matchesGen = !selectedGeneration || pokemon.generation === selectedGeneration;
      return matchesSearch && matchesType && matchesGen;
    });
  }, [searchTerm, selectedType, selectedGeneration]);

  const handleEvolutionNavigate = (pokemonId) => {
    const pokemon = pokemonData.find(p => p.id === pokemonId);
    if (pokemon) {
      setSelectedPokemon(pokemon);
    }
  };

  const handleMenuNavigate = (view) => {
    setCurrentView(view);
    // Reset filters when changing views
    setSearchTerm('');
    setSelectedType(null);
    setSelectedGeneration(null);
    setShowTypeFilter(false);
    setShowGenFilter(false);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPokemon(null);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const handleGenSelect = (gen) => {
    setSelectedGeneration(selectedGeneration === gen ? null : gen);
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedGeneration(null);
    setSearchTerm('');
  };

  // Render Home
  if (currentView === 'home') {
    return <Home onNavigate={handleMenuNavigate} />;
  }

  // Render Team Builder
  if (currentView === 'team') {
    return <TeamBuilder onBack={handleBackToHome} />;
  }

  // Render Moves Database
  if (currentView === 'moves') {
    return <MovesView onBack={handleBackToHome} />;
  }

  // Render Abilities Database
  if (currentView === 'abilities') {
    return <AbilitiesView onBack={handleBackToHome} />;
  }

  // Render Story Guide
  if (currentView === 'story') {
    return <StoryView onBack={handleBackToHome} />;
  }

  // Render Legendaries Guide
  if (currentView === 'legendaries') {
    return <LegendariesView onBack={handleBackToHome} />;
  }

  // Render Pokédex (vista actual)
  
  // Si hay un Pokémon seleccionado, mostrar su detalle como página completa
  if (currentView === 'pokedex' && selectedPokemon) {
    return (
      <AnimatePresence mode="wait">
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onNavigate={handleEvolutionNavigate}
        />
      </AnimatePresence>
    );
  }

  // Si la vista es 'pokedex' pero NO hay Pokémon seleccionado, mostrar la lista
  if (currentView === 'pokedex') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md pb-4 mb-4">
          {/* Back Button + Title */}
          <div className="flex items-center gap-4 mb-6 pt-4">
            <button
              onClick={handleBackToHome}
              className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                PokeYedia
              </h1>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              placeholder="Nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-16 py-3 rounded-full glass-effect text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
            <button 
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Type Filter (expandable) */}
          <AnimatePresence>
            {showTypeFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="glass-dark rounded-2xl p-4">
                  <h3 className="text-white font-semibold mb-3 text-sm">Filtrar por Tipo</h3>
                  <TypeFilter 
                    selectedType={selectedType} 
                    onSelectType={(type) => {
                      handleTypeSelect(type);
                      setShowTypeFilter(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Count */}
          <div className="text-center">
            <span className="text-white/60 text-sm">
              Mostrando <span className="text-purple-400 font-bold">{filteredPokemon.length}</span> Pokémon
            </span>
          </div>
        </div>

        {/* Pokémon List - Scrollable with custom scrollbar */}
        <div className="space-y-3 pb-8 custom-scrollbar">
          {filteredPokemon.map((pokemon, index) => (
            <motion.button
              key={pokemon.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => setSelectedPokemon(pokemon)}
              className="w-full rounded-2xl p-4 flex items-center gap-4 transition-all group relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${typeColors[pokemon.types[0]]} 0%, ${typeColors[pokemon.types[0]]}dd 100%)`
              }}
            >
              {/* Sprite */}
              <div className="w-16 h-16 flex-shrink-0 relative z-10 bg-white/10 rounded-xl">
                <img
                  src={`/sprites/normal/${pokemon.id}.gif`}
                  alt={pokemon.name}
                  className="w-full h-full object-contain pixelated drop-shadow-lg"
                  onError={(e) => {
                    e.target.src = `/sprites/normal/${String(pokemon.id).padStart(4, '0')}.gif`;
                    e.target.onerror = null;
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-left z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/90 text-sm font-mono font-bold">
                    #{String(pokemon.id).padStart(4, '0')}
                  </span>
                  <span className="text-white font-bold text-lg">
                    {pokemon.name}
                  </span>
                </div>
                
                {/* Types */}
                <div className="flex gap-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/20 backdrop-blur-sm"
                    >
                      {typeTranslations[type]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="text-white/60 group-hover:text-white transition-colors z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
            </motion.button>
          ))}
        </div>

        {filteredPokemon.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-white/60">No se encontraron Pokémon</div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-110 z-50"
          >
            <ChevronUp size={28} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    );
  }

  // Default: return home or handle other views
  return <Home onNavigate={handleMenuNavigate} />;
}

export default App;
