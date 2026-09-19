package app

import (
	"context"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
)

// ======================================================= administration
// Administrators are ordinary accounts with role=admin; the role is granted only here (installer / CLI).

type AdminSession struct {
	Token string `json:"token"`
	Admin struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	} `json:"admin"`
}

func (a *App) AdminLogin(ctx context.Context, email, password, ip string) (*AdminSession, error) {
	if a.Limit.Limited("admin:"+ip, 20) {
		return nil, fail(429, "too_many_requests")
	}
	time.Sleep(a.Limit.Tarpit(ip))
	u, err := a.store.Users().ByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if err != nil || u.Role != domain.RoleAdmin || u.Disabled || !checkPassword(u.PassHash, u.Salt, password) {
		a.Limit.Fail(ip)
		a.audit(ctx, "-", "admin_login_failed", email, ip)
		return nil, fail(401, "bad_credentials")
	}
	a.Limit.Clear(ip)
	a.audit(ctx, u.ID, "admin_login", "", ip)
	s := &AdminSession{Token: a.adminToken(u)}
	s.Admin.Email, s.Admin.Name = u.Email, u.Name
	return s, nil
}

func (a *App) AdminChangePassword(ctx context.Context, admin *domain.User, current, next, ip string) (string, error) {
	if !checkPassword(admin.PassHash, admin.Salt, current) {
		return "", fail(401, "bad_credentials")
	}
	if weakPassword(next) {
		return "", fail(400, "weak_password")
	}
	a.setPassword(admin, next)
	if err := a.store.Users().Update(ctx, admin); err != nil {
		return "", err
	}
	a.audit(ctx, admin.ID, "admin_password_change", "", ip)
	return a.adminToken(admin), nil
}

// SetAdmin creates the account if needed, grants the admin role and sets the password (CLI / installer).
func (a *App) SetAdmin(ctx context.Context, email, password, name string) (*domain.User, string, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	if !validEmail(email) {
		return nil, "", fail(400, "invalid_email")
	}
	if password == "" {
		password = RandomPassword(18)
	}
	u, err := a.store.Users().ByEmail(ctx, email)
	if err != nil {
		if name == "" {
			name = "Admin"
		}
		u, err = a.createUser(ctx, email, password, name, domain.RoleAdmin)
		if err != nil {
			return nil, "", err
		}
		a.audit(ctx, "cli", "admin_create", email, "")
		return u, password, nil
	}
	u.Role, u.Disabled = domain.RoleAdmin, false
	if name != "" {
		u.Name = name
	}
	a.setPassword(u, password)
	if err := a.store.Users().Update(ctx, u); err != nil {
		return nil, "", err
	}
	a.audit(ctx, "cli", "admin_reset", email, "")
	return u, password, nil
}

func (a *App) RemoveAdmin(ctx context.Context, email string) error {
	u, err := a.store.Users().ByEmail(ctx, strings.ToLower(email))
	if err != nil || u.Role != domain.RoleAdmin {
		return fail(404, "not_found")
	}
	u.Role = domain.RoleUser
	u.TokenVersion++
	return a.store.Users().Update(ctx, u)
}

// ---------- users management ----------

type UserAction string

func (a *App) UserAction(ctx context.Context, admin *domain.User, userID string, action, value, ip string) (map[string]any, error) {
	u, err := a.store.Users().ByID(ctx, userID)
	if err != nil {
		return nil, fail(404, "not_found")
	}
	if u.Role == domain.RoleAdmin && (action == "disable" || action == "delete" || action == "wipe_data") {
		return nil, fail(400, "is_admin")
	}
	out := map[string]any{"ok": true}
	switch action {
	case "disable":
		u.Disabled = true
		u.TokenVersion++
		err = a.store.Users().Update(ctx, u)
	case "enable":
		u.Disabled = false
		err = a.store.Users().Update(ctx, u)
	case "rename":
		u.Name = strings.TrimSpace(value)
		if len(u.Name) > 80 {
			u.Name = u.Name[:80]
		}
		err = a.store.Users().Update(ctx, u)
	case "delete":
		err = a.store.Users().Delete(ctx, u.ID)
	case "wipe_data":
		var w *domain.Workspace
		if w, err = a.store.Workspaces().PersonalOf(ctx, u.ID); err == nil {
			err = a.store.Sync().DeleteWorkspaceData(ctx, w.ID)
		}
	case "reset_link":
		var link string
		link, err = a.ResetLink(ctx, u.ID, 24*time.Hour)
		out["link"], out["expiresIn"] = link, "24h"
	default:
		return nil, fail(400, "bad_action")
	}
	if err != nil {
		return nil, err
	}
	a.audit(ctx, admin.ID, "admin_"+action, u.Email, ip)
	return out, nil
}

// ---------- invites ----------

func (a *App) CreateInvite(ctx context.Context, admin *domain.User, note, ip string) (string, error) {
	i := &domain.Invite{Code: inviteCode(), Note: strings.TrimSpace(note), CreatedAt: time.Now()}
	if len(i.Note) > 80 {
		i.Note = i.Note[:80]
	}
	if err := a.store.Invites().Create(ctx, i); err != nil {
		return "", err
	}
	a.audit(ctx, admin.ID, "invite_create", i.Code, ip)
	return i.Code, nil
}

// ---------- overview ----------

type Overview struct {
	Users        int                 `json:"users"`
	Admins       int                 `json:"admins"`
	Tasks        int                 `json:"tasks"`
	Done7        int                 `json:"done7"`
	Signups7     int                 `json:"signups7"`
	Active7      int                 `json:"active7"`
	Active1      int                 `json:"active1"`
	Series       []DayCount          `json:"signupsSeries"`
	Registration domain.Registration `json:"registration"`
	Mail         bool                `json:"mail"`
}
type DayCount struct {
	D string `json:"d"`
	N int    `json:"n"`
}

func (a *App) Overview(ctx context.Context) (*Overview, error) {
	o := &Overview{Registration: a.RegistrationMode(ctx), Mail: a.mail != nil}
	var err error
	if o.Users, err = a.store.Users().Count(ctx); err != nil {
		return nil, err
	}
	o.Admins, _ = a.store.Users().CountAdmins(ctx)
	o.Tasks, o.Done7, _ = a.store.Sync().CountAllTasks(ctx)
	o.Signups7, o.Active7, _ = a.store.Users().Stats(ctx, time.Now().Add(-7*24*time.Hour))
	_, o.Active1, _ = a.store.Users().Stats(ctx, time.Now().Add(-24*time.Hour))
	perDay, _ := a.store.Users().SignupsPerDay(ctx, time.Now().Add(-30*24*time.Hour))
	for i := 29; i >= 0; i-- {
		d := time.Now().Add(-time.Duration(i) * 24 * time.Hour).UTC().Format("2006-01-02")
		o.Series = append(o.Series, DayCount{D: d, N: perDay[d]})
	}
	return o, nil
}
