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
- **Shiny:** el juego nombra los sprites como `<ID+1000>.gif` (por ejemplo, `1 -> 1001.gif`, `892 -> 1892.gif`).
  El dataset guarda el nombre exacto en `sprite.shinyFile`; la app también conserva copias renombradas a ID plano.
- **Gritos:** `data\audio\grito` (copiados a `public\cries`). Se usa el nombre de archivo exacto por ID.
- **Variantes:** nombres Mega/Gigamax del propio juego; el método mostrado sale del nombre registrado.

### Datos heredados (no verificables en los archivos legibles)

- `types` / `stats`: vienen del dataset anterior. Los tipos se emparejan **por nombre del juego** (`official-name-matched`); cuando Reloaded reutiliza un ID con otro nombre (Pikablue ocupa el 495, que oficialmente es Snivy), no se copia el tipo del hueco. Las criaturas exclusivas sin ficha oficial se dejan sin tipo en lugar de inventar uno.
- Los stats se conservan por hueco cuando el nombre es propio de Reloaded (Pikablue y Mega Pikablue mantienen 45/45/55/45/55/63 = 308); cuando el nombre sí coincide con una ficha oficial se usan los stats de esa ficha (por ejemplo, Sylveon).
- `evolutions` / `prevEvolution`: del backup interno (`pokemon_backup.js`, `pokemonFull.js`), solo donde existe registro.
  No hay una tabla de evolución legible en el juego; los métodos son datos internos heredados, no verificados en disco.
- **Corrección aplicada:** el backup apuntaba Primeape → ID 979, que en Reloaded es Tapu Fini.
  `Annihilape` está en `txt_pkmn.dll` con ID real **2357**; el enlace quedó corregido.
- **Urshifu:** las dos formas del juego (2236 y 2237) no tienen método de evolución legible; se muestran como dos ramas desde Kubfu (2235), sin inventar objeto.
- No se han encontrado tablas por Pokémon de **grupos huevo, pasos de eclosión ni tasa de crecimiento**;
  esos campos no se inventan y la ficha los omite.

### Gritos huérfanos

Estos IDs tienen `.wav` en el juego pero **no sprite ni entrada**:

`10168, 10321, 10600, 10950, 100952, 102356, 102398, 102399`

No se asignan a ningún Pokémon para no atribuir un grito equivocado.

## Regeneración

`npm run build:data` actualiza `src/data/reloadex.json` y `src/data/reloadex.provenance.json`.
`npm run build:all` regenera datos y compila la PWA.

## Límites del entorno

- No se puede generar `.apk` aquí: falta Java/Android SDK y red. La app queda preparada con
  `capacitor.config.json` e instrucciones en `APK.md`.
- La interfaz está en español y no incluye bloques de procedencia ni avisos de "no verificado".
