package httpapi

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
	"github.com/AbolfazlTafakori/anjam/backend/internal/system"
)

func (s *Server) adminRoutes() {
	m, cfg := s.mux, s.app.Config()

	m.HandleFunc("POST /api/admin/login", func(w http.ResponseWriter, r *http.Request) {
		var b struct{ Email, Password string }
		_ = decode(r, &b)
		sess, err := s.app.AdminLogin(r.Context(), b.Email, b.Password, clientIP(r))
		respond(w, sess, err)
	})
	m.HandleFunc("GET /api/admin/me", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, a *domain.User) {
		writeJSON(w, 200, map[string]any{"admin": map[string]string{"email": a.Email, "name": a.Name}})
	}))
	m.HandleFunc("POST /api/admin/password", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, a *domain.User) {
		var b struct{ CurrentPassword, NewPassword string }
		_ = decode(r, &b)
		tok, err := s.app.AdminChangePassword(r.Context(), a, b.CurrentPassword, b.NewPassword, clientIP(r))
		respond(w, map[string]any{"ok": true, "token": tok}, err)
	}))
	m.HandleFunc("GET /api/admin/overview", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		o, err := s.app.Overview(r.Context())
		if err != nil {
			writeErr(w, err)
			return
		}
		writeJSON(w, 200, map[string]any{
			"users": o.Users, "admins": o.Admins, "tasks": o.Tasks, "done7": o.Done7, "signups7": o.Signups7, "active7": o.Active7, "active1": o.Active1,
			"signupsSeries": o.Series, "registration": o.Registration, "mail": o.Mail,
			"system": system.Info(cfg, s.app.Store().SizeBytes()), "release": s.rel.Latest(r.Context()), "releaseStatus": s.rel.Status(),
		})
	}))
	m.HandleFunc("GET /api/admin/users", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		list, err := s.app.Store().Users().List(r.Context())
		out := make([]map[string]any, 0, len(list))
		for _, u := range list {
			out = append(out, map[string]any{"id": u.ID, "email": u.Email, "name": u.Name, "role": u.Role, "disabled": u.Disabled, "created_at": u.CreatedAt.UnixMilli(), "last_sync_at": u.LastSyncAt.UnixMilli(), "last_ip": u.LastIP, "tasks": u.Tasks, "lists": u.Databases})
		}
		respond(w, map[string]any{"users": out}, err)
	}))
	m.HandleFunc("POST /api/admin/users/{id}", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, a *domain.User) {
		var b struct{ Action, Value string }
		_ = decode(r, &b)
		out, err := s.app.UserAction(r.Context(), a, r.PathValue("id"), b.Action, b.Value, clientIP(r))
		respond(w, out, err)
	}))
	m.HandleFunc("GET /api/admin/settings", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		writeJSON(w, 200, map[string]any{"registration": s.app.RegistrationMode(r.Context()), "mail": s.app.MailEnabled(), "publicUrl": cfg.PublicURL, "adminPath": cfg.AdminPath, "releasesRepo": cfg.ReleasesRepo})
	}))
	m.HandleFunc("POST /api/admin/settings", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, a *domain.User) {
		var b struct{ Registration string }
		_ = decode(r, &b)
		respond(w, map[string]any{"registration": b.Registration}, s.app.SetRegistrationMode(r.Context(), domain.Registration(b.Registration), a.ID, clientIP(r)))
	}))
	m.HandleFunc("GET /api/admin/invites", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		list, err := s.app.Store().Invites().List(r.Context())
		out := make([]map[string]any, 0, len(list))
		for _, i := range list {
			row := map[string]any{"code": i.Code, "note": i.Note, "created_at": i.CreatedAt.UnixMilli(), "used_by": nil, "used_at": nil}
			if i.UsedBy != "" {
				row["used_by"], row["used_at"] = i.UsedBy, i.UsedAt.UnixMilli()
			}
			out = append(out, row)
		}
		respond(w, map[string]any{"invites": out}, err)
	}))
	m.HandleFunc("POST /api/admin/invites", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, a *domain.User) {
		var b struct{ Note string }
		_ = decode(r, &b)
		code, err := s.app.CreateInvite(r.Context(), a, b.Note, clientIP(r))
		respond(w, map[string]any{"code": code}, err)
	}))
	m.HandleFunc("POST /api/admin/invites/{code}/delete", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		respond(w, map[string]any{"ok": true}, s.app.Store().Invites().Delete(r.Context(), r.PathValue("code")))
	}))
	m.HandleFunc("GET /api/admin/audit", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
		if limit <= 0 || limit > 500 {
			limit = 150
		}
		list, err := s.app.Store().Audit().List(r.Context(), limit)
		out := make([]map[string]any, 0, len(list))
		for _, e := range list {
			out = append(out, map[string]any{"ts": e.At.UnixMilli(), "actor": e.Actor, "action": e.Action, "target": e.Target, "ip": e.IP})
		}
		respond(w, map[string]any{"audit": out}, err)
	}))
	m.HandleFunc("GET /api/admin/releases", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, _ *domain.User) {
		writeJSON(w, 200, map[string]any{"release": s.rel.Latest(r.Context()), "status": s.rel.Status()})
	}))
	m.HandleFunc("GET /api/admin/backup", s.requireAdmin(func(w http.ResponseWriter, r *http.Request, a *domain.User) {
		tmp := filepath.Join(cfg.DataDir, "backup-"+strconv.FormatInt(time.Now().UnixMilli(), 10)+".sqlite")
		if err := s.app.Store().Backup(r.Context(), tmp); err != nil {
			writeErr(w, err)
			return
		}
		defer os.Remove(tmp)
		w.Header().Set("Content-Disposition", `attachment; filename="anjam-backup-`+time.Now().Format("2006-01-02")+`.sqlite"`)
		http.ServeFile(w, r, tmp)
	}))
}
