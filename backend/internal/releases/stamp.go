package releases

// Server stamping: every installer this server hands out carries the server's own address,
// so users never type it.
//
//   - APK: the address is written into the APK Signing Block as an extra ID-value pair.
//     The v2/v3 signature covers everything except that block, so the APK stays validly
//     signed (the same technique Play's install referrer and Walle channels use).
//     The app reads it back from its own file (android/…/ServerConfigPlugin.java).
//   - Windows / AppImage: the address is carried in the file name
//     (Anjam-Setup-1.3.0.srv-anjam.example.com.exe); the NSIS installer and the AppImage
//     read their own file name and write it to the app's config.

import (
	"bytes"
	"encoding/binary"
	"errors"
	"io"
	"os"
	"strings"
)

const stampID uint32 = 0x414E4A41 // "ANJA"
var sigMagic = []byte("APK Sig Block 42")

// StampAPK copies src to dst with serverURL embedded in the signing block.
func StampAPK(src, dst, serverURL string) error {
	data, err := os.ReadFile(src)
	if err != nil {
		return err
	}
	out, err := stampAPKBytes(data, serverURL)
	if err != nil {
		return err
	}
	tmp := dst + ".part"
	if err := os.WriteFile(tmp, out, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, dst)
}

func stampAPKBytes(data []byte, serverURL string) ([]byte, error) {
	// --- End Of Central Directory ---
	eocd := bytes.LastIndex(data, []byte{0x50, 0x4b, 0x05, 0x06})
	if eocd < 0 || len(data)-eocd < 22 {
		return nil, errors.New("apk: no end of central directory")
	}
	cdOffset := int(binary.LittleEndian.Uint32(data[eocd+16:]))
	if cdOffset < 24 || cdOffset > len(data) {
		return nil, errors.New("apk: bad central directory offset")
	}
	// --- APK Signing Block ends right before the central directory ---
	if !bytes.Equal(data[cdOffset-16:cdOffset], sigMagic) {
		return nil, errors.New("apk: not signed with v2/v3 (no signing block)")
	}
	blockSize := int(binary.LittleEndian.Uint64(data[cdOffset-24:]))
	blockStart := cdOffset - blockSize - 8
	if blockStart < 0 {
		return nil, errors.New("apk: bad signing block size")
	}
	// pairs live between blockStart+8 and cdOffset-24
	pairs := data[blockStart+8 : cdOffset-24]
	var kept [][]byte
	for len(pairs) >= 12 {
		l := int(binary.LittleEndian.Uint64(pairs))
		if l < 4 || 8+l > len(pairs) {
			return nil, errors.New("apk: corrupt signing block")
		}
		id := binary.LittleEndian.Uint32(pairs[8:])
		if id != stampID { // drop any previous stamp
			kept = append(kept, pairs[:8+l])
		}
		pairs = pairs[8+l:]
	}
	val := []byte(serverURL)
	stamp := make([]byte, 8+4+len(val))
	binary.LittleEndian.PutUint64(stamp, uint64(4+len(val)))
	binary.LittleEndian.PutUint32(stamp[8:], stampID)
	copy(stamp[12:], val)
	kept = append(kept, stamp)

	var body []byte
	for _, p := range kept {
		body = append(body, p...)
	}
	newSize := uint64(len(body) + 8 + 16) // pairs + size-of-block(8) + magic(16)
	block := make([]byte, 0, 8+len(body)+8+16)
	block = binary.LittleEndian.AppendUint64(block, newSize)
	block = append(block, body...)
	block = binary.LittleEndian.AppendUint64(block, newSize)
	block = append(block, sigMagic...)

	out := make([]byte, 0, len(data)-blockSize-8+len(block))
	out = append(out, data[:blockStart]...)
	out = append(out, block...)
	out = append(out, data[cdOffset:]...)
	// fix the central directory offset in the EOCD (it moved by the size delta)
	delta := len(block) - (blockSize + 8)
	newEOCD := eocd + delta
	binary.LittleEndian.PutUint32(out[newEOCD+16:], uint32(cdOffset+delta))
	return out, nil
}

// ReadStamp returns the server address embedded in an APK, or "" (used by tests and the CLI).
func ReadStamp(r io.ReaderAt, size int64) string {
	buf := make([]byte, size)
	if _, err := r.ReadAt(buf, 0); err != nil && err != io.EOF {
		return ""
	}
	eocd := bytes.LastIndex(buf, []byte{0x50, 0x4b, 0x05, 0x06})
	if eocd < 0 {
		return ""
	}
	cd := int(binary.LittleEndian.Uint32(buf[eocd+16:]))
	if cd < 24 || !bytes.Equal(buf[cd-16:cd], sigMagic) {
		return ""
	}
	bs := int(binary.LittleEndian.Uint64(buf[cd-24:]))
	pairs := buf[cd-bs-8+8 : cd-24]
	for len(pairs) >= 12 {
		l := int(binary.LittleEndian.Uint64(pairs))
		if l < 4 || 8+l > len(pairs) {
			return ""
		}
		if binary.LittleEndian.Uint32(pairs[8:]) == stampID {
			return strings.TrimSpace(string(pairs[12 : 8+l]))
		}
		pairs = pairs[8+l:]
	}
	return ""
}

// stampedName inserts the server host into a file name: Anjam-Setup-1.3.0.exe → Anjam-Setup-1.3.0.srv-host.exe
func stampedName(name, publicURL string) string {
	host := strings.TrimPrefix(strings.TrimPrefix(publicURL, "https://"), "http://")
	host = strings.Trim(strings.ReplaceAll(host, "/", ""), ".")
	if host == "" {
		return name
	}
	if i := strings.LastIndexByte(name, '.'); i > 0 {
		return name[:i] + ".srv-" + host + name[i:]
	}
	return name + ".srv-" + host
}
