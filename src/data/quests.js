import raw from './quests.json';

export const quests = Array.isArray(raw.quests) ? raw.quests : [];
export const questStats = raw.stats || {};
export const questGroups = raw.groups || [];

export const normalizeQuestText = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

// 144 misiones: el texto de búsqueda se normaliza una sola vez al cargar.
export const QUEST_SEARCH_INDEX = quests.map((quest) => ({
  quest,
  group: quest.group,
  haystack: [
    quest.id,
    quest.title,
    quest.description,
    quest.resolution,
    ...quest.objectives.map((objective) => objective.text),
  ].map(normalizeQuestText).filter(Boolean).join(' '),
}));
