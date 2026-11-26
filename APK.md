# Generar el APK — Reloadex

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

Salida: `android/app/build/outputs/apk/release/app-release.apk` (~30 MB).
Para probar sin firmar: `npm run apk:debug`.

## Publicar para todo el mundo

1. Sube `app-release.apk` a un **GitHub Release** de este repo (tag `v1.0`, por ejemplo).
2. Quien descarga el APK desde el móvil lo instala habilitando "Instalar apps desconocidas".
3. No necesita internet para usar la Pokédex: todo viene dentro del APK.

Si luego quieres Play Store, usa el mismo keystore y sube el **AAB** (`bundleRelease`) en vez
del APK; la cuenta de desarrollador tiene un costo único.
