# Procedencia de datos — Reloadex

Documento interno. **La interfaz no muestra esta información.**

## Fuente de verdad

**Juego:** `D:\Juegos\Reloaded` (Pokémon Reloaded).

### Verificado en disco

- **IDs y existencia:** `data\pkmn\*.gif` y `data\pkmn_shiny\*.gif`.
- **Esquema Reloaded:** base `1-1000`, propios `2001-2425`, mega `+100000`, mega2 `+150000`, formas `+200000`.
- **Textos reales del juego descifrados** (`scripts/decodeReloaded.mjs`, sustitución monoalfabética):
  - `data\text\es\txt_pkmn.dll` → nombre de cada Pokémon.
  - `data\text\es\dex_info.dll` → descripción.
  - `data\text\es\dex_espec.dll` → categoría.
  - `data\text\zz\dex_height_m.dll` / `dex_weight_kg.dll` → altura y peso.
  - `data\text\{es,en}\txt_abilities.dll` → 314 nombres (español del juego y clave interna).
  - `data\text\es\txt_abilities_desc.dll` → 314 descripciones en español.
  - `data\text\{es,en}\ordenNameAbility.dll` → orden alfabético de la UI (no es el ID).
- **Habilidades por Pokémon:** script `PokemonHabilidad` del `gamedata` de GameMaker 8
  (`scripts/game-scripts/PokemonHabilidad.gml.txt`). El ID de habilidad es el número
  de línea en `txt_abilities.dll`. Las pocas especies añadidas que el script no
  contempla (Ruinas, Koraidon/Miraidon, Ogerpon, Terapagos, megas tardías) se
  completan con habilidades oficiales ya presentes en el DLL (`curated-official`).
- **Shiny:** el juego nombra los sprites como `<ID+1000>.gif` (por ejemplo, `1 -> 1001.gif`, `892 -> 1892.gif`).
  El dataset guarda el nombre exacto en `sprite.shinyFile`; la app también conserva copias renombradas a ID plano.
- **Gritos:** carpeta mantenida por el usuario `D:\reloaded\Proyecto Reloaded The Last Beta 1.9.2.2 Full\data\audio\grito` (sincronizada a `public\cries` por `npm run build:data`). Se usa el nombre de archivo exacto por ID; los archivos nuevos tienen prioridad sobre los empaquetados antes.
- **Variantes:** nombres Mega/Gigamax del propio juego; el método mostrado sale del nombre registrado.
- **Iconos de tipos:** extraídos sin modificar los EXE del `gamedata` cifrado de GameMaker 8.0
  (`spr_gotype` 12×12 y `spr_gobigtype` 44×44). El orden de frames se contrastó con `TipoName`
  y los colores con `TipoColor`; se guardan en `public/icons/types/`.
- **Iconos del filtro:** versiones vectoriales SVG 512×512 en blanco puro, guardadas en
  `public/icons/types/hd/` y generadas por `scripts/fetchHdTypeIcons.mjs` desde
  `duiker101/pokemon-type-svg-icons` (MIT). Solo se usan en el filtro para evitar el pixelado.
- **Movimientos por Pokémon:** scripts GML del `gamedata` extraídos por
  `scripts/extractGameScripts.py` (`Ataque_Nivel`, `Ataque_MT`, `Ataque_Tutor`, `Ataque_DT`,
  `AprendeAtaqueHuevo`, `MTAtack`, `IndiceTutor`). `scripts/buildLearnsets.mjs` genera
  `src/data/learnsets.json` con niveles reales, objetos MT/MO, tutores, DTs y huevo;
  nombres y descripciones vienen de `txt_attack.dll` y `txt_attack_desc.dll`.
  `PokemonMovesPanel.jsx` los muestra por pestañas en la ficha de cada Pokémon.
- **Guía/historia:** wikitext de la wiki oficial guardado en `scripts/wiki-cache.json` y
  convertido por `scripts/buildGuideData.mjs` en `src/data/guide.json` (sin peticiones en runtime).
- **Localización de objetos:** scripts GML del `gamedata` (`CreateObjects` para los objetos del
  suelo por sala y `NameLugar` para convertir cada sala en el lugar del juego), cruzados con
  `txt_obj.dll` y `txt_places.dll`. `scripts/buildObjectLocations.mjs` genera
  `src/data/objectLocations.json` con los 821 objetos registrados y sus rutas reales
  (497 con al menos una ruta, 1407 colocaciones en 421 lugares). No se inventa ninguna ruta;
  los objetos sin colocación verificada se dejan sin ubicación.
  Las **97 megapiedras** se clasifican por los IDs que el GML `ObjetoMegaPiedra` acepta
  (408-409, 414-440, 444-449, 452-464, 672-673 y 775-821). La guía de megapiedras de la
  comunidad (`scripts/megaStoneLocations.mjs`, 94 indicaciones) se cruza por nombre con
  `txt_obj.dll` y añade 22 zonas que el juego no deja en el suelo (el resto ya estaban en
  `CreateObjects` con otra grafía, p. ej. «Tunel Gaara»). Condiciones como «solo con Latias
  en el equipo», «piso 14» o «solo en 1.9.2.1» se guardan como detalle de la ruta.
- **Misiones:** `scripts/buildQuests.mjs` cruza `txt_quests.dll` con los GML `TituloMision`,
  `DescribeMision`, `ObjetivosMision` y `ResolucionMision` (extraídos con
  `extractGameScripts.py`) y genera `src/data/quests.json`: **144 misiones** (63 de historia,
  66 del Escuadrón Élite y 15 retos del Frente) con **781 pasos** (689 objetivos, 58 opcionales
  y 34 restricciones). Incluye el **Caso Gripherial** (E048) con sus 9 investigaciones y su
  restricción «Información confidencial». Los marcadores `$parN$` del juego (contadores y
  nombres que se calculan en ejecución) se sustituyen por una lectura en español; el juego no
  guarda recompensas por misión, así que no se inventa ninguna.
- **Caras (truco F3 → `CARA`):** `scripts/buildFaces.mjs` genera `src/data/faces.json` a partir de
  la tabla verificada en `scripts/data/faces.csv`. El flujo del juego se leyó del GML
  `ExecuteCheat` (ID 7579): `0..9` son los 10 protagonistas (`txt_character.dll`, líneas 1-10)
  y `10` pide un segundo número `0..351` que `ValorTrainerTrucado` (ID 10003) convierte en ID
  de entrenador; `NameTrainer` (ID 8740) da el nombre y `ImportTrainer` (ID 8020) carga
  `data\trainer\<ID>.gif`. Los diálogos se confirmaron en `txt_menu.dll` (líneas 1194-1195).
  Hay 361 entradas: 10 protagonistas (`1000.gif`…`1009.gif`) y 351 adicionales. El changelog
  del juego dice «10 + 350», pero el script tiene 351 IDs reales (el último es Segovien).
  347 sprites son GIF sueltos copiados tal cual a `public/caras/`. Los 14 restantes
  (`char2` 338-351: Grey, Violette, Alfred, Lucero, Kim, Sasha, Nadia, Peter, Lilith, Reig,
  Monty, Mellinas, Moisés y Segovien) no tienen GIF suelto: se exportaron de los recursos
  embebidos del EXE (`spr_GreyBig` … `spr_SegovienBig`, índices 1348-1367) y se guardaron como
  PNG en `public/caras/eNNN.png`. No se inventa ningún nombre ni sprite.

### Datos heredados (no verificables en los archivos legibles)

- `types`: vienen del dataset anterior. Se emparejan **por nombre del juego** (`official-name-matched`); cuando Reloaded reutiliza un ID con otro nombre (Pikablue ocupa el 495, que oficialmente es Snivy), no se copia el tipo del hueco. Las criaturas exclusivas sin ficha oficial se dejan sin tipo en lugar de inventar uno.
- Los `stats` de `reloadex.json` (usados en la ficha) se conservan por hueco cuando el nombre es propio de Reloaded (Pikablue y Mega Pikablue mantienen 45/45/55/45/55/63 = 308); cuando el nombre sí coincide con una ficha oficial se usan los stats de esa ficha.
- **Stats base reales para el creador de equipos:** `scripts/buildGameBaseStats.mjs` extrae las tablas `StatPSPokemon`, `StatATPokemon`, `StatDEFPokemon`, `StatATSpPokemon`, `StatDEFSpPokemon` y `StatVELPokemon` del GML incrustado en el EXE. `scripts/buildTeamData.mjs` las vuelca en `src/data/teamData.json` (1397 de 1561 IDs; el resto cae al JSON heredado). `src/utils/pokemonStats.js` aplica las fórmulas originales `PSPokemon`, `ATPokemon`, etc., con IV 9 y dígito de naturaleza 0 (multiplicador 1,0). La velocidad mostrada usa `ShowStatVel`, no la velocidad de movimiento `VELPokemon`.
- **Objetos equipables:** `scripts/buildEquippableItems.mjs` aplica exactamente las reglas del GML `ObjetoPosibleAsignar` a los 821 nombres de `txt_obj.dll`, dando 76 objetos. No se incluyen Revivir ni Revivir Máximo, ni objetos clave, MT o MO que el juego rechaza.
- **Regalos de objetos:** `scripts/buildItemGifts.mjs` combina (a) los 21 regalos NPC dedicados del GML (`CreateNPC1`/`CreateNPC2` + `RegalarHabla`, cruzados con `txt_obj.dll` y `txt_places.dll`) y (b) las entregas narradas en la guía real incluida en `src/data/guide.json`. Resultado: `src/data/itemGifts.json` con 69 regalos, quién, dónde, cuándo y la cita original. Por ejemplo, la Master Ball la entrega **Javi** en el Centro de Investigación, tras vencer al infiltrado (Medalla Psíquica); la Mewtwoita Y la entrega el **Comisario Amando** durante la historia (guía de megapiedras).
- `evolutions` / `prevEvolution`: la autoridad son los scripts GML embebidos en el gamedata del EXE
  (`Dex_evolution_standar`, `Dex_evolution_complex`, `Dex_mega_evolution`, `EvolutionConfirmation`).
  `scripts/extractGameScripts.py` los extrae y `scripts/parseGameEvolutions.mjs` construye la tabla;
  `buildReloadexData.mjs` la aplica antes que el backup heredado (`pokemon_backup.js`, `pokemonFull.js`).
  `Dex_evolution_complex` se interpreta evaluando `PK` y cada modo `(79).EV` (1-19), siguiendo las
  asignaciones `f.p1 / f.p2 / f.str` y las ramas `if/else`, de modo que no se pierdan las líneas
  condicionales (Ralts, Eevee, Pichu, Typhlosion, Mime Jr., Flapple…).
  Los métodos se leen de los textos reales: `txt_menu.dll` (260-266) y `txt_obj.dll` (piedras y objetos).
  **Eevee** mantiene su tabla verificada de 18 piedras (`txt_obj.dll` 43-51, 54, 322, 412, 601-606)
  y prevalece sobre la rama genérica del GML. No se usa felicidad, afecto ni nivel.
- **Corrección aplicada:** el backup apuntaba Primeape → ID 979, que en Reloaded es Tapu Fini.
  `Annihilape` está en `txt_pkmn.dll` con ID real **2357**; el enlace quedó corregido.
- **Urshifu:** Kubfu (2235) evoluciona a 2236 con `Gafas de Sol` y a 2237 con `Agua Mística`, según `Dex_evolution_complex`.
- No se han encontrado tablas por Pokémon de **grupos huevo, pasos de eclosión ni tasa de crecimiento**;
  esos campos no se inventan y la ficha los omite.

### Gritos huérfanos

Estos IDs tienen `.wav` en el juego pero **no sprite ni entrada**:

`10168, 10321, 10600, 10950, 100330, 100496, 100509, 100516, 100517, 100900, 100952, 102356, 102398, 102399, 152356, 202356, 300026`

No se asignan a ningún Pokémon para no atribuir un grito equivocado.

## Regeneración

`npm run build:abilities` regenera el catálogo (`src/data/gameAbilities.json`,
`src/data/abilities.js`, `src/data/abilityNames.es.js`) desde los DLL y el script del juego.
`npm run build:learnsets` genera `src/data/learnsets.json` desde los GML extraídos.
`npm run build:data` ejecuta ambos pasos y actualiza `src/data/reloadex.json` y
`src/data/reloadex.provenance.json`, con `abilities: [{ id, key, name, hidden }]`.
`npm run build:guia` actualiza `src/data/guide.json` desde `scripts/wiki-cache.json`.
`node scripts/buildGameBaseStats.mjs` y `node scripts/buildTeamData.mjs` generan las stats base
reales y el índice ligero del creador de equipos. `node scripts/buildEquippableItems.mjs` y
`node scripts/buildItemGifts.mjs` generan los objetos equipables y los regalos de objetos.
`npm run build:all` regenera habilidades, learnsets, datos y guía, y compila la PWA.

## Límites del entorno

- No se puede generar `.apk` aquí: falta Java/Android SDK y red. La app queda preparada con
  `capacitor.config.json` e instrucciones en `APK.md`.
- La interfaz está en español y no incluye bloques de procedencia ni avisos de "no verificado".
