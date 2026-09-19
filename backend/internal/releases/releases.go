// Package releases mirrors the latest GitHub release of the apps onto this server so users
// download installers directly from here (/dl/<platform>), and exposes the release description.
package releases

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/config"
)

type File struct {
	Platform  string `json:"platform"`
	Label     string `json:"label"`
	Arch      string `json:"arch"`
	Kind      string `json:"kind"`
	Type      string `json:"type"`
	Name      string `json:"name"`
	Size      int64  `json:"size"`
	URL       string `json:"url"`    // this server's /dl/<platform>
	GitHub    string `json:"github"` // origin
	Downloads int    `json:"downloads"`
}
type Release struct {
	Version     string `json:"version"`
	Name        string `json:"name"`
	PublishedAt string `json:"publishedAt"`
	Notes       string `json:"notes"`
	Page        string `json:"page"`
	Files       []File `json:"files"`
}
type Status struct {
	CachedAt int64           `json:"cachedAt"`
	Error    string          `json:"error"`
	Repo     string          `json:"repo"`
	Mirrored map[string]bool `json:"mirrored"`
	Dir      string          `json:"dir"`
}

var platforms = []struct {
	id, label, arch, kind, ctype string
	re                           *regexp.Regexp
}{
	{"android", "Android", "universal", "apk", "application/vnd.android.package-archive", regexp.MustCompile(`(?i)\.apk$`)},
	{"windows", "Windows", "x64", "installer", "application/octet-stream", regexp.MustCompile(`(?i)\.exe$`)},
	{"linux-appimage", "Linux", "x64", "AppImage", "application/octet-stream", regexp.MustCompile(`(?i)\.AppImage$`)},
	{"linux-deb", "Linux (Debian/Ubuntu)", "x64", "deb", "application/vnd.debian.binary-package", regexp.MustCompile(`(?i)\.deb$`)},
}

type Mirror struct {
	cfg      *config.Config
	dir      string
	client   *http.Client
	mu       sync.Mutex
	at       time.Time
	rel      *Release
	err      string
	inflight map[string]bool
}

func New(cfg *config.Config) *Mirror {
	dir := filepath.Join(cfg.DataDir, "releases")
	_ = os.MkdirAll(dir, 0o750)
	return &Mirror{cfg: cfg, dir: dir, client: &http.Client{Timeout: 10 * time.Minute}, inflight: map[string]bool{}}
}

func (m *Mirror) Latest(ctx context.Context) *Release {
	m.mu.Lock()
	age := time.Since(m.at)
	fresh := (m.rel != nil && age < 10*time.Minute) || (m.rel == nil && age < time.Minute && !m.at.IsZero())
	m.mu.Unlock()
	if fresh {
		return m.rel
	}
	rel, err := m.fetch(ctx)
	m.mu.Lock()
	m.at = time.Now()
	if err != nil {
		m.err = err.Error()
	} else {
		m.rel, m.err = rel, ""
		go m.mirrorAll(rel)
	}
	cur := m.rel
	m.mu.Unlock()
	return cur
}

func (m *Mirror) fetch(ctx context.Context) (*Release, error) {
	req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/repos/"+m.cfg.ReleasesRepo+"/releases/latest", nil)
	req.Header.Set("User-Agent", "anjam-server")
	req.Header.Set("Accept", "application/vnd.github+json")
	res, err := m.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return nil, &httpErr{res.StatusCode}
	}
	var gh struct {
		TagName     string `json:"tag_name"`
		Name        string `json:"name"`
		PublishedAt string `json:"published_at"`
		Body        string `json:"body"`
		HTMLURL     string `json:"html_url"`
		Assets      []struct {
			Name string `json:"name"`
			Size int64  `json:"size"`
			URL  string `json:"browser_download_url"`
			DL   int    `json:"download_count"`
		} `json:"assets"`
	}
	if err := json.NewDecoder(res.Body).Decode(&gh); err != nil {
		return nil, err
	}
	rel := &Release{Version: strings.TrimPrefix(gh.TagName, "v"), Name: gh.Name, PublishedAt: gh.PublishedAt, Notes: gh.Body, Page: gh.HTMLURL, Files: []File{}}
	for _, p := range platforms {
		for _, a := range gh.Assets {
			if p.re.MatchString(a.Name) && !strings.Contains(a.Name, "blockmap") {
				rel.Files = append(rel.Files, File{Platform: p.id, Label: p.label, Arch: p.arch, Kind: p.kind, Type: p.ctype, Name: a.Name, Size: a.Size, URL: m.cfg.PublicURL + "/dl/" + p.id, GitHub: a.URL, Downloads: a.DL})
				break
			}
		}
	}
	return rel, nil
}

type httpErr struct{ code int }

func (e *httpErr) Error() string { return "github " + http.StatusText(e.code) }

func (m *Mirror) local(f File) (string, bool) {
	p := filepath.Join(m.dir, f.Name)
	st, err := os.Stat(p)
	return p, err == nil && st.Size() == f.Size
}

// download fetches one asset once; concurrent callers just wait for the next check.
func (m *Mirror) download(f File) {
	m.mu.Lock()
	if m.inflight[f.Name] {
		m.mu.Unlock()
		return
	}
	m.inflight[f.Name] = true
	m.mu.Unlock()
	defer func() { m.mu.Lock(); delete(m.inflight, f.Name); m.mu.Unlock() }()
	dest := filepath.Join(m.dir, f.Name)
	tmp := dest + ".part"
	req, _ := http.NewRequest("GET", f.GitHub, nil)
	req.Header.Set("User-Agent", "anjam-server")
	res, err := m.client.Do(req)
	if err != nil {
		log.Printf("mirror %s: %v", f.Name, err)
		return
	}
	defer res.Body.Close()
	out, err := os.Create(tmp)
	if err != nil {
		return
	}
	if _, err := io.Copy(out, res.Body); err != nil {
		out.Close()
		os.Remove(tmp)
		return
	}
	out.Close()
	_ = os.Rename(tmp, dest)
}

func (m *Mirror) mirrorAll(rel *Release) {
	keep := map[string]bool{}
	for _, f := range rel.Files {
		keep[f.Name] = true
		if _, ok := m.local(f); !ok {
			m.download(f)
		}
	}
	entries, _ := os.ReadDir(m.dir)
	for _, e := range entries { // drop older versions
		if !keep[e.Name()] && !strings.HasSuffix(e.Name(), ".part") {
			_ = os.Remove(filepath.Join(m.dir, e.Name()))
		}
	}
}

func (m *Mirror) Status() Status {
	m.mu.Lock()
	defer m.mu.Unlock()
	s := Status{CachedAt: m.at.UnixMilli(), Error: m.err, Repo: m.cfg.ReleasesRepo, Mirrored: map[string]bool{}, Dir: m.dir}
	if m.rel != nil {
		for _, f := range m.rel.Files {
			_, ok := m.local(f)
			s.Mirrored[f.Platform] = ok
		}
	}
	return s
}

// ServeHTTP handles GET /dl/{platform}: direct download from the mirror, redirect to GitHub while filling.
func (m *Mirror) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	rel := m.Latest(r.Context())
	want := r.PathValue("platform")
	if rel != nil {
		for _, f := range rel.Files {
			if f.Platform != want {
				continue
			}
			if p, ok := m.local(f); ok {
				w.Header().Set("Content-Type", f.Type)
				w.Header().Set("Content-Disposition", `attachment; filename="`+f.Name+`"`)
				w.Header().Set("Cache-Control", "public, max-age=3600")
				http.ServeFile(w, r, p)
				return
			}
			go m.download(f)
			http.Redirect(w, r, f.GitHub, http.StatusFound)
			return
		}
	}
	http.Error(w, "No build for this platform yet", 404)
}
