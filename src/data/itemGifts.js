// GENERADO por scripts/buildItemGifts.mjs. No editar a mano.
import raw from './itemGifts.json';

export const itemGifts = raw.gifts;

export const giftsByItemId = itemGifts.reduce((map, gift) => {
  const list = map.get(gift.itemId) || [];
  list.push(gift);
  map.set(gift.itemId, list);
  return map;
}, new Map());
