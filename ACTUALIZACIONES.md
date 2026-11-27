# Actualizaciones desde la propia app — Reloadex

La app comprueba el último release de GitHub (`nelsonjpr/Reloadex`) y muestra en la
portada un botón que dice **Actualizar** cuando hay versión nueva y **Actualizado**
cuando no la hay.

Hay dos vías:

| Vía | Qué descarga | Cuándo usarla |
| --- | --- | --- |
| **Actualización rápida** (botón principal) | Solo los archivos web que cambiaron | Datos, sprites, diseño, lógica React |
| **APK completo** (botón secundario) | El APK firmado entero | Cambios nativos (Java, permisos, plugins) |

La actualización rápida no reinstala la app: mantiene una copia local de `dist/` en
`/data/data/com.reloadex.pokedex/files/web`, parchea ahí solo los archivos cambiados
y le dice al WebView de Capacitor que cargue desde esa carpeta (`WebView.setServerBasePath`).
Si el ZIP o algún hash falla, se conserva la copia anterior.

## ⚠️ Importante: la primera vez es manual

La v1.0 que ya está instalada en los móviles **no tiene el actualizador dentro**, así que
no puede enterarse de nada por sí sola. Hay que publicar la **v1.1** y que cada usuario
la instale una vez desde GitHub como siempre. A partir de v1.1, todas las versiones
siguientes se actualizan desde el botón de la app.

Reglas que no se pueden saltar:

- Todo APK nuevo debe ir firmado con el **mismo `reloadex-release.jks`**. Si cambia la
  firma, Android rechaza la actualización ("la app no está instalada").
- Subir `versionCode` en `android/app/build.gradle` en cada release (ahora 2 = v1.1).
- Si algún día publicas en Google Play, desactiva esta vía: la política de Play exige
  usar *Play In-App Updates* y prohíbe instalar APKs descargados a mano.

## Publicar la v1.1 (primera vez)

```bash
npm run build                      # dist/
npm run apk:release                # APK firmado con versionCode 2
npm run update:bundle -- --version-code 2 --version-name 1.1 --tag v1.1 \
  --notes "Primer release con actualizador" --set-baseline
```

Esto crea en `release/`:

- `update-manifest.json`
- `update-manifest-v1.1.json`
- `web-full-v1.1.zip` (paquete web completo; al no haber base aún no hay delta)

Sube a la GitHub Release **v1.1** estos tres archivos junto al APK:

```bash
gh release create v1.1 android/app/build/outputs/apk/release/app-release.apk#Reloadex-1.1.apk \
  release/update-manifest.json release/web-full-v1.1.zip \
  --title "Reloadex 1.1" --notes "Actualizador integrado"
```

`tools/update-baseline.json` queda fijado en v1.1. Ese es el punto de comparación
para todos los deltas futuros (así funciona incluso si un usuario salta versiones).

## Publicar versiones posteriores (v1.2, v1.3, …)

**Si solo cambian datos / interfaz (lo habitual):** basta con subir `APP_VERSION`
en `src/data/appInfo.js` y generar el bundle. No hace falta recompilar ni subir un APK
nuevo; el `versionCode` del manifiesto debe ser mayor que el de la versión web aplicada:

```bash
npm run build
npm run update:bundle -- --version-code 3 --version-name 1.2 --tag v1.2 \
  --notes $'Novedades:\n- Más Pokémon\n- Correcciones'
```

**Si además hay cambios nativos** (Java, permisos, plugins): sube también
`versionCode` a 3 en `android/app/build.gradle`, recompila con `npm run apk:release`
y sube el APK a la release. Al instalarlo, Capacitor vuelve a usar los assets del
paquete y la versión web se alinea automáticamente con la del APK.

En ambos casos se genera `release/web-delta-v1.2.zip` con **únicamente los archivos
que cambiaron desde v1.1**. Sube a la release:

- `release/update-manifest.json`
- `release/web-delta-v1.2.zip`
- el APK (`Reloadex-1.2.apk`) solo si compilaste uno nuevo

**No vuelvas a pasar `--set-baseline`**: la base debe seguir siendo v1.1 para que
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
