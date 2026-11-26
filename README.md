# Reloadex — Pokédex de Pokémon Reloaded

Pokédex **profesional** para el fangame **Pokémon Reloaded** (The Last Beta 1.9.2.2), pensada
**mobile-first** y lista para empaquetar como **app móvil (APK)**.

- Nombre de la app: **Reloadex**
- Logo: `logo.png` → copiado a `public/logo.png`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icons/*`
- PWA instalable + service worker offline (`public/manifest.webmanifest`, `public/sw.js`)
- Salida de build APK-ready con Capacitor (`capacitor.config.json`) → ver **[APK.md](./APK.md)**

## Datos: fidelidad a Pokémon Reloaded

La app **no usa datos de Pokémon oficiales como fuente**. El dataset se construye a partir del
**juego real** (`D:\Juegos\Reloaded`) con procedencia honesta por campo. Ver **[DATA_PROVENANCE.md](./DATA_PROVENANCE.md)**.

- **IDs verificados** desde los sprites del juego (`data\pkmn`): `1-1000`, propios `2001-2425`, megas `+100000`, mega2 `+150000`, formas `+200000`.
- **Todos los Pokémon registrados** en el juego, **con megas y formas**, y sprite/shiny/grito reales.
- Los campos se generan desde el juego y sus fuentes internas (`nameSource`, `typesSource`, `statsSource`, …); la interfaz nunca muestra avisos técnicos.

### Guía e historia

`Historia` y `Guía` salen de la wiki oficial de Pokémon Reloaded y funcionan **100 % offline**:
el wikitext cacheado se convierte en `src/data/guide.json` con `npm run build:guia`.
Los capítulos siguen el orden argumental (Oak → 8 medallas de Star → ligas → Volcán Tormento),
con índice, búsqueda, filtros por región/fase y colores para medallas, ligas y eventos.

### Iconos de tipos originales

`public/icons/types/` contiene los iconos reales extraídos del `gamedata` de GameMaker
(`spr_gotype` / `spr_gobigtype`), con transparencia y colores contrastados contra el propio
`TipoColor` del juego. Se usan en la lista, la ficha y el filtro de tipos.

### Regenerar el dataset

```bash
npm run build:data      # node scripts/buildReloadexData.mjs
# o apuntando a otra copia del juego:
RELAODEX_GAME_DATA="D:\Juegos\Reloaded\data" npm run build:data
```

Genera `src/data/reloadex.json` + `src/data/reloadex.provenance.json`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # producción -> dist/
npm run build:guia # regenera guía/historia desde la caché de la wiki
npm run build:all  # regenera datos + guía + build
npm run preview
```

## App móvil (APK)

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android        # genera el APK desde Android Studio
```

Requiere **Java + Android SDK**. Detalle y notas en **[APK.md](./APK.md)**.

## Tecnologías

React 18 · Vite 5 · Tailwind CSS · Framer Motion · Lucide React · PWA/Service Worker · Capacitor-ready

---

**Versión:** 2.1.0 · **Pokémon Reloaded:** Beta 1.9.2.2
