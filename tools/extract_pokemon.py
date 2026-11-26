#!/usr/bin/env python3
"""
Script para copiar sprites y gritos de Pokémon desde el juego Reloaded
a la carpeta del proyecto Reloadex.
"""

import os
import shutil
from pathlib import Path

# Rutas
RELOADED_PATH = Path("D:/Juegos/Reloaded/data")
PROJECT_PATH = Path("d:/Trabajo/Reloadex/public")

def copy_sprites(pokemon_ids):
    """Copia los sprites normales y shiny de los Pokémon especificados."""
    
    sprites_normal_src = RELOADED_PATH / "pkmn"
    sprites_shiny_src = RELOADED_PATH / "pkmn_shiny"
    
    sprites_normal_dest = PROJECT_PATH / "sprites" / "normal"
    sprites_shiny_dest = PROJECT_PATH / "sprites" / "shiny"
    
    # Crear carpetas si no existen
    sprites_normal_dest.mkdir(parents=True, exist_ok=True)
    sprites_shiny_dest.mkdir(parents=True, exist_ok=True)
    
    for pokemon_id in pokemon_ids:
        # Sprite normal
        src_normal = sprites_normal_src / f"{pokemon_id}.gif"
        dest_normal = sprites_normal_dest / f"{pokemon_id}.gif"
        
        if src_normal.exists():
            shutil.copy2(src_normal, dest_normal)
            print(f"✓ Copiado sprite normal: {pokemon_id}.gif")
        else:
            print(f"✗ No encontrado sprite normal: {pokemon_id}.gif")
        
        # Sprite shiny (los shiny tienen IDs con formato 1XXX)
        shiny_id = 1000 + pokemon_id
        src_shiny = sprites_shiny_src / f"{shiny_id}.gif"
        dest_shiny = sprites_shiny_dest / f"{pokemon_id}.gif"
        
        if src_shiny.exists():
            shutil.copy2(src_shiny, dest_shiny)
            print(f"✓ Copiado sprite shiny: {pokemon_id}.gif (desde {shiny_id}.gif)")
        else:
            print(f"✗ No encontrado sprite shiny: {shiny_id}.gif")

def copy_cries(pokemon_ids):
    """Copia los gritos de los Pokémon especificados."""
    
    cries_src = RELOADED_PATH / "audio" / "grito"
    cries_dest = PROJECT_PATH / "cries"
    
    # Crear carpeta si no existe
    cries_dest.mkdir(parents=True, exist_ok=True)
    
    for pokemon_id in pokemon_ids:
        # Los gritos tienen formato 001.wav, 002.wav, etc.
        cry_filename = f"{str(pokemon_id).zfill(3)}.wav"
        src_cry = cries_src / cry_filename
        dest_cry = cries_dest / f"{pokemon_id}.wav"
        
        if src_cry.exists():
            shutil.copy2(src_cry, dest_cry)
            print(f"✓ Copiado grito: {pokemon_id}.wav")
        else:
            print(f"✗ No encontrado grito: {cry_filename}")

def main():
    """Función principal."""
    
    print("=" * 60)
    print("EXTRACTOR DE RECURSOS POKÉMON RELOADED")
    print("=" * 60)
    print()
    
    # Ejemplo: extraer Pokémon del 1 al 10
    print("¿Qué Pokémon deseas extraer?")
    print("1. Rango de IDs (ej: 1-10)")
    print("2. IDs específicos (ej: 1,4,7,25)")
    print()
    
    opcion = input("Selecciona una opción (1 o 2): ").strip()
    
    pokemon_ids = []
    
    if opcion == "1":
        rango = input("Introduce el rango (ej: 1-10): ").strip()
        try:
            inicio, fin = map(int, rango.split("-"))
            pokemon_ids = list(range(inicio, fin + 1))
        except:
            print("❌ Error: formato de rango inválido")
            return
    
    elif opcion == "2":
        ids_str = input("Introduce los IDs separados por comas (ej: 1,4,7,25): ").strip()
        try:
            pokemon_ids = [int(id.strip()) for id in ids_str.split(",")]
        except:
            print("❌ Error: formato de IDs inválido")
            return
    else:
        print("❌ Opción inválida")
        return
    
    print()
    print(f"📦 Extrayendo {len(pokemon_ids)} Pokémon...")
    print()
    
    # Copiar recursos
    print("--- SPRITES ---")
    copy_sprites(pokemon_ids)
    
    print()
    print("--- GRITOS ---")
    copy_cries(pokemon_ids)
    
    print()
    print("=" * 60)
    print("✅ ¡Extracción completada!")
    print("=" * 60)
    print()
    print("Ahora debes agregar los datos de estos Pokémon en:")
    print("  src/data/pokemon.js")
    print()

if __name__ == "__main__":
    main()
