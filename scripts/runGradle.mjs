// Ejecuta Gradle desde android/ asegurando JAVA_HOME.
// Busca JDK 21 en JAVA_HOME, RELOADEX_JAVA_HOME, Program Files y %LOCALAPPDATA%\Programs.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const androidDir = path.join(root, 'android');
const localPrograms = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'Programs');

const installed = fs.existsSync(localPrograms)
  ? fs.readdirSync(localPrograms).filter((n) => /^jdk-21/i.test(n)).map((n) => path.join(localPrograms, n))
  : [];

const candidates = [
  process.env.RELOADEX_JAVA_HOME,
  process.env.JAVA_HOME,
  'C:\\Program Files\\EclipseAdoptium\\jdk-21',
  ...installed,
].filter(Boolean);

const javaHome = candidates.find((p) => fs.existsSync(path.join(p, 'bin', 'java.exe')));
const env = { ...process.env };
if (javaHome) env.JAVA_HOME = javaHome;

const wrapper = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const result = spawnSync(path.join(androidDir, wrapper), process.argv.slice(2), {
  cwd: androidDir,
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
