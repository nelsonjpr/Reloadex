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
    return { versionCode: 2, versionName: '1.1', webVersionCode: 2, canInstallApps: true, webRoot: null };
  }
  return Updater.getInfo();
}

/**
 * Consulta el último release de GitHub y devuelve si hay una versión web nueva.
 * `force: true` ignora la cache (use para el botón "Comprobar").
 */
export async function checkForUpdate({ force = false } = {}) {
  if (!isNative) {
    return { available: false, reason: 'web', webVersionCode: 2, versionCode: 2 };
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

    const result = {
      available: Number(manifest.versionCode) > Number(info.webVersionCode),
      versionCode: Number(manifest.versionCode),
      versionName: manifest.versionName || release.tag_name,
      notes: manifest.notes || release.body || '',
      webVersionCode: Number(info.webVersionCode),
      canInstallApps: Boolean(info.canInstallApps),
      deltaUrl: delta?.browser_download_url || null,
      fullUrl: full?.browser_download_url || null,
      apkUrl: apk?.browser_download_url || release.html_url,
      apkName: apk?.name || 'Reloadex.apk',
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

/** Aplica solo los archivos cambiados. El WebView se recarga automáticamente. */
export async function applyWebUpdate(result) {
  const zipUrl = result?.deltaUrl || result?.fullUrl;
  if (!zipUrl) throw new Error('El release no incluye paquete de cambios');
  const response = await Updater.applyWebUpdate({
    zipUrl,
    manifestJson: result.manifestJson,
  });
  clearUpdateCache();
  return response;
}

/** Instala el APK completo. Devuelve needSettings cuando faltan permisos. */
export async function installFullApk(result) {
  const info = await getNativeInfo();
  if (!info.canInstallApps) {
    await Updater.openInstallSettings();
    return { needSettings: true };
  }
  return Updater.downloadAndInstallApk({
    url: result?.apkUrl,
    fileName: result?.apkName || 'Reloadex.apk',
  });
}
