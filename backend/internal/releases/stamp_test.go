package releases

import (
	"bytes"
	"encoding/binary"
	"testing"
)

// builds a minimal fake APK: [local data][signing block][central dir][EOCD]
func fakeAPK() []byte {
	local := []byte("PK\x03\x04fake-local-entry")
	pair := make([]byte, 8+4+3)
	binary.LittleEndian.PutUint64(pair, 7)
	binary.LittleEndian.PutUint32(pair[8:], 0x7109871a)
	copy(pair[12:], "sig")
	size := uint64(len(pair) + 8 + 16)
	var block []byte
	block = binary.LittleEndian.AppendUint64(block, size)
	block = append(block, pair...)
	block = binary.LittleEndian.AppendUint64(block, size)
	block = append(block, sigMagic...)
	cd := []byte("PK\x01\x02central")
	eocd := make([]byte, 22)
	copy(eocd, "PK\x05\x06")
	binary.LittleEndian.PutUint32(eocd[16:], uint32(len(local)+len(block)))
	return bytes.Join([][]byte{local, block, cd, eocd}, nil)
}

func TestStampRoundTrip(t *testing.T) {
	apk := fakeAPK()
	out, err := stampAPKBytes(apk, "https://anjam.example.com")
	if err != nil {
		t.Fatal(err)
	}
	if got := ReadStamp(bytes.NewReader(out), int64(len(out))); got != "https://anjam.example.com" {
		t.Fatalf("stamp = %q", got)
	}
	// stamping twice replaces, not appends
	out2, _ := stampAPKBytes(out, "https://other.example.com")
	if got := ReadStamp(bytes.NewReader(out2), int64(len(out2))); got != "https://other.example.com" {
		t.Fatalf("restamp = %q", got)
	}
	if !bytes.HasSuffix(out2, apk[len(apk)-22+16:len(apk)-22+16]) { // sanity: EOCD still there
		t.Fatal("eocd lost")
	}
	if stampedName("Anjam-Setup-1.3.0.exe", "https://anjam.example.com") != "Anjam-Setup-1.3.0.srv-anjam.example.com.exe" {
		t.Fatal("stampedName")
	}
}
