package ir.abolfazl.anjam;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Downloads the new APK straight into the app, showing progress like Telegram, then hands it to
 * the system installer — instead of bouncing the user out to the browser's own download UI.
 */
@CapacitorPlugin(name = "Updater")
public class UpdaterPlugin extends Plugin {
    private volatile boolean cancelled = false;

    @PluginMethod
    public void download(PluginCall call) {
        String url = call.getString("url");
        String name = call.getString("name", "update.apk");
        if (url == null) {
            call.reject("url is required");
            return;
        }
        cancelled = false;
        new Thread(() -> doDownload(url, name)).start();
        call.resolve();
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        cancelled = true;
        call.resolve();
    }

    @PluginMethod
    public void install(PluginCall call) {
        String name = call.getString("name", "update.apk");
        File dest = new File(getContext().getExternalFilesDir(null), name);
        if (!dest.exists()) {
            call.reject("file not found");
            return;
        }
        try {
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", dest);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()));
        }
    }

    private void doDownload(String urlStr, String name) {
        File dest = new File(getContext().getExternalFilesDir(null), name);
        File tmp = new File(dest.getPath() + ".part");
        HttpURLConnection conn = null;
        try {
            conn = (HttpURLConnection) new URL(urlStr).openConnection();
            conn.setInstanceFollowRedirects(true);
            conn.connect();
            long total = conn.getContentLength();
            long done = 0;
            int lastPct = -1;
            try (InputStream in = conn.getInputStream(); FileOutputStream out = new FileOutputStream(tmp)) {
                byte[] buf = new byte[64 * 1024];
                int n;
                while ((n = in.read(buf)) > 0) {
                    if (cancelled) {
                        emit("cancelled", 0);
                        tmp.delete();
                        return;
                    }
                    out.write(buf, 0, n);
                    done += n;
                    if (total > 0) {
                        int pct = (int) (done * 100 / total);
                        if (pct != lastPct) { lastPct = pct; emit("progress", pct); }
                    }
                }
            }
            if (dest.exists()) dest.delete();
            if (!tmp.renameTo(dest)) throw new IllegalStateException("rename failed");
            emit("done", 100);
        } catch (Exception e) {
            tmp.delete();
            JSObject data = new JSObject();
            data.put("state", "error");
            data.put("message", String.valueOf(e.getMessage()));
            notifyListeners("update", data);
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private void emit(String state, int percent) {
        JSObject data = new JSObject();
        data.put("state", state);
        data.put("percent", percent);
        notifyListeners("update", data);
    }
}
