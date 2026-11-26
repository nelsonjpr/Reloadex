// Base de datos de habilidades de Pokémon
import { pokemonData } from './pokemon';
import { ABILITY_NAMES_ES } from './abilityNames.es';

// Función para obtener Pokémon por habilidad
// reverse map: nombre español -> nombre original
const ES_TO_ORIGINAL = {};
for (const [orig, es] of Object.entries(ABILITY_NAMES_ES)) {
  const k = String(es).trim().toLowerCase();
  if (!ES_TO_ORIGINAL[k]) ES_TO_ORIGINAL[k] = orig;
}

export const getPokemonByAbility = (abilityName) => {
  const wanted = String(abilityName).trim().toLowerCase();
  const aliases = new Set([wanted]);
  if (ES_TO_ORIGINAL[wanted]) aliases.add(ES_TO_ORIGINAL[wanted].toLowerCase());
  return pokemonData
    .filter(pokemon => Array.isArray(pokemon.abilities) && pokemon.abilities.some(a => {
      const name = typeof a === 'object' ? a?.name : a;
      const lower = String(name || '').trim().toLowerCase();
      const es = String(ABILITY_NAMES_ES[name] || '').trim().toLowerCase();
      return aliases.has(lower) || (es && aliases.has(es));
    }))
    .map(pokemon => pokemon.name);
};

export const abilities = [
  { name: 'Espesura', description: 'Potencia los movimientos de tipo Planta cuando los PS son bajos.' },
  { name: 'Clorofila', description: 'Aumenta la Velocidad cuando hace sol.' },
  { name: 'Mar Llamas', description: 'Potencia los movimientos de tipo Fuego cuando los PS son bajos.' },
  { name: 'Poder Solar', description: 'Aumenta el Ataque Especial cuando hace sol, pero pierde PS cada turno.' },
  { name: 'Torrente', description: 'Potencia los movimientos de tipo Agua cuando los PS son bajos.' },
  { name: 'Lluvia', description: 'Invoca lluvia al entrar en combate.' },
  { name: 'Polvo Escudo', description: 'Inmunidad a problemas de estado causados por polvos y esporas.' },
  { name: 'Fuga', description: 'Permite huir siempre de Pokémon salvajes.' },
  { name: 'Mudar', description: 'Puede curarse de problemas de estado mudando la piel.' },
  { name: 'Ojo Compuesto', description: 'Aumenta la Precisión en un 30%.' },
  { name: 'Cromolente', description: 'Cambia el tipo según la tableta que lleve.' },
  { name: 'Vista Lince', description: 'Aumenta la Precisión del Pokémon.' },
  { name: 'Tumbos', description: 'Puede evadir mejor los ataques si está confuso.' },
  { name: 'Sacapecho', description: 'Aumenta el Ataque al derrotar a un Pokémon rival.' },
  { name: 'Agallas', description: 'Aumenta el Ataque si sufre un problema de estado.' },
  { name: 'Entusiasmo', description: 'Aumenta la Velocidad si sufre un problema de estado.' },
  { name: 'Francotirador', description: 'Aumenta el daño de los golpes críticos.' },
  { name: 'Elec. Estática', description: 'Puede paralizar al contacto.' },
  { name: 'Pararrayos', description: 'Atrae movimientos eléctricos y sube el Ataque Especial.' },
  { name: 'Velo Arena', description: 'Aumenta la Evasión en tormentas de arena.' },
  { name: 'Barrido Arena', description: 'Aumenta la Velocidad en tormentas de arena.' },
  { name: 'Punto Tóxico', description: 'Puede envenenar al contacto.' },
  { name: 'Rivalidad', description: 'Aumenta el Ataque contra rivales del mismo sexo.' },
  { name: 'Rompemoldes', description: 'Los movimientos no se ven afectados por las habilidades del rival.' },
  { name: 'Gran Encanto', description: 'Puede cautivar al contacto.' },
  { name: 'Muro Mágico', description: 'Refleja movimientos de estado al rival.' },
  { name: 'Ignorante', description: 'Ignora los cambios en las características del rival.' },
  { name: 'Absorbe Fuego', description: 'Absorbe movimientos de tipo Fuego para recuperar PS.' },
  { name: 'Sequía', description: 'Invoca luz solar intensa al entrar en combate.' },
  { name: 'Competitivo', description: 'Aumenta mucho el Ataque Especial si se reduce una característica.' },
  { name: 'Presión', description: 'Hace que el rival gaste más PP.' },
  { name: 'Nerviosismo', description: 'El rival no puede comer bayas.' },
  { name: 'Intimidación', description: 'Baja el Ataque del rival al entrar en combate.' },
  { name: 'Flexibilidad', description: 'Inmune a la paralisis.' },
  { name: 'Absorbe Agua', description: 'Absorbe movimientos de tipo Agua para recuperar PS.' },
  { name: 'Absorbe Elect', description: 'Absorbe movimientos eléctricos para recuperar PS.' },
  { name: 'Nado Rápido', description: 'Duplica la Velocidad bajo la lluvia.' },
  { name: 'Sincronía', description: 'Pasa envenenamiento, parálisis o quemadura al rival.' },
  { name: 'Cuerpo Puro', description: 'Inmunidad a problemas de estado.' },
  { name: 'Imán', description: 'Atrapa Pokémon de tipo Acero.' },
  { name: 'Insonorizar', description: 'Inmunidad a movimientos de sonido.' },
  { name: 'Regeneración', description: 'Recupera un poco de PS al cambiar de Pokémon.' },
  { name: 'Levitación', description: 'Inmunidad a movimientos de tipo Tierra.' },
  { name: 'Efecto Espora', description: 'Puede causar envenenamiento, parálisis o sueño al contacto.' },
  { name: 'Enjambre', description: 'Potencia movimientos de tipo Bicho cuando los PS son bajos.' },
  { name: 'Encanto', description: 'Puede cautivar al oponente del sexo opuesto.' },
  { name: 'Intrépido', description: 'No se ve afectado por Intimidación.' },
  { name: 'Sombratrampa', description: 'Evita que el rival huya o sea cambiado.' },
  { name: 'Cromático', description: 'Cambia de tipo según el movimiento que use.' },
  { name: 'Piel Roca', description: 'Aumenta la Defensa Especial en tormentas de arena.' },
  { name: 'Velo Agua', description: 'Previene quemaduras.' },
  { name: 'Magnetismo', description: 'Atrapa Pokémon de tipo Acero.' },
  { name: 'Robustez', description: 'No puede ser derrotado de un solo golpe.' },
  { name: 'Húmedo', description: 'Evita que se usen movimientos explosivos.' },
  { name: 'Flexibilidad', description: 'Duplica la potencia de movimientos de rebote.' },
  { name: 'Piel Áspera', description: 'Daña al contacto.' },
  { name: 'Superguarda', description: 'Solo recibe daño de movimientos supereficaces.' },
  { name: 'Colector', description: 'Puede recoger objetos que otros Pokémon han usado.' },
  { name: 'Espíritu Vital', description: 'Inmunidad al sueño.' },
  { name: 'Aclimatación', description: 'Cambia de tipo según el clima.' },
  { name: 'Gula', description: 'Come bayas antes de lo habitual.' },
  { name: 'Irascible', description: 'Aumenta el Ataque al sufrir un golpe crítico.' },
  { name: 'Liviano', description: 'Duplica la Velocidad.' },
  { name: 'Ignífugo', description: 'Protege de quemaduras.' },
  { name: 'Simple', description: 'Duplica los cambios en las características.' },
  { name: 'Piel Seca', description: 'Absorbe movimientos de agua pero sufre más daño de fuego.' },
  { name: 'Descarga', description: 'Puede paralizar al contacto.' },
  { name: 'Puño Férreo', description: 'Potencia los movimientos de puñetazo.' },
  { name: 'Antídoto', description: 'Cura envenenamiento del equipo al salir de combate.' },
  { name: 'Adaptable', description: 'Aumenta la potencia de movimientos del mismo tipo.' },
  { name: 'Encadenado', description: 'Puede atacar varias veces seguidas.' },
  { name: 'Hidratación', description: 'Cura problemas de estado bajo la lluvia.' },
  { name: 'Poder Solar', description: 'Aumenta el Ataque Especial bajo el sol, pero pierde PS.' },
  { name: 'Pies Rápidos', description: 'Aumenta la Velocidad si tiene un problema de estado.' },
  { name: 'Normalidad', description: 'Todos los movimientos se vuelven de tipo Normal.' },
  { name: 'Francotirador', description: 'Aumenta el daño de los golpes críticos.' },
  { name: 'Cambio Color', description: 'Cambia el tipo al del último movimiento recibido.' },
  { name: 'Inmunidad', description: 'Inmunidad al envenenamiento.' },
  { name: 'Absorbe Llama', description: 'Absorbe movimientos de fuego para potenciar los propios.' },
  { name: 'Escudo Polvo', description: 'Inmune a efectos secundarios de movimientos.' },
  { name: 'Espíritu Vital', description: 'No puede dormirse.' },
  { name: 'Predict', description: 'Copia la habilidad del rival.' },
  { name: 'Filtro', description: 'Reduce el daño de movimientos supereficaces.' },
  { name: 'Inicio Lento', description: 'Ataque y Velocidad se duplican después de 5 turnos.' },
  { name: 'Anticipación', description: 'Detecta movimientos peligrosos del rival.' },
  { name: 'Alerta', description: 'Evita el sueño y hace más fácil despertar.' },
  { name: 'Cromolente', description: 'El tipo cambia según la tableta que lleve.' },
  { name: 'Rompemoldes', description: 'Los movimientos no se ven afectados por habilidades del rival.' },
  { name: 'Afortunado', description: 'Aumenta la probabilidad de golpe crítico.' },
  { name: 'Metano', description: 'Protege de movimientos de un solo golpe.' },
  { name: 'Nieve', description: 'Invoca granizo al entrar en combate.' },
  { name: 'Recolección', description: 'Restaura bayas después de usarlas.' },
  { name: 'Despiste', description: 'Evita ser intimidado.' },
  { name: 'Garra Dura', description: 'Potencia movimientos de contacto.' },
  { name: 'Nevada', description: 'Mejora la Defensa bajo el granizo.' },
  { name: 'Miel', description: 'Atrae Pokémon salvajes.' },
  { name: 'Cacheo', description: 'Detecta el objeto que lleva el rival.' },
  { name: 'Audaz', description: 'Potencia movimientos físicos, pero reduce Precisión.' },
  { name: 'Cromático', description: 'Cambia de tipo según el movimiento usado.' },
  { name: 'Flor Regalo', description: 'Mejora las estadísticas de los aliados bajo el sol.' },
  { name: 'Mal Sueño', description: 'Daña a rivales dormidos cada turno.' }
];

// deduplicar habilidades por nombre
const _seen = new Set();
for (let i = abilities.length - 1; i >= 0; i--) {
  const key = String(abilities[i].name).trim().toLowerCase();
  if (_seen.has(key)) abilities.splice(i, 1); else _seen.add(key);
}
export const getAbilitiesByLetter = () => {
  const grouped = {};
  abilities.forEach(ability => {
    const firstLetter = ability.name[0].toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(ability);
  });
  return grouped;
};

export const searchAbilities = (query) => {
  const lowerQuery = query.toLowerCase();
  return abilities.filter(ability => 
    ability.name.toLowerCase().includes(lowerQuery) ||
    ability.description.toLowerCase().includes(lowerQuery)
  );
};
