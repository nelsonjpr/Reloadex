// =============================================================
// Reloadex — Legendarios y Pokémon singulares de Pokémon Reloaded
// =============================================================
// Orden y textos: «Localización de Pokémon Legendarios y Singulares»
// (wiki de Pokémon Reloaded). `dex` es el número mostrado en la guía;
// `spriteId` es el ID real del sprite dentro de /sprites/normal, que en
// Reloaded NO coincide con la Pokédex oficial en muchas especies.

const entry = (dex, name, spriteId, types, location, level = null) => ({
  dex,
  name,
  spriteId,
  types,
  location,
  level,
});

export const legendaries = [
  entry('144', 'Articuno', 144, ['ice', 'flying'], `Isla Viento, tras vencer a todos los Pokémon Boss (Glalie y Froslass) y acomodar todas las rocas de la cueva, en el fondo de la cueva.`),
  entry('145', 'Zapdos', 145, ['electric', 'flying'], `Isla Energía, tras vencer a todos los Pokémon Boss (Electrode y Magneton), aparece en la esquina superior derecha.`),
  entry('146', 'Moltres', 146, ['fire', 'flying'], `Isla Calor, tras vencer a todos los Pokémon Boss (Golem y Golem de Alola) y acomodar todas las rocas de la cueva, en el fondo de la cueva.`),
  entry('150', 'Mewtwo', 150, ['psychic'], `Calle Victoria, solo si has ganado la octava medalla de Kanto y has liberado a Mewthree del Team Rocket.`),
  entry('151', 'Mew', 151, ['psychic'], `Búscalo en la Jungla (va transformándose en pokémon salvajes, síguelo hasta la ruta 26 al sur) luego aparecerá en el Bosque Místico como Pokémon Evasivo tras superar la Liga Pokémon de Kanto 3 veces.`),
  entry('243', 'Raikou', 243, ['electric'], `Después de liberarlo en la Casa abandonada. Podrás encontrarlo en la ruta 15 antes de llegar al Pantano Swamp, después aparecerá como Pokémon Errante.`),
  entry('244', 'Entei', 244, ['fire'], `Después de liberarlo en la Casa abandonada. Se encuentra en la Ruta 17. Ve desde Pueblo Kena hacia el sur y, cuando veas el Instituto Meteorológico, gira a la derecha. Después, aparecerá como Pokémon Errante.`),
  entry('245', 'Suicune', 245, ['water'], `Después de liberarlo en la Casa abandonada. Se encuentra en la parte noroeste del Río Hidra, después aparecerá como Pokémon Errante.`),
  entry('249', 'Lugia', 249, ['psychic', 'flying'], `Se halla en la Isla Remolino luego de eliminar los 200 Remolinos del juego.`),
  entry('250', 'Ho-Oh', 250, ['fire', 'flying'], `Se ubica en el santuario de Ho-Oh en Isla Urano teniendo el Ala Arcoiris (nos lo entrega Oak tras completar la Liga Pokémon de Kanto), haber resuelto los rompecabezas de las ruinas omega y capturar a todos los Unown (funciona capturando de la A a la Z).`),
  entry('251', 'Celebi', 251, ['psychic', 'grass'], `Se encuentra en el Bosque Spica, tras superar la Liga Pokémon de Johto 3 veces y vencer al Team Rekiem en el pasado deberás usar Gran Ojo y conseguir la GS Ball. Tras esto vuelve al Bosque Spica y aparecerá. Es un Pokémon Evasivo.`),
  entry('377', 'Regirock', 377, ['rock'], `Cueva Rocosa, pero para capturarlo es necesario ir con un equipo de seis Pokémon de Tipo Roca y ordenar todas las piedras de la cueva. Tras hacer esto, se debe ir a su altar y decir la frase "Yo te invoco, roca que se reconstruye" con letra T.`),
  entry('378', 'Regice', 378, ['ice'], `Cueva Helada, pero para capturarlo es necesario ir con un equipo de seis Pokémon de Tipo Hielo y ordenar todas las piedras de la cueva. Tras hacer esto, se debe ir a su altar y decir la frase "Yo te invoco, hielo imposible de derretir" con letra T.`),
  entry('379', 'Registeel', 379, ['steel'], `Cueva Metal, pero para capturarlo es necesario ir con un equipo de seis Pokémon de Tipo Acero y ordenar todas las piedras de la cueva. Tras hacer esto, se debe ir a su altar y decir la frase "Yo te invoco, metal más duro existente" con letra T.`),
  entry('380', 'Latias', 380, ['dragon', 'psychic'], `Se encuentra en la ruta 25 junto a Latios; después de encontrarlos se vuelve un Pokémon Errante.`),
  entry('381', 'Latios', 381, ['dragon', 'psychic'], `Se encuentra en la ruta 25 junto a Latias; después de encontrarlos se vuelve un Pokémon Errante.`),
  entry('382', 'Kyogre', 382, ['water'], `Primero debiste haber derrotado al Team Aqua en la Cueva Oceánica, y haber derrotado a Silvana, comandante del equipo mencionado (la cual estará esperándote en la segunda visita a la cueva). Tras vencerla debes volver a la última sala de la Cueva Oceánica, donde anteriormente derrotaste a Aquiles, con Pokémon inferiores al nivel 50, para que aparezca Kyogre (sus pokemones del comandante no estarán acorde al nivel de tu Pokémon más fuerte).`),
  entry('383', 'Groudon', 383, ['ground'], `Aparece en la Cueva Ardiente después de haber vencido al Team Magma. Primero derrota al comandante Tatiano con tus Pokémon de siempre; después regresa al centro Pokémon más cercano y en el PC cambia a tus Pokémon por otros inferiores al nivel 50 (esto es fundamental). Finalmente te saldrá en la Cueva Magmática, en un río de lava, solamente basta con capturarlo.`),
  entry('384', 'Rayquaza', 384, ['dragon', 'flying'], `Se encuentra en el Santuario Celeste, bajo el Santuario Terra de Isla Terra en el Archipiélago Solar. Se necesita Velocidad Extrema, haber completado la Liga Pokémon de Hoenn, capturado a Kyogre y Groudon y aparece al nivel 70 solo si llevas Pokémon de nivel 50 o menor. Es un Pokémon Evasivo.`, 70),
  entry('385', 'Jirachi', 385, ['steel', 'psychic'], `Se ubica en el Bosque Fugaz de La Jungla, al completar la Liga Hoenn 3 veces y capturar a Lady Boss, y aparece al nivel 50. Tiene 50 de evasión.`, 50),
  entry('386', 'Deoxys', 386, ['psychic'], `Para capturar a Deoxys tienes que superar el Dojo Marte de Isla Marte en el Archipiélago Solar 5 veces y haber llegado al Frente de Batalla. Luego, debes ir a la entrada del Bosque Místico y cumplir el evento de Javi huyendo de los Beedrill. Por último, debes ir a la Cueva Roja con un equipo constituido por Pokémon cuyos nombres empiecen por las letras de la palabra "DEOXYS".`),
  entry('480', 'Uxie', 480, ['psychic'], `Después de rescatarlo del Equipo Galaxia aparece en la Zona Extravío. Al interactuar con él se convertirá en un Pokémon Errante.`),
  entry('481', 'Mesprit', 481, ['psychic'], `Después de rescatarlo del Equipo Galaxia aparece en la Zona Extravío. Al interactuar con él se convertirá en un Pokémon Errante.`),
  entry('482', 'Azelf', 482, ['psychic'], `Después de rescatarlo del Equipo Galaxia aparece en la Zona Extravío. Al interactuar con él se convertirá en un Pokémon Errante.`),
  entry('483', 'Dialga', 483, ['steel', 'dragon'], `Isla Halley con Anillo Electromagnético y Diamansfera después de derrotar a Helio en Isla Plutón.`),
  entry('484', 'Palkia', 484, ['water', 'dragon'], `Isla Halley, con Anillo Electromagnético y Lustresfera después de derrotar a Helio en Isla Plutón.`),
  entry('485', 'Heatran', 485, ['fire', 'steel'], `Se debe obtener la Piedra Magma, la cual se encuentra en la Zona Volcánica usando Gran Ojo. Luego debes ir a la Cueva Ardiente y se encontrará en el piso de abajo, en el centro.`),
  entry('486', 'Regigigas', 486, ['normal'], `Se ubica en un santuario del Desierto del Gaara los domingos. Para atraparlo debes caminar por cada espacio de la cueva llevando solo a Regirock, Regice y Registeel en ese orden y recitar "Yo te invoco, Rey de los gigantes" con la letra T.`),
  entry('487', 'Giratina', 487, ['ghost', 'dragon'], `Isla Plutón, con Anillo Electromagnético y Griseosfera al ir al mundo distorsión.`),
  entry('488', 'Cresselia', 488, ['psychic'], `Al atrapar a Darkrai, deberás ir al norte desde Ciudad Sirio y luego al este, donde hay un callejón que antes bloqueaba un hombre dormido sufriendo por una pesadilla. Allí encontrarás la Pluma Lunar. Luego ir a la Cueva Moonlight y en una parte secreta tendrás que buscarla y encontrarla.`),
  entry('489', 'Phione', 489, ['water'], `Criar Manaphy con Mew para que nos salga otro Manaphy, y luego criar a los dos Manaphy; como resultado obtendremos a Phione.`),
  entry('490', 'Manaphy', 490, ['water'], `Luego de pasar la Liga Sinnoh 3 veces, después de que el Team Rocket te secuestra, aparece Manaphy e intercambia tu alma con la de James. Una vez hayas derrotado al Team Rocket aparece como Pokémon evasivo con una evasión de 50 en este mismo bosque.`),
  entry('491', 'Darkrai', 491, ['dark'], `Para combatir contra Darkrai deberás completar la Liga Pokémon de Johto por primera vez y viajar a Ciudad Sirio. Hablar con la líder Noelia y después ir al centro Pokémon para hablar con Aghata. Debes situarte al este de la ciudad, entre las dos estatuas Gengar, a las 00:00 del horario del juego; aparecerán 2 Gengar y después Darkrai te lleva a su hogar. Enfrentarás a Gengar salvajes (Boss), después tendrás un combate con Helia y finalmente podrás enfrentarte a Darkrai.`),
  entry('492', 'Shaymin', 492, ['grass'], `Para capturar a Shaymin se debe ganar la Liga Pokémon de Sinnoh 3 veces y haber capturado al Butterfree rosa en el Paraíso Floral. Se necesita tener plantadas 42 bayas distintas (se sugiere plantarlas en la Ruta 12, debajo del Cementerio Can de Ciudad Sirio). Luego de plantar las bayas y esperar a que broten, debemos ir al Paraíso Floral, los martes de día, con la flor Gracídea. Para encontrar la Gracídea tenemos que terminar el Examen B de la Universidad Pokémon de Isla Júpiter.`),
  entry('493', 'Arceus', 493, ['normal'], `Pasando 3 veces cada liga, en la Colina Sagrada al este de Pueblo Arcturus en La Jungla y acomodando todas las Tablas Elementales. Después deberás obtener un 10 en el Examen S de la Universidad Pokémon para obtener la Flauta Azur.`),
  entry('494', 'Victini', 560, ['psychic', 'fire'], `Luego de haber ganado la Liga Pokémon de Sinnoh 3 veces; Victini aparecerá como Pokémon Evasivo, los domingos durante el día, en el Parque Caloris de Isla Mercurio. Tendrá 55 de evasión y se encontrará en nivel 55.`, 55),
  entry('638', 'Cobalion', 726, ['steel', 'fighting'], `En el Río Perseo luego de haber superado el evento de Kyurem y ganado la liga Teselia.`),
  entry('639', 'Terrakion', 727, ['rock', 'fighting'], `En la Cueva Paleo luego de haber superado el evento de Kyurem y ganado la liga Teselia.`),
  entry('640', 'Virizion', 728, ['grass', 'fighting'], `En el Bosque Silluam luego de haber superado el evento de Kyurem y ganado la liga Teselia.`),
  entry('641', 'Tornadus', 729, ['flying'], `Aparece como Pokémon Errante luego de su última aparición.`),
  entry('642', 'Thundurus', 730, ['electric', 'flying'], `Aparece como Pokémon Errante luego de su última aparición.`),
  entry('643', 'Reshiram', 543, ['dragon', 'fire'], `Debes haber ganado 6 medallas de Teselia y ciertas victorias en el Frente de Batalla. Fer nos llamará y dirá que hay un sol abrasador en la Ruta 8; Willy nos acompañará. Usaremos corte en el arbolito e iremos a la zona de arriba donde se encontrará Reshiram, que vino a advertirnos de una amenaza cercana a la Región Star. Luego se irá; tras obtener un par más de victorias en el Frente podremos encontrarlo y capturarlo en el mismo lugar.`),
  entry('644', 'Zekrom', 544, [], `Debes haber ganado 6 medallas de Teselia y ciertas victorias en el Frente de Batalla. Fer nos llamará y dirá que hay una lluvia torrencial en la Zona Volcánica; para encontrarlo es necesario tener la habilidad Ola-lava. Al empezar a ir por la lava hay que dirigirse a la izquierda hasta la segunda intersección, ir hacia arriba y poco después te encontrarás con Zekrom e Iris, que vendrá a advertirnos de una amenaza cercana a la Región Star. Luego se irá; tras obtener un par más de victorias en el Frente podremos encontrarlo y capturarlo en el mismo lugar.`),
  entry('645', 'Landorus', 731, ['ground', 'flying'], `Aparece como Pokémon Errante luego de su última aparición.`),
  entry('646', 'Kyurem', 545, ['dragon', 'ice'], `Luego de completar la Liga Pokémon de Teselia por primera vez y vencer a N en el Desierto del Gaara.`),
  entry('647', 'Keldeo', 546, ['water', 'fighting'], `Luego de haber atrapado a los otros espadachines místicos (Virizion, Cobalion, Terrakion) debes ponerlos en tu equipo en el siguiente orden: Cobalion, Terrakion, Virizion. Luego ir al Pueblo Arcturus y caminar hacia la base del Team Rekiem; debería aparecer a primera vista.`),
  entry('648', 'Meloetta', 732, ['normal', 'psychic'], `Solo hay que haber ganado la Liga Pokémon de Teselia 3 veces y luego ir al Teatro Melody, que se encuentra cerca de Pueblo Régulo, y la encontraremos esperándonos como Pokémon Único.`),
  entry('649', 'Genesect', 733, ['bug', 'steel'], `En la zona central de la Cueva Retaguardia como Pokémon Único.`),
  entry('716', 'Xerneas', 743, ['fairy'], `Luego de los eventos de la Guarida Flare y la Liga Kalos, tras hablar con Serena en Costa Virgo, estará Xerneas en este mismo lugar. Deberemos perseguirlo a lo largo de toda Isla Supernova hasta llegar a Valle Supernova, donde tendremos que derrotar a los 6 Pokémon Boss y finalmente a Serena. Luego de eso podremos capturar a Xerneas.`),
  entry('717', 'Yveltal', 744, ['dark', 'flying'], `Luego de los eventos en la Guarida Flare y pasar la Liga Kalos, dirigirnos a Playa Géminis y hablar con Kalm, que estará al lado del faro. Empezaremos una persecución por Isla Llanos desde el Monte León hasta el Bosque Centauri. Deberemos enfrentarnos a 6 Pokémon Boss y dirigirnos a la parte derecha del bosque y finalmente enfrentarnos a Kalm para luego capturar a Yveltal.`),
  entry('718', 'Zygarde 50%', 995, ['dragon', 'ground'], `En el Túnel Gaara, en la Guarida Flare, con el dispositivo de Agrupación, luego de haberlo rescatado y encontrar las células necesarias repartidas por toda la región Star.`),
  entry('719', 'Diancie', 835, ['rock', 'fairy'], `En la Zona Pentagonal (la del Torneo del Frente) de la Cueva Retaguardia. Aparecerá solo luego de luchar contra Genesect.`),
  entry('720', 'Hoopa', 836, ['psychic', 'ghost'], `En la Cueva Retaguardia, tras conseguir 12 victorias en cada modalidad de la Supervivencia del Frente.`),
  entry('721', 'Volcanion', 837, ['fire', 'water'], `En la Cueva Retaguardia, tras conseguir 12 victorias en cada modalidad del Palacio del Frente.`),
  entry('772', 'Código Cero', 956, ['normal'], `Al ganar las 5 ligas 3 veces y completar la misión de Manaphy, ir al Pueblo Arcturus, entrar al Centro Pokémon y recibir la llamada del Comisario Amando; completar la misión de eliminar al Team Rekiem. Una vez terminada, ir al Frente de Batalla y hablar con Gladio, que estará cerca de La Torre y nos dará a Código Cero a nivel 40.`, 40),
  entry('785', 'Tapu Koko', 976, ['electric', 'fairy'], `En Isla Llanos, en la parte superior del Monte León. Acércate hasta que se escape de nosotros; entonces nos saldrá en cualquier momento como Pokémon Errante. Necesitarás un Pokémon con Treparrocas para moverte por esta zona.`),
  entry('786', 'Tapu Lele', 977, ['psychic', 'fairy'], `En Isla Supernova, sobre una plataforma en el Bosque Hechizo. Acércate hasta que se escape de nosotros; entonces nos saldrá en cualquier momento como Pokémon Errante.`),
  entry('787', 'Tapu Bulu', 978, ['grass', 'fairy'], `En Isla Espíritu, en el Valle Aries en la esquina inferior izquierda. Luego de activarlo saldrá en cualquier momento como Pokémon Errante.`),
  entry('788', 'Tapu Fini', 979, ['water', 'fairy'], `En Isla Nebulosa, subiendo por el Río Heracles con Cascada hasta llegar a una zona más rocosa y dirigirnos hacia la derecha. Acércate hasta que se escape; entonces nos saldrá en cualquier momento como Pokémon Errante.`),
  entry('789', 'Cosmog', 980, ['psychic'], `Colocar un Solgaleo y un Lunala en la Guardería.`),
  entry('790', 'Cosmoem', 981, ['psychic'], `Evolucionar a Cosmog.`),
  entry('791', 'Solgaleo', 982, ['psychic', 'steel'], `Cueva Libra tras pelear con Samina; requiere tener la Flauta Solar en el inventario.`),
  entry('792', 'Lunala', 983, ['psychic', 'ghost'], `Tras derrotar al Team Skull en la Cueva Elemental y liberar a Lunala, deberemos ir al Monte Selenio de noche. La encontraremos en el mismo lugar donde evolucionó previamente. Lucharemos contra Necrozma, que se fusionará con ella y huirá tras derrotarlo. Entonces pelearemos nuevamente contra Lunala y ya podremos capturarla.`),
  entry('800', 'Necrozma', 991, ['psychic'], `Tras ganar la liga Alola por primera vez, nos reta automáticamente.`),
  entry('801', 'Magearna', 992, ['steel', 'fairy'], `En la Cueva Retaguardia, tras conseguir 12 victorias en cada modalidad de la Fábrica del Frente.`),
  entry('802', 'Marshadow', 994, ['fighting', 'ghost'], `En la Cueva Retaguardia, tras conseguir 12 victorias en cada modalidad de la Zona del Frente.`),
  entry('807', 'Zeraora', 2050, [], `Aparece solo los sábados por la noche, a la derecha y subiendo en Isla Saturno. Solo después de ganar la Liga Sinnoh.`),
  entry('808', 'Meltan', 2060, ['steel'], `Aparece solo los lunes por el día en la parte inferior derecha de Isla Neptuno, bajo una torre.`),
  entry('888', 'Zacian', 2158, ['fairy'], `No disponible de momento.`),
  entry('889', 'Zamazenta', 2159, ['fighting'], `No disponible de momento.`),
  entry('890', 'Eternatus', 2160, ['poison', 'dragon'], `No disponible de momento.`),
  entry('891', 'Kubfu', 2235, ['fighting'], `Aparece los martes en el Valle Espíritu, en Isla Espíritu, como Pokémon único. Cambia de posición ante cualquier reinicio en el juego, como guardar, cargar, entrar en combate o salir del mapa.`),
  entry('892', 'Urshifu Brusco', 2236, ['fighting', 'dark'], `Se obtiene evolucionando a Kubfu al nivel 36 mientras lleva equipadas las Gafas de sol.`),
  entry('892-2', 'Urshifu Fluido', 2237, ['fighting', 'dark'], `Se obtiene evolucionando a Kubfu al nivel 36 mientras lleva equipada el Agua Mística.`),
  entry('893', 'Zarude', 2244, [], `Para que aparezca Zarude deberás llevar en tu equipo al menos un Pokémon Siniestro y uno Planta (se recomienda Cacturne para usar un solo slot). Deberás ir a Campo Blazar en Isla Supernova y derrotar a todos los Pokémon Boss de la zona (puedes encontrarlos usando Gran Ojo, y aparecerán uno solo a la vez). Habiendo hecho eso, en el centro de la zona Zarude te estará esperando.`),
  entry('894', 'Regieleki', 2242, ['electric'], `En Cueva Magnetar, llevando un equipo de seis Pokémon tipo Eléctrico, colocando todas las Rocas Magnéticas en su lugar, derrotando a todos los Pokémon Boss esparcidos por la cueva y recitando la frase "Yo te invoco, energía eléctrica sin fin" estando parados encima de la "X".`),
  entry('895', 'Regidrago', 2243, ['dragon'], `Dentro de la Cueva Orión en Isla Nebulosa, tras haber derrotado a todos los Pokémon Boss que irán apareciendo esparcidos por la cueva y algunos a las afueras de ella (puedes encontrarlos usando Gran Ojo, y aparecerán uno solo a la vez). Tu equipo deberá estar formado por seis Pokémon de tipo Dragón. Si cumples estas condiciones, dentro de la cueva habrá una parte donde deberás subir con Treparrocas y pararte sobre una roca que tiene marcada una X como el resto de Regis, y citar la frase: "Yo te invoco, cabeza de dragón ancestral".`),
  entry('144-2', 'Articuno de Galar', 2232, ['ice', 'flying'], `Para que aparezca, en tu equipo no podrás llevar Pokémon Legendarios y deberás dirigirte al Bosque Mental, en Isla Espíritu. Para esto habremos conseguido el 7.º Pétalo de Alola de parte de Denio. Luego derrotaremos a todos los Pokémon Boss que se encuentran en ambas zonas del bosque sin salir de este y volveremos a la parte de inicio, donde Articuno estará esperándonos.`),
  entry('145-2', 'Zapdos Galar', 2233, ['electric', 'flying'], `Para que aparezca, en tu equipo no podrás llevar Pokémon Legendarios y deberás dirigirte al Abismo Perdido, en Isla Espíritu. Luego derrotaremos a todos los Pokémon Boss que se encuentran en ambas zonas del abismo sin salir de este y volveremos a la parte de inicio, donde Zapdos Galar estará esperándonos.`),
  entry('146-2', 'MoltresGalar', 2234, ['fire', 'flying'], `Para que aparezca, en tu equipo no podrás llevar Pokémon Legendarios; necesitarás haber conseguido la 2.ª Medalla de Kalos y dirigirte al Monte Fénix en Isla Nebulosa, a la derecha de Costa Cetácea. Una vez allí deberás derrotar a todos los Pokémon Boss de la zona y entonces Moltres de Galar aparecerá en la zona más a la derecha del lugar. Para moverte necesitarás un Pokémon que sepa usar Treparrocas.`),
  entry('896', 'Glastrier', 2250, ['ice'], `No disponible de momento.`),
  entry('897', 'Spectrier', 2251, ['ghost'], `No disponible de momento.`),
  entry('898', 'Calyrex', 2238, ['psychic', 'grass'], `No disponible de momento.`),
  entry('905', 'Enamorus', 2267, ['fairy', 'flying'], `Luego del evento de los Celesteela, donde se rompe el tótem rosa de Enamorus, deberemos ir al Bosque Hechizo en Isla Supernova, atravesar la cueva para llegar a la parte del bosque toda rosada como un cuento de hadas y subir a lo más alto de la colina en la parte superior de la zona. Hablar con la chica parada en el centro; entonces Enamorus dejará de poseerla y huirá. A partir de ahí nos saldrá en cualquier momento como Pokémon Errante.`),
  entry('1007', 'Koraidon', 2385, [], `No disponible de momento.`),
  entry('1008', 'Miraidon', 2386, [], `No disponible de momento.`),
  entry('1060', 'Latly', 499, [], `Se obtiene mediante crianza, apareando a Latios con Latias.`),
  entry('1061', 'Silver', 2283, [], `Se obtiene mediante crianza, apareando a Lugia con Mew.`),
  entry('1063', 'Psicovenom', 516, [], `Después de ganar la Liga Star 2 veces, aparece en la Cueva Neith, solo uno al nivel 70. Para que aparezca se deben tapar todos los agujeros de dicha cueva con rocas utilizando Fuerza. Solo aparecerá luego de completar la misión de la fábrica de perfumes en la Isla Venus.`, 70),
  entry('1064', 'Gripherial', 517, [], `No disponible de momento.`),
  entry('1065', 'Mewthree', 500, [], `Se obtiene evolucionando a Mewtwo. Después del evento con el Team Rocket en Parque Vital y habiendo devuelto la Partícula Vital a su lugar, si nuestro Mewtwo tiene un nivel superior a 80 e interactuamos con la partícula, Mewtwo evolucionará en Mewthree.`),
  entry('150-2', 'Dark Mewtwo', 2248, [], `En la Cueva Retaguardia, tras conseguir al menos 5 victorias consecutivas en cada modalidad de todos los pisos de la Torre del Frente.`),
];

export const getLegendariesByGeneration = (gen) => {
  const ranges = {
    1: [144, 151],
    2: [243, 251],
    3: [377, 386],
    4: [480, 493],
    5: [638, 649],
    6: [716, 721],
    7: [772, 808],
    8: [888, 905],
    9: [1007, 1008],
  };
  const range = ranges[gen];
  if (!range) return [];
  return legendaries.filter((l) => {
    const dex = Number(String(l.dex).replace('-2', ''));
    return dex >= range[0] && dex <= range[1];
  });
};

export const getLegendariesByType = (type) =>
  legendaries.filter((l) => l.types.includes(type));
