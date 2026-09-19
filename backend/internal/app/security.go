package app

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"regexp"
	"strings"
	"sync"
	"time"
	"unicode"

	"golang.org/x/crypto/scrypt"
)

// ---------- passwords (scrypt N=16384, r=8, p=1, 64 bytes; compatible with the previous server) ----------

func hashPassword(pw, salt string) string {
	k, _ := scrypt.Key([]byte(pw), []byte(salt), 16384, 8, 1, 64)
	return hex.EncodeToString(k)
}
func newSalt() string { b := make([]byte, 16); _, _ = rand.Read(b); return hex.EncodeToString(b) }
func checkPassword(hash, salt, pw string) bool {
	return subtle.ConstantTimeCompare([]byte(hashPassword(pw, salt)), []byte(hash)) == 1
}

var emailRe = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func validEmail(e string) bool { return len(e) < 200 && emailRe.MatchString(e) }

// weakPassword: at least 8 chars with a digit and a letter (Latin or Persian).
func weakPassword(pw string) bool {
	if len(pw) < 8 || len(pw) > 200 {
		return true
	}
	digit, letter := false, false
	for _, r := range pw {
		if unicode.IsDigit(r) {
			digit = true
		} else if unicode.IsLetter(r) {
			letter = true
		}
	}
	return !(digit && letter)
}

func RandomPassword(n int) string {
	const a = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789"
	b := make([]byte, n)
	_, _ = rand.Read(b)
	for i := range b {
		b[i] = a[int(b[i])%len(a)]
	}
	return string(b)
}
func randomToken() string { b := make([]byte, 24); _, _ = rand.Read(b); return base64.RawURLEncoding.EncodeToString(b) }
func inviteCode() string   { b := make([]byte, 4); _, _ = rand.Read(b); return strings.ToUpper(hex.EncodeToString(b)) }
func newID() string        { b := make([]byte, 16); _, _ = rand.Read(b); return hex.EncodeToString(b) }

// ---------- signed tokens: base64url(json) . hmac ----------

type tokenClaims struct {
	Sub string `json:"sub,omitempty"` // user session
	Adm string `json:"adm,omitempty"` // admin session
	V   int    `json:"v"`
	Exp int64  `json:"exp"`
}

func signToken(secret []byte, c tokenClaims) string {
	payload, _ := json.Marshal(c)
	p := base64.RawURLEncoding.EncodeToString(payload)
	m := hmac.New(sha256.New, secret)
	m.Write([]byte(p))
	return p + "." + base64.RawURLEncoding.EncodeToString(m.Sum(nil))
}
func parseToken(secret []byte, tok string) (*tokenClaims, bool) {
	i := strings.IndexByte(tok, '.')
	if i <= 0 {
		return nil, false
	}
	p, sig := tok[:i], tok[i+1:]
	m := hmac.New(sha256.New, secret)
	m.Write([]byte(p))
	want := base64.RawURLEncoding.EncodeToString(m.Sum(nil))
	if subtle.ConstantTimeCompare([]byte(sig), []byte(want)) != 1 {
		return nil, false
	}
	raw, err := base64.RawURLEncoding.DecodeString(p)
	if err != nil {
		return nil, false
	}
	var c tokenClaims
	if json.Unmarshal(raw, &c) != nil || c.Exp < time.Now().UnixMilli() {
		return nil, false
	}
	return &c, true
}

// ---------- abuse limits: per-key counter in a 15-minute window + exponential tarpit ----------

type Limiter struct {
	mu    sync.Mutex
	hits  map[string]*hit
	fails map[string]int
}
type hit struct {
	n int
	t time.Time
}

func NewLimiter() *Limiter {
	l := &Limiter{hits: map[string]*hit{}, fails: map[string]int{}}
	go func() {
		for range time.Tick(10 * time.Minute) {
			l.mu.Lock()
			for k, h := range l.hits {
				if time.Since(h.t) > 30*time.Minute {
					delete(l.hits, k)
				}
			}
			l.mu.Unlock()
		}
	}()
	return l
}
func (l *Limiter) Limited(key string, max int) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	h := l.hits[key]
	if h == nil || time.Since(h.t) > 15*time.Minute {
		h = &hit{t: time.Now()}
		l.hits[key] = h
	}
	h.n++
	return h.n > max
}
func (l *Limiter) Tarpit(key string) time.Duration {
	l.mu.Lock()
	n := l.fails[key]
	l.mu.Unlock()
	if n == 0 {
		return 0
	}
	d := 500 * time.Millisecond << uint(n-1)
	if d > 8*time.Second {
		d = 8 * time.Second
	}
	return d
}
func (l *Limiter) Fail(key string)  { l.mu.Lock(); l.fails[key]++; l.mu.Unlock() }
func (l *Limiter) Clear(key string) { l.mu.Lock(); delete(l.fails, key); l.mu.Unlock() }
