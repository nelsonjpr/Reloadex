import React, { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './components/Home';

// Las vistas pesadas se cargan solo cuando se abren. Así el arranque no debe
// parsear los ~2,8 MB de datos (reloadex.json, guía, habilidades, movimientos).
const PokemonDetail = lazy(() => import('./components/PokemonDetail'));
const MovesView = lazy(() => import('./components/MovesView'));
const AbilitiesView = lazy(() => import('./components/AbilitiesView'));
const LegendariesView = lazy(() => import('./components/LegendariesView'));
const ObjectLocationsView = lazy(() => import('./components/ObjectLocationsView'));
const GuiaView = lazy(() => import('./components/GuiaView'));
const TeamBuilder = lazy(() => import('./components/TeamBuilder')
  .then((m) => ({ default: m.TeamBuilder })));
const Pokedex = lazy(() => import('./components/Pokedex'));

const VIEWS = ['home', 'pokedex', 'team', 'moves', 'abilities', 'guia', 'legendaries', 'objetos'];

const getInitialView = () => {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('reloadex.view') : null;
  return VIEWS.includes(saved) ? saved : 'home';
};

const createEntry = (view, selectedPokemon = null) => ({ view, selectedPokemon });

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d1a]"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 38%, rgba(139,92,246,0.30), transparent 58%)' }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.65, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 170, damping: 14 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-br from-fuchsia-500/60 via-violet-500/40 to-transparent blur-2xl" />
          <motion.img
            src="/logo-ui.png"
            alt=""
            className="relative h-28 w-28 rounded-[32px] object-cover ring-1 ring-white/25 sm:h-36 sm:w-36"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Cargando…</p>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-300"
            initial={{ width: '10%' }}
            animate={{ width: ['10%', '85%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================
// Reloadex — Pokédex profesional de Pokémon Reloaded
// =============================================================
function App() {
  // Pila de UI: cada entrada guarda la vista y el Pokémon abierto. Así el back
  // físico de Android puede volver exactamente a la pantalla anterior.
  const [entries, setEntries] = useState(() => [createEntry(getInitialView())]);
  const currentEntry = entries[entries.length - 1];
  const currentView = currentEntry.view;
  const selectedPokemon = currentEntry.selectedPokemon;
  const overlayBackRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('reloadex.view', currentView); } catch { /* noop */ }
  }, [currentView]);

  // Precalienta la Pokédex en idle: solo carga el índice ligero (~625 KB),
  // no el dataset completo que necesita la ficha.
  useEffect(() => {
    const warm = () => { import('./components/Pokedex'); };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(warm, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const pushEntry = useCallback((entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  // Todas las flechas internas y el back del sistema pasan por aquí. En la raíz
  // no se sale de la app: se consume el evento y se permanece en Inicio.
  const handleBack = useCallback(() => {
    setEntries((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    return true;
  }, []);

  const registerOverlayBack = useCallback((handler) => {
    overlayBackRef.current = typeof handler === 'function' ? handler : null;
  }, []);

  // El back físico debe cerrar primero un panel desplegable (p. ej. Movimientos)
  // antes de cambiar de pantalla.
  const handleSystemBack = useCallback(() => {
    const closeOverlay = overlayBackRef.current;
    if (typeof closeOverlay === 'function' && closeOverlay()) return true;
    return handleBack();
  }, [handleBack]);

  // MainActivity.java llama a esta función desde onBackPressed() mediante
  // WebView.evaluateJavascript. Devolver true evita que Android cierre/minimice.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window.__reloadexOnAndroidBack = handleSystemBack;
    return () => {
      if (window.__reloadexOnAndroidBack === handleSystemBack) {
        delete window.__reloadexOnAndroidBack;
      }
    };
  }, [handleSystemBack]);

  const navigate = useCallback((view) => {
    pushEntry(createEntry(view));
  }, [pushEntry]);

  // La lista usa el índice ligero; al abrir una ficha se hidrata con el
  // objeto completo (descripción, habilidades, altura, peso, etc.).
  const openFromList = async (p) => {
    const { pokemonData: fullData } = await import('./data/pokemon');
    const full = fullData.find((x) => Number(x.id) === Number(p.id));
    setEntries((prev) => [...prev, createEntry(prev[prev.length - 1].view, full || p)]);
  };

  // Navegación de evolución / mega: IDs NUMÉRICOS. El dataset se importa aquí
  // bajo demanda para no incluirlo en el chunk inicial.
  const handleEvolutionNavigate = async (pokemonId) => {
    const { pokemonData } = await import('./data/pokemon');
    const target = pokemonData.find((p) => Number(p.id) === Number(pokemonId));
    if (target) {
      setEntries((prev) => [...prev, createEntry(prev[prev.length - 1].view, target)]);
    }
  };

  const openFromTeam = (p) => {
    pushEntry(createEntry('team', p));
  };

  let content;
  if (selectedPokemon && (currentView === 'pokedex' || currentView === 'team')) {
    content = (
      <AnimatePresence mode="wait">
        <PokemonDetail
          key={selectedPokemon.id}
          pokemon={selectedPokemon}
          onClose={handleBack}
          onNavigate={handleEvolutionNavigate}
          onRegisterOverlayBack={registerOverlayBack}
        />
      </AnimatePresence>
    );
  } else if (currentView === 'home') {
    content = <Home onNavigate={navigate} />;
  } else if (currentView === 'team') {
    content = (
      <TeamBuilder
        onBack={handleBack}
        onOpen={openFromTeam}
        onRegisterOverlayBack={registerOverlayBack}
      />
    );
  } else if (currentView === 'moves') {
    content = <MovesView onBack={handleBack} />;
  } else if (currentView === 'abilities') {
    content = <AbilitiesView onBack={handleBack} />;
  } else if (currentView === 'guia') {
    content = <GuiaView onBack={handleBack} />;
  } else if (currentView === 'legendaries') {
    content = <LegendariesView onBack={handleBack} />;
  } else if (currentView === 'objetos') {
    content = <ObjectLocationsView onBack={handleBack} />;
  } else {
    content = <Pokedex onBack={handleBack} onSelect={openFromList} />;
  }

  return <Suspense fallback={<Loading />}>{content}</Suspense>;
}

export default App;
