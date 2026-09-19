package ir.abolfazl.anjam;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;

/**
 * Reads the server address the download server stamped into this APK's signing block
 * (ID "ANJA" = 0x414E4A41). The signature stays valid because the block is outside the signed content.
 */
@CapacitorPlugin(name = "ServerConfig")
public class ServerConfigPlugin extends Plugin {
    private static final int STAMP_ID = 0x414E4A41;
    private static final byte[] MAGIC = "APK Sig Block 42".getBytes(StandardCharsets.US_ASCII);

    @PluginMethod
    public void get(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("server", readStamp());
        call.resolve(ret);
    }

    private String readStamp() {
        String path = getContext().getApplicationInfo().sourceDir;
        try (RandomAccessFile f = new RandomAccessFile(path, "r")) {
            long len = f.length();
            // find EOCD (scan the last 64 KB for PK\5\6)
            int tail = (int) Math.min(len, 65557);
            byte[] t = new byte[tail];
            f.seek(len - tail);
            f.readFully(t);
            int eocd = -1;
            for (int i = tail - 22; i >= 0; i--) {
                if (t[i] == 0x50 && t[i + 1] == 0x4b && t[i + 2] == 0x05 && t[i + 3] == 0x06) { eocd = i; break; }
            }
            if (eocd < 0) return "";
            long cd = ByteBuffer.wrap(t, eocd + 16, 4).order(ByteOrder.LITTLE_ENDIAN).getInt() & 0xffffffffL;
            if (cd < 24) return "";
            byte[] head = new byte[24];
            f.seek(cd - 24);
            f.readFully(head);
            for (int i = 0; i < 16; i++) if (head[8 + i] != MAGIC[i]) return "";
            long size = ByteBuffer.wrap(head, 0, 8).order(ByteOrder.LITTLE_ENDIAN).getLong();
            long start = cd - size - 8;
            if (start < 0 || size > 1 << 20) return "";
            byte[] block = new byte[(int) size - 24];
            f.seek(start + 8);
            f.readFully(block);
            ByteBuffer b = ByteBuffer.wrap(block).order(ByteOrder.LITTLE_ENDIAN);
            while (b.remaining() >= 12) {
                long l = b.getLong();
                if (l < 4 || l > b.remaining()) return "";
                int id = b.getInt();
                int vlen = (int) l - 4;
                if (id == STAMP_ID) {
                    byte[] v = new byte[vlen];
                    b.get(v);
                    return new String(v, StandardCharsets.UTF_8).trim();
                }
                b.position(b.position() + vlen);
            }
        } catch (Exception ignored) { }
        return "";
    }
}
