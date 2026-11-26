// Base de datos de Pokémon Legendarios y Singulares - Pokémon Reloaded
// Datos extraídos de: https://pokemonreloaded.fandom.com/es/wiki

export const legendaries = [
  {
    id: 144,
    name: 'Articuno',
    types: ['ice', 'flying'],
    location: 'Islas Espuma',
    level: 50,
    description: 'Articuno se encuentra en lo más profundo de las Islas Espuma. Debes resolver el puzzle de rocas para llegar hasta él.',
    requirements: ['MO03 Surf', 'MO04 Fuerza'],
    tips: [
      'Lleva muchas Ultra Balls',
      'Se recomienda paralizarlo o dormirlo',
      'Guarda la partida antes de enfrentarlo'
    ]
  },
  {
    id: 145,
    name: 'Zapdos',
    types: ['electric', 'flying'],
    location: 'Central Energía',
    level: 50,
    description: 'Zapdos se encuentra en la Central de Energía abandonada. Necesitas MO02 Vuelo para llegar.',
    requirements: ['MO02 Vuelo'],
    tips: [
      'Los Pokémon tipo Tierra son inmunes a sus ataques eléctricos',
      'Lleva Pokémon con buen HP',
      'Ultra Balls son esenciales'
    ]
  },
  {
    id: 146,
    name: 'Moltres',
    types: ['fire', 'flying'],
    location: 'Monte Brasa',
    level: 50,
    description: 'Moltres habita en lo alto del Monte Brasa. Necesitarás escalar hasta la cima.',
    requirements: ['MO04 Fuerza'],
    tips: [
      'Pokémon tipo Roca son muy efectivos',
      'Cuidado con sus ataques de fuego',
      'Lleva muchas Pokéballs'
    ]
  },
  {
    id: 150,
    name: 'Mewtwo',
    types: ['psychic'],
    location: 'Cueva Celeste',
    level: 70,
    description: 'El Pokémon más poderoso. Aparece en la Cueva Celeste después de derrotar a la Liga Pokémon.',
    requirements: ['Ser Campeón', 'MO03 Surf'],
    tips: [
      'Es extremadamente poderoso',
      'Lleva Master Ball si es posible',
      'Pokémon tipo Bicho o Siniestro son efectivos',
      'Ten un equipo de nivel 70+'
    ]
  },
  {
    id: 151,
    name: 'Mew',
    types: ['psychic'],
    location: 'Evento Especial',
    level: 30,
    description: 'Mew solo se puede obtener mediante eventos especiales o intercambios.',
    requirements: ['Evento especial'],
    tips: [
      'Revisa eventos del juego',
      'Puede aparecer en misiones secretas'
    ]
  },
  {
    id: 243,
    name: 'Raikou',
    types: ['electric'],
    location: 'Johto - Itinerante',
    level: 40,
    description: 'Raikou vaga por Johto después de despertar en la Torre Latón. Aparece aleatoriamente en diferentes rutas.',
    requirements: ['Liberar en Torre Latón'],
    tips: [
      'Usa Bloqueo o Sombra Trampa para evitar que huya',
      'Lleva muchas Ultra Balls rápidas',
      'Consulta la Pokédex para ver su ubicación'
    ]
  },
  {
    id: 244,
    name: 'Entei',
    types: ['fire'],
    location: 'Johto - Itinerante',
    level: 40,
    description: 'Entei vaga por Johto después de despertar en la Torre Latón. Aparece aleatoriamente en diferentes rutas.',
    requirements: ['Liberar en Torre Latón'],
    tips: [
      'Usa Bloqueo o Sombra Trampa',
      'Pokémon con ataque Mirada Media son útiles',
      'Veloz Balls funcionan bien'
    ]
  },
  {
    id: 245,
    name: 'Suicune',
    types: ['water'],
    location: 'Johto - Itinerante / Cabo Celeste',
    level: 40,
    description: 'Suicune aparece en varias ubicaciones antes de poder ser capturado en el Cabo Celeste.',
    requirements: ['Seguir su rastro'],
    tips: [
      'Aparece en múltiples lugares antes de la batalla final',
      'La batalla final es en Cabo Celeste',
      'No huye como los otros'
    ]
  },
  {
    id: 249,
    name: 'Lugia',
    types: ['psychic', 'flying'],
    location: 'Islas Remolino',
    level: 45,
    description: 'Lugia duerme en las profundidades de las Islas Remolino. Necesitas la Campana Marea.',
    requirements: ['Campana Marea', 'MO03 Surf', 'MO07 Buceo'],
    tips: [
      'Lleva Pokémon de nivel 50+',
      'Ultra Balls y Timer Balls',
      'Se recomienda paralizarlo'
    ]
  },
  {
    id: 250,
    name: 'Ho-Oh',
    types: ['fire', 'flying'],
    location: 'Torre Latón',
    level: 45,
    description: 'Ho-Oh aparece en la cima de la Torre Latón. Necesitas la Campana Clara y haber liberado a las bestias legendarias.',
    requirements: ['Campana Clara', 'Liberar las Bestias'],
    tips: [
      'Pokémon tipo Roca son muy efectivos',
      'Lleva muchas Ultra Balls',
      'Cuidado con Fuego Sagrado'
    ]
  },
  {
    id: 380,
    name: 'Latias',
    types: ['dragon', 'psychic'],
    location: 'Hoenn - Itinerante',
    level: 40,
    description: 'Después de derrotar a la Liga, elige entre Latias o Latios. Vagará por Hoenn.',
    requirements: ['Derrotar Liga Pokémon'],
    tips: [
      'Usa Bloqueo o Sombra Trampa',
      'Master Ball recomendada',
      'Aparece aleatoriamente'
    ]
  },
  {
    id: 381,
    name: 'Latios',
    types: ['dragon', 'psychic'],
    location: 'Hoenn - Itinerante',
    level: 40,
    description: 'Después de derrotar a la Liga, elige entre Latias o Latios. Vagará por Hoenn.',
    requirements: ['Derrotar Liga Pokémon'],
    tips: [
      'Usa Bloqueo o Sombra Trampa',
      'Master Ball recomendada',
      'Aparece aleatoriamente'
    ]
  },
  {
    id: 382,
    name: 'Kyogre',
    types: ['water'],
    location: 'Cueva Ancestral',
    level: 45,
    description: 'Kyogre duerme en la Cueva Ancestral. Necesitas MO07 Buceo para llegar.',
    requirements: ['MO03 Surf', 'MO07 Buceo'],
    tips: [
      'Lleva Pokémon tipo Planta o Eléctrico',
      'Master Ball altamente recomendada',
      'Lluvia constante en batalla'
    ]
  },
  {
    id: 383,
    name: 'Groudon',
    types: ['ground'],
    location: 'Cueva Tierra',
    level: 45,
    description: 'Groudon se encuentra en las profundidades de la Cueva Tierra.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Pokémon tipo Agua son muy efectivos',
      'Master Ball recomendada',
      'Sol intenso en batalla'
    ]
  },
  {
    id: 384,
    name: 'Rayquaza',
    types: ['dragon', 'flying'],
    location: 'Pilar Celeste',
    level: 70,
    description: 'Rayquaza está en la cima del Pilar Celeste. Solo accesible después de capturar a Kyogre y Groudon.',
    requirements: ['Capturar Kyogre y Groudon', 'Bici Acuática'],
    tips: [
      'Pokémon de nivel 60+',
      'Muchas Ultra Balls',
      'Tipo Hielo es superefectivo'
    ]
  },
  {
    id: 483,
    name: 'Dialga',
    types: ['steel', 'dragon'],
    location: 'Columna Lanza',
    level: 47,
    description: 'Dialga aparece en la Columna Lanza durante la historia principal de Sinnoh.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla obligatoria',
      'Guarda antes de la batalla',
      'Tipo Lucha y Tierra son efectivos'
    ]
  },
  {
    id: 484,
    name: 'Palkia',
    types: ['water', 'dragon'],
    location: 'Columna Lanza',
    level: 47,
    description: 'Palkia aparece en la Columna Lanza durante la historia principal de Sinnoh.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla obligatoria',
      'Guarda antes de la batalla',
      'Tipo Dragón y Hada son efectivos'
    ]
  },
  {
    id: 487,
    name: 'Giratina',
    types: ['ghost', 'dragon'],
    location: 'Mundo Distorsión',
    level: 47,
    description: 'Giratina habita en el Mundo Distorsión. Accesible después de capturar a Dialga/Palkia.',
    requirements: ['Capturar Dialga o Palkia'],
    tips: [
      'El Mundo Distorsión es un laberinto',
      'Tipo Hielo, Dragón y Hada efectivos',
      'Lleva muchas Pokéballs'
    ]
  },
  {
    id: 643,
    name: 'Reshiram',
    types: ['dragon', 'fire'],
    location: 'Torre Dragospiral',
    level: 50,
    description: 'Reshiram aparece en la Torre Dragospiral durante la historia de Teselia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla principal de la historia',
      'Captura obligatoria',
      'Tipo Dragón, Tierra y Roca efectivos'
    ]
  },
  {
    id: 644,
    name: 'Zekrom',
    types: ['dragon', 'electric'],
    location: 'Torre Dragospiral',
    level: 50,
    description: 'Zekrom aparece en la Torre Dragospiral durante la historia de Teselia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla principal de la historia',
      'Captura obligatoria',
      'Tipo Dragón, Tierra y Hielo efectivos'
    ]
  },
  {
    id: 646,
    name: 'Kyurem',
    types: ['dragon', 'ice'],
    location: 'Cueva Gigante',
    level: 75,
    description: 'Kyurem se encuentra en la Cueva Gigante después de completar la Liga Pokémon.',
    requirements: ['Ser Campeón'],
    tips: [
      'Uno de los más difíciles',
      'Nivel muy alto (75)',
      'Tipo Lucha, Roca y Acero efectivos',
      'Master Ball recomendada'
    ]
  },
  {
    id: 716,
    name: 'Xerneas',
    types: ['fairy'],
    location: 'Árbol Ilusorio',
    level: 50,
    description: 'Xerneas duerme en el Árbol Ilusorio de Kalos. Batalla obligatoria en la historia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla principal',
      'Captura obligatoria',
      'Tipo Veneno y Acero efectivos'
    ]
  },
  {
    id: 717,
    name: 'Yveltal',
    types: ['dark', 'flying'],
    location: 'Cueva Desenlace',
    level: 50,
    description: 'Yveltal aparece en la Cueva Desenlace. Batalla obligatoria en la historia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla principal',
      'Captura obligatoria',
      'Tipo Hielo, Eléctrico, Hada y Roca efectivos'
    ]
  },
  {
    id: 718,
    name: 'Zygarde',
    types: ['dragon', 'ground'],
    location: 'Cueva Desenlace',
    level: 70,
    description: 'Zygarde se encuentra en las profundidades de la Cueva Desenlace después de la historia.',
    requirements: ['Completar historia principal'],
    tips: [
      'Nivel alto (70)',
      'Tipo Hielo es 4x efectivo',
      'Lleva muchas Ultra Balls'
    ]
  },
  {
    id: 785,
    name: 'Tapu Koko',
    types: ['electric', 'fairy'],
    location: 'Ruinas del Conflicto',
    level: 60,
    description: 'Tapu Koko es el guardián de Melemele. Se encuentra en las Ruinas del Conflicto.',
    requirements: ['Ser Campeón'],
    tips: [
      'Batalla automática al acercarse',
      'Puede huir, ten cuidado',
      'Tipo Tierra y Veneno efectivos'
    ]
  },
  {
    id: 791,
    name: 'Solgaleo',
    types: ['psychic', 'steel'],
    location: 'Altar del Sol',
    level: 55,
    description: 'Solgaleo aparece en el Altar del Sol. Batalla principal de la historia de Alola.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla obligatoria',
      'Captura parte de la historia',
      'Tipo Fuego, Tierra y Fantasma efectivos'
    ]
  },
  {
    id: 792,
    name: 'Lunala',
    types: ['psychic', 'ghost'],
    location: 'Altar de la Luna',
    level: 55,
    description: 'Lunala aparece en el Altar de la Luna. Batalla principal de la historia de Alola.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla obligatoria',
      'Captura parte de la historia',
      'Tipo Fantasma y Siniestro efectivos'
    ]
  },
  {
    id: 800,
    name: 'Necrozma',
    types: ['psychic'],
    location: 'Túnel Fractal',
    level: 75,
    description: 'Necrozma aparece en el Túnel Fractal después de la historia principal.',
    requirements: ['Completar historia', 'Capturar Solgaleo/Lunala'],
    tips: [
      'Muy poderoso (nivel 75)',
      'Tipo Bicho, Fantasma y Siniestro efectivos',
      'Master Ball altamente recomendada'
    ]
  },
  {
    id: 888,
    name: 'Zacian',
    types: ['fairy'],
    location: 'Bosque Durmiente',
    level: 70,
    description: 'Zacian aparece en el Bosque Durmiente de Galar. Batalla obligatoria en la historia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla principal',
      'Captura obligatoria',
      'Tipo Acero y Veneno efectivos'
    ]
  },
  {
    id: 889,
    name: 'Zamazenta',
    types: ['fighting'],
    location: 'Bosque Durmiente',
    level: 70,
    description: 'Zamazenta aparece en el Bosque Durmiente de Galar. Batalla obligatoria en la historia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla principal',
      'Captura obligatoria',
      'Tipo Volador, Psíquico y Hada efectivos'
    ]
  },
  {
    id: 890,
    name: 'Eternatus',
    types: ['poison', 'dragon'],
    location: 'Torre Hammerlocke',
    level: 60,
    description: 'Eternatus aparece en la cima de la Torre Hammerlocke. Batalla final de la historia.',
    requirements: ['Avanzar en historia'],
    tips: [
      'Batalla final obligatoria',
      'Captura garantizada',
      'Tipo Psíquico, Tierra, Hielo y Dragón efectivos'
    ]
  }
];

export const getLegendariesByGeneration = (gen) => {
  const ranges = {
    1: [144, 151],
    2: [243, 251],
    3: [377, 386],
    4: [480, 493],
    5: [638, 649],
    6: [716, 721],
    7: [785, 809],
    8: [888, 898],
    9: [1001, 1010]
  };
  
  const range = ranges[gen];
  if (!range) return [];
  
  return legendaries.filter(l => l.id >= range[0] && l.id <= range[1]);
};

export const getLegendariesByType = (type) => {
  return legendaries.filter(l => l.types.includes(type));
};
