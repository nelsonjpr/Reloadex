import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import PokemonDetail from './components/PokemonDetail';
import MovesView from './components/MovesView';
import AbilitiesView from './components/AbilitiesView';
import LegendariesView from './components/LegendariesView';
import GuiaView from './components/GuiaView';
import { TeamBuilder } from './components/TeamBuilder';
import Pokedex from './components/Pokedex';
import { pokemonData } from './data/pokemon';

const VIEWS = ['home', 'pokedex', 'team', 'moves', 'abilities', 'story', 'guia', 'legendaries'];

// =============================================================
// Reloadex — Pokédex profesional de Pokémon Reloaded
// =============================================================
function App() {
  const [currentView, setCurrentView] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('reloadex.view') : null;
    return VIEWS.includes(saved) ? saved : 'home';
  });
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    try { localStorage.setItem('reloadex.view', currentView); } catch { /* noop */ }
  }, [currentView]);

  const navigate = (view) => { setCurrentView(view); setSelectedPokemon(null); };

  // Navegación de evolución / mega: IDs NUMÉRICOS
  const handleEvolutionNavigate = (pokemonId) => {
    const target = pokemonData.find((p) => Number(p.id) === Number(pokemonId));
    if (target) setSelectedPokemon(target);
  };

  const handleBackToHome = () => { setCurrentView('home'); setSelectedPokemon(null); };

  // Detalle de Pokémon (página completa)
  if (selectedPokemon && (currentView === 'pokedex' || currentView === 'team')) {
    return (
      <AnimatePresence mode="wait">
        <PokemonDetail
          key={selectedPokemon.id}
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onNavigate={handleEvolutionNavigate}
        />
      </AnimatePresence>
    );
  }

  if (currentView === 'home') return <Home onNavigate={navigate} />;
  if (currentView === 'team') return <TeamBuilder onBack={handleBackToHome} onOpen={(p) => setSelectedPokemon(p)} />;
  if (currentView === 'moves') return <MovesView onBack={handleBackToHome} />;
  if (currentView === 'abilities') return <AbilitiesView onBack={handleBackToHome} />;
  if (currentView === 'story') return <GuiaView onBack={handleBackToHome} variant="historia" />;
  if (currentView === 'guia') return <GuiaView onBack={handleBackToHome} variant="guia" />;
  if (currentView === 'legendaries') return <LegendariesView onBack={handleBackToHome} />;

  // Pokédex (vista actual)
  return (
    <Pokedex
      onBack={handleBackToHome}
      onSelect={(p) => setSelectedPokemon(p)}
    />
  );
}

export default App;
