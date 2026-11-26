# Generar el APK — Reloadex

La app está **APK-ready**: build de producción, **PWA**, **logo/iconos**, `viewport-fit=cover`,
safe-area, `capacitor.config.json`. **No se puede generar el `.apk` en este entorno** (no hay
**Java**, **Android SDK**, ni **red** para instalar Capacitor). Hazlo en tu máquina:

## 1. Requisitos

- **Node 18+**
- **Java 17** (JDK)
- **Android SDK** (Android Studio) + `ANDROID_HOME`
- **Gradle** (viene con el proyecto Android de Capacitor)

## 2. Build web

```bash
npm install
npm run build            # genera dist/
```

## 3. Capacitor → Android

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android                 # crea android/
npx cap sync android                # copia dist/ + plugins
npx cap open android                # abre Android Studio
```

En Android Studio: **Build → Build Bundle(s) / APK → Build APK(s)**.
Salida típica: `android/app/build/outputs/apk/debug/app-debug.apk`
(release firmado en `.../release/`).

> `capacitor.config.json` ya define `appId: com.reloadex.pokedex`, `appName: Reloadex`, `webDir: dist`.
> El **icono** usa tu `logo.png`; para regenerar assets Android puedes usar `@capacitor/assets`
> (`npx capacitor-assets generate --android`) o poner `icon`/`splash` en `android/app/src/main/res`.

## 4. CLI pura (sin Android Studio)

```bash
cd android
./gradlew assembleDebug      # APK debug
./gradlew assembleRelease    # APK release (necesita keystore de firma)
```

## Notas

- La app es **offline-friendly**: sprites, shiny, gritos, dataset y service worker van empaquetados.
- No requiere conexión a internet ni a PokeAPI; todo sale de **Pokémon Reloaded**.
- Si sirves la app también como PWA, `manifest.webmanifest` + `sw.js` permiten "Añadir a pantalla de inicio".
