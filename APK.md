# Generar el APK — Reloadex

**Descarga pública:** [Reloadex-1.0.apk (34,5 MB)](https://github.com/nelsonjpr/Reloadex/releases/download/v1.0/Reloadex-1.0.apk)
· [Página del release](https://github.com/nelsonjpr/Reloadex/releases/tag/v1.0)

La app se distribuye como **APK firmado** y funciona **100% offline desde el primer arranque**:
dataset, guía, sprites, shiny, fuentes y gritos van dentro del paquete. No usa PokeAPI ni
Google Fonts en runtime.

## Requisitos

- Node 22+
- **JDK 21** (Temurin recomendado)
- Android SDK con **platform 36** y `ANDROID_HOME` apuntando al SDK
- `ffmpeg` en el PATH (solo si vas a regenerar los gritos desde el juego)

## Build web (offline)

```bash
npm install
npm run build          # dist/ (~31 MB: 1.381 gritos MP3, sprites, JSON, fuentes)
```

`npm run build:all` regenera además `reloadex.json` desde el juego. Los gritos WAV del juego se
convierten automáticamente a **MP3 mono 96 kbps sin carátula** (`scripts/buildReloadexData.mjs`);
el WAV original ocupaba ~230 MB y el MP3 ~21 MB.

## Capacitor → Android

```bash
npm run apk:prepare    # build + cap sync android
npx @capacitor/assets generate --android \
  --iconBackgroundColor '#0b0f1a' --splashBackgroundColor '#0b0f1a'
```

Los iconos y el splash se generan desde `assets/logo.png` (tu `logo.png`). El `appId` es
`com.reloadex.pokedex` y el `webDir` es `dist`.

## Firma release (una sola vez)

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/reloadex-release.jks \
  -alias reloadex -keyalg RSA -keysize 2048 -validity 10000
```

Crea `android/keystore.properties` (ignorado por git):

```properties
storeFile=reloadex-release.jks
storePassword=TU_PASSWORD
keyAlias=reloadex
keyPassword=TU_PASSWORD
```

> **Guarda el `.jks` y esas contraseñas fuera del repo.** Sin ellos no podrás firmar futuras
> versiones con la misma identidad.

## Compilar

```bash
npm run apk:release    # assemblyRelease firmado
```

Salida: `android/app/build/outputs/apk/release/app-release.apk` (~34,5 MB).
Para probar sin firmar: `npm run apk:debug`.

### Si Google Maven está bloqueado

AGP 8.13 intenta descargar `intellij-core`/`kotlin-compiler` para las tareas de anotaciones y
lint. `npm run apk:release` ya omite esas tareas (no afectan al APK) y
`scripts/prepareApkBuild.mjs` crea los `typedefs.txt` vacíos que AGP exige como entrada.
Los JARs descargados como respaldo viven en `android/local-jars/` (ignorado por git).

## Publicar para todo el mundo

El release **v1.0 ya está publicado**: https://github.com/nelsonjpr/Reloadex/releases/tag/v1.0

1. Sube `app-release.apk` como asset de un **GitHub Release** para versiones nuevas.
2. Quien descarga el APK desde el móvil lo instala habilitando "Instalar apps desconocidas".
3. No necesita internet para usar la Pokédex: todo viene dentro del APK.

Si luego quieres Play Store, usa el mismo keystore y sube el **AAB** (`bundleRelease`) en vez
del APK; la cuenta de desarrollador tiene un costo único.
