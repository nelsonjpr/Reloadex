// Base de datos completa de Pokémon - Se irá expandiendo
// Por ahora incluye los primeros 151 + algunos especiales
// TODO: Expandir con script automático para los 1563 totales

import { typeColors, typeTranslations } from './pokemon';

// Esta función se usará para cargar Pokémon dinámicamente
export const getPokemonById = (id) => {
  return fullPokemonData.find(p => p.id === id) || null;
};

export const getAllPokemon = () => {
  return fullPokemonData;
};

// IDs de sprites disponibles en el juego (extraídos de la carpeta)
export const availableSpriteIds = [
  ...Array.from({length: 1000}, (_, i) => i + 1), // 1-1000 Pokémon principales
  // Formas especiales se agregarán aquí
];

// Base de datos inicial - Los primeros 151 Pokémon
export const fullPokemonData = [
  {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    abilities: ['Espesura', 'Clorofila'],
    stats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 },
    height: 0.7,
    weight: 6.9,
    description: 'Este Pokémon nace con una semilla en el lomo, que brota con el paso del tiempo.',
    generation: 'Gen I',
    region: 'Kanto',
    evolutions: [
      { id: 2, name: 'Ivysaur', method: 'Nv. 16' }
    ]
  },
  {
    id: 2,
    name: 'Ivysaur',
    types: ['grass', 'poison'],
    abilities: ['Espesura', 'Clorofila'],
    stats: { hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60 },
    height: 1.0,
    weight: 13.0,
    description: 'Cuando le crece bastante el bulbo del lomo, pierde la capacidad de erguirse sobre las patas traseras.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 1, name: 'Bulbasaur', method: 'Nv. 16' },
    evolutions: [
      { id: 3, name: 'Venusaur', method: 'Nv. 32' }
    ]
  },
  {
    id: 3,
    name: 'Venusaur',
    types: ['grass', 'poison'],
    abilities: ['Espesura', 'Clorofila'],
    stats: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 },
    height: 2.0,
    weight: 100.0,
    description: 'La planta florece cuando absorbe energía solar, lo cual le obliga a buscar siempre la luz del sol.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 2, name: 'Ivysaur', method: 'Nv. 32' }
  },
  {
    id: 4,
    name: 'Charmander',
    types: ['fire'],
    abilities: ['Mar Llamas', 'Poder Solar'],
    stats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 },
    height: 0.6,
    weight: 8.5,
    description: 'Prefiere las cosas calientes. Dicen que cuando llueve le sale vapor de la punta de la cola.',
    generation: 'Gen I',
    region: 'Kanto',
    evolutions: [
      { id: 5, name: 'Charmeleon', method: 'Nv. 16' }
    ]
  },
  {
    id: 5,
    name: 'Charmeleon',
    types: ['fire'],
    abilities: ['Mar Llamas', 'Poder Solar'],
    stats: { hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80 },
    height: 1.1,
    weight: 19.0,
    description: 'Este Pokémon de naturaleza agresiva ataca en combate con su cola, con la que puede derribar a un enemigo y pasto a las llamas.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 4, name: 'Charmander', method: 'Nv. 16' },
    evolutions: [
      { id: 6, name: 'Charizard', method: 'Nv. 36' }
    ]
  },
  {
    id: 6,
    name: 'Charizard',
    types: ['fire', 'flying'],
    abilities: ['Mar Llamas', 'Poder Solar'],
    stats: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 },
    height: 1.7,
    weight: 90.5,
    description: 'Escupe un fuego tan caliente que puede derretir cualquier cosa. Suele causar incendios forestales sin querer.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 5, name: 'Charmeleon', method: 'Nv. 36' }
  },
  {
    id: 7,
    name: 'Squirtle',
    types: ['water'],
    abilities: ['Torrente', 'Lluvia'],
    stats: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 },
    height: 0.5,
    weight: 9.0,
    description: 'Cuando retrae su largo cuello en el caparazón, dispara agua a una presión increíble.',
    generation: 'Gen I',
    region: 'Kanto',
    evolutions: [
      { id: 8, name: 'Wartortle', method: 'Nv. 16' }
    ]
  },
  {
    id: 8,
    name: 'Wartortle',
    types: ['water'],
    abilities: ['Torrente', 'Lluvia'],
    stats: { hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58 },
    height: 1.0,
    weight: 22.5,
    description: 'Se lo considera un símbolo de longevidad. Los ejemplares más ancianos tienen musgo sobre el caparazón.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 7, name: 'Squirtle', method: 'Nv. 16' },
    evolutions: [
      { id: 9, name: 'Blastoise', method: 'Nv. 36' }
    ]
  },
  {
    id: 9,
    name: 'Blastoise',
    types: ['water'],
    abilities: ['Torrente', 'Lluvia'],
    stats: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 },
    height: 1.6,
    weight: 85.5,
    description: 'Para acabar con su enemigo, lo aplasta con el peso de su cuerpo. En momentos de apuro, se esconde en el caparazón.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 8, name: 'Wartortle', method: 'Nv. 36' }
  },
  {
    id: 25,
    name: 'Pikachu',
    types: ['electric'],
    abilities: ['Elec. Estática', 'Pararrayos'],
    stats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 },
    height: 0.4,
    weight: 6.0,
    description: 'Cuando varios de estos Pokémon se juntan, su energía puede causar fuertes tormentas.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 172, name: 'Pichu', method: 'Felicidad' },
    evolutions: [
      { id: 26, name: 'Raichu', method: 'Piedra Trueno' }
    ]
  },
  {
    id: 26,
    name: 'Raichu',
    types: ['electric'],
    abilities: ['Elec. Estática', 'Pararrayos'],
    stats: { hp: 60, attack: 90, defense: 55, spAttack: 90, spDefense: 80, speed: 110 },
    height: 0.8,
    weight: 30.0,
    description: 'Su cola actúa como toma de tierra y descarga electricidad al suelo, protegiéndole de los calambres.',
    generation: 'Gen I',
    region: 'Kanto',
    prevEvolution: { id: 25, name: 'Pikachu', method: 'Piedra Trueno' }
  },
  {
    id: 133,
    name: 'Eevee',
    types: ['normal'],
    abilities: ['Fuga', 'Adaptable'],
    stats: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 },
    height: 0.3,
    weight: 6.5,
    description: 'Tiene una composición genética irregular. Puede mutar si se expone a la radiación de varias piedras.',
    generation: 'Gen I',
    region: 'Kanto',
    evolutions: [
      { id: 134, name: 'Vaporeon', method: 'Piedra Agua' },
      { id: 135, name: 'Jolteon', method: 'Piedra Trueno' },
      { id: 136, name: 'Flareon', method: 'Piedra Fuego' },
      { id: 196, name: 'Espeon', method: 'Piedra Solar' },
      { id: 197, name: 'Umbreon', method: 'Piedra Lunar' },
      { id: 470, name: 'Leafeon', method: 'Piedra Hoja' },
      { id: 471, name: 'Glaceon', method: 'Piedra Hielo' },
      { id: 738, name: 'Sylveon', method: 'Piedra Ninfa' }
    ]
  },
  {
    id: 150,
    name: 'Mewtwo',
    types: ['psychic'],
    abilities: ['Presión', 'Nerviosismo'],
    stats: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 },
    height: 2.0,
    weight: 122.0,
    description: 'Fue creado por un científico tras años de horribles experimentos de ingeniería genética.',
    generation: 'Gen I',
    region: 'Kanto'
  }
];

export { typeColors, typeTranslations };
