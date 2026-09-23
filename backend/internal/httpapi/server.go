// Package httpapi exposes the application over HTTP (net/http, Go 1.22 routing). No business rules here.
package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/app"
	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
	"github.com/AbolfazlTafakori/anjam/backend/internal/releases"
	"github.com/AbolfazlTafakori/anjam/backend/internal/system"
)

type Server struct {
	app *app.App
	rel *releases.Mirror
	mux *http.ServeMux
}

func New(a *app.App, rel *releases.Mirror) http.Handler {
	s := &Server{app: a, rel: rel, mux: http.NewServeMux()}
	s.routes()
	return s.withMiddleware(s.mux)
}

// ---------- plumbing ----------

type ctxKey int

const (
	ctxUser ctxKey = iota
	ctxAdmin
)

func (s *Server) withMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("Referrer-Policy", "no-referrer")
		h.Set("X-Frame-Options", "DENY")
		// The desktop app runs from file://, so the API is CORS-open; auth is bearer-token, never cookies.
		h.Set("Access-Control-Allow-Origin", "*")
		h.Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		h.Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, 4<<20)
		next.ServeHTTP(w, r)
	})
}

func clientIP(r *http.Request) string {
	if v := r.Header.Get("X-Real-IP"); v != "" {
		return v
	}
	if v := r.Header.Get("X-Forwarded-For"); v != "" {
		return strings.TrimSpace(strings.Split(v, ",")[0])
	}
	host, _, _ := net.SplitHostPort(r.RemoteAddr)
	return host
}
func bearer(r *http.Request) string {
	const p = "Bearer "
	if h := r.Header.Get("Authorization"); strings.HasPrefix(h, p) {
		return h[len(p):]
	}
	return ""
}
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
func writeErr(w http.ResponseWriter, err error) {
	var ae *app.Error
	if errors.As(err, &ae) {
		writeJSON(w, ae.Status, map[string]string{"error": ae.Code})
		return
	}
	switch {
	case errors.Is(err, domain.ErrNotFound):
		writeJSON(w, 404, map[string]string{"error": "not_found"})
	case errors.Is(err, domain.ErrForbidden):
		writeJSON(w, 403, map[string]string{"error": "forbidden"})
	default:
		log.Printf("error: %v", err)
		writeJSON(w, 500, map[string]string{"error": "server_error"})
	}
}
func decode(r *http.Request, v any) error {
	if r.Body == nil {
		return nil
	}
	if err := json.NewDecoder(r.Body).Decode(v); err != nil && !errors.Is(err, errEmpty) {
		return err
	}
	return nil
}

var errEmpty = errors.New("empty")

func (s *Server) requireUser(next func(http.ResponseWriter, *http.Request, *domain.User)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := s.app.UserFromToken(r.Context(), bearer(r))
		if u == nil {
			writeJSON(w, 401, map[string]string{"error": "unauthorized"})
			return
		}
		next(w, r, u)
	}
}
func (s *Server) requireAdmin(next func(http.ResponseWriter, *http.Request, *domain.User)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := s.app.AdminFromToken(r.Context(), bearer(r))
		if u == nil {
			writeJSON(w, 401, map[string]string{"error": "unauthorized"})
			return
		}
		next(w, r, u)
	}
}

// ---------- routes ----------

func (s *Server) routes() {
	m, cfg := s.mux, s.app.Config()

	m.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]any{"ok": true, "name": "anjam", "version": cfg.Version, "registration": s.app.RegistrationMode(r.Context()), "mail": s.app.MailEnabled()})
	})
	m.HandleFunc("GET /api/releases", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]any{"release": s.rel.Latest(r.Context()), "server": cfg.PublicURL})
	})
	m.HandleFunc("GET /dl/{platform}", s.rel.ServeHTTP)
	m.HandleFunc("GET /update/latest.yml", s.rel.ServeUpdateFeed)
	m.HandleFunc("GET /update/latest-linux.yml", s.rel.ServeUpdateFeed)
	m.HandleFunc("GET /update/latest-mac.yml", s.rel.ServeUpdateFeed)
	m.HandleFunc("GET /update/{name}", s.rel.ServeUpdateFile)

	// auth
	m.HandleFunc("POST /api/auth/register", func(w http.ResponseWriter, r *http.Request) {
		var b struct{ Email, Password, Name, Invite string }
		_ = decode(r, &b)
		sess, err := s.app.Register(r.Context(), b.Email, b.Password, b.Name, b.Invite, clientIP(r))
		respond(w, sess, err)
	})
	m.HandleFunc("POST /api/auth/login", func(w http.ResponseWriter, r *http.Request) {
		var b struct{ Email, Password string }
		_ = decode(r, &b)
		sess, err := s.app.Login(r.Context(), b.Email, b.Password, clientIP(r))
		respond(w, sess, err)
	})
	m.HandleFunc("POST /api/auth/forgot", func(w http.ResponseWriter, r *http.Request) {
		var b struct{ Email string }
		_ = decode(r, &b)
		mailed, err := s.app.Forgot(r.Context(), b.Email, clientIP(r))
		respond(w, map[string]any{"ok": true, "mailed": mailed}, err)
	})
	m.HandleFunc("POST /api/auth/reset", func(w http.ResponseWriter, r *http.Request) {
		var b struct{ Token, Password string }
		_ = decode(r, &b)
		sess, err := s.app.Reset(r.Context(), b.Token, b.Password, clientIP(r))
		respond(w, sess, err)
	})

	// me
	m.HandleFunc("GET /api/me", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		writeJSON(w, 200, map[string]any{"user": publicOf(u)})
	}))
	m.HandleFunc("POST /api/me", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		var b struct{ Name, CurrentPassword, NewPassword string }
		_ = decode(r, &b)
		sess, err := s.app.UpdateProfile(r.Context(), u, b.Name, b.CurrentPassword, b.NewPassword, clientIP(r))
		respond(w, sess, err)
	}))
	m.HandleFunc("POST /api/me/delete", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		var b struct{ Password string }
		_ = decode(r, &b)
		respond(w, map[string]any{"ok": true}, s.app.DeleteAccount(r.Context(), u, b.Password, clientIP(r)))
	}))

	// workspaces
	m.HandleFunc("GET /api/workspaces", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		list, err := s.app.Workspaces(r.Context(), u)
		respond(w, map[string]any{"workspaces": list}, err)
	}))
	m.HandleFunc("POST /api/workspaces", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		var b struct{ Name string }
		_ = decode(r, &b)
		ws, err := s.app.CreateWorkspace(r.Context(), u, b.Name)
		respond(w, map[string]any{"workspace": ws}, err)
	}))
	m.HandleFunc("POST /api/workspaces/{id}", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		var b struct{ Name string }
		_ = decode(r, &b)
		respond(w, map[string]any{"ok": true}, s.app.RenameWorkspace(r.Context(), u, r.PathValue("id"), b.Name))
	}))
	m.HandleFunc("DELETE /api/workspaces/{id}", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		respond(w, map[string]any{"ok": true}, s.app.DeleteWorkspace(r.Context(), u, r.PathValue("id")))
	}))
	m.HandleFunc("GET /api/workspaces/{id}/members", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		list, err := s.app.Members(r.Context(), u, r.PathValue("id"))
		out := make([]map[string]any, 0, len(list))
		for _, mm := range list {
			out = append(out, map[string]any{"userId": mm.UserID, "email": mm.Email, "name": mm.Name, "role": mm.Role, "joinedAt": mm.JoinedAt.UnixMilli()})
		}
		respond(w, map[string]any{"members": out}, err)
	}))
	m.HandleFunc("POST /api/workspaces/{id}/members", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		var b struct {
			Email string
			Role  string
		}
		_ = decode(r, &b)
		respond(w, map[string]any{"ok": true}, s.app.AddMember(r.Context(), u, r.PathValue("id"), b.Email, domain.MemberRole(b.Role), clientIP(r)))
	}))
	m.HandleFunc("DELETE /api/workspaces/{id}/members/{user}", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		respond(w, map[string]any{"ok": true}, s.app.RemoveMember(r.Context(), u, r.PathValue("id"), r.PathValue("user")))
	}))

	// sync
	m.HandleFunc("POST /api/sync", s.requireUser(func(w http.ResponseWriter, r *http.Request, u *domain.User) {
		var req app.SyncRequest
		if err := decode(r, &req); err != nil {
			writeJSON(w, 400, map[string]string{"error": "bad_request"})
			return
		}
		resp, err := s.app.Sync(r.Context(), u, req, clientIP(r))
		respond(w, resp, err)
	}))

	s.adminRoutes()
	s.pages()
}

func publicOf(u *domain.User) map[string]any {
	return map[string]any{"id": u.ID, "email": u.Email, "name": u.Name, "created_at": u.CreatedAt.UnixMilli()}
}
func respond(w http.ResponseWriter, v any, err error) {
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, 200, v)
}

// ---------- static pages (PWA, panel at the secret path, download page) ----------

func (s *Server) pages() {
	cfg := s.app.Config()
	if cfg.WebDir == "" {
		return
	}
	file := func(name string) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Cache-Control", "no-cache")
			http.ServeFile(w, r, filepath.Join(cfg.WebDir, name))
		}
	}
	s.mux.HandleFunc("GET /"+cfg.AdminPath, file("admin.html"))
	if cfg.AdminPath != "admin" {
		s.mux.HandleFunc("GET /admin", func(w http.ResponseWriter, _ *http.Request) { http.Error(w, "Not found", 404) })
	}
	s.mux.HandleFunc("GET /download", file("download.html"))
	fs := http.FileServer(http.Dir(cfg.WebDir))
	s.mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, ".woff2") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "no-cache")
		}
		if _, err := os.Stat(filepath.Join(cfg.WebDir, filepath.FromSlash(r.URL.Path))); err != nil && r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		fs.ServeHTTP(w, r)
	})
}

// Run serves until ctx is cancelled, then drains connections.
func Run(ctx context.Context, addr string, h http.Handler) error {
	srv := &http.Server{Addr: addr, Handler: h, ReadHeaderTimeout: 10 * time.Second, IdleTimeout: 60 * time.Second}
	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
	}()
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}

// keep system imported for admin routes file
var _ = system.Info
