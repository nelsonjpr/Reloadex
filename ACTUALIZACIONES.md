# Actualizaciones desde la propia app — Reloadex

La app comprueba el último release de GitHub (`nelsonjpr/Reloadex`) y muestra en la
portada un botón que dice **Actualizar** cuando hay versión nueva y **Actualizado**
cuando no la hay. El número mostrado abajo sale de `APP_VERSION` y del `versionName`
del APK; ambos son **1.0.1**.

Hay dos vías:

| Vía | Qué descarga | Cuándo usarla |
| --- | --- | --- |
| **Actualización rápida** (botón principal) | Solo los archivos web que cambiaron | Datos, sprites, diseño, lógica React |
| **APK completo** (botón secundario) | El APK firmado entero | Cambios nativos (Java, permisos, plugins) |

La actualización rápida no reinstala la app: mantiene una copia local de `dist/` en
`/data/data/com.reloadex.pokedex/files/web`, parchea ahí solo los archivos cambiados
y le dice al WebView de Capacitor que cargue desde esa carpeta (`WebView.setServerBasePath`).
Si el ZIP o algún hash falla, se conserva la copia anterior.

## Versiones y firma

La **v1.0** no tenía el actualizador; hubo que instalar manualmente la **v1.1**
(`versionCode 2`) una vez. La versión pública vigente es la **v1.0.1**
(`versionCode 3`, `versionName 1.0.1`): aunque el nombre parezca menor que v1.1,
el `versionCode` mayor permite que Android la instale encima de v1.1 con la misma firma.

Reglas que no se pueden saltar:

- Todo APK nuevo debe ir firmado con el **mismo `reloadex-release.jks`**. Si cambia la
  firma, Android rechaza la actualización ("la app no está instalada").
- Subir `versionCode` en `android/app/build.gradle` en cada APK nuevo (ahora 3 = v1.0.1).
- Si algún día publicas en Google Play, desactiva esta vía: la política de Play exige
  usar *Play In-App Updates* y prohíbe instalar APKs descargados a mano.

## Publicar la v1.0.1

```bash
npm run build
npm run update:bundle -- --version-code 3 --version-name 1.0.1 --tag v1.0.1 \
  --notes "Actualizador integrado y back físico" --set-baseline
npm run apk:release                # APK firmado con versionCode 3
```

Esto crea en `release/`:

- `update-manifest.json` y `update-manifest-v1.0.1.json`
- `web-delta-v1.0.1.zip` (solo los archivos cambiados desde v1.1, porque ya había base)
- `Reloadex-1.0.1.apk` (copia del APK firmado)

Sube a la GitHub Release **v1.0.1** el APK, `update-manifest.json` y el ZIP.
`tools/update-baseline.json` queda fijado en v1.0.1 con `--set-baseline`.

## Publicar versiones posteriores

**Si solo cambian datos / interfaz:** basta con subir `APP_VERSION` en
`src/data/appInfo.js` y generar el bundle. No hace falta recompilar ni subir un APK
nuevo; el `versionCode` del manifiesto debe ser mayor que el de la versión web aplicada:

```bash
npm run build
npm run update:bundle -- --version-code 4 --version-name 1.0.2 --tag v1.0.2 \
  --notes $'Novedades:\n- Más Pokémon\n- Correcciones'
```

**Si además hay cambios nativos** (Java, permisos, plugins): sube también
`versionCode` a 4 en `android/app/build.gradle`, recompila con `npm run apk:release`
y sube el APK a la release. Al instalarlo, Capacitor vuelve a usar los assets del
paquete y la versión web se alinea automáticamente con la del APK.

En ambos casos se genera `release/web-delta-v1.0.2.zip` con **únicamente los archivos
que cambiaron desde v1.0.1**. Sube a la release:

- `release/update-manifest.json`
- `release/web-delta-v1.0.2.zip`
- el APK (`Reloadex-1.0.2.apk`) solo si compilaste uno nuevo

**No vuelvas a pasar `--set-baseline`**: la base debe seguir siendo v1.0.1 para que
los deltas sigan siendo acumulativos y pequeños.

## Flujo dentro de la app

1. Al abrir la portada se consulta la API de GitHub (con cache de 6 h; pulsar el
   botón fuerza la comprobación).
2. Si `versionCode` del manifiesto > versión web aplicada → botón **Actualizar**.
3. Al pulsar, se descarga el ZIP de cambios, se valida el SHA-256 de cada archivo
   y se activa la nueva copia. La app se recarga sola y el botón pasa a **Actualizado**.
4. Si no hay conexión o GitHub falla, el botón sigue mostrando **Actualizado** para
   no molestar; al pulsarlo se reintenta.

La consulta a GitHub se hace con `CapacitorHttp` (HTTP nativo, incluido en
`@capacitor/core`) porque los assets de GitHub Releases no devuelven cabeceras CORS
y un `fetch` del WebView podría ser bloqueado.

El permiso `REQUEST_INSTALL_PACKAGES` solo se usa para el botón de APK completo.
En Android 8+ el usuario debe activar una vez "Instalar apps desconocidas"; la app
lo lleva directamente a ese ajuste si aún no está concedido.
