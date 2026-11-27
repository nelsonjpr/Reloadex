// Genera los artefactos de actualización incremental para un release de GitHub:
//   release/update-manifest.json  -> lista de archivos web con su SHA-256
//   release/web-delta-<tag>.zip   -> SOLO archivos nuevos/cambiados desde la versión base
//   release/web-full-<tag>.zip    -> paquete completo (cuando aún no hay base)
//
// La versión base se guarda en tools/update-baseline.json. Se fija en la primera
// versión que incluye el actualizador (v1.1) para que los deltas sean acumulativos.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist');
const outDir = path.join(root, 'release');
const baselinePath = path.join(root, 'tools', 'update-baseline.json');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const versionCode = Number(args['version-code'] || 2);
const versionName = args['version-name'] || '1.1';
const tag = args.tag || `v${versionName}`;
const notes = typeof args.notes === 'string' ? args.notes : '';
const setBaseline = args['set-baseline'] === true;

if (!fs.existsSync(distDir)) {
  console.error('[update] No existe dist/. Ejecuta npm run build primero.');
  process.exit(1);
}

function walk(dir, base = dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(absolute, base, found);
    else if (entry.isFile()) found.push(path.relative(base, absolute).split(path.sep).join('/'));
  }
  return found;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xFFFFFFFF;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// ZIP mínimo en modo "store" (sin compresión): los MP3 y los bundles JS ya
// están comprimidos y así evitamos añadir dependencias externas.
function writeZip(dest, entries) {
  const fd = fs.openSync(dest, 'w');
  let offset = 0;
  const write = (buffer) => { offset += fs.writeSync(fd, buffer); };
  const central = [];

  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'utf8');
    const crc = crc32(entry.data);
    const size = entry.data.length;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // firma
    local.writeUInt16LE(20, 4);          // versión necesaria
    local.writeUInt16LE(0x0800, 6);      // UTF-8
    local.writeUInt16LE(0, 8);           // método: store
    local.writeUInt16LE(0, 10);          // hora
    local.writeUInt16LE(0x21, 12);       // fecha: 1980-01-01
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(size, 18);
    local.writeUInt32LE(size, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);

    const headerOffset = offset;
    write(local);
    write(name);
    write(entry.data);
    central.push({ name, crc, size, headerOffset });
  }

  const centralStart = offset;
  for (const entry of central) {
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(20, 4);  // hecho por
    header.writeUInt16LE(20, 6);  // versión necesaria
    header.writeUInt16LE(0x0800, 8);
    header.writeUInt16LE(0, 10);  // store
    header.writeUInt16LE(0, 12);  // hora
    header.writeUInt16LE(0x21, 14); // fecha
    header.writeUInt32LE(entry.crc, 16);
    header.writeUInt32LE(entry.size, 20);
    header.writeUInt32LE(entry.size, 24);
    header.writeUInt16LE(entry.name.length, 28);
    header.writeUInt16LE(0, 30);
    header.writeUInt16LE(0, 32);
    header.writeUInt16LE(0, 34);
    header.writeUInt16LE(0, 36);
    header.writeUInt32LE(0, 38);
    header.writeUInt32LE(entry.headerOffset, 42);
    write(header);
    write(entry.name);
  }
  const centralSize = offset - centralStart;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(central.length, 8);
  eocd.writeUInt16LE(central.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralStart, 16);
  eocd.writeUInt16LE(0, 20);
  write(eocd);
  fs.closeSync(fd);
}

const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
  : null;

const files = walk(distDir).sort();
const manifestFiles = [];
const changed = [];

for (const rel of files) {
  const data = fs.readFileSync(path.join(distDir, rel));
  const sha = crypto.createHash('sha256').update(data).digest('hex');
  manifestFiles.push({ path: rel, sha256: sha, size: data.length });
  if (!baseline || baseline.files?.[rel] !== sha) {
    changed.push({ name: rel, data });
  }
}

fs.mkdirSync(outDir, { recursive: true });

const useDelta = Boolean(baseline) && changed.length > 0;
const bundleName = useDelta ? `web-delta-${tag}.zip` : `web-full-${tag}.zip`;
const bundlePath = path.join(outDir, bundleName);
writeZip(bundlePath, useDelta ? changed : manifestFiles.map((f) => ({
  name: f.path,
  data: fs.readFileSync(path.join(distDir, f.path)),
})));

const manifest = {
  versionCode,
  versionName,
  tag,
  generatedAt: new Date().toISOString(),
  notes,
  deltaAsset: useDelta ? bundleName : null,
  fullAsset: useDelta ? null : bundleName,
  files: manifestFiles,
};
fs.writeFileSync(path.join(outDir, 'update-manifest.json'), JSON.stringify(manifest));
fs.writeFileSync(path.join(outDir, `update-manifest-${tag}.json`), JSON.stringify(manifest));

if (setBaseline || !baseline) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, JSON.stringify({
    versionCode,
    versionName,
    tag,
    files: Object.fromEntries(manifestFiles.map((f) => [f.path, f.sha256])),
  }, null, 2) + '\n');
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
console.log(`[update] ${tag} · versión ${versionCode}`);
console.log(`[update] ${manifestFiles.length} archivos web, ${useDelta ? `${changed.length} cambiados` : 'paquete completo'}`);
console.log(`[update] ZIP: ${bundleName} (${mb(fs.statSync(bundlePath).size)})`);
console.log('[update] Manifiesto: release/update-manifest.json');
if (setBaseline || !baseline) console.log(`[update] Base fijada en ${baselinePath}`);
