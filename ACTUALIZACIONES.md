# Actualizaciones desde la propia app — Reloadex

La app comprueba el último release de GitHub (`nelsonjpr/Reloadex`) y muestra en la
portada un botón que dice **Actualizar ahora** cuando hay versión nueva y
**Actualizado** cuando no la hay. El número mostrado abajo sale de `APP_VERSION` y
del `versionName` del APK; ambos son **1.0.5** en el código fuente.

Solo hay un botón de actualización. Al pulsarlo se abre una tarjeta opaca y la
descarga empieza en el acto (no hay segundo botón de confirmación). La tarjeta muestra:

- el tamaño aproximado de la descarga;
- si corresponde un APK completo o solo los cambios web;
- una barra de progreso real con MB descargados y porcentaje.

El propio botón decide qué descargar:

| Situación | Qué descarga |
| --- | --- |
| El release sube el `versionCode` del APK | El APK firmado entero (cambios nativos) |
| El release solo sube la versión web | Solo los archivos que cambiaron |

La actualización web no reinstala la app: mantiene una copia local de `dist/` en
`/data/data/com.reloadex.pokedex/files/web`, parchea ahí solo los archivos cambiados
y le dice al WebView de Capacitor que cargue desde esa carpeta (`WebView.setServerBasePath`).
Si el ZIP o algún hash falla, se conserva la copia anterior.

Desde la v1.0.3 la tarjeta se monta con un portal sobre `<body>` y usa un `z-index`
muy alto: el footer tiene `backdrop-filter`, que antes atrapaba el modal y lo dejaba
debajo de las tarjetas del inicio. También se corrigió `prune()` en el plugin nativo:
comparaba las rutas desde el subdirectorio recorrido y borraba archivos válidos como
`sprites/normal/100025.gif` antes de verificarlos. Si falta un archivo en la copia
local, el plugin lo recupera desde los assets del APK y vuelve a validar su SHA-256.

En la v1.0.4 se corrigió además el `No se pudo calcular SHA-256`: `copyAssets()` usaba
`AssetManager.list()`, que devuelve vacío tanto para archivos como para rutas que no
existen. Al recuperar un archivo ausente creaba una carpeta con su nombre y luego el
hash intentaba leerla como archivo. Ahora `am.open()` decide si es un archivo real; si
no existe, se informa `Falta el archivo <ruta>` en vez de generar una carpeta falsa.

La v1.0.5 cambia los recursos nativos del icono (`npm run icons:android` genera los PNG
de todos los tamaños con el logo a sangre y fondo `#0b0f1a`, y añade los adaptive icons
`mipmap-anydpi-v26` para que Android 8+ no caiga al robot por defecto ni al blanco del
template) y el buscador de **Objeto equipado** en el creador de equipos: en vez de los
76 objetos equipables según el GML, ofrece los **821 objetos** de `objectLocations.json`
con búsqueda por nombre o ID.

## Versiones y firma

La **v1.0** no tenía el actualizador; hubo que instalar manualmente la **v1.1**
(`versionCode 2`) una vez. La versión pública vigente es la **v1.0.5**
(`versionCode 7`, `versionName 1.0.5`), que se instala encima de la v1.0.4
con la misma firma: corrige el icono y conserva las correcciones del actualizador, las
Caras y la paleta de comandos.

Reglas que no se pueden saltar:

- Todo APK nuevo debe ir firmado con el **mismo `reloadex-release.jks`**. Si cambia la
  firma, Android rechaza la actualización ("la app no está instalada").
- Subir `versionCode` en `android/app/build.gradle` en cada APK nuevo (ahora 7 = v1.0.5).
- Si algún día publicas en Google Play, desactiva esta vía: la política de Play exige
  usar *Play In-App Updates* y prohíbe instalar APKs descargados a mano.

## Publicar la v1.0.5

```bash
npm run build
npm run update:bundle -- --version-code 7 --version-name 1.0.5 --tag v1.0.5 \
  --notes "Reloadex 1.0.5: icono con el logo a sangre y sin fondo blanco." --set-baseline
npm run apk:release                # APK firmado con versionCode 7
```

El delta se calcula desde la base fijada en v1.0.4 y se suben los tres assets a la
GitHub Release **v1.0.5**: `Reloadex-1.0.5.apk`, `update-manifest.json` y
`web-delta-v1.0.5.zip`.

## Publicar la v1.0.4 (histórico)

```bash
npm run build
npm run update:bundle -- --version-code 6 --version-name 1.0.4 --tag v1.0.4 \
  --notes "Reloadex 1.0.4: corregido el error SHA-256 al aplicar actualizaciones web." --set-baseline
npm run apk:release                # APK firmado con versionCode 6
```

## Publicar la v1.0.3 (histórico)

```bash
npm run build
npm run update:bundle -- --version-code 5 --version-name 1.0.3 --tag v1.0.3 \
  --notes "Reloadex 1.0.3: 361 caras del truco CARA, paleta de comandos y correcciones del actualizador." --set-baseline
npm run apk:release                # APK firmado con versionCode 5
```

El delta se calcula desde la base fijada en v1.0.2 y se suben los tres assets a la
GitHub Release **v1.0.3**: `Reloadex-1.0.3.apk`, `update-manifest.json` y
`web-delta-v1.0.3.zip`.

## Publicar la v1.0.2 (histórico)

```bash
npm run build
npm run update:bundle -- --version-code 4 --version-name 1.0.2 --tag v1.0.2 \
  --notes "Actualizador con progreso, modal professional y corrección del error EISDIR" --set-baseline
npm run apk:release                # APK firmado con versionCode 4
```

Esto crea en `release/`:

- `update-manifest.json` y `update-manifest-v1.0.2.json`
- `web-delta-v1.0.2.zip` (archivos web cambiados desde v1.0.1)
- `Reloadex-1.0.2.apk` (copia del APK firmado)

Sube a la GitHub Release **v1.0.2** el APK, `update-manifest.json` y el ZIP.
`tools/update-baseline.json` queda fijado en v1.0.2 con `--set-baseline`.

## Publicar versiones posteriores

**Si solo cambian datos / interfaz:** no hace falta recompilar ni subir un APK nuevo.
Mantén el `versionCode` del APK y sube solo el del manifiesto:

```bash
npm run build
npm run update:bundle -- --version-code 8 --version-name 1.0.6 --tag v1.0.6 \
  --notes $'Novedades:\n- Más Pokémon\n- Correcciones'
```

**Si además hay cambios nativos** (Java, permisos, plugins): sube también
`versionCode` en `android/app/build.gradle`, recompila y sube el APK a la release.
Al instalarlo, Capacitor vuelve a usar los assets del paquete y la versión web se
alinea automáticamente con la del APK.

En ambos casos se genera `release/web-delta-v1.0.6.zip` con **únicamente los archivos
que cambiaron desde la base fijada**. Sube a la release:

- `release/update-manifest.json`
- `release/web-delta-v1.0.6.zip`
- el APK (`Reloadex-1.0.6.apk`) solo si compilaste uno nuevo

**No vuelvas a pasar `--set-baseline`** en las actualizaciones web posteriores: la base
debe seguir siendo la última release publicada para que los deltas sean pequeños.

## Flujo dentro de la app

1. Al abrir la portada se consulta la API de GitHub (con cache de 6 h; pulsar el
   botón fuerza la comprobación).
2. Si `versionCode` del manifiesto > versión web aplicada → botón **Actualizar ahora**.
3. Al pulsar, la tarjeta muestra el tamaño estimado y el botón inicia la descarga.
   El plugin nativo emite eventos `updateProgress` y la barra muestra el avance real.
4. Si el release trae código nativo nuevo, se descarga e instala el APK; si no, se
   aplica el delta, se valida el SHA-256 de cada archivo y la app se recarga sola.
5. Si no hay conexión o GitHub falla, el botón sigue mostrando **Actualizado** para
   no molestar; al pulsarlo se reintenta.

La consulta a GitHub se hace con `CapacitorHttp` (HTTP nativo, incluido en
`@capacitor/core`) porque los assets de GitHub Releases no devuelven cabeceras CORS
y un `fetch` del WebView podría ser bloqueado.

El permiso `REQUEST_INSTALL_PACKAGES` solo se usa cuando el botón decide instalar el
APK completo. En Android 8+ el usuario debe activar una vez "Instalar apps desconocidas";
la app lo lleva directamente a ese ajuste si aún no está concedido.
