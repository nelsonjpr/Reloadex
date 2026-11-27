// GENERADO desde los DLL del juego y PokemonHabilidad.gml.txt. No editar a mano.
// Regenerar con: node scripts/buildAbilities.mjs
import reloadexData from './reloadex.json';
import { abilityId } from './abilityNames.es';

const POKEMON = Array.isArray(reloadexData)
  ? reloadexData
  : (reloadexData.pokemon || reloadexData.data || []);

export const abilities = [
  {
    "id": 268,
    "key": "Beads of Ruin",
    "name": "Abalorio debacle",
    "description": "Reduce la Def. Esp. del resto de Pokémon en un 25%.",
    "sortEs": 1,
    "sortEn": 20
  },
  {
    "id": 11,
    "key": "Water Absorb",
    "name": "Absorbe Agua",
    "description": "Absorbe ataques acuáticos y recupera salud.",
    "sortEs": 2,
    "sortEn": 301
  },
  {
    "id": 10,
    "key": "Volt Absorb",
    "name": "Absorbe Electricidad",
    "description": "Absorbe ataques eléctricos y recupera salud.",
    "sortEs": 3,
    "sortEn": 299
  },
  {
    "id": 18,
    "key": "Flash Fire",
    "name": "Absorbe Fuego",
    "description": "Absorbe ataques de fuego y aumenta su poder ígneo.",
    "sortEs": 4,
    "sortEn": 73
  },
  {
    "id": 215,
    "key": "Steelworker",
    "name": "Acero Templado",
    "description": "Potencia los ataques de tipo Acero en un 50%.",
    "sortEs": 5,
    "sortEn": 252
  },
  {
    "id": 242,
    "key": "Stalwart",
    "name": "Acérrimo",
    "description": "Ignora movimientos y habilidades de cambio de objetivo.",
    "sortEs": 6,
    "sortEn": 246
  },
  {
    "id": 13,
    "key": "Cloud Nine",
    "name": "Aclimatación",
    "description": "Anula los efectos climáticos.",
    "sortEs": 7,
    "sortEn": 31
  },
  {
    "id": 91,
    "key": "Adaptability",
    "name": "Adaptable",
    "description": "Aumenta el poder de los ataques que reciben STAB.",
    "sortEs": 8,
    "sortEn": 1
  },
  {
    "id": 105,
    "key": "Super Luck",
    "name": "Afortunado",
    "description": "Aumenta las probabilidades de asestar golpes críticos.",
    "sortEs": 9,
    "sortEn": 260
  },
  {
    "id": 62,
    "key": "Guts",
    "name": "Agallas",
    "description": "Aumenta su At. si sufre un cambio de estado.",
    "sortEs": 10,
    "sortEn": 94
  },
  {
    "id": 230,
    "key": "Power Construct",
    "name": "Agrupamiento",
    "description": "Si su salud es inferior a la mitad, cambia de forma.",
    "sortEs": 11,
    "sortEn": 181
  },
  {
    "id": 181,
    "key": "Gale Wings",
    "name": "Alas Vendaval",
    "description": "Aumenta la vel. de ataques voladores con PS > 90%.",
    "sortEs": 12,
    "sortEn": 83
  },
  {
    "id": 108,
    "key": "Forewarn",
    "name": "Alerta",
    "description": "Predice el ataque de mayor poder del rival.",
    "sortEs": 13,
    "sortEn": 78
  },
  {
    "id": 151,
    "key": "Infiltrator",
    "name": "Allanamiento",
    "description": "Ignora Pantalla Luz, Reflejo, Velo Sagrado y Neblina.",
    "sortEs": 14,
    "sortEn": 115
  },
  {
    "id": 252,
    "key": "Steely Spirit",
    "name": "Alma Acerada",
    "description": "Aumenta en un 50% la potencia de los movimientos de tipo acero.",
    "sortEs": 15,
    "sortEn": 253
  },
  {
    "id": 131,
    "key": "Healer",
    "name": "Alma Cura",
    "description": "Puede curar el estado de los Pokémon de su equipo.",
    "sortEs": 16,
    "sortEn": 98
  },
  {
    "id": 254,
    "key": "Wandering Spirit",
    "name": "Alma Errante",
    "description": "Tras un golpe por contacto, intercambia la habilidad con el rival.",
    "sortEs": 17,
    "sortEn": 300
  },
  {
    "id": 169,
    "key": "Parental Bond",
    "name": "Amor Filial",
    "description": "Su cría ayuda en combate y se realizan ataques dobles.",
    "sortEs": 18,
    "sortEn": 169
  },
  {
    "id": 178,
    "key": "Bulletproof",
    "name": "Antibalas",
    "description": "Inmunidad a ataques basados en cañones, bombas y bolas.",
    "sortEs": 19,
    "sortEn": 25
  },
  {
    "id": 251,
    "key": "Screen Cleaner",
    "name": "Antibarrera",
    "description": "Anula el efecto de los movimientos barrera en combate.",
    "sortEs": 20,
    "sortEn": 220
  },
  {
    "id": 107,
    "key": "Anticipation",
    "name": "Anticipación",
    "description": "Predice ataques peligrosos del rival.",
    "sortEs": 21,
    "sortEn": 8
  },
  {
    "id": 90,
    "key": "Poison Heal",
    "name": "Antídoto",
    "description": "El envenenamiento en lugar de dañar, restaura la salud.",
    "sortEs": 22,
    "sortEn": 177
  },
  {
    "id": 4,
    "key": "Battle Armor",
    "name": "Armadura Batalla",
    "description": "Los ataques del rival nunca serán Golpe Crítico.",
    "sortEs": 23,
    "sortEn": 18
  },
  {
    "id": 133,
    "key": "Weak Armor",
    "name": "Armadura Frágil",
    "description": "Si el enemigo lo golpea puede bajar su Def. y subir su Vel.",
    "sortEs": 24,
    "sortEn": 305
  },
  {
    "id": 227,
    "key": "Prism Armor",
    "name": "Armadura Prisma",
    "description": "Reduce en 1/4 el daño de movimientos muy efectivos.",
    "sortEs": 25,
    "sortEn": 187
  },
  {
    "id": 120,
    "key": "Reckless",
    "name": "Audaz",
    "description": "Aumenta el poder de los ataques con daño de retroceso.",
    "sortEs": 26,
    "sortEn": 202
  },
  {
    "id": 187,
    "key": "Fairy Aura",
    "name": "Aura Feérica",
    "description": "Aumenta el poder de los ataques de tipo Hada.",
    "sortEs": 27,
    "sortEn": 68
  },
  {
    "id": 188,
    "key": "Dark Aura",
    "name": "Aura Oscura",
    "description": "Aumenta el poder de los ataques de tipo Siniestro.",
    "sortEs": 28,
    "sortEn": 47
  },
  {
    "id": 153,
    "key": "Moxie",
    "name": "Autoestima",
    "description": "Si debilita a un enemigo aumenta su nivel de At.",
    "sortEs": 29,
    "sortEn": 153
  },
  {
    "id": 185,
    "key": "Gooey",
    "name": "Baba",
    "description": "Si recibe un ataque de contacto, baja la Vel. al enemigo.",
    "sortEs": 30,
    "sortEn": 87
  },
  {
    "id": 197,
    "key": "Schooling",
    "name": "Banco",
    "description": "A partir del nivel 20 puede cambiar a la forma Banco.",
    "sortEs": 31,
    "sortEn": 218
  },
  {
    "id": 231,
    "key": "Battery",
    "name": "Batería",
    "description": "Aumenta un 30% el At. Esp. del resto del equipo.",
    "sortEs": 32,
    "sortEn": 17
  },
  {
    "id": 158,
    "key": "Prankster",
    "name": "Bromista",
    "description": "Ataques con potencia cero consumen menos PP.",
    "sortEs": 33,
    "sortEn": 184
  },
  {
    "id": 69,
    "key": "Rock Head",
    "name": "Cabeza Roca",
    "description": "No sufre daño de retroceso en ataques arriesgados.",
    "sortEs": 34,
    "sortEn": 208
  },
  {
    "id": 119,
    "key": "Frisk",
    "name": "Cacheo",
    "description": "Averigua el objeto que tiene equipado el rival.",
    "sortEs": 35,
    "sortEn": 80
  },
  {
    "id": 307,
    "key": "Toxic Chain",
    "name": "Cadena Tóxica",
    "description": "Puede envenenar al enemigo tras asestarle un golpe.",
    "sortEs": 36,
    "sortEn": 285
  },
  {
    "id": 36,
    "key": "Trace",
    "name": "Calco",
    "description": "Copia la habilidad del Pokémon rival.",
    "sortEs": 37,
    "sortEn": 287
  },
  {
    "id": 148,
    "key": "Analytic",
    "name": "Cálculo Final",
    "description": "Si el rival es más rápido, aumenta su At. y su At. Esp.",
    "sortEs": 38,
    "sortEn": 5
  },
  {
    "id": 269,
    "key": "Vessel of Ruin",
    "name": "Caldero debacle",
    "description": "Reduce la At. Esp. del resto de Pokémon en un 25%.",
    "sortEs": 39,
    "sortEn": 296
  },
  {
    "id": 16,
    "key": "Color Change",
    "name": "Cambio Color",
    "description": "Cambia su tipo al del último ataque recibido.",
    "sortEs": 40,
    "sortEn": 32
  },
  {
    "id": 270,
    "key": "Zero to Hero",
    "name": "Cambio heroico",
    "description": "Tras ser retirado, al volver de nuevo cambia de forma.",
    "sortEs": 41,
    "sortEn": 314
  },
  {
    "id": 174,
    "key": "Stance Change",
    "name": "Cambio Táctico",
    "description": "Puede cambiar entre su forma escudo y su forma filo.",
    "sortEs": 42,
    "sortEn": 248
  },
  {
    "id": 271,
    "key": "Toxic Debris",
    "name": "Capa tóxica",
    "description": "Dispersa una capa de púas tóxicas si es golpeado físicamente.",
    "sortEs": 43,
    "sortEn": 286
  },
  {
    "id": 75,
    "key": "Shell Armor",
    "name": "Caparazón",
    "description": "Los ataques del rival nunca serán Golpe Crítico.",
    "sortEs": 44,
    "sortEn": 228
  },
  {
    "id": 248,
    "key": "Ice Face",
    "name": "Cara de Hielo",
    "description": "Recubre su cabeza con hielo para resistir ataques físicos.",
    "sortEs": 45,
    "sortEn": 109
  },
  {
    "id": 272,
    "key": "Quark Drive",
    "name": "Carga cuark",
    "description": "Con campo eléctrico aumenta su stat más poderoso en un 30%.",
    "sortEs": 46,
    "sortEn": 195
  },
  {
    "id": 171,
    "key": "Cheek Pouch",
    "name": "Carrillo",
    "description": "Restaura su salud tras consumir una baya.",
    "sortEs": 47,
    "sortEn": 26
  },
  {
    "id": 45,
    "key": "Sand Stream",
    "name": "Chorro Arena",
    "description": "Al entrar en combate produce una Tormenta Arena.",
    "sortEs": 48,
    "sortEn": 215
  },
  {
    "id": 34,
    "key": "Chlorophyll",
    "name": "Clorofila",
    "description": "Duplica su Vel. si hace Sol.",
    "sortEs": 49,
    "sortEn": 29
  },
  {
    "id": 155,
    "key": "Rattled",
    "name": "Cobardía",
    "description": "Sube su Vel. al ser herido por siniestro, fantasma o bicho.",
    "sortEs": 50,
    "sortEn": 200
  },
  {
    "id": 273,
    "key": "Armor Tail",
    "name": "Cola armadura",
    "description": "Impide que los Pokémon oponentes usen ataques con prioridad.",
    "sortEs": 51,
    "sortEn": 10
  },
  {
    "id": 228,
    "key": "Surge Surfer",
    "name": "Cola Surf",
    "description": "Aumenta la Vel. cuando existe un Campo Eléctrico.",
    "sortEs": 52,
    "sortEn": 263
  },
  {
    "id": 114,
    "key": "Storm Drain",
    "name": "Colector",
    "description": "Inmunidad a ataques de tipo Agua. Aumentan su At. Esp.",
    "sortEs": 53,
    "sortEn": 256
  },
  {
    "id": 214,
    "key": "Berserk",
    "name": "Cólera",
    "description": "Sube su At. Esp. si un golpe baja su PS por debajo del 50%.",
    "sortEs": 54,
    "sortEn": 22
  },
  {
    "id": 274,
    "key": "Commander",
    "name": "Comandar",
    "description": "Puede tomar el control de un Dondozo aliado en combate.",
    "sortEs": 55,
    "sortEn": 34
  },
  {
    "id": 243,
    "key": "Steam Engine",
    "name": "Combustible",
    "description": "Los ataques de agua o fuego aumentan su Vel. en 6 niveles.",
    "sortEs": 56,
    "sortEn": 251
  },
  {
    "id": 128,
    "key": "Defiant",
    "name": "Competitivo",
    "description": "Si modifican sus stats aumenta su nivel de At.",
    "sortEs": 57,
    "sortEn": 51
  },
  {
    "id": 132,
    "key": "Friend Guard",
    "name": "Compiescolta",
    "description": "Al ser intercambiado baja At. y At. Esp. al enemigo.",
    "sortEs": 58,
    "sortEn": 79
  },
  {
    "id": 222,
    "key": "Soul-Heart",
    "name": "Coránima",
    "description": "Aumenta su At. Esp. cuando un Pokémon cae debilitado.",
    "sortEs": 59,
    "sortEn": 240
  },
  {
    "id": 275,
    "key": "Anger Shell",
    "name": "Coraza ira",
    "description": "Si su PS se reduce a la mitad o menos, modifica sus stats.",
    "sortEs": 60,
    "sortEn": 7
  },
  {
    "id": 240,
    "key": "Mirror Armor",
    "name": "Coraza Reflejo",
    "description": "Refleja disminuciones de stats al enemigo que se las causó.",
    "sortEs": 61,
    "sortEn": 148
  },
  {
    "id": 201,
    "key": "Corrosion",
    "name": "Corrosión",
    "description": "Puede envenenar a Pokémon de tipo Veneno y Acero.",
    "sortEs": 62,
    "sortEn": 38
  },
  {
    "id": 276,
    "key": "Sharpness",
    "name": "Cortante",
    "description": "Aumenta en un 50% la potencia de los ataques basados en cortes.",
    "sortEs": 63,
    "sortEn": 225
  },
  {
    "id": 52,
    "key": "Hyper Cutter",
    "name": "Corte Fuerte",
    "description": "El Pokémon rival no le puede bajar el At.",
    "sortEs": 64,
    "sortEn": 107
  },
  {
    "id": 139,
    "key": "Harvest",
    "name": "Cosecha",
    "description": "A veces puede conservar una baya tras su uso.",
    "sortEs": 65,
    "sortEn": 97
  },
  {
    "id": 314,
    "key": "Fire Mane",
    "name": "Crin de Fuego",
    "description": "Potencia los ataques de tipo Fuego en un 50%.",
    "sortEs": 66,
    "sortEn": 70
  },
  {
    "id": 110,
    "key": "Tinted Lens",
    "name": "Cromolente",
    "description": "Duplica el poder de los ataques poco efectivos.",
    "sortEs": 67,
    "sortEn": 281
  },
  {
    "id": 277,
    "key": "Good As Gold",
    "name": "Cuerpo áureo",
    "description": "No se ve afectado por ataques de estado lanzados por el enemigo.",
    "sortEs": 68,
    "sortEn": 86
  },
  {
    "id": 278,
    "key": "Well-Baked Body",
    "name": "Cuerpo horneado",
    "description": "Inmunidad a movimientos de tipo fuego. Aumentan su Def.",
    "sortEs": 69,
    "sortEn": 306
  },
  {
    "id": 49,
    "key": "Flame Body",
    "name": "Cuerpo Llama",
    "description": "Si el enemigo lo golpea puede resultar quemado.",
    "sortEs": 70,
    "sortEn": 71
  },
  {
    "id": 130,
    "key": "Cursed Body",
    "name": "Cuerpo Maldito",
    "description": "Si el enemigo lo golpea puede anular el ataque recibido.",
    "sortEs": 71,
    "sortEn": 43
  },
  {
    "id": 253,
    "key": "Perish Body",
    "name": "Cuerpo Mortal",
    "description": "Tras un golpe por contacto, ambos Pokémon se debilitan al cabo de un rato.",
    "sortEs": 72,
    "sortEn": 171
  },
  {
    "id": 29,
    "key": "Clear Body",
    "name": "Cuerpo Puro",
    "description": "El rival no le puede bajar sus stats.",
    "sortEs": 73,
    "sortEn": 30
  },
  {
    "id": 213,
    "key": "Dazzling",
    "name": "Cuerpo Vívido",
    "description": "Los ataques de alta prioridad del rival dejan de serlo.",
    "sortEs": 74,
    "sortEn": 49
  },
  {
    "id": 44,
    "key": "Rain Dish",
    "name": "Cura Lluvia",
    "description": "Recupera su salud cuando llueve.",
    "sortEs": 75,
    "sortEn": 199
  },
  {
    "id": 30,
    "key": "Natural Cure",
    "name": "Cura Natural",
    "description": "Se recupera de los cambios de estado con el intercambio.",
    "sortEs": 76,
    "sortEn": 158
  },
  {
    "id": 102,
    "key": "Leaf Guard",
    "name": "Defensa Hoja",
    "description": "Con bochorno no es posíble cambiar su estado.",
    "sortEs": 77,
    "sortEn": 126
  },
  {
    "id": 88,
    "key": "Download",
    "name": "Descarga",
    "description": "Sube At. ó At. Esp. dependiendo de la Def. y Def. Esp. del rival.",
    "sortEs": 78,
    "sortEn": 55
  },
  {
    "id": 12,
    "key": "Oblivious",
    "name": "Despiste",
    "description": "Inmunidad a la atracción.",
    "sortEs": 79,
    "sortEn": 163
  },
  {
    "id": 106,
    "key": "Aftermath",
    "name": "Detonación",
    "description": "Si es debilitado con un ataque de contacto, hiere al rival.",
    "sortEs": 80,
    "sortEn": 3
  },
  {
    "id": 32,
    "key": "Serene Grace",
    "name": "Dicha",
    "description": "Dobla las probabilidades de provocar efectos secundarios.",
    "sortEs": 81,
    "sortEn": 222
  },
  {
    "id": 279,
    "key": "Electromorphosis",
    "name": "Dinamo",
    "description": "Tras recibir daño, su siguiente ataque eléctrico duplica su poder.",
    "sortEs": 82,
    "sortEn": 66
  },
  {
    "id": 280,
    "key": "Seed Sower",
    "name": "Disemillar",
    "description": "Al ser golpeado produce un Campo de Hierba.",
    "sortEs": 83,
    "sortEn": 221
  },
  {
    "id": 212,
    "key": "Disguise",
    "name": "Disfraz",
    "description": "No sufre daño con el primer ataque recibido en combate.",
    "sortEs": 84,
    "sortEn": 54
  },
  {
    "id": 122,
    "key": "Flower Gift",
    "name": "Don Floral",
    "description": "Aumenta su At. y Def. Esp. con día soleado.",
    "sortEs": 85,
    "sortEn": 74
  },
  {
    "id": 27,
    "key": "Effect Spore",
    "name": "Efecto Espora",
    "description": "Si el enemigo lo golpea puede sufrir un cambio de estado.",
    "sortEs": 86,
    "sortEn": 64
  },
  {
    "id": 9,
    "key": "Static",
    "name": "Electricidad Estática",
    "description": "Si el enemigo lo golpea puede resultar paralizado.",
    "sortEs": 87,
    "sortEn": 249
  },
  {
    "id": 216,
    "key": "Electric Surge",
    "name": "Electrogénesis",
    "description": "Genera un Campo Eléctrico cuando entra en combate.",
    "sortEs": 88,
    "sortEn": 65
  },
  {
    "id": 78,
    "key": "Motor Drive",
    "name": "Electromotor",
    "description": "Inmunidad a ataques de tipo Eléctrico. Aumentan su Vel.",
    "sortEs": 89,
    "sortEn": 152
  },
  {
    "id": 92,
    "key": "Skill Link",
    "name": "Encadenado",
    "description": "Garantiza el máximo golpeo en ataques múltiples.",
    "sortEs": 90,
    "sortEn": 232
  },
  {
    "id": 281,
    "key": "Wind Power",
    "name": "Energía eólica",
    "description": "Tras un ataque de viento, su siguiente ataque eléctrico duplica su poder.",
    "sortEs": 91,
    "sortEn": 309
  },
  {
    "id": 74,
    "key": "Pure Power",
    "name": "Energía Pura",
    "description": "Duplica su poder de At.",
    "sortEs": 92,
    "sortEn": 193
  },
  {
    "id": 68,
    "key": "Swarm",
    "name": "Enjambre",
    "description": "Mejora ataques de Bicho cuando la salud escasea.",
    "sortEs": 93,
    "sortEn": 264
  },
  {
    "id": 198,
    "key": "Merciless",
    "name": "Ensañamiento",
    "description": "Si el objetivo está envenenado siempre realiza golpe crítico.",
    "sortEs": 94,
    "sortEn": 144
  },
  {
    "id": 55,
    "key": "Hustle",
    "name": "Entusiasmo",
    "description": "Sube el daño de ataques físicos pero reduce su precisión.",
    "sortEs": 95,
    "sortEn": 105
  },
  {
    "id": 246,
    "key": "Ice Scales",
    "name": "Escama de Hielo",
    "description": "Reduce a la mitad el daño recibido de ataques especiales.",
    "sortEs": 96,
    "sortEn": 110
  },
  {
    "id": 63,
    "key": "Marvel Scale",
    "name": "Escama Especial",
    "description": "Aumenta su Def. si sufre un cambio de estado.",
    "sortEs": 97,
    "sortEn": 141
  },
  {
    "id": 76,
    "key": "Air Lock",
    "name": "Esclusa de Aire",
    "description": "Anula los efectos climáticos durante todo el combate.",
    "sortEs": 98,
    "sortEn": 4
  },
  {
    "id": 210,
    "key": "Shields Down",
    "name": "Escudo Limitado",
    "description": "En su forma meteorito no es posible cambiar su estado.",
    "sortEs": 99,
    "sortEn": 230
  },
  {
    "id": 40,
    "key": "Magma Armor",
    "name": "Escudo Magma",
    "description": "Inmunidad al congelamiento.",
    "sortEs": 100,
    "sortEn": 139
  },
  {
    "id": 235,
    "key": "Dauntless Shield",
    "name": "Escudo Recio",
    "description": "Aumenta la Defensa al entrar en combate.",
    "sortEs": 101,
    "sortEn": 48
  },
  {
    "id": 282,
    "key": "Sword of Ruin",
    "name": "Espada debacle",
    "description": "Reduce la Def. del resto de Pokémon en un 25%.",
    "sortEs": 102,
    "sortEn": 267
  },
  {
    "id": 234,
    "key": "Intrepid Sword",
    "name": "Espada Indómita",
    "description": "Aumenta el Ataque al entrar en combate.",
    "sortEs": 103,
    "sortEn": 120
  },
  {
    "id": 156,
    "key": "Magic Bounce",
    "name": "Espejo Mágico",
    "description": "Devuelve al enemigo el efecto de ataques de estado.",
    "sortEs": 104,
    "sortEn": 136
  },
  {
    "id": 65,
    "key": "Overgrow",
    "name": "Espesura",
    "description": "Mejora ataques de Planta cuando la salud escasea.",
    "sortEs": 105,
    "sortEn": 167
  },
  {
    "id": 72,
    "key": "Vital Spirit",
    "name": "Espíritu Vital",
    "description": "Inmunidad al sueño.",
    "sortEs": 106,
    "sortEn": 298
  },
  {
    "id": 101,
    "key": "Technician",
    "name": "Experto",
    "description": "Los ataques débiles (PB<=60) aumentan su poder un 50%.",
    "sortEs": 107,
    "sortEn": 273
  },
  {
    "id": 245,
    "key": "Sand Spit",
    "name": "Expulsarena",
    "description": "Al ser golpeado produce una Tormenta Arena.",
    "sortEs": 108,
    "sortEn": 214
  },
  {
    "id": 111,
    "key": "Filter",
    "name": "Filtro",
    "description": "Reduce el poder de los ataques recibidos efectivos.",
    "sortEs": 109,
    "sortEn": 69
  },
  {
    "id": 199,
    "key": "Stamina",
    "name": "Firmeza",
    "description": "Sube su Def. al ser golpeado por un ataque de daño directo.",
    "sortEs": 110,
    "sortEn": 247
  },
  {
    "id": 129,
    "key": "Defeatist",
    "name": "Flaqueza",
    "description": "Si su PS es inferior a la mitad, baja su At. y At. Esp.",
    "sortEs": 111,
    "sortEn": 50
  },
  {
    "id": 7,
    "key": "Limber",
    "name": "Flexibilidad",
    "description": "Inmunidad a la paralización.",
    "sortEs": 112,
    "sortEn": 131
  },
  {
    "id": 97,
    "key": "Sniper",
    "name": "Francotirador",
    "description": "El poder de los golpes críticos pasa del doble al triple.",
    "sortEs": 113,
    "sortEn": 235
  },
  {
    "id": 249,
    "key": "Power Spot",
    "name": "Fuente Energía",
    "description": "Aumenta la potencia de los movimientos de los Pokémon aliados.",
    "sortEs": 114,
    "sortEn": 183
  },
  {
    "id": 232,
    "key": "Battle Bond",
    "name": "Fuerte Afecto",
    "description": "Cambia de forma tras debilitar a un oponente.",
    "sortEs": 115,
    "sortEn": 19
  },
  {
    "id": 308,
    "key": "Neuroforce",
    "name": "Fuerza Cerebral",
    "description": "Aumenta la potencia de los movimientos supereficaces.",
    "sortEs": 116,
    "sortEn": 159
  },
  {
    "id": 39,
    "key": "Inner Focus",
    "name": "Fuerza mental",
    "description": "El Pokémon nunca retrocederá.",
    "sortEs": 117,
    "sortEn": 117
  },
  {
    "id": 50,
    "key": "Run Away",
    "name": "Fuga",
    "description": "Puede ser intercambiado aunque esté atrapado.",
    "sortEs": 118,
    "sortEn": 211
  },
  {
    "id": 142,
    "key": "Overcoat",
    "name": "Funda",
    "description": "Inmunidad a los daños producidos por el clima.",
    "sortEs": 119,
    "sortEn": 166
  },
  {
    "id": 167,
    "key": "Tough Claws",
    "name": "Garra Dura",
    "description": "Aumenta el poder de ataques físicos de contacto en un 30%.",
    "sortEs": 120,
    "sortEn": 283
  },
  {
    "id": 256,
    "key": "Neutralizing Gas",
    "name": "Gas Reactivo",
    "description": "Anula todas las habilidades de los Pokémon que estén en combate.",
    "sortEs": 121,
    "sortEn": 160
  },
  {
    "id": 115,
    "key": "Ice Body",
    "name": "Gélido",
    "description": "Recupera su salud cuando graniza.",
    "sortEs": 122,
    "sortEn": 108
  },
  {
    "id": 283,
    "key": "Supreme Overlord",
    "name": "General supremo",
    "description": "Aumenta su poder un 10% por cada aliado derrotado en combate.",
    "sortEs": 123,
    "sortEn": 262
  },
  {
    "id": 284,
    "key": "Earth Eater",
    "name": "Geofagia",
    "description": "Inmunidad a movimientos de tipo tierra. Recuperan su PS.",
    "sortEs": 124,
    "sortEn": 62
  },
  {
    "id": 56,
    "key": "Cute Charm",
    "name": "Gran Encanto",
    "description": "Si el enemigo lo golpea puede resultar enamorado.",
    "sortEs": 125,
    "sortEn": 44
  },
  {
    "id": 299,
    "key": "Hailstorm",
    "name": "Granizada",
    "description": "Al entrar en combate produce una granizada.",
    "sortEs": 126,
    "sortEn": 96
  },
  {
    "id": 221,
    "key": "Shadow Shield",
    "name": "Guardia Espectro",
    "description": "Si su PS está al 100% reduce el daño recibido a la mitad.",
    "sortEs": 127,
    "sortEn": 223
  },
  {
    "id": 220,
    "key": "Full Metal Body",
    "name": "Guardia Metálica",
    "description": "Evita que el enemigo baje sus estadísticas de combate.",
    "sortEs": 128,
    "sortEn": 81
  },
  {
    "id": 82,
    "key": "Gluttony",
    "name": "Gula",
    "description": "Usa las bayas más rápido de lo normal.",
    "sortEs": 129,
    "sortEn": 85
  },
  {
    "id": 1,
    "key": "Stench",
    "name": "Hedor",
    "description": "Ataques Físicos pueden hacer retroceder al enemigo.",
    "sortEs": 130,
    "sortEn": 254
  },
  {
    "id": 239,
    "key": "Propeller Tail",
    "name": "Hélice Caudal",
    "description": "Ignora movimientos y habilidades de cambio de objetivo.",
    "sortEs": 131,
    "sortEn": 188
  },
  {
    "id": 157,
    "key": "Sap Sipper",
    "name": "Herbívoro",
    "description": "Inmunidad a ataques de tipo Planta. Aumentan su At..",
    "sortEs": 132,
    "sortEn": 217
  },
  {
    "id": 218,
    "key": "Grassy Surge",
    "name": "Herbogénesis",
    "description": "Genera un Campo de Hierba cuando entra en combate.",
    "sortEs": 133,
    "sortEn": 90
  },
  {
    "id": 93,
    "key": "Hydration",
    "name": "Hidratación",
    "description": "Cura sus problemas de estado si llueve.",
    "sortEs": 134,
    "sortEn": 106
  },
  {
    "id": 207,
    "key": "Water Compaction",
    "name": "Hidrorrefuerzo",
    "description": "Aumenta mucho su Def. al ser dañado con ataques de Agua.",
    "sortEs": 135,
    "sortEn": 303
  },
  {
    "id": 305,
    "key": "Hospitality",
    "name": "Hospitalidad",
    "description": "Recupera un 20% la salud a sus aliados al entrar al combate.",
    "sortEs": 136,
    "sortEn": 102
  },
  {
    "id": 233,
    "key": "Wimp Out",
    "name": "Huida",
    "description": "Huye del combate cuando su PS es menor de la mitad.",
    "sortEs": 137,
    "sortEn": 308
  },
  {
    "id": 6,
    "key": "Damp",
    "name": "Humedad",
    "description": "Ningún Pokémon en batalla puede autodestruirse.",
    "sortEs": 138,
    "sortEn": 45
  },
  {
    "id": 73,
    "key": "White Smoke",
    "name": "Humo Blanco",
    "description": "El Pokémon rival no le puede bajar los stats.",
    "sortEs": 139,
    "sortEn": 307
  },
  {
    "id": 124,
    "key": "Pickpocket",
    "name": "Hurto",
    "description": "Se queda con el ítem del rival tras un ataque de contacto.",
    "sortEs": 140,
    "sortEn": 172
  },
  {
    "id": 85,
    "key": "Heatproof",
    "name": "Ignífugo",
    "description": "Reduce a la mitad el daño recibido por ataques de Fuego.",
    "sortEs": 141,
    "sortEn": 99
  },
  {
    "id": 109,
    "key": "Unaware",
    "name": "Ignorante",
    "description": "El rival no puede aumentar sus Stats.",
    "sortEs": 142,
    "sortEn": 292
  },
  {
    "id": 35,
    "key": "Illuminate",
    "name": "Iluminación",
    "description": "De noche los combates se verán más iluminados.",
    "sortEs": 143,
    "sortEn": 111
  },
  {
    "id": 149,
    "key": "Illusion",
    "name": "Ilusión",
    "description": "Adopta la apariencia de otro Pokémon hasta ser golpeado.",
    "sortEs": 144,
    "sortEn": 112
  },
  {
    "id": 42,
    "key": "Magnet Pull",
    "name": "Imán",
    "description": "Los rivales de acero no pueden huir ni ser cambiados.",
    "sortEs": 145,
    "sortEn": 140
  },
  {
    "id": 80,
    "key": "Steadfast",
    "name": "Impasible",
    "description": "Si sufre un retroceso, aumenta su Vel.",
    "sortEs": 146,
    "sortEn": 250
  },
  {
    "id": 138,
    "key": "Flare Boost",
    "name": "Ímpetu Ardiente",
    "description": "Aumenta su At. Esp. cuando está quemado.",
    "sortEs": 147,
    "sortEn": 72
  },
  {
    "id": 146,
    "key": "Sand Rush",
    "name": "Ímpetu Arena",
    "description": "Duplica su Vel. con Torm. Arena.",
    "sortEs": 148,
    "sortEn": 213
  },
  {
    "id": 137,
    "key": "Toxic Boost",
    "name": "Ímpetu Tóxico",
    "description": "Aumenta su At. cuando está envenenado.",
    "sortEs": 149,
    "sortEn": 284
  },
  {
    "id": 150,
    "key": "Imposter",
    "name": "Impostor",
    "description": "Al mismo salir al combate se transforma en su enemigo.",
    "sortEs": 150,
    "sortEn": 114
  },
  {
    "id": 3,
    "key": "Speed Boost",
    "name": "Impulso",
    "description": "Aumenta la velocidad conforme avanza el combate.",
    "sortEs": 151,
    "sortEn": 242
  },
  {
    "id": 313,
    "key": "Eelevate",
    "name": "Impulso Anguila",
    "description": "Levita y aumenta su stat más alto si debilita al rival con un ataque.",
    "sortEs": 152,
    "sortEn": 63
  },
  {
    "id": 99,
    "key": "No Guard",
    "name": "Indefenso",
    "description": "Todos los ataques usados ó recibidos dan a su objetivo.",
    "sortEs": 153,
    "sortEn": 161
  },
  {
    "id": 112,
    "key": "Slow Start",
    "name": "Inicio Lento",
    "description": "Comienza el combate con bajos stats de Vel. y At.",
    "sortEs": 154,
    "sortEn": 233
  },
  {
    "id": 17,
    "key": "Immunity",
    "name": "Inmunidad",
    "description": "Inmunidad al envenenamiento.",
    "sortEs": 155,
    "sortEn": 113
  },
  {
    "id": 15,
    "key": "Insomnia",
    "name": "Insomnio",
    "description": "Inmunidad al sueño.",
    "sortEs": 156,
    "sortEn": 118
  },
  {
    "id": 43,
    "key": "Soundproof",
    "name": "Insonorizar",
    "description": "Inmunidad a movimientos que funcionan por sonido.",
    "sortEs": 157,
    "sortEn": 241
  },
  {
    "id": 22,
    "key": "Intimidate",
    "name": "Intimidación",
    "description": "Al entrar en combate reduce el At. del Pokémon rival.",
    "sortEs": 158,
    "sortEn": 119
  },
  {
    "id": 113,
    "key": "Scrappy",
    "name": "Intrépido",
    "description": "Puede herir a fantasmas con ataques Normales y de Lucha.",
    "sortEs": 159,
    "sortEn": 219
  },
  {
    "id": 83,
    "key": "Anger Point",
    "name": "Irascible",
    "description": "Si recibe un golpe crítico, se dispara su At.",
    "sortEs": 160,
    "sortEn": 6
  },
  {
    "id": 154,
    "key": "Justified",
    "name": "Justiciero",
    "description": "Aumenta su At. al ser golpeado por un ataque siniestro.",
    "sortEs": 161,
    "sortEn": 123
  },
  {
    "id": 285,
    "key": "Orichalcum Pulse",
    "name": "Latido oricalco",
    "description": "Produce tiempo soleado temporalmente aumentando su poder en un 33%.",
    "sortEs": 162,
    "sortEn": 165
  },
  {
    "id": 211,
    "key": "Comatose",
    "name": "Letargo Perenne",
    "description": "Actúa como si estuviese dormido pero pudiendo atacar.",
    "sortEs": 163,
    "sortEn": 33
  },
  {
    "id": 26,
    "key": "Levitate",
    "name": "Levitación",
    "description": "Inmunidad a ataques de tipo Tierra.",
    "sortEs": 164,
    "sortEn": 127
  },
  {
    "id": 236,
    "key": "Libero",
    "name": "Líbero",
    "description": "Modifica su propio tipo al del ataque que va a efectuar.",
    "sortEs": 165,
    "sortEn": 128
  },
  {
    "id": 84,
    "key": "Unburden",
    "name": "Liviano",
    "description": "Aumenta su Vel. si no lleva objeto.",
    "sortEs": 166,
    "sortEn": 293
  },
  {
    "id": 2,
    "key": "Drizzle",
    "name": "Llovizna",
    "description": "Al entrar en combate produce una llovizna.",
    "sortEs": 167,
    "sortEn": 58
  },
  {
    "id": 48,
    "key": "Early Bird",
    "name": "Madrugar",
    "description": "Despierta del sueño de forma rápida.",
    "sortEs": 168,
    "sortEn": 61
  },
  {
    "id": 247,
    "key": "Ripen",
    "name": "Maduración",
    "description": "Duplica el efecto de las bayas equipadas al ser usadas.",
    "sortEs": 169,
    "sortEn": 205
  },
  {
    "id": 123,
    "key": "Bad Dreams",
    "name": "Mal Sueño",
    "description": "El rival pierde salud mientras este durmiendo.",
    "sortEs": 170,
    "sortEn": 15
  },
  {
    "id": 263,
    "key": "Dragon's Maw",
    "name": "Mandíbula dragón",
    "description": "Aumenta en un 50% la potencia de los ataques tipo dragón.",
    "sortEs": 171,
    "sortEn": 57
  },
  {
    "id": 176,
    "key": "Strong Jaw",
    "name": "Mandíbula Fuerte",
    "description": "Mejora el poder de ataques basados en mordiscos.",
    "sortEs": 172,
    "sortEn": 257
  },
  {
    "id": 259,
    "key": "Quick Draw",
    "name": "Mano rápida",
    "description": "Un tercio de los ataques de daño realizados serán más veloces.",
    "sortEs": 173,
    "sortEn": 197
  },
  {
    "id": 183,
    "key": "Grass Pelt",
    "name": "Manto Frondoso",
    "description": "Aumenta la Def. mientras esté activo Campo de Hierba.",
    "sortEs": 174,
    "sortEn": 89
  },
  {
    "id": 81,
    "key": "Snow Cloak",
    "name": "Manto Níveo",
    "description": "Con Granizo, reduce la precisión del rival.",
    "sortEs": 175,
    "sortEn": 236
  },
  {
    "id": 190,
    "key": "Primordial Sea",
    "name": "Mar del Albor",
    "description": "Al entrar en combate produce un diluvio.",
    "sortEs": 176,
    "sortEn": 186
  },
  {
    "id": 66,
    "key": "Blaze",
    "name": "Mar Llamas",
    "description": "Mejora ataques de Fuego cuando la salud escasea.",
    "sortEs": 177,
    "sortEn": 24
  },
  {
    "id": 57,
    "key": "Plus",
    "name": "Más",
    "description": "Aumenta su At. Esp. con un Menos en el equipo.",
    "sortEs": 178,
    "sortEn": 176
  },
  {
    "id": 261,
    "key": "Curious Medicine",
    "name": "Medicina extraña",
    "description": "Al entrar en combate restaura los cambios de stats de su equipo.",
    "sortEs": 179,
    "sortEn": 42
  },
  {
    "id": 168,
    "key": "Mega Launcher",
    "name": "Megadisparador",
    "description": "Aumenta la potencia de mov. de pulsos y auras en un 50%.",
    "sortEs": 180,
    "sortEn": 142
  },
  {
    "id": 311,
    "key": "Mega Sol",
    "name": "Megasolar",
    "description": "Adquiere los efectos producidos por el clima Soleado.",
    "sortEs": 181,
    "sortEn": 143
  },
  {
    "id": 58,
    "key": "Minus",
    "name": "Menos",
    "description": "Aumenta su At. Esp. con un Mas en el equipo.",
    "sortEs": 182,
    "sortEn": 147
  },
  {
    "id": 135,
    "key": "Light Metal",
    "name": "Metal Liviano",
    "description": "Reduce su Def. y Def. Esp. pero aumenta su Vel.",
    "sortEs": 183,
    "sortEn": 129
  },
  {
    "id": 134,
    "key": "Heavy Metal",
    "name": "Metal Pesado",
    "description": "Aumenta su Def. y Def. Esp. pero reduce su Vel.",
    "sortEs": 184,
    "sortEn": 100
  },
  {
    "id": 250,
    "key": "Mimicry",
    "name": "Mimetismo",
    "description": "Cambia su tipo de acuerdo al campo presente en combate.",
    "sortEs": 185,
    "sortEn": 145
  },
  {
    "id": 161,
    "key": "Zen Mode",
    "name": "Modo Daruma",
    "description": "Cambia sus tipos cuando su PS es inferior a la mitad.",
    "sortEs": 186,
    "sortEn": 313
  },
  {
    "id": 152,
    "key": "Mummy",
    "name": "Momia",
    "description": "Cuando es golpeado, el rival cambia su habilidad a Momia.",
    "sortEs": 187,
    "sortEn": 156
  },
  {
    "id": 255,
    "key": "Gorilla Tactics",
    "name": "Monotema",
    "description": "Al usar un movimiento, el resto de ataques se deshabilitan.",
    "sortEs": 188,
    "sortEn": 88
  },
  {
    "id": 286,
    "key": "Hadron Engine",
    "name": "Motor hadrónico",
    "description": "Produce Campo Eléctrico temporalmente aumentando su poder en un 33%.",
    "sortEs": 189,
    "sortEn": 95
  },
  {
    "id": 61,
    "key": "Shed Skin",
    "name": "Mudar",
    "description": "Puede curarse de sus problemas de estado.",
    "sortEs": 190,
    "sortEn": 226
  },
  {
    "id": 136,
    "key": "Multiscale",
    "name": "Multiescamas",
    "description": "Con su PS al máximo, el ataque recibido reduce su poder.",
    "sortEs": 191,
    "sortEn": 154
  },
  {
    "id": 121,
    "key": "Multitype",
    "name": "Multitipo",
    "description": "Modifica su tipo dependiendo de la tabla equipada.",
    "sortEs": 192,
    "sortEn": 155
  },
  {
    "id": 98,
    "key": "Magic Guard",
    "name": "Muro Mágico",
    "description": "Inmunidad frente a ataques que no son de daño directo.",
    "sortEs": 193,
    "sortEn": 137
  },
  {
    "id": 258,
    "key": "Hunger Switch",
    "name": "Mutapetito",
    "description": "El Pokémon cambia de forma sin parar durante el combate.",
    "sortEs": 194,
    "sortEn": 104
  },
  {
    "id": 180,
    "key": "Protean",
    "name": "Mutatipo",
    "description": "Modifica su propio tipo al del ataque que va a efectuar.",
    "sortEs": 195,
    "sortEn": 189
  },
  {
    "id": 33,
    "key": "Swift Swim",
    "name": "Nado Rápido",
    "description": "Duplica su Vel. si está lloviendo.",
    "sortEs": 196,
    "sortEn": 266
  },
  {
    "id": 219,
    "key": "Misty Surge",
    "name": "Nebulogénesis",
    "description": "Genera un Campo de Niebla cuando entra en combate.",
    "sortEs": 197,
    "sortEn": 149
  },
  {
    "id": 304,
    "key": "Supersweet Syrup",
    "name": "Néctar dulce",
    "description": "Baja la evasión al rival al entrar al combate.",
    "sortEs": 198,
    "sortEn": 261
  },
  {
    "id": 127,
    "key": "Unnerve",
    "name": "Nerviosismo",
    "description": "El Pokémon rival no es capaz de usar la baya equipada.",
    "sortEs": 199,
    "sortEn": 294
  },
  {
    "id": 117,
    "key": "Snow Warning",
    "name": "Nevada",
    "description": "Al entrar en combate produce una nevada.",
    "sortEs": 200,
    "sortEn": 237
  },
  {
    "id": 96,
    "key": "Normalize",
    "name": "Normalidad",
    "description": "Todos los ataques de este Pokémon son de tipo normal.",
    "sortEs": 201,
    "sortEn": 162
  },
  {
    "id": 14,
    "key": "Compound Eyes",
    "name": "Ojo Compuesto",
    "description": "Aumenta la precisión del Pokémon.",
    "sortEs": 202,
    "sortEn": 36
  },
  {
    "id": 306,
    "key": "Mind's Eye",
    "name": "Ojo Mental",
    "description": "Daña a fantasmas con ataques Lucha y Normal, y no le pueden bajar la Prec.",
    "sortEs": 203,
    "sortEn": 146
  },
  {
    "id": 287,
    "key": "Lingering Aroma",
    "name": "Olor persistente",
    "description": "Cuando es golpeado, el rival cambia su habilidad a Olor Persistente.",
    "sortEs": 204,
    "sortEn": 132
  },
  {
    "id": 288,
    "key": "Opportunist",
    "name": "Oportunista",
    "description": "Copia los aumentos de stats de los enemigos.",
    "sortEs": 205,
    "sortEn": 164
  },
  {
    "id": 289,
    "key": "Protosynthesis",
    "name": "Paleosíntesis",
    "description": "Con tiempo soleado aumenta su stat más poderoso en un 30%.",
    "sortEs": 206,
    "sortEn": 190
  },
  {
    "id": 31,
    "key": "Lightning Rod",
    "name": "Pararrayos",
    "description": "Inmunidad a ataques de tipo Eléctrico. Suben su At. Esp.",
    "sortEs": 207,
    "sortEn": 130
  },
  {
    "id": 196,
    "key": "Dancer",
    "name": "Pareja de Baile",
    "description": "Copia cualquier movimiento de danza usado por el enemigo.",
    "sortEs": 208,
    "sortEn": 46
  },
  {
    "id": 173,
    "key": "Fur Coat",
    "name": "Pelaje Recio",
    "description": "Reduce a la mitad el daño recibido por ataques físicos.",
    "sortEs": 209,
    "sortEn": 82
  },
  {
    "id": 202,
    "key": "Fluffy",
    "name": "Peluche",
    "description": "Resistente frente a ataques de contacto pero débil al fuego.",
    "sortEs": 210,
    "sortEn": 76
  },
  {
    "id": 238,
    "key": "Cotton Down",
    "name": "Pelusa",
    "description": "Al ser golpeado, esparce pelusas que bajan la Vel.",
    "sortEs": 211,
    "sortEn": 40
  },
  {
    "id": 54,
    "key": "Truant",
    "name": "Pereza",
    "description": "Recarga su PP de manera lenta.",
    "sortEs": 212,
    "sortEn": 290
  },
  {
    "id": 290,
    "key": "Guard Dog",
    "name": "Perro guardián",
    "description": "No se ve afectado por movimientos de cambio ni por Intimidación.",
    "sortEs": 213,
    "sortEn": 92
  },
  {
    "id": 170,
    "key": "Aerilate",
    "name": "Piel Celeste",
    "description": "Los ataques de tipo Normal se convierten en tipo Volador.",
    "sortEs": 214,
    "sortEn": 2
  },
  {
    "id": 310,
    "key": "Dragonize",
    "name": "Piel Dragontina",
    "description": "Los ataques de tipo Normal se convierten en Dragón.",
    "sortEs": 215,
    "sortEn": 56
  },
  {
    "id": 225,
    "key": "Galvanize",
    "name": "Piel Eléctrica",
    "description": "Los ataques de tipo Normal se convierten en Eléctrico.",
    "sortEs": 216,
    "sortEn": 84
  },
  {
    "id": 166,
    "key": "Pixilate",
    "name": "Piel Feérica",
    "description": "Los ataques de tipo Normal se convierten en tipo Hada.",
    "sortEs": 217,
    "sortEn": 175
  },
  {
    "id": 177,
    "key": "Refrigerate",
    "name": "Piel Helada",
    "description": "Los ataques de tipo Normal se convierten en tipo Hielo.",
    "sortEs": 218,
    "sortEn": 203
  },
  {
    "id": 147,
    "key": "Wonder Skin",
    "name": "Piel Milagro",
    "description": "Los ataques de estado recibidos reducen su precisión.",
    "sortEs": 219,
    "sortEn": 312
  },
  {
    "id": 87,
    "key": "Dry Skin",
    "name": "Piel Seca",
    "description": "Aumenta su salud con lluvia, y la reduce con bochorno.",
    "sortEs": 220,
    "sortEn": 60
  },
  {
    "id": 24,
    "key": "Rough Skin",
    "name": "Piel Tosca",
    "description": "Si el enemigo lo golpea sufre un daño de retroceso.",
    "sortEs": 221,
    "sortEn": 210
  },
  {
    "id": 95,
    "key": "Quick Feet",
    "name": "Pies Rápidos",
    "description": "Aumenta su Vel. cuando sufre un cambio de estado.",
    "sortEs": 222,
    "sortEn": 198
  },
  {
    "id": 159,
    "key": "Sand Force",
    "name": "Poder Arena",
    "description": "Mejora ataques de tipo Roca, Tierra y Acero con Tor. Arena.",
    "sortEs": 223,
    "sortEn": 212
  },
  {
    "id": 291,
    "key": "Mycelium Might",
    "name": "Poder fúngico",
    "description": "Los ataques de estado son lentos pero ignoran habilidades defensivas.",
    "sortEs": 224,
    "sortEn": 157
  },
  {
    "id": 94,
    "key": "Solar Power",
    "name": "Poder Solar",
    "description": "Duplica su At. Esp. con bochorno, pero pierde salud.",
    "sortEs": 225,
    "sortEn": 238
  },
  {
    "id": 19,
    "key": "Shield Dust",
    "name": "Polvo Escudo",
    "description": "Bloquea los efectos secundarios de ataques de daño.",
    "sortEs": 226,
    "sortEn": 229
  },
  {
    "id": 200,
    "key": "Water Bubble",
    "name": "Pompa",
    "description": "Mejora los ataques de Agua y su resistencia al Fuego.",
    "sortEs": 227,
    "sortEn": 302
  },
  {
    "id": 37,
    "key": "Huge Power",
    "name": "Potencia",
    "description": "Duplica su poder de At.",
    "sortEs": 228,
    "sortEn": 103
  },
  {
    "id": 125,
    "key": "Sheer Force",
    "name": "Potencia Bruta",
    "description": "Los ataques mejoran pero pierden su efecto secundario.",
    "sortEs": 229,
    "sortEn": 227
  },
  {
    "id": 59,
    "key": "Forecast",
    "name": "Predicción",
    "description": "Modifica su aspecto y tipo dependiendo del tiempo.",
    "sortEs": 230,
    "sortEn": 77
  },
  {
    "id": 46,
    "key": "Pressure",
    "name": "Presión",
    "description": "Los ataques del enemigo consumen más PP.",
    "sortEs": 231,
    "sortEn": 185
  },
  {
    "id": 179,
    "key": "Magician",
    "name": "Prestidigitador",
    "description": "Se queda con el ítem del rival tras un ataque de contacto.",
    "sortEs": 232,
    "sortEn": 138
  },
  {
    "id": 204,
    "key": "Triage",
    "name": "Primer Auxilio",
    "description": "Los ataques de curación requieren menos gasto de PP.",
    "sortEs": 233,
    "sortEn": 289
  },
  {
    "id": 217,
    "key": "Psychic Surge",
    "name": "Psicogénesis",
    "description": "Genera un Campo Psíquico cuando entra en combate.",
    "sortEs": 234,
    "sortEn": 191
  },
  {
    "id": 244,
    "key": "Punk Rock",
    "name": "Punk Rock",
    "description": "Aumenta el poder y resistencia a los ataques de sonido.",
    "sortEs": 235,
    "sortEn": 192
  },
  {
    "id": 160,
    "key": "Iron Barbs",
    "name": "Punta Acero",
    "description": "Si el enemigo lo golpea sufre un gran daño de retroceso.",
    "sortEs": 236,
    "sortEn": 121
  },
  {
    "id": 38,
    "key": "Poison Point",
    "name": "Punto Tóxico",
    "description": "Si el enemigo lo golpea puede resultar envenenado.",
    "sortEs": 237,
    "sortEn": 178
  },
  {
    "id": 89,
    "key": "Iron Fist",
    "name": "Puño Férreo",
    "description": "Aumenta el poder de los ataques que se usan los puños.",
    "sortEs": 238,
    "sortEn": 122
  },
  {
    "id": 260,
    "key": "Unseen Fist",
    "name": "Puño invisible",
    "description": "Permite golpear a Pokémon que se están protegiendo.",
    "sortEs": 239,
    "sortEn": 295
  },
  {
    "id": 165,
    "key": "Chimera",
    "name": "Quimera",
    "description": "Elige su tipo dependiendo de la tabla equipada y su 1er mov.",
    "sortEs": 240,
    "sortEn": 28
  },
  {
    "id": 229,
    "key": "Slush Rush",
    "name": "Quitanieves",
    "description": "Aumenta la Vel. cuando está nevando o granizando.",
    "sortEs": 241,
    "sortEn": 234
  },
  {
    "id": 192,
    "key": "Delta Stream",
    "name": "Ráfaga Delta",
    "description": "Al entrar en combate produce turbulencias.",
    "sortEs": 242,
    "sortEn": 52
  },
  {
    "id": 224,
    "key": "Power of Alchemy",
    "name": "Reacción Química",
    "description": "Recoge la habilidad del último aliado caído en combate.",
    "sortEs": 243,
    "sortEn": 182
  },
  {
    "id": 205,
    "key": "Receiver",
    "name": "Receptor",
    "description": "Recoge la habilidad del último aliado caído en combate.",
    "sortEs": 244,
    "sortEn": 201
  },
  {
    "id": 237,
    "key": "Ball Fetch",
    "name": "Recogebolas",
    "description": "Recoge los objetos de captura si no se logra atrapar al Pokémon.",
    "sortEs": 245,
    "sortEn": 16
  },
  {
    "id": 118,
    "key": "Honey Gather",
    "name": "Recogemiel",
    "description": "Al final del combate puede recoger un objeto.",
    "sortEs": 246,
    "sortEn": 101
  },
  {
    "id": 53,
    "key": "Pickup",
    "name": "Recogida",
    "description": "Puede recoger las bayas usadas en el combate.",
    "sortEs": 247,
    "sortEn": 173
  },
  {
    "id": 144,
    "key": "Regenerator",
    "name": "Regeneración",
    "description": "Recupera algo su salud al salir a combatir.",
    "sortEs": 248,
    "sortEn": 204
  },
  {
    "id": 203,
    "key": "Queenly Majesty",
    "name": "Regia Presencia",
    "description": "Los ataques de alta prioridad del rival dejan de serlo.",
    "sortEs": 249,
    "sortEn": 196
  },
  {
    "id": 264,
    "key": "Chilling Neigh",
    "name": "Relincho blanco",
    "description": "Aumenta su At. al derrotar al rival con un ataque de daño.",
    "sortEs": 250,
    "sortEn": 27
  },
  {
    "id": 265,
    "key": "Grim Neigh",
    "name": "Relincho negro",
    "description": "Aumenta su At. Esp. al derrotar al rival con un ataque de daño.",
    "sortEs": 251,
    "sortEn": 91
  },
  {
    "id": 193,
    "key": "Long Reach",
    "name": "Remoto",
    "description": "Evita efectos secundarios al realizar ataques de contacto.",
    "sortEs": 252,
    "sortEn": 135
  },
  {
    "id": 126,
    "key": "Contrary",
    "name": "Respondón",
    "description": "Invierte las alteraciones de stats del Pokémon.",
    "sortEs": 253,
    "sortEn": 37
  },
  {
    "id": 206,
    "key": "Emergency Exit",
    "name": "Retirada",
    "description": "Huye del combate si un golpe baja su PS por debajo del 50%.",
    "sortEs": 254,
    "sortEn": 67
  },
  {
    "id": 208,
    "key": "Innards Out",
    "name": "Revés",
    "description": "Cuando es debilitado resta al rival tanto PS como le quedaba.",
    "sortEs": 255,
    "sortEn": 116
  },
  {
    "id": 100,
    "key": "Stall",
    "name": "Rezagado",
    "description": "Comienza el combate con la mitad de PP.",
    "sortEs": 256,
    "sortEn": 245
  },
  {
    "id": 20,
    "key": "Own Tempo",
    "name": "Ritmo Propio",
    "description": "Inmunidad a la confusión.",
    "sortEs": 257,
    "sortEn": 168
  },
  {
    "id": 79,
    "key": "Rivalry",
    "name": "Rivalidad",
    "description": "Aumenta su poder si el rival tiene su mismo género.",
    "sortEs": 258,
    "sortEn": 206
  },
  {
    "id": 226,
    "key": "Tangling Hair",
    "name": "Rizos Rebeldes",
    "description": "Si recibe un ataque de contacto, baja la Vel. al enemigo.",
    "sortEs": 259,
    "sortEn": 272
  },
  {
    "id": 5,
    "key": "Sturdy",
    "name": "Robustez",
    "description": "Puede sobrevivir a movimientos de KO directo.",
    "sortEs": 260,
    "sortEn": 258
  },
  {
    "id": 116,
    "key": "Solid Rock",
    "name": "Roca Sólida",
    "description": "Reduce el poder de los ataques recibidos efectivos.",
    "sortEs": 261,
    "sortEn": 239
  },
  {
    "id": 189,
    "key": "Aura Break",
    "name": "Rompeaura",
    "description": "Invierte el efecto de Aura Feérica y de Aura Oscura.",
    "sortEs": 262,
    "sortEn": 14
  },
  {
    "id": 104,
    "key": "Mold Breaker",
    "name": "Rompemoldes",
    "description": "Las habilidades defensivas no tienen efecto.",
    "sortEs": 263,
    "sortEn": 150
  },
  {
    "id": 292,
    "key": "Cud Chew",
    "name": "Rumia",
    "description": "Puede regurgitar una baya consumida para usarla una vez más.",
    "sortEs": 264,
    "sortEn": 41
  },
  {
    "id": 145,
    "key": "Big Pecks",
    "name": "Sacapecho",
    "description": "El Pokémon rival no le puede bajar la Def.",
    "sortEs": 265,
    "sortEn": 23
  },
  {
    "id": 293,
    "key": "Purifying Salt",
    "name": "Sal purificadora",
    "description": "Evita los cambios de estado más comunes y es resistente a Fantasmas.",
    "sortEs": 266,
    "sortEn": 194
  },
  {
    "id": 312,
    "key": "Spicy Spray",
    "name": "Salpicante",
    "description": "Si recibe daño de un movimiento, quema al Pokémon atacante.",
    "sortEs": 267,
    "sortEn": 243
  },
  {
    "id": 47,
    "key": "Thick Fat",
    "name": "Sebo",
    "description": "Los ataques de Hielo y Fuego lo dañan menos.",
    "sortEs": 268,
    "sortEn": 280
  },
  {
    "id": 70,
    "key": "Drought",
    "name": "Sequía",
    "description": "Al entrar en combate produce un bochorno.",
    "sortEs": 269,
    "sortEn": 59
  },
  {
    "id": 182,
    "key": "Symbiosis",
    "name": "Simbiosis",
    "description": "Si es debilitado puede ceder su objeto a un aliado.",
    "sortEs": 270,
    "sortEn": 268
  },
  {
    "id": 86,
    "key": "Simple",
    "name": "Simple",
    "description": "Duplica el efecto de sus alteraciones de stats.",
    "sortEs": 271,
    "sortEn": 231
  },
  {
    "id": 28,
    "key": "Synchronize",
    "name": "Sincronía",
    "description": "Cuando cambia su estado el rival sufre la misma alteración.",
    "sortEs": 272,
    "sortEn": 269
  },
  {
    "id": 209,
    "key": "RKS System",
    "name": "Sistema Alfa",
    "description": "Modifica su tipo dependiendo del objeto equipado.",
    "sortEs": 273,
    "sortEn": 207
  },
  {
    "id": 23,
    "key": "Shadow Tag",
    "name": "Sombra Trampa",
    "description": "El rival no puede huir ni ser intercambiado.",
    "sortEs": 274,
    "sortEn": 224
  },
  {
    "id": 25,
    "key": "Wonder Guard",
    "name": "Superguarda",
    "description": "Sólo recibe daño de ataques que sean muy efectivos.",
    "sortEs": 275,
    "sortEn": 311
  },
  {
    "id": 294,
    "key": "Wind Rider",
    "name": "Surcavientos",
    "description": "Inmunidad a movimientos de viento. Aumentan su At.",
    "sortEs": 276,
    "sortEn": 310
  },
  {
    "id": 295,
    "key": "Tablets of Ruin",
    "name": "Tablilla debacle",
    "description": "Reduce la At. del resto de Pokémon en un 25%.",
    "sortEs": 277,
    "sortEn": 270
  },
  {
    "id": 140,
    "key": "Telepathy",
    "name": "Telepatía",
    "description": "Predice la habilidad especial del rival.",
    "sortEs": 278,
    "sortEn": 274
  },
  {
    "id": 186,
    "key": "Competitive",
    "name": "Tenacidad",
    "description": "Si modifican sus stats aumenta su nivel de At. Esp.",
    "sortEs": 279,
    "sortEn": 35
  },
  {
    "id": 301,
    "key": "Tera Shift",
    "name": "Teracambio",
    "description": "Cambia a su forma Teracristal al entrar en combate.",
    "sortEs": 280,
    "sortEn": 276
  },
  {
    "id": 302,
    "key": "Tera Shell",
    "name": "Teracaparazón",
    "description": "Los movimientos enemigos serán poco eficaces si tiene su salud al 100%.",
    "sortEs": 281,
    "sortEn": 275
  },
  {
    "id": 303,
    "key": "Teraform Zero",
    "name": "Teraformación 0",
    "description": "Eliminates any active weather and fields.",
    "sortEs": 282,
    "sortEn": 277
  },
  {
    "id": 296,
    "key": "Thermal Exchange",
    "name": "Termoconversión",
    "description": "Inmunidad a las quemaduras. Los ataques de fuego aumentan su At.",
    "sortEs": 283,
    "sortEn": 279
  },
  {
    "id": 164,
    "key": "Teravolt",
    "name": "Terravoltaje",
    "description": "Anula las hab. que reducen el poder de los ataques.",
    "sortEs": 284,
    "sortEn": 278
  },
  {
    "id": 191,
    "key": "Desolate Land",
    "name": "Tierra del Ocaso",
    "description": "Al entrar en combate produce un calor abrasador.",
    "sortEs": 285,
    "sortEn": 53
  },
  {
    "id": 162,
    "key": "Victory Star",
    "name": "Tinovictoria",
    "description": "Aumenta la precisión del Pokémon.",
    "sortEs": 286,
    "sortEn": 297
  },
  {
    "id": 300,
    "key": "Poison Puppeteer",
    "name": "Títere tóxico",
    "description": "Si envenena al enemigo, éste pasará a estar confuso a la vez.",
    "sortEs": 287,
    "sortEn": 179
  },
  {
    "id": 143,
    "key": "Poison Touch",
    "name": "Toque Tóxico",
    "description": "Puede envenenar al enemigo tras asestarle un golpe.",
    "sortEs": 288,
    "sortEn": 180
  },
  {
    "id": 67,
    "key": "Torrent",
    "name": "Torrente",
    "description": "Mejora ataques de Agua cuando la salud escasea.",
    "sortEs": 289,
    "sortEn": 282
  },
  {
    "id": 241,
    "key": "Gulp Missile",
    "name": "Tragamisil",
    "description": "Tras usar Surf o Buceo, regresa con un Pokémon en el pico.",
    "sortEs": 290,
    "sortEn": 93
  },
  {
    "id": 71,
    "key": "Arena Trap",
    "name": "Trampa Arena",
    "description": "El rival no puede huir ni ser intercambiado.",
    "sortEs": 291,
    "sortEn": 9
  },
  {
    "id": 262,
    "key": "Transistor",
    "name": "Transistor",
    "description": "Aumenta en un 50% la potencia de los ataques tipo eléctrico.",
    "sortEs": 292,
    "sortEn": 288
  },
  {
    "id": 297,
    "key": "Rocky Payload",
    "name": "Transportarrocas",
    "description": "Aumenta en un 50% la potencia de los movimientos de tipo roca.",
    "sortEs": 293,
    "sortEn": 209
  },
  {
    "id": 77,
    "key": "Tangled Feet",
    "name": "Tumbos",
    "description": "Si está confuso, reduce la precisión del rival.",
    "sortEs": 294,
    "sortEn": 271
  },
  {
    "id": 163,
    "key": "Turboblaze",
    "name": "Turbollama",
    "description": "Anula las hab. que reducen el poder de los ataques.",
    "sortEs": 295,
    "sortEn": 291
  },
  {
    "id": 309,
    "key": "Piercing Drill",
    "name": "Turbotaladro",
    "description": "Permite dañar a Pokémon que se están protegiendo.",
    "sortEs": 296,
    "sortEn": 174
  },
  {
    "id": 223,
    "key": "Beast Boost",
    "name": "Ultraimpulso",
    "description": "Aumenta su stat más alto si debilita al rival con un ataque.",
    "sortEs": 297,
    "sortEn": 21
  },
  {
    "id": 266,
    "key": "As One",
    "name": "Unidad ecuestre",
    "description": "Combina los efectos de Nerviosismo y Relincho Blanco.",
    "sortEs": 298,
    "sortEn": 12
  },
  {
    "id": 267,
    "key": "As One",
    "name": "Unidad ecuestre",
    "description": "Combina los efectos de Nerviosismo y Relincho Negro.",
    "sortEs": 299,
    "sortEn": 13
  },
  {
    "id": 298,
    "key": "Costar",
    "name": "Unísono",
    "description": "Al entrar en combate copia los cambios de stats de un aliado.",
    "sortEs": 300,
    "sortEn": 39
  },
  {
    "id": 141,
    "key": "Moody",
    "name": "Veleta",
    "description": "En combate baja de nivel un stat y sube dos niveles su At.",
    "sortEs": 301,
    "sortEn": 151
  },
  {
    "id": 41,
    "key": "Water Veil",
    "name": "Velo Agua",
    "description": "Inmunidad a la quemadura.",
    "sortEs": 302,
    "sortEn": 304
  },
  {
    "id": 8,
    "key": "Sand Veil",
    "name": "Velo Arena",
    "description": "Con Tormenta Arena, reduce la precisión del rival.",
    "sortEs": 303,
    "sortEn": 216
  },
  {
    "id": 184,
    "key": "Aroma Veil",
    "name": "Velo Aroma",
    "description": "Protege al usuario y aliados de anulaciones de movimientos.",
    "sortEs": 304,
    "sortEn": 11
  },
  {
    "id": 175,
    "key": "Sweet Veil",
    "name": "Velo Dulce",
    "description": "Protege al equipo de sufrir efectos de sueño.",
    "sortEs": 305,
    "sortEn": 265
  },
  {
    "id": 172,
    "key": "Flower Veil",
    "name": "Velo Flor",
    "description": "Protege a aliados de Planta de cambios de stats y de estado.",
    "sortEs": 306,
    "sortEn": 75
  },
  {
    "id": 257,
    "key": "Pastel Veil",
    "name": "Velo Pastel",
    "description": "Impide al Pokémon y a sus aliados ser envenenados.",
    "sortEs": 307,
    "sortEn": 170
  },
  {
    "id": 21,
    "key": "Suction Cups",
    "name": "Ventosas",
    "description": "Inmunidad ante intercambios forzados.",
    "sortEs": 308,
    "sortEn": 259
  },
  {
    "id": 195,
    "key": "Stakeout",
    "name": "Vigilante",
    "description": "Daña el doble cuando el rival entra a mitad del combate.",
    "sortEs": 309,
    "sortEn": 244
  },
  {
    "id": 64,
    "key": "Liquid Ooze",
    "name": "Viscosecreción",
    "description": "Si el rival trata de absorber PS, en su lugar los perderá.",
    "sortEs": 310,
    "sortEn": 133
  },
  {
    "id": 60,
    "key": "Sticky Hold",
    "name": "Viscosidad",
    "description": "El objeto equipado no puede ser retirado.",
    "sortEs": 311,
    "sortEn": 255
  },
  {
    "id": 51,
    "key": "Keen Eye",
    "name": "Vista Lince",
    "description": "El Pokémon rival no le puede bajar la precisión.",
    "sortEs": 312,
    "sortEn": 124
  },
  {
    "id": 194,
    "key": "Liquid Voice",
    "name": "Voz Fluida",
    "description": "Los ataques de sonido usados se convierten en acuáticos.",
    "sortEs": 313,
    "sortEn": 134
  },
  {
    "id": 103,
    "key": "Klutz",
    "name": "Zoquete",
    "description": "El Pokémon no sabe usar objetos equipados.",
    "sortEs": 314,
    "sortEn": 125
  }
];

const ABILITY_BY_ID = new Map(abilities.map((a) => [a.id, a]));

export const getAbility = (value) => {
  const id = abilityId(value);
  return id ? (ABILITY_BY_ID.get(id) || null) : null;
};

export const getPokemonByAbility = (value) => {
  const id = abilityId(value);
  if (!id) return [];
  const names = POKEMON
    .filter((p) => Array.isArray(p.abilities) && p.abilities.some((a) => {
      if (typeof a === 'object' && a != null) {
        return (a.id != null ? Number(a.id) : abilityId(a.key || a.name)) === id;
      }
      return abilityId(a) === id;
    }))
    .map((p) => (/unown/i.test(p.name) ? 'Unown' : p.name))
    .filter(Boolean);
  // Las formas alternativas comparten nombre (Unown, Rotom, ...): se muestra una sola vez.
  return [...new Set(names)];
};

export const searchAbilities = (query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return abilities;
  return abilities.filter((a) => (
    a.name.toLowerCase().includes(q)
    || a.key.toLowerCase().includes(q)
    || a.description.toLowerCase().includes(q)
  ));
};

export const getAbilitiesByLetter = () => {
  const grouped = {};
  for (const ability of abilities) {
    const firstLetter = ability.name[0].toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(ability);
  }
  return grouped;
};
