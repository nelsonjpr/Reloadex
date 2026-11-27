import raw from './objectLocations.json';
import { giftsByItemId } from './itemGifts';

export const objectLocations = Array.isArray(raw.items) ? raw.items : [];
export const objectLocationsSource = raw.source || '';
export const objectLocationStats = {
  total: objectLocations.length,
  withRoutes: objectLocations.filter((item) => Array.isArray(item.locations) && item.locations.length > 0).length,
  placements: raw.stats?.placements || 0,
};

export const normalizeText = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

// Índice de búsqueda precalculado una sola vez. Antes cada pulsación normalizaba
// el nombre, los regalos y las ~1345 ubicaciones de los 821 objetos. Ahora el
// texto ya está normalizado y unido en un único campo.
export const OBJECT_SEARCH_INDEX = objectLocations.map((item) => {
  const locations = Array.isArray(item.locations) ? item.locations : [];
  const gifts = giftsByItemId.get(item.id) || [];
  const haystack = [
    item.name,
    String(item.id),
    item.category,
    ...gifts.flatMap((gift) => [gift.who, gift.where, gift.when]),
    ...locations.flatMap((loc) => [loc.zone, loc.detail, loc.method]),
  ].map(normalizeText).filter(Boolean).join(' ');

  return { item, category: item.category || 'Objeto', haystack };
});
