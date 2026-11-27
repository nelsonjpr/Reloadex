import { CapacitorHttp, registerPlugin } from '@capacitor/core';

const Updater = registerPlugin('Updater');

const REPO = 'nelsonjpr/Reloadex';
const LATEST_API = `https://api.github.com/repos/${REPO}/releases/latest`;
const CACHE_KEY = 'reloadex.updateCheck';
const CACHE_MS = 6 * 60 * 60 * 1000; // 6 h entre comprobaciones automáticas

const cap = typeof window !== 'undefined' ? window.Capacitor : null;
export const isNative = Boolean(cap && (cap.isNativePlatform?.() || cap.platform === 'android'));

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Number.isFinite(parsed.at)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(result) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), result }));
  } catch {
    // almacenamiento lleno: simplemente no cacheamos
  }
}

export function clearUpdateCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* noop */ }
}

// Los assets de GitHub Releases no envían cabeceras CORS: desde el WebView hay
// que leerlos con el HTTP nativo de Capacitor (ya registrado en el bridge).
async function getJson(url) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Reloadex-Updater',
  };
  if (isNative) {
    const res = await CapacitorHttp.get({ url, headers, connectTimeout: 20000, readTimeout: 60000 });
    if (res.status < 200 || res.status >= 300) throw new Error(`HTTP ${res.status}`);
    const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    return { text, json: JSON.parse(text) };
  }
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return { text, json: JSON.parse(text) };
}

export async function getNativeInfo() {
  if (!isNative) {
    return { versionCode: 8, versionName: '1.0.6', webVersionCode: 8, canInstallApps: true, webRoot: null };
  }
  return Updater.getInfo();
}

/** Escucha el progreso real del plugin nativo mientras se descarga. */
async function withProgress(onProgress, work) {
  if (typeof onProgress !== 'function' || !isNative) return work();
  const handle = await Updater.addListener('updateProgress', onProgress);
  try {
    return await work();
  } finally {
    await handle?.remove?.();
  }
}

/**
 * Consulta el último release de GitHub y devuelve si hay una versión nueva.
 * `force: true` ignora la cache (use para el botón "Comprobar").
 */
export async function checkForUpdate({ force = false } = {}) {
  if (!isNative) {
    return { available: false, reason: 'web', webVersionCode: 8, versionCode: 8 };
  }

  if (!force) {
    const cached = readCache();
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.result;
  }

  try {
    const { json: release } = await getJson(LATEST_API);

    const manifestAsset = release.assets?.find((a) => a.name === 'update-manifest.json');
    if (!manifestAsset) {
      return writeResult({ available: false, reason: 'no-manifest' });
    }

    const { text: manifestText, json: manifest } = await getJson(manifestAsset.browser_download_url);

    const info = await getNativeInfo();
    const assets = release.assets || [];
    const delta = assets.find((a) => a.name === manifest.deltaAsset);
    const full = assets.find((a) => a.name === manifest.fullAsset)
      || assets.find((a) => a.name.startsWith('web-full-'));
    const apk = assets.find((a) => /\.apk$/i.test(a.name));

    const targetCode = Number(manifest.versionCode);
    // `versionCode` es la versión WEB del manifest. El código del APK que la
    // publicó va aparte para que una actualización solo web no descargue un APK
    // que no existe en el release (los manifests antiguos no traen el campo).
    const nativeCode = Number(manifest.nativeVersionCode ?? targetCode);
    const nativeUpdate = nativeCode > Number(info.versionCode);
    const webAsset = delta || full;

    const result = {
      available: targetCode > Number(info.webVersionCode),
      versionCode: targetCode,
      versionName: manifest.versionName || release.tag_name,
      notes: manifest.notes || release.body || '',
      webVersionCode: Number(info.webVersionCode),
      canInstallApps: Boolean(info.canInstallApps),
      nativeUpdate,
      deltaUrl: delta?.browser_download_url || null,
      fullUrl: full?.browser_download_url || null,
      apkUrl: apk?.browser_download_url || release.html_url,
      apkName: apk?.name || 'Reloadex.apk',
      downloadBytes: Number(nativeUpdate ? apk?.size : (webAsset?.size || manifest.bundleSize)) || 0,
      downloadAsset: nativeUpdate ? (apk?.name || 'APK completo') : (webAsset?.name || 'paquete web'),
      manifestJson: manifestText,
    };
    return writeResult(result);
  } catch (error) {
    return { available: false, reason: 'error', error: String(error?.message || error) };
  }
}

function writeResult(result) {
  writeCache(result);
  return result;
}

/** Descarga e instala el APK completo. Devuelve needSettings si falta permiso. */
export async function installFullApk(result, onProgress) {
  const info = await getNativeInfo();
  if (!info.canInstallApps) {
    await Updater.openInstallSettings();
    return { needSettings: true };
  }
  return withProgress(onProgress, () => Updater.downloadAndInstallApk({
    url: result?.apkUrl,
    fileName: result?.apkName || 'Reloadex.apk',
  }));
}

/** Aplica solo los archivos cambiados. El WebView se recarga automáticamente. */
export async function applyWebUpdate(result, onProgress) {
  const zipUrl = result?.deltaUrl || result?.fullUrl;
  if (!zipUrl) throw new Error('El release no incluye paquete de cambios');
  const response = await withProgress(onProgress, () => Updater.applyWebUpdate({
    zipUrl,
    manifestJson: result.manifestJson,
  }));
  clearUpdateCache();
  return response;
}

/**
 * Único punto de entrada del botón "Actualizar ahora":
 * - Si el release sube el código nativo, instala el APK completo.
 * - Si solo cambió la web, aplica el delta.
 */
export async function applyUpdate(result, onProgress) {
  if (result?.nativeUpdate) return installFullApk(result, onProgress);
  return applyWebUpdate(result, onProgress);
}
