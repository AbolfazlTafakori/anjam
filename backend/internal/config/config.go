// Package config reads the process environment once into an immutable struct.
package config

import (
	"crypto/rand"
	"encoding/hex"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

var Version = "dev" // set by -ldflags at build time

type Config struct {
	Version         string
	Port            int
	Bind            string
	DataDir         string
	DBFile          string
	Secret          []byte
	PublicURL       string
	AdminPath       string
	Registration    string
	SMTPURL         string
	MailFrom        string
	ReleasesRepo    string
	WebDir          string
	UserTokenDays   int
	AdminTokenHours int
}

func env(k, d string) string {
	if v := strings.TrimSpace(os.Getenv(k)); v != "" {
		return v
	}
	return d
}

// Load builds the config and makes sure the data directory and the signing secret exist.
func Load() (*Config, error) {
	dataDir := env("ANJAM_DATA", "./data")
	if err := os.MkdirAll(dataDir, 0o750); err != nil {
		return nil, err
	}
	secretFile := filepath.Join(dataDir, "secret.key")
	secret, err := os.ReadFile(secretFile)
	if err != nil {
		b := make([]byte, 48)
		if _, err := rand.Read(b); err != nil {
			return nil, err
		}
		secret = []byte(hex.EncodeToString(b))
		if err := os.WriteFile(secretFile, secret, 0o600); err != nil {
			return nil, err
		}
	}
	port, _ := strconv.Atoi(env("PORT", "8787"))
	webDir := env("ANJAM_WEB", "")
	if webDir == "" {
		exe, _ := os.Executable()
		for _, cand := range []string{filepath.Join(filepath.Dir(exe), "web"), filepath.Join(filepath.Dir(exe), "..", "web"), "web", "../web"} {
			if st, err := os.Stat(cand); err == nil && st.IsDir() {
				webDir = cand
				break
			}
		}
	}
	return &Config{
		Version:         Version,
		Port:            port,
		Bind:            env("BIND", "0.0.0.0"),
		DataDir:         dataDir,
		DBFile:          filepath.Join(dataDir, "anjam.sqlite"),
		Secret:          []byte(strings.TrimSpace(string(secret))),
		PublicURL:       strings.TrimRight(env("PUBLIC_URL", ""), "/"),
		AdminPath:       strings.Trim(env("ADMIN_PATH", "admin"), "/"),
		Registration:    env("REGISTRATION", "invite"),
		SMTPURL:         env("SMTP_URL", ""),
		MailFrom:        env("MAIL_FROM", "Anjam <no-reply@localhost>"),
		ReleasesRepo:    env("RELEASES_REPO", "AbolfazlTafakori/anjam"),
		WebDir:          webDir,
		UserTokenDays:   90,
		AdminTokenHours: 12,
	}, nil
}
