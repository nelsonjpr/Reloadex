package com.reloadex.pokedex;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import androidx.core.content.pm.PackageInfoCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Actualizaciones de Reloadex sin volver a descargar el APK completo.
 *
 * - Los archivos web (dist/) se sirven desde una copia local que se parchea
 *   con un ZIP que contiene SOLO los archivos cambiados desde la versión base.
 * - El APK completo sigue disponible para cambios nativos.
 */
@CapacitorPlugin(name = "Updater")
public class UpdaterPlugin extends Plugin {

    private static final String PREFS = "reloadex_updater";
    private static final String KEY_WEB_VERSION = "webVersionCode";
    private static final String KEY_BASE_APK_VERSION = "baseApkVersionCode";

    // Mismo nombre que usa el plugin WebView de Capacitor para persistir la ruta.
    private static final String CAP_PREFS = "CapWebViewSettings";
    private static final String CAP_SERVER_PATH = "serverBasePath";

    // Capacitor inyecta estos archivos en assets/public; no vienen en dist/.
    private static final Set<String> CAP_RUNTIME_FILES = new HashSet<>(Arrays.asList(
        "cordova.js", "cordova_plugins.js", "capacitor.js", "native-bridge.js"
    ));

    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Override
    public void load() {
        super.load();
        try {
            normalizeForApkVersion();
        } catch (Exception ignored) {
            // Si falla la limpieza, se reintenta al pedir getInfo().
        }
    }

    @Override
    protected void handleOnDestroy() {
        executor.shutdownNow();
        super.handleOnDestroy();
    }

    /** Estado local: versión del APK, versión web aplicada y permiso de instalación. */
    @PluginMethod
    public void getInfo(PluginCall call) {
        try {
            normalizeForApkVersion();
        } catch (Exception ignored) {
            // noop
        }
        JSObject ret = new JSObject();
        ret.put("versionCode", apkVersionCode());
        ret.put("versionName", apkVersionName());
        ret.put("webVersionCode", prefs().getLong(KEY_WEB_VERSION, apkVersionCode()));
        ret.put("webRoot", webRoot().getAbsolutePath());
        ret.put("canInstallApps", canInstallApps());
        call.resolve(ret);
    }

    /**
     * Descarga el ZIP de cambios, lo aplica sobre una copia de la web actual y
     * redirige el WebView a esa copia. Si algo falla, la copia anterior sigue intacta.
     */
    @PluginMethod
    public void applyWebUpdate(PluginCall call) {
        String zipUrl = call.getString("zipUrl");
        String manifestJson = call.getString("manifestJson");
        if (zipUrl == null || manifestJson == null) {
            call.reject("Faltan zipUrl o manifestJson");
            return;
        }

        executor.execute(() -> {
            try {
                JSONObject manifest = new JSONObject(manifestJson);
                long newVersion = manifest.optLong("versionCode", -1);
                if (newVersion < 0) throw new IOException("Manifest sin versionCode");

                JSONArray files = manifest.getJSONArray("files");
                Map<String, String> wanted = new HashMap<>();
                for (int i = 0; i < files.length(); i++) {
                    JSONObject f = files.getJSONObject(i);
                    wanted.put(f.getString("path"), f.getString("sha256").toLowerCase());
                }

                File mirror = webRoot();
                ensureBaseline(mirror);

                File staging = new File(filesDir(), "web-new");
                deleteRecursively(staging);
                copyRecursively(mirror, staging);

                File zip = new File(cacheDir(), "web-delta-" + newVersion + ".zip");
                downloadToFile(zipUrl, zip);
                unzip(zip, staging);

                prune(staging, wanted);
                verifyHashes(staging, wanted);
                swap(mirror, staging);

                prefs().edit().putLong(KEY_WEB_VERSION, newVersion).apply();
                persistServerPath(mirror);
                getBridge().setServerBasePath(mirror.getAbsolutePath());

                JSObject ret = new JSObject();
                ret.put("versionCode", newVersion);
                ret.put("files", wanted.size());
                call.resolve(ret);
            } catch (Exception e) {
                String msg = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
                call.reject("No se pudo actualizar: " + msg);
            }
        });
    }

    /** Descarga el APK completo y abre el instalador del sistema. */
    @PluginMethod
    public void downloadAndInstallApk(PluginCall call) {
        String url = call.getString("url");
        String fileName = call.getString("fileName");
        if (url == null) {
            call.reject("Falta la URL del APK");
            return;
        }
        if (!canInstallApps()) {
            call.reject("INSTALL_PERMISSION");
            return;
        }

        executor.execute(() -> {
            try {
                File apk = new File(cacheDir(), fileName == null ? "update.apk" : fileName);
                downloadToFile(url, apk);
                installApk(apk);
                JSObject ret = new JSObject();
                ret.put("started", true);
                call.resolve(ret);
            } catch (Exception e) {
                String msg = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
                call.reject("No se pudo instalar el APK: " + msg);
            }
        });
    }

    /** Abre Ajustes → Instalar aplicaciones desconocidas para esta app. */
    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        try {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getContext().getPackageName())
            );
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("No se pudo abrir Ajustes: " + e.getMessage());
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private SharedPreferences prefs() {
        return getContext().getSharedPreferences(PREFS, Activity.MODE_PRIVATE);
    }

    private File filesDir() {
        return getContext().getFilesDir();
    }

    private File cacheDir() {
        return getContext().getCacheDir();
    }

    private File webRoot() {
        return new File(filesDir(), "web");
    }

    private long apkVersionCode() {
        try {
            PackageManager pm = getContext().getPackageManager();
            PackageInfo pi = pm.getPackageInfo(getContext().getPackageName(), 0);
            return PackageInfoCompat.getLongVersionCode(pi);
        } catch (Exception e) {
            return 1L;
        }
    }

    private String apkVersionName() {
        try {
            PackageManager pm = getContext().getPackageManager();
            PackageInfo pi = pm.getPackageInfo(getContext().getPackageName(), 0);
            return pi.versionName == null ? "" : pi.versionName;
        } catch (Exception e) {
            return "";
        }
    }

    private boolean canInstallApps() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return true;
        return getContext().getPackageManager().canRequestPackageInstalls();
    }

    /**
     * Al instalar un APK nuevo, Capacitor vuelve a servir los assets del paquete.
     * Descartamos la copia local anterior y alineamos la versión web con la del APK.
     */
    private void normalizeForApkVersion() throws IOException {
        long apk = apkVersionCode();
        if (prefs().getLong(KEY_BASE_APK_VERSION, -1) == apk) return;
        deleteRecursively(webRoot());
        deleteRecursively(new File(filesDir(), "web-new"));
        prefs().edit()
            .putLong(KEY_BASE_APK_VERSION, apk)
            .putLong(KEY_WEB_VERSION, apk)
            .apply();
    }

    private void ensureBaseline(File mirror) throws IOException {
        if (mirror.isDirectory()) return;
        deleteRecursively(mirror);
        if (!mirror.mkdirs()) throw new IOException("No se pudo crear " + mirror);
        copyAssets("public", mirror);
    }

    private void copyAssets(String relative, File target) throws IOException {
        AssetManager am = getContext().getAssets();
        String[] children = am.list(relative);
        if (children == null) {
            try (InputStream in = am.open(relative);
                 OutputStream out = new FileOutputStream(target)) {
                copy(in, out);
            }
            return;
        }
        if (!target.exists() && !target.mkdirs()) throw new IOException("No se pudo crear " + target);
        for (String child : children) {
            copyAssets(relative.equals("") ? child : relative + "/" + child, new File(target, child));
        }
    }

    private void copyRecursively(File source, File target) throws IOException {
        if (source.isDirectory()) {
            if (!target.exists() && !target.mkdirs()) throw new IOException("No se pudo crear " + target);
            File[] children = source.listFiles();
            if (children != null) {
                for (File child : children) {
                    copyRecursively(child, new File(target, child.getName()));
                }
            }
            return;
        }
        File parent = target.getParentFile();
        if (parent != null) parent.mkdirs();
        try (InputStream in = new FileInputStream(source);
             OutputStream out = new FileOutputStream(target)) {
            copy(in, out);
        }
    }

    private void downloadToFile(String urlString, File dest) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(urlString).openConnection();
        conn.setInstanceFollowRedirects(true);
        conn.setConnectTimeout(30000);
        conn.setReadTimeout(60000);
        conn.setRequestProperty("User-Agent", "Reloadex-Updater");
        conn.setRequestProperty("Accept", "application/octet-stream");

        int code = conn.getResponseCode();
        if (code < 200 || code >= 300) {
            conn.disconnect();
            throw new IOException("HTTP " + code + " al descargar " + urlString);
        }

        File part = new File(dest.getParentFile(), dest.getName() + ".part");
        try (InputStream in = new BufferedInputStream(conn.getInputStream(), 65536);
             OutputStream out = new BufferedOutputStream(new FileOutputStream(part), 65536)) {
            copy(in, out);
        } finally {
            conn.disconnect();
        }
        if (!part.renameTo(dest)) throw new IOException("No se pudo guardar " + dest.getName());
    }

    private void copy(InputStream in, OutputStream out) throws IOException {
        byte[] buf = new byte[65536];
        int n;
        while ((n = in.read(buf)) != -1) out.write(buf, 0, n);
    }

    private void unzip(File zip, File target) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zip))) {
            ZipEntry entry;
            byte[] buf = new byte[65536];
            String rootPath = target.getCanonicalPath();
            while ((entry = zis.getNextEntry()) != null) {
                String name = entry.getName();
                if (name.startsWith("/") || name.contains("..")) continue;
                File out = new File(target, name);
                if (!out.getCanonicalPath().startsWith(rootPath)) continue;
                if (entry.isDirectory()) {
                    out.mkdirs();
                    continue;
                }
                File parent = out.getParentFile();
                if (parent != null) parent.mkdirs();
                try (OutputStream fos = new FileOutputStream(out)) {
                    int n;
                    while ((n = zis.read(buf)) != -1) fos.write(buf, 0, n);
                }
                zis.closeEntry();
            }
        }
    }

    /** Quita archivos que ya no existen en la versión destino. */
    private void prune(File dir, Map<String, String> wanted) {
        File[] children = dir.listFiles();
        if (children == null) return;
        for (File child : children) {
            String rel = relativeTo(dir, child);
            if (child.isDirectory()) {
                prune(child, wanted);
                File[] rest = child.listFiles();
                if (rest != null && rest.length == 0) child.delete();
            } else if (!wanted.containsKey(rel) && !CAP_RUNTIME_FILES.contains(rel)) {
                child.delete();
            }
        }
    }

    private String relativeTo(File root, File file) {
        String rootPath = root.getAbsolutePath() + File.separator;
        String path = file.getAbsolutePath();
        return path.startsWith(rootPath) ? path.substring(rootPath.length()).replace(File.separatorChar, '/') : "";
    }

    private void verifyHashes(File root, Map<String, String> wanted) throws IOException {
        for (Map.Entry<String, String> entry : wanted.entrySet()) {
            File file = new File(root, entry.getKey().replace('/', File.separatorChar));
            if (!file.isFile()) throw new IOException("Falta el archivo " + entry.getKey());
            if (!sha256(file).equals(entry.getValue())) {
                throw new IOException("Hash incorrecto en " + entry.getKey());
            }
        }
    }

    private String sha256(File file) throws IOException {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            try (InputStream in = new FileInputStream(file)) {
                byte[] buf = new byte[65536];
                int n;
                while ((n = in.read(buf)) != -1) md.update(buf, 0, n);
            }
            StringBuilder sb = new StringBuilder();
            for (byte b : md.digest()) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        } catch (Exception e) {
            throw new IOException("No se pudo calcular SHA-256", e);
        }
    }

    private void swap(File mirror, File staging) throws IOException {
        File old = new File(filesDir(), "web-old");
        deleteRecursively(old);
        if (!mirror.renameTo(old)) throw new IOException("No se pudo retirar la web anterior");
        if (!staging.renameTo(mirror)) {
            old.renameTo(mirror);
            throw new IOException("No se pudo activar la web nueva");
        }
        deleteRecursively(old);
    }

    private void persistServerPath(File mirror) {
        getContext().getSharedPreferences(CAP_PREFS, Activity.MODE_PRIVATE)
            .edit()
            .putString(CAP_SERVER_PATH, mirror.getAbsolutePath())
            .apply();
    }

    private void installApk(File apk) throws IOException {
        Uri uri = FileProvider.getUriForFile(
            getContext(), getContext().getPackageName() + ".fileprovider", apk
        );
        Intent intent = new Intent(Intent.ACTION_INSTALL_PACKAGE);
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra(Intent.EXTRA_NOT_UNKNOWN_SOURCE, true);
        getContext().startActivity(intent);
    }

    private void deleteRecursively(File file) {
        if (file == null || !file.exists()) return;
        File[] children = file.listFiles();
        if (children != null) {
            for (File child : children) deleteRecursively(child);
        }
        file.delete();
    }
}
