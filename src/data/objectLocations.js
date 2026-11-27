import raw from './objectLocations.json';

export const objectLocations = Array.isArray(raw.items) ? raw.items : [];
export const objectLocationsSource = raw.source || '';
export const objectLocationStats = {
  total: objectLocations.length,
  withRoutes: objectLocations.filter((item) => Array.isArray(item.locations) && item.locations.length > 0).length,
};
