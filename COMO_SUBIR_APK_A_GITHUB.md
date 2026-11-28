# 📱 Cómo subir la APK v1.0.7 a GitHub Releases

## ✅ COMPLETADO:
- ✅ Código subido a GitHub (commit a556d18)
- ✅ APK compilada exitosamente: `release/Reloadex-v1.0.7.apk` (37.1 MB)
- ✅ Versión: 1.0.7 (versionCode 9)

---

## 📤 SUBIR MANUALMENTE A GITHUB:

### Opción 1: Desde la web de GitHub (MÁS FÁCIL)

1. Ve a tu repositorio: https://github.com/nelsonjpr/Reloadex

2. Clic en **Releases** (columna derecha)

3. Clic en **"Draft a new release"** o **"Create a new release"**

4. Rellena el formulario:
   - **Tag version:** `v1.0.7`
   - **Release title:** `v1.0.7 - Mejoras en datos y UI`
   - **Description:**
     ```markdown
     ## 🎮 Reloadex v1.0.7

     ### Cambios principales
     - 🔧 Datos corregidos del juego (reloadex.json actualizado)
     - 🎨 Mejoras en componentes: AbilitiesView, CarasView, GuiaView, etc.
     - 📋 Nuevos scripts: dexTextMap.mjs, patchDexText.mjs, extractGameScripts.py
     - 🐛 Correcciones de bugs y optimizaciones
     - 📱 Configuración Android actualizada (versionCode 9)

     ### 📥 Instalación
     1. Descarga el archivo **Reloadex-v1.0.7.apk** (37.1 MB)
     2. Permite instalación desde fuentes desconocidas en tu dispositivo Android
     3. Instala la APK
     4. ¡Disfruta del Pokédex completo de Reloaded!

     **Tamaño:** 37.1 MB  
     **Versión Android:** Mínimo SDK 23 (Android 6.0+)
     ```

5. **IMPORTANTE:** Arrastra el archivo `release/Reloadex-v1.0.7.apk` a la zona de "Attach binaries"

6. Marca ✅ "Set as the latest release"

7. Clic en **"Publish release"**

---

### Opción 2: Instalar GitHub CLI y hacerlo automático

```powershell
# Instala GitHub CLI desde:
# https://cli.github.com/

# Luego ejecuta:
gh auth login

# Y después:
gh release create v1.0.7 "d:/Trabajo/Reloadex/release/Reloadex-v1.0.7.apk" `
  --title "v1.0.7 - Mejoras en datos y UI" `
  --notes-file RELEASE_NOTES.md `
  --repo nelsonjpr/Reloadex
```

---

## 📲 COMPARTIR LA APK:

Una vez publicado el release, el enlace directo será:

```
https://github.com/nelsonjpr/Reloadex/releases/download/v1.0.7/Reloadex-v1.0.7.apk
```

Los usuarios pueden:
1. Ir a: https://github.com/nelsonjpr/Reloadex/releases/latest
2. Descargar directamente la APK desde su móvil
3. Instalar (necesitan activar "Fuentes desconocidas" en Android)

---

## 🔄 PRÓXIMAS VERSIONES:

Para futuras versiones, el proceso es:

1. Actualizar versión en `package.json`:
   ```json
   "version": "1.0.8"
   ```

2. Actualizar versión en `android/app/build.gradle`:
   ```gradle
   versionCode 10
   versionName "1.0.8"
   ```

3. Hacer cambios en el código

4. Compilar y subir:
   ```powershell
   git add -A
   git commit -m "v1.0.8 - Descripción de cambios"
   git push origin main
   npm run apk:release
   ```

5. Subir APK a GitHub Releases (manual o con gh CLI)

---

## 📁 ARCHIVOS IMPORTANTES:

- **APK lista para distribuir:** `release/Reloadex-v1.0.7.apk`
- **Código fuente:** Repositorio GitHub (commit a556d18)
- **Configuración Android:** `android/app/build.gradle`
- **Versión de la app:** `package.json` + `src/data/appInfo.js`

---

## 🎉 ¡LISTO PARA INSTALAR!

La APK está firmada con tu keystore y lista para distribuir.
Los usuarios pueden instalarla directamente en sus móviles Android.
