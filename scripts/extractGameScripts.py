"""Extrae scripts GML del gamedata cifrado de Pokémon Reloaded (GameMaker 8).

Fuente: el gamedata embebido en el EXE. El descifrado es el mismo que se usó
para `PokemonHabilidad.gml.txt` (ver DATA_PROVENANCE.md). Se deja en Python
para poder regenerar los learnsets sin depender de la herramienta original.

Uso:
  python scripts/extractGameScripts.py
  python scripts/extractGameScripts.py --exe "OTRO.exe" --names Ataque_Nivel MTAtack
"""
import argparse
import os
import struct
import sys
import zlib

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DEFAULT_EXE = r"D:\Juegos\Reloaded\Proyecto Reloaded Online (compatible).exe"
DEFAULT_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'game-scripts')
LEARNSET_SCRIPTS = [
    'Ataque_Nivel', 'Ataque_MT', 'Ataque_Tutor', 'Ataque_DT',
    'AprendeAtaqueHuevo', 'MTAtack', 'IndiceTutor',
    'TieneAprendizajeEspecifico', 'NumeroAtaquesPorNivel',
    'AprendeAtaquePorNivel', 'AprendeAtaquePorMT', 'AprendeAtaquePorTutor',
]
EVOLUTION_SCRIPTS = [
    'Dex_evolution', 'Dex_evolution_complex', 'Dex_evolution_especiales',
    'Dex_evolution_standar', 'Dex_mega_evolution', 'EvolutionConfirmation',
    'GetPreevolution', 'MYSON', 'ObjetoMegaEvolucion', 'PaginasEvolucion',
    'SelectRandomEeveeEvolution', 'SelectTypeEeveeEvolution',
    'UseObject', 'CheckEvolution',
]


def load_scripts(path):
    data = bytearray(open(path, 'rb').read())
    hdr = 0x1E8480
    cur = hdr + 16
    slen = struct.unpack_from('<I', data, cur)[0]; cur += 4 + slen
    nlen = struct.unpack_from('<I', data, cur)[0]; cur += 4 + nlen
    dlllen = struct.unpack_from('<I', data, cur)[0]; cur += 4 + dlllen
    g1 = struct.unpack_from('<I', data, cur)[0] * 4; cur += 4
    g2 = struct.unpack_from('<I', data, cur)[0] * 4; cur += 4
    cur += g1
    swap = bytes(data[cur:cur + 256]); cur += 256 + g2
    ln = struct.unpack_from('<I', data, cur)[0]; cur += 4
    rev = [0] * 256
    for i, v in enumerate(swap):
        rev[v] = i
    for i in range(cur + ln, cur + 1, -1):
        data[i - 1] = (rev[data[i - 1]] - (data[i - 2] + ((i - (cur + 1)) & 0xFF))) & 0xFF
    for i in range(cur + ln - 1, cur - 1, -1):
        b = max(i - swap[(i - cur) & 0xFF], cur)
        data[i], data[b] = data[b], data[i]

    pos = cur

    def u32():
        nonlocal pos
        v = struct.unpack_from('<I', data, pos)[0]
        pos += 4
        return v

    def i32():
        nonlocal pos
        v = struct.unpack_from('<i', data, pos)[0]
        pos += 4
        return v

    def pas():
        nonlocal pos
        n = u32()
        s = bytes(data[pos:pos + n])
        pos += n
        return s.decode('utf8', 'replace')

    def skip(n):
        nonlocal pos
        pos += n

    def chunk():
        nonlocal pos
        length = u32()
        c = bytes(data[pos:pos + length])
        pos += length
        return c

    def name_of(c):
        try:
            d = zlib.decompress(c)
            n = struct.unpack_from('<I', d, 4)[0]
            return d[8:8 + n].decode('utf8', 'replace'), d
        except Exception:
            return '<err>', b''

    def assets():
        nonlocal pos
        u32()
        count = u32()
        return [name_of(chunk()) for _ in range(count)]

    garbage = u32(); skip(garbage * 4)
    u32(); u32(); skip(16)
    ext_ver = u32(); ec = u32()
    for _ in range(ec):
        u32(); pas(); pas(); fc = u32()
        for _ in range(fc):
            u32(); pas(); u32(); pas(); pas(); nc = u32()
            for _ in range(nc):
                u32(); pas(); pas(); u32(); u32(); u32(); skip(17 * 4); u32()
            cc = u32()
            for _ in range(cc):
                u32(); pas(); pas()
        contents_len = u32() - 4; seed = u32(); skip(contents_len)

    assets()  # triggers
    cv = u32(); cc = u32()
    for _ in range(cc):
        pas(); pas()
    assets()  # sounds
    assets()  # sprites
    assets()  # backgrounds
    assets()  # paths
    scripts = assets()
    return scripts


def script_source(d):
    nl = struct.unpack_from('<I', d, 4)[0]
    q = 8 + nl + 4
    n = struct.unpack_from('<I', d, q)[0]
    q += 4
    return bytes(d[q:q + n]).decode('utf8', 'replace')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--exe', default=DEFAULT_EXE)
    ap.add_argument('--out', default=DEFAULT_OUT)
    ap.add_argument('--names', nargs='*', default=LEARNSET_SCRIPTS + EVOLUTION_SCRIPTS)
    args = ap.parse_args()

    scripts = load_scripts(args.exe)
    os.makedirs(args.out, exist_ok=True)
    wanted = set(args.names)
    found = set()
    for name, blob in scripts:
        if name in wanted:
            src = script_source(blob)
            out = os.path.join(args.out, name + '.gml.txt')
            with open(out, 'w', encoding='utf-8') as f:
                f.write(src)
            found.add(name)
            print(f'{name}: {len(src)} chars -> {out}')
    missing = wanted - found
    if missing:
        print('NO ENCONTRADOS:', ', '.join(sorted(missing)))
        sys.exit(2)


if __name__ == '__main__':
    main()
