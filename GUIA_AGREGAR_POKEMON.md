# 📖 Guía: Cómo Agregar Más Pokémon

Esta guía te explica paso a paso cómo agregar nuevos Pokémon a la Pokédex.

## Método 1: Script Automático de Python (Recomendado)

### Paso 1: Ejecutar el script
```bash
cd tools
python extract_pokemon.py
```

### Paso 2: Seguir las instrucciones
El script te preguntará qué Pokémon quieres extraer:
- **Opción 1**: Rango (ej: 4-10 para Charmander hasta Caterpie)
- **Opción 2**: IDs específicos (ej: 25,133,151 para Pikachu, Eevee y Mew)

### Paso 3: Agregar datos manualmente
Abre `src/data/pokemon.js` y agrega la información:

```javascript
{
  id: 4,
  name: "Charmander",
  types: ["fire"],
  height: 0.6,
  weight: 8.5,
  description: "Prefiere las cosas calientes. Dicen que cuando llueve le sale vapor de la punta de su cola.",
  stats: {
    hp: 39,
    attack: 52,
    defense: 43,
    spAttack: 60,
    spDefense: 50,
    speed: 65
  },
  evolutions: [
    { id: 5, name: "Charmeleon", level: 16, method: "Level 16" }
  ],
  abilities: ["Mar Llamas", "Poder Solar (Oculta)"],
  generation: 1,
  region: "Kanto"
}
```

## Método 2: Manual (Sin Python)

### Paso 1: Copiar sprites
1. Ve a `D:\Juegos\Reloaded\data\pkmn\`
2. Copia el archivo `4.gif` (Charmander)
3. Pégalo en `Reloadex/public/sprites/normal/`

### Paso 2: Copiar sprites shiny
1. Ve a `D:\Juegos\Reloaded\data\pkmn_shiny\`
2. Busca el archivo `1004.gif` (Charmander shiny - formato 1XXX)
3. Renómbralo a `4.gif`
4. Pégalo en `Reloadex/public/sprites/shiny/`

### Paso 3: Copiar gritos
1. Ve a `D:\Juegos\Reloaded\data\audio\grito\`
2. Copia el archivo `004.wav`
3. Renómbralo a `4.wav`
4. Pégalo en `Reloadex/public/cries/`

### Paso 4: Agregar datos
Igual que el Método 1, Paso 3.

## 🎯 Formato de IDs en Pokémon Reloaded

### Pokémon Base (1-2425)
- **Archivo normal**: `1.gif`, `2.gif`, `3.gif`, etc.
- **Archivo shiny**: `1001.gif`, `1002.gif`, `1003.gif`, etc.
- **Grito**: `001.wav`, `002.wav`, `003.wav`, etc.

### Formas Alternativas (6 dígitos)
- **Ejemplo**: Raichu de Alola = `100026.gif`
- **Formato**: `100XXX` para normal, `150XXX` para shiny

### Mega Evoluciones
- **Ejemplo**: Mega Venusaur = `101003.gif`
- **Formato**: `101XXX` para normal, `151XXX` para shiny

### Pokémon Exclusivos (3001-3425)
- **Ejemplo**: `3001.gif`, `3002.gif`, etc.
- **Shiny**: Similar patrón

## 📋 Dónde Obtener la Información

### Stats y Datos Oficiales
Para Pokémon del 1-1025 (oficiales):
- **PokéAPI**: https://pokeapi.co/api/v2/pokemon/{id}
- **Bulbapedia**: https://bulbapedia.bulbagarden.net/

### Pokémon Exclusivos de Reloaded
Tendrás que:
1. Jugar el juego y capturarlos
2. Ver sus stats en la Pokédex del juego
3. Hacer screenshots o tomar notas
4. Contactar a la comunidad de Pokémon Reloaded

## ✨ Ejemplo Completo: Agregar Pikachu (#25)

### 1. Copiar recursos
```bash
# Normal
copy "D:\Juegos\Reloaded\data\pkmn\25.gif" "public\sprites\normal\25.gif"

# Shiny
copy "D:\Juegos\Reloaded\data\pkmn_shiny\1025.gif" "public\sprites\shiny\25.gif"

# Grito
copy "D:\Juegos\Reloaded\data\audio\grito\025.wav" "public\cries\25.wav"
```

### 2. Agregar a pokemon.js
```javascript
{
  id: 25,
  name: "Pikachu",
  types: ["electric"],
  height: 0.4,
  weight: 6.0,
  description: "Cuando varios de estos Pokémon se juntan, su electricidad puede causar tormentas eléctricas.",
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    spAttack: 50,
    spDefense: 50,
    speed: 90
  },
  evolutions: [
    { id: 26, name: "Raichu", method: "Piedra Trueno" }
  ],
  abilities: ["Electricidad Estática", "Pararrayos (Oculta)"],
  generation: 1,
  region: "Kanto",
  prevEvolution: { id: 172, name: "Pichu" }
}
```

### 3. ¡Listo! Recarga el navegador y verás a Pikachu.

## 🚀 Agregar Muchos Pokémon a la Vez

Si quieres agregar, por ejemplo, toda la primera generación (1-151):

```bash
cd tools
python extract_pokemon.py
# Selecciona opción 1
# Escribe: 1-151
```

Esto copiará todos los recursos. Luego tendrás que agregar los datos manualmente en `pokemon.js` o crear un script para importarlos desde una API.

## 💡 Consejos

1. **Mantén el orden**: Agrega los Pokémon en orden numérico en `pokemon.js`
2. **Verifica los archivos**: Asegúrate de que los GIF y WAV existan antes de agregar el Pokémon
3. **Prueba incrementalmente**: Agrega 10-20 Pokémon, prueba, y continúa
4. **Respalda tu progreso**: Haz commits git frecuentemente

## ❓ Problemas Comunes

### "No aparece el sprite"
- Verifica que el archivo esté en `/public/sprites/normal/` o `/shiny/`
- Verifica que el nombre sea exactamente `{id}.gif`
- Recarga el navegador con Ctrl+F5

### "No suena el grito"
- Verifica que esté en `/public/cries/`
- Verifica que el nombre sea `{id}.wav`
- Algunos navegadores bloquean autoplay de audio

### "Error en consola del navegador"
- Abre DevTools (F12)
- Ve a la pestaña Console
- Busca errores relacionados con rutas de archivos

---

¿Dudas? Revisa el README.md o consulta la documentación de React.
