// GENERADO desde el juego: F3 -> CARA (ValorTrainerTrucado / NameTrainer /
// txt_character.dll y sprites de data\trainer). No editar a mano.
import rawFaces from './faces.json';

export const faces = rawFaces.map((face) => ({
  ...face,
  n: Number(face.n),
  sub: face.sub === null ? null : Number(face.sub),
  id: Number(face.id),
}));

export const principalFaces = faces.filter((face) => face.tipo === 'principal');
export const extraFaces = faces.filter((face) => face.tipo === 'adicional');

export const normalizeFaceText = (text) => String(text || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

export const FACE_SEARCH_INDEX = faces.map((face) => ({
  ...face,
  search: normalizeFaceText(`${face.nombre} ${face.id} ${face.codigo} ${face.n} ${face.sub ?? ''}`),
}));
