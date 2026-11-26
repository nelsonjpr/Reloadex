# 🔄 INSTRUCCIONES PARA LIMPIAR CACHÉ

## ⚠️ PROBLEMA: Navegador muestra datos antiguos

Los Pokémon con IDs incorrectos (#8498, #8499, etc.) son **caché del navegador**.

El archivo `pokemon.js` está **CORRECTO** con:
- Pokémon 1-1025 (oficiales)
- IDs especiales 100000+ (formas alternativas)

---

## ✅ SOLUCIONES (en orden de eficacia)

### 1️⃣ Hard Reload (MÁS RÁPIDO)
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 2️⃣ Limpiar Caché de DevTools
1. Presiona **F12** (abrir DevTools)
2. Click derecho en el botón **Recargar** (al lado de la URL)
3. Selecciona: **"Vaciar caché y recargar de manera forzada"**

### 3️⃣ Borrar Caché del Navegador
1. Presiona **Ctrl + Shift + Delete**
2. Selecciona **"Archivos e imágenes en caché"**
3. Rango: **"Todo"**
4. Click **"Borrar datos"**

### 4️⃣ Modo Incógnito (GARANTIZADO)
1. Presiona **Ctrl + Shift + N** (Chrome/Edge)
2. Abre **http://localhost:5174/**
3. Los datos deberían ser correctos

### 5️⃣ Reiniciar Servidor Vite
En la terminal donde corre `npm run dev`:
```bash
# Detener: Ctrl + C
# Iniciar de nuevo:
npm run dev
```

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ

Entra a la **Pokédex** y verifica:

✅ **IDs Correctos:**
- #1 Bulbasaur
- #25 Pikachu  
- #150 Mewtwo
- #1025 Pecharunt (último oficial)

❌ **IDs Incorrectos (caché):**
- #8498 ← **NO debería aparecer**
- #8499 ← **NO debería aparecer**
- #8500 ← **NO debería aparecer**

---

## 📊 DATOS CORRECTOS EN EL ARCHIVO

```javascript
// Primeros Pokémon (CORRECTO)
{ id: "1", name: "Bulbasaur" }
{ id: "2", name: "Ivysaur" }
{ id: "3", name: "Venusaur" }

// Últimos Pokémon oficiales
{ id: "1023", name: "Iron Boulder" }
{ id: "1024", name: "Iron Crown" }
{ id: "1025", name: "Pecharunt" }

// Formas especiales
{ id: "100003", name: "Forma Especial #100003" }
{ id: "200448", name: "Forma Especial #200448" }
```

---

## 🎯 SI NADA FUNCIONA

1. **Cierra COMPLETAMENTE el navegador** (todas las pestañas)
2. Espera 5 segundos
3. Abre de nuevo y ve a **http://localhost:5174/**
4. Presiona **F5** para recargar

---

## ✨ RESULTADO ESPERADO

Deberías ver:
- ✅ **1,136 Pokémon** en total
- ✅ Bulbasaur como #1
- ✅ Sprites coincidiendo con nombres
- ✅ Sin IDs raros (8498, 8499, etc.)

---

**Nota:** El problema NO es el código, es solo caché del navegador.
El archivo `pokemon.js` tiene los datos correctos.
