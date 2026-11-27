import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './components/Home';

// Las vistas pesadas se cargan solo cuando se abren. Así el arranque no debe
// parsear los ~2,8 MB de datos (reloadex.json, guía, habilidades, movimientos).
const PokemonDetail = lazy(() => import('./components/PokemonDetail'));
const MovesView = lazy(() => import('./components/MovesView'));
const AbilitiesView = lazy(() => import('./components/AbilitiesView'));
const LegendariesView = lazy(() => import('./components/LegendariesView'));
const GuiaView = lazy(() => import('./components/GuiaView'));
const TeamBuilder = lazy(() => import('./components/TeamBuilder')
  .then((m) => ({ default: m.TeamBuilder })));
const Pokedex = lazy(() => import('./components/Pokedex'));

const VIEWS = ['home', 'pokedex', 'team', 'moves', 'abilities', 'guia', 'legendaries'];

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080d1a]">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo-ui.png" alt="" className="h-12 w-12 animate-pulse rounded-2xl object-cover" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Cargando…</p>
      </div>
    </div>
  );
}

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

  // Precalienta la Pokédex en idle: el usuario la abre al instante y el coste
  // de ~1,8 MB de datos no se paga en el primer render.
  useEffect(() => {
    const warm = () => { import('./components/Pokedex'); };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(warm, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const navigate = (view) => { setCurrentView(view); setSelectedPokemon(null); };

  // Navegación de evolución / mega: IDs NUMÉRICOS. El dataset se importa aquí
  // bajo demanda para no incluirlo en el chunk inicial.
  const handleEvolutionNavigate = async (pokemonId) => {
    const { pokemonData } = await import('./data/pokemon');
    const target = pokemonData.find((p) => Number(p.id) === Number(pokemonId));
    if (target) setSelectedPokemon(target);
  };

  const handleBackToHome = () => { setCurrentView('home'); setSelectedPokemon(null); };

  let content;
  if (selectedPokemon && (currentView === 'pokedex' || currentView === 'team')) {
    content = (
      <AnimatePresence mode="wait">
        <PokemonDetail
          key={selectedPokemon.id}
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onNavigate={handleEvolutionNavigate}
        />
      </AnimatePresence>
    );
  } else if (currentView === 'home') {
    content = <Home onNavigate={navigate} />;
  } else if (currentView === 'team') {
    content = <TeamBuilder onBack={handleBackToHome} onOpen={(p) => setSelectedPokemon(p)} />;
  } else if (currentView === 'moves') {
    content = <MovesView onBack={handleBackToHome} />;
  } else if (currentView === 'abilities') {
    content = <AbilitiesView onBack={handleBackToHome} />;
  } else if (currentView === 'guia') {
    content = <GuiaView onBack={handleBackToHome} />;
  } else if (currentView === 'legendaries') {
    content = <LegendariesView onBack={handleBackToHome} />;
  } else {
    content = <Pokedex onBack={handleBackToHome} onSelect={(p) => setSelectedPokemon(p)} />;
  }

  return <Suspense fallback={<Loading />}>{content}</Suspense>;
}

export default App;
