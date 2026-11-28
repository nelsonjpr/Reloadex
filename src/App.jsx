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
const QuestsView = lazy(() => import('./components/QuestsView'));
const GuiaView = lazy(() => import('./components/GuiaView'));
const TeamBuilder = lazy(() => import('./components/TeamBuilder')
  .then((m) => ({ default: m.TeamBuilder })));
const Pokedex = lazy(() => import('./components/Pokedex'));
const CarasView = lazy(() => import('./components/CarasView'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

const VIEWS = ['home', 'pokedex', 'team', 'moves', 'abilities', 'guia', 'legendaries', 'objetos', 'misiones', 'caras'];

// Paleta de comandos: atajo para abrir cualquier vista escribiendo su nombre.
const COMMANDS = [
  {
    id: 'caras', text: 'cambio cara', label: 'Caras',
    description: 'Los 361 personajes del truco CARA',
    aliases: ['cambio cara', 'cambiar cara', 'cambio de cara', 'cara', 'caras'],
  },
  { id: 'pokedex', text: 'pokedex', label: 'Pokédex', description: 'Explora todos los Pokémon', aliases: ['pokedex', 'pokemon'] },
  { id: 'abilities', text: 'habilidades', label: 'Habilidades', description: 'Todas las habilidades', aliases: ['habilidades', 'abilities'] },
  { id: 'moves', text: 'movimientos', label: 'Movimientos', description: 'MTs, MOs, DTs y tutores', aliases: ['movimientos', 'moves'] },
  { id: 'misiones', text: 'misiones', label: 'Misiones', description: 'Las misiones del juego', aliases: ['misiones', 'quests'] },
  { id: 'objetos', text: 'objetos', label: 'Localización de objetos', description: 'Objetos y sus rutas', aliases: ['objetos', 'items'] },
  { id: 'legendaries', text: 'legendarios', label: 'Legendarios', description: 'Ubicaciones y capturas', aliases: ['legendarios', 'legendaries'] },
  { id: 'guia', text: 'guia', label: 'Guía', description: 'Recorrido por regiones', aliases: ['guia', 'guía', 'guide'] },
  { id: 'team', text: 'equipo', label: 'Equipo', description: 'Crea tu equipo perfecto', aliases: ['equipo', 'team'] },
];

const normalizeCommand = (text) => String(text || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const resolveCommand = (text) => {
  const q = normalizeCommand(text);
  if (!q) return null;
  return COMMANDS.find((command) => command.aliases.some((alias) => {
    const a = normalizeCommand(alias);
    return q === a || q.startsWith(`${a} `);
  })) || null;
};

const createEntry = (view, selectedPokemon = null) => ({ view, selectedPokemon });

function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--app-bg)]"
    >
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.65, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 170, damping: 14 }}
          className="relative"
        >
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
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-300"
            initial={{ scaleX: 0.1 }}
            animate={{ scaleX: [0.1, 0.85, 1] }}
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
  // Siempre arrancamos en Inicio. Antes se restauraba la última vista desde
  // localStorage y, si era Objetos, la pila quedaba sin raíz: no había forma de
  // volver a las demás pestañas.
  const [entries, setEntries] = useState(() => [createEntry('home')]);
  const currentEntry = entries[entries.length - 1];
  const currentView = currentEntry.view;
  const selectedPokemon = currentEntry.selectedPokemon;
  const overlayBackRef = useRef(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    try { localStorage.removeItem('reloadex.view'); } catch { /* noop */ }
  }, []);

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

  // Paleta de comandos: Ctrl/Cmd+K o "/" cuando no se está escribiendo.
  useEffect(() => {
    const onKey = (event) => {
      const tag = document.activeElement?.tagName || '';
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (event.key === '/' && !typing && !paletteOpen) {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen]);

  // Mientras la paleta está abierta, el back físico la cierra primero.
  useEffect(() => {
    if (!paletteOpen) return undefined;
    const previous = overlayBackRef.current;
    registerOverlayBack(() => {
      setPaletteOpen(false);
      return true;
    });
    return () => registerOverlayBack(previous);
  }, [paletteOpen, registerOverlayBack]);

  const navigate = useCallback((view) => {
    pushEntry(createEntry(view));
  }, [pushEntry]);

  const runCommand = useCallback((text) => {
    const command = resolveCommand(text);
    if (!command) return false;
    setPaletteOpen(false);
    navigate(command.id);
    return true;
  }, [navigate]);

  const closePalette = useCallback(() => setPaletteOpen(false), []);

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
    content = <Home onNavigate={navigate} onOpenPalette={() => setPaletteOpen(true)} />;
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
  } else if (currentView === 'misiones') {
    content = <QuestsView onBack={handleBack} />;
  } else if (currentView === 'caras') {
    content = <CarasView onBack={handleBack} />;
  } else {
    content = <Pokedex onBack={handleBack} onSelect={openFromList} />;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>{content}</Suspense>
      <Suspense fallback={null}>
        {paletteOpen && (
          <CommandPalette
            commands={COMMANDS}
            onRun={runCommand}
            onClose={closePalette}
          />
        )}
      </Suspense>
    </>
  );
}

export default App;
