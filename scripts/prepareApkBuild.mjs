// AGP 8.13 quiere descargar intellij-core/kotlin-compiler desde Google Maven.
// En redes donde ese host está bloqueado se omiten las tareas de anotaciones y
// lint, pero AGP todavía exige estos typedefs.txt como entrada. Los creamos
// vacíos para que assembleRelease termine sin conexión a Google Maven.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const stubs = [
  path.join(root, 'node_modules', '@capacitor', 'android', 'capacitor', 'build', 'intermediates',
    'annotations_typedef_file', 'release', 'extractReleaseAnnotations', 'typedefs.txt'),
  path.join(root, 'android', 'capacitor-cordova-android-plugins', 'build', 'intermediates',
    'annotations_typedef_file', 'release', 'extractReleaseAnnotations', 'typedefs.txt'),
];

for (const file of stubs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '', 'utf8');
}

console.log(`[apk] ${stubs.length} typedefs.txt preparados para el build sin Google Maven`);
