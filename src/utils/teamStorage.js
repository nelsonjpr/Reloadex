// Persistencia de equipos. Se guarda en localStorage de la WebView: sobrevive
// a actualizaciones de la APK y solo desaparece si se desinstala la app.
const TEAMS_KEY = 'reloadex:teams:v1';
const LEGACY_KEY = 'pokemonTeam';
const SLOTS = 6;

const clampLevel = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 50;
  return Math.min(100, Math.max(1, Math.round(n)));
};

export const createSlot = (pokemon, overrides = {}) => (
  pokemon
    ? {
      id: Number(pokemon.id),
      name: String(pokemon.name || ''),
      level: clampLevel(overrides.level ?? 50),
      shiny: Boolean(overrides.shiny),
      ability: overrides.ability || null,
      item: overrides.item || null,
    }
    : null
);

const normalizeSlot = (slot) => {
  if (!slot || !Number(slot.id)) return null;
  return {
    id: Number(slot.id),
    name: String(slot.name || ''),
    level: clampLevel(slot.level),
    shiny: Boolean(slot.shiny),
    ability: slot.ability || null,
    item: slot.item || null,
  };
};

export const createTeam = (number) => ({
  id: `equipo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: `Equipo ${number}`,
  slots: Array(SLOTS).fill(null),
});

const normalizeTeam = (team, index) => ({
  id: String(team?.id || `equipo-${index + 1}`),
  name: String(team?.name || `Equipo ${index + 1}`),
  slots: Array.from({ length: SLOTS }, (_, slotIndex) => normalizeSlot(team?.slots?.[slotIndex])),
});

const defaultState = () => {
  const first = createTeam(1);
  return { activeId: first.id, teams: [first] };
};

// Migra el formato antiguo: un array de hasta 6 IDs guardado en "pokemonTeam".
const migrateLegacy = () => {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return null;
    const team = createTeam(1);
    team.slots = Array.from({ length: SLOTS }, (_, i) => {
      const id = Number(ids[i]);
      return id ? createSlot({ id }) : null;
    });
    return { activeId: team.id, teams: [team] };
  } catch {
    return null;
  }
};

export const loadTeams = () => {
  try {
    const raw = localStorage.getItem(TEAMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.teams) && parsed.teams.length) {
        const teams = parsed.teams.map(normalizeTeam);
        const activeId = teams.some((t) => t.id === parsed.activeId) ? parsed.activeId : teams[0].id;
        return { activeId, teams };
      }
    }
  } catch {
    // Datos corruptos: se intenta recuperar el formato anterior.
  }
  return migrateLegacy() || defaultState();
};

export const saveTeams = (state) => {
  try {
    localStorage.setItem(TEAMS_KEY, JSON.stringify({
      version: 1,
      activeId: state.activeId,
      teams: state.teams,
    }));
    return true;
  } catch {
    return false;
  }
};
