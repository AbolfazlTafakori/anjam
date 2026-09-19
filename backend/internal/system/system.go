// Package system reports host health for the admin panel (read-only).
package system

import (
	"os"
	"os/exec"
	"runtime"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/config"
)

var started = time.Now()

type Memory struct {
	Total int64 `json:"total"`
	Free  int64 `json:"free"`
	RSS   int64 `json:"rss"`
}
type Disk struct {
	Free  int64 `json:"free"`
	Total int64 `json:"total"`
}
type Report struct {
	Version       string    `json:"version"`
	Node          string    `json:"node"` // runtime label; the panel prints it next to the version
	Platform      string    `json:"platform"`
	Hostname      string    `json:"hostname"`
	Uptime        int64     `json:"uptime"`
	Load          []float64 `json:"load"`
	CPUs          int       `json:"cpus"`
	Memory        Memory    `json:"memory"`
	Disk          *Disk     `json:"disk"`
	DBBytes       int64     `json:"dbBytes"`
	PublicURL     string    `json:"publicUrl"`
	AdminPath     string    `json:"adminPath"`
	CertExpiresAt *int64    `json:"certExpiresAt"`
	DataDir       string    `json:"dataDir"`
}

func Info(cfg *config.Config, dbBytes int64) Report {
	host, _ := os.Hostname()
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)
	r := Report{
		Version: cfg.Version, Node: "Go " + runtime.Version(), Platform: runtime.GOOS + " " + runtime.GOARCH, Hostname: host,
		Uptime: int64(time.Since(started).Seconds()), Load: loadAvg(), CPUs: runtime.NumCPU(),
		Memory: Memory{Total: memTotal(), Free: memFree(), RSS: int64(ms.Sys)}, Disk: diskFree(cfg.DataDir), DBBytes: dbBytes,
		PublicURL: cfg.PublicURL, AdminPath: cfg.AdminPath, DataDir: cfg.DataDir, CertExpiresAt: certExpiry(cfg.PublicURL),
	}
	return r
}

func certExpiry(publicURL string) *int64 {
	host := strings.TrimPrefix(strings.TrimPrefix(publicURL, "https://"), "http://")
	if i := strings.IndexByte(host, '/'); i >= 0 {
		host = host[:i]
	}
	pem := "/etc/letsencrypt/live/" + host + "/cert.pem"
	if host == "" {
		return nil
	}
	if _, err := os.Stat(pem); err != nil {
		return nil
	}
	out, err := exec.Command("openssl", "x509", "-enddate", "-noout", "-in", pem).Output()
	if err != nil {
		return nil
	}
	s := strings.TrimSpace(strings.TrimPrefix(string(out), "notAfter="))
	t, err := time.Parse("Jan 2 15:04:05 2006 MST", s)
	if err != nil {
		return nil
	}
	v := t.UnixMilli()
	return &v
}
