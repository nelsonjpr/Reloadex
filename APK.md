# Generar el APK — Reloadex

**Descarga pública:** [Reloadex-1.0.4.apk](https://github.com/nelsonjpr/Reloadex/releases/download/v1.0.4/Reloadex-1.0.4.apk)
· [Página del release](https://github.com/nelsonjpr/Reloadex/releases/tag/v1.0.4)

La v1.0.4 (`versionCode 6`) corrige el error `No se pudo calcular SHA-256` al aplicar un
delta: ya no se crea una carpeta cuando un asset no existe. Incluye además las 361 caras,
la paleta de comandos, el modal siempre encima y la corrección de `Falta el archivo
sprites/normal/100025.gif`; consulta `ACTUALIZACIONES.md`.

La app se distribuye como **APK firmado** y funciona **100% offline desde el primer arranque**:
dataset, guía, sprites, shiny, fuentes y gritos van dentro del paquete. No usa PokeAPI ni
Google Fonts en runtime.

## Requisitos

- Node 22+
- **JDK 21** (Temurin recomendado). No hace falta configurar `JAVA_HOME`: `scripts/runGradle.mjs`
  lo detecta solo en `%LOCALAPPDATA%\Programs\jdk-21*`, `Program Files\EclipseAdoptium` o `JAVA_HOME`.
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

## Compilar después de cambios

```bash
npm run apk:release    # build web + cap sync + APK firmado, en un solo comando
```

Salida: `android/app/build/outputs/apk/release/app-release.apk`. La v1.0.4
pesa **38.898.667 bytes** y su SHA-256 es `73a64819461e6e14f542b69bd612964f68a1e9f357e851fde568ed4c049d5630`.
Firmado con los esquemas v1 (JAR), v2 y v3; verifica con
`apksigner verify --verbose --min-sdk-version 18 <apk>`.
Para probar sin firmar: `npm run apk:debug`.

**Tiempo medido con caché caliente: ~67 s** (Vite ~19 s + `cap sync` ~4 s + Gradle ~37 s).
Solo cambia el código: no rehaces gritos, iconos ni keystore. Para tocar únicamente algo nativo
de Android puedes saltarte el build web y llamar a Gradle directo (~20-30 s):

```bash
node scripts/runGradle.mjs assembleRelease --no-daemon -x :capacitor-android:extractReleaseAnnotations -x :capacitor-cordova-android-plugins:extractReleaseAnnotations -x :capacitor-android:lintVitalAnalyzeRelease -x :capacitor-cordova-android-plugins:lintVitalAnalyzeRelease -x :app:lintVitalAnalyzeRelease -x :app:lintVitalReportRelease -x :app:lintVitalRelease
```

Si el cambio fue en datos del juego (`scripts/buildReloadexData.mjs`, guía, etc.), usa
`npm run build:all && npm run apk:release`, que sí regenera `dist/` desde cero.

### Si Google Maven está bloqueado

AGP 8.13 intenta descargar `intellij-core`/`kotlin-compiler` para las tareas de anotaciones y
lint. `npm run apk:release` ya omite esas tareas (no afectan al APK) y
`scripts/prepareApkBuild.mjs` crea los `typedefs.txt` vacíos que AGP exige como entrada.
Los JARs descargados como respaldo viven en `android/local-jars/` (ignorado por git).

## Publicar para todo el mundo

El release **v1.0.4 ya está publicado**: https://github.com/nelsonjpr/Reloadex/releases/tag/v1.0.4
(anteriores: v1.0.3, v1.0.2, v1.0.1 y v1.0)

1. Sube `app-release.apk` como asset de un **GitHub Release** para versiones nuevas.
2. Quien descarga el APK desde el móvil lo instala habilitando "Instalar apps desconocidas".
3. No necesita internet para usar la Pokédex: todo viene dentro del APK.

Si luego quieres Play Store, usa el mismo keystore y sube el **AAB** (`bundleRelease`) en vez
del APK; la cuenta de desarrollador tiene un costo único.
