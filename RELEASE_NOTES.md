# 🎮 Reloadex v1.0.7

## Cambios principales

### 🔧 Datos del juego
- Actualización completa de `reloadex.json` con datos corregidos del juego
- Nuevos scripts para extracción automática de datos del juego:
  - `dexTextMap.mjs` - Mapeo de textos de Pokédex
  - `patchDexText.mjs` - Parcheo de descripciones
  - `extractGameScripts.py` - Extracción de scripts GML
  - Scripts del juego: GetOrdenDex, GetOrdenDexEspecial, NumeroPokemonEspecial

### 🎨 Mejoras de UI
- Mejoras en `AbilitiesView` - Vista de habilidades optimizada
- Mejoras en `CarasView` - Visualización de sprites faciales
- Mejoras en `GuiaView` - Guía del juego más completa
- Mejoras en `LegendariesView` - Vista de legendarios actualizada
- Mejoras en `MovesView` - Listado de movimientos mejorado
- Mejoras en `ObjectLocationsView` - Localización de objetos
- Mejoras en `QuestsView` - Sistema de misiones
- Mejoras en `TeamBuilder` - Constructor de equipos
- Mejoras en `Pokedex` - Vista principal de Pokédex
- Mejoras en `PokemonDetail` - Detalles de Pokémon
- Mejoras en `EvolutionTree` - Árbol de evoluciones
- Sistema de actualizaciones mejorado (`UpdateButton`, `updater.js`)

### 🔨 Configuración técnica
- Versión Android actualizada:
  - `versionCode`: 9
  - `versionName`: "1.0.7"
- Iconos de tipos HD actualizados
- Configuración de launcher mejorada (`ic_launcher_background.xml`)
- Manifest web actualizado (`manifest.webmanifest`)
- Estilos CSS optimizados (`index.css`)
- Scripts de compilación mejorados (`buildReloadexData.mjs`)

### 📄 Documentación
- Actualización de `ACTUALIZACIONES.md` con historial completo
- Actualización de `APK.md` con instrucciones de compilación
- Actualización de `DATA_PROVENANCE.md` con origen de datos

## 📥 Instalación

1. Descarga el archivo **Reloadex-v1.0.7.apk** (37.1 MB)
2. En tu dispositivo Android, ve a **Ajustes > Seguridad**
3. Activa **"Permitir instalación de aplicaciones de fuentes desconocidas"** (o similar)
4. Abre el archivo APK descargado
5. Sigue las instrucciones en pantalla
6. ¡Listo! Ya puedes disfrutar del Pokédex completo de Pokémon Reloaded

## 📱 Requisitos

- **Sistema:** Android 6.0 (Marshmallow) o superior (SDK 23+)
- **Espacio:** ~50 MB libres
- **Permisos:** Almacenamiento (para guardar equipos y configuración)

## 🔗 Enlaces

- **Repositorio:** https://github.com/nelsonjpr/Reloadex
- **Issues:** https://github.com/nelsonjpr/Reloadex/issues
- **Releases:** https://github.com/nelsonjpr/Reloadex/releases

## 🐛 Problemas conocidos

Si encuentras algún bug o tienes sugerencias, por favor:
1. Ve a https://github.com/nelsonjpr/Reloadex/issues
2. Crea un nuevo issue describiendo el problema
3. Incluye tu versión de Android y capturas de pantalla si es posible

## 🙏 Créditos

- **Pokémon Reloaded** - Fangame original
- **Datos del juego** - Extraídos directamente de Pokémon Reloaded
- **Sprites** - Pokémon Reloaded
- **API de referencia** - PokeAPI (para tipos y categorías estándar)

---

**Versión:** 1.0.7  
**Fecha:** 25 de noviembre de 2026  
**Tamaño:** 37.1 MB  
**Firma:** Release firmada con keystore oficial
