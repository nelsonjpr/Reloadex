// Catálogo completo de objetos de Pokémon Reloaded (821), no solo los que
// el juego permite equipar. Se reutiliza el mismo dataset de localizaciones.
import raw from './objectLocations.json';

export const allItems = (raw.items || []).map((item) => ({
  id: item.id,
  name: item.name,
  category: item.category || 'Objeto',
}));
