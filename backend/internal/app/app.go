// Package app contains Anjam's use cases. It depends on domain only; HTTP and SQL live outside.
package app

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/config"
	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
)

// Mailer is what auth needs from e-mail; nil means "not configured".
type Mailer interface {
	Send(to, subject, body string) error
}

type App struct {
	cfg   *config.Config
	store domain.Store
	mail  Mailer
	Limit *Limiter
}

func New(cfg *config.Config, store domain.Store, mail Mailer) *App {
	return &App{cfg: cfg, store: store, mail: mail, Limit: NewLimiter()}
}

func (a *App) Config() *config.Config { return a.cfg }
func (a *App) Store() domain.Store    { return a.store }
func (a *App) MailEnabled() bool      { return a.mail != nil }
func (a *App) audit(ctx context.Context, actor, action, target, ip string) {
	_ = a.store.Audit().Add(ctx, domain.AuditEntry{Actor: actor, Action: action, Target: target, IP: ip})
}

// Error carries a stable machine code (and HTTP status) for the API.
type Error struct {
	Code   string
	Status int
}

func (e *Error) Error() string           { return e.Code }
func fail(status int, code string) error { return &Error{Code: code, Status: status} }

// ======================================================= registration & sessions

type Session struct {
	Token string      `json:"token"`
	User  *PublicUser `json:"user"`
}
type PublicUser struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	CreatedAt int64  `json:"created_at"`
	AvatarVer int    `json:"avatar_ver"`
}

func public(u *domain.User) *PublicUser {
	return &PublicUser{ID: u.ID, Email: u.Email, Name: u.Name, CreatedAt: u.CreatedAt.UnixMilli(), AvatarVer: u.AvatarVer}
}

func (a *App) RegistrationMode(ctx context.Context) domain.Registration {
	v, _ := a.store.Settings().Get(ctx, "registration", a.cfg.Registration)
	return domain.Registration(v)
}
func (a *App) SetRegistrationMode(ctx context.Context, m domain.Registration, actor, ip string) error {
	switch m {
	case domain.RegistrationOpen, domain.RegistrationInvite, domain.RegistrationClosed:
	default:
		return fail(400, "bad_request")
	}
	a.audit(ctx, actor, "settings_registration", string(m), ip)
	return a.store.Settings().Set(ctx, "registration", string(m))
}

func (a *App) Register(ctx context.Context, email, password, name, invite, ip string) (*Session, error) {
	if a.Limit.Limited("auth:"+ip, 30) {
		return nil, fail(429, "too_many_requests")
	}
	email = strings.ToLower(strings.TrimSpace(email))
	if !validEmail(email) {
		return nil, fail(400, "invalid_email")
	}
	mode := a.RegistrationMode(ctx)
	if mode == domain.RegistrationClosed {
		return nil, fail(403, "registration_closed")
	}
	if weakPassword(password) {
		return nil, fail(400, "weak_password")
	}
	name = strings.TrimSpace(name)
	if name == "" {
		return nil, fail(400, "name_required")
	}
	if len(name) > 80 {
		name = name[:80]
	}
	if _, err := a.store.Users().ByEmail(ctx, email); err == nil {
		return nil, fail(409, "email_taken")
	}
	var inv *domain.Invite
	if mode == domain.RegistrationInvite {
		var err error
		inv, err = a.store.Invites().Get(ctx, strings.ToUpper(strings.TrimSpace(invite)))
		if err != nil || inv.UsedBy != "" {
			return nil, fail(403, "invite_required")
		}
	}
	u, err := a.createUser(ctx, email, password, name, domain.RoleUser)
	if err != nil {
		return nil, err
	}
	if inv != nil {
		_ = a.store.Invites().Use(ctx, inv.Code, u.ID)
	}
	a.audit(ctx, u.ID, "register", email, ip)
	return &Session{Token: a.userToken(u), User: public(u)}, nil
}

// createUser inserts the account and its personal workspace with a default "Inbox" database.
func (a *App) createUser(ctx context.Context, email, password, name string, role domain.Role) (*domain.User, error) {
	salt := newSalt()
	u := &domain.User{ID: newID(), Email: email, Name: name, PassHash: hashPassword(password, salt), Salt: salt, Role: role, CreatedAt: time.Now()}
	if err := a.store.Users().Create(ctx, u); err != nil {
		if errors.Is(err, domain.ErrConflict) {
			return nil, fail(409, "email_taken")
		}
		return nil, err
	}
	if _, err := a.ensurePersonalWorkspace(ctx, u); err != nil {
		return nil, err
	}
	return u, nil
}

func (a *App) ensurePersonalWorkspace(ctx context.Context, u *domain.User) (*domain.Workspace, error) {
	if w, err := a.store.Workspaces().PersonalOf(ctx, u.ID); err == nil {
		return w, nil
	}
	w := &domain.Workspace{ID: newID(), Name: u.Name, OwnerID: u.ID, Personal: true, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	if err := a.store.Workspaces().Create(ctx, w, &domain.Member{WorkspaceID: w.ID, UserID: u.ID, Role: domain.MemberOwner, JoinedAt: time.Now()}); err != nil {
		return nil, err
	}
	return w, nil
}

func (a *App) Login(ctx context.Context, email, password, ip string) (*Session, error) {
	if a.Limit.Limited("auth:"+ip, 30) {
		return nil, fail(429, "too_many_requests")
	}
	u, err := a.store.Users().ByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if err != nil || !checkPassword(u.PassHash, u.Salt, password) {
		return nil, fail(401, "bad_credentials")
	}
	if u.Disabled {
		return nil, fail(403, "account_disabled")
	}
	a.audit(ctx, u.ID, "login", "", ip)
	return &Session{Token: a.userToken(u), User: public(u)}, nil
}

func (a *App) userToken(u *domain.User) string {
	return signToken(a.cfg.Secret, tokenClaims{Sub: u.ID, V: u.TokenVersion, Exp: time.Now().Add(time.Duration(a.cfg.UserTokenDays) * 24 * time.Hour).UnixMilli()})
}
func (a *App) adminToken(u *domain.User) string {
	return signToken(a.cfg.Secret, tokenClaims{Adm: u.ID, V: u.TokenVersion, Exp: time.Now().Add(time.Duration(a.cfg.AdminTokenHours) * time.Hour).UnixMilli()})
}

// UserFromToken resolves a user session token; nil if invalid, expired, revoked or disabled.
func (a *App) UserFromToken(ctx context.Context, tok string) *domain.User {
	c, ok := parseToken(a.cfg.Secret, tok)
	if !ok || c.Sub == "" {
		return nil
	}
	u, err := a.store.Users().ByID(ctx, c.Sub)
	if err != nil || u.Disabled || u.TokenVersion != c.V {
		return nil
	}
	return u
}
func (a *App) AdminFromToken(ctx context.Context, tok string) *domain.User {
	c, ok := parseToken(a.cfg.Secret, tok)
	if !ok || c.Adm == "" {
		return nil
	}
	u, err := a.store.Users().ByID(ctx, c.Adm)
	if err != nil || u.Disabled || u.Role != domain.RoleAdmin || u.TokenVersion != c.V {
		return nil
	}
	return u
}

// ---------- password reset ----------

func (a *App) Forgot(ctx context.Context, email, ip string) (mailed bool, err error) {
	if a.Limit.Limited("forgot:"+ip, 10) {
		return false, fail(429, "too_many_requests")
	}
	u, err := a.store.Users().ByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if err != nil || a.mail == nil {
		return false, nil // never reveal whether the address exists
	}
	link, err := a.ResetLink(ctx, u.ID, time.Hour)
	if err != nil {
		return false, err
	}
	body := fmt.Sprintf("برای تعیین رمز جدید روی این لینک بزنید (۱ ساعت اعتبار دارد):\n%s\n\nOpen this link to set a new password (valid for 1 hour).", link)
	if err := a.mail.Send(u.Email, "Anjam — بازیابی رمز / password reset", body); err != nil {
		return false, nil
	}
	return true, nil
}

func (a *App) ResetLink(ctx context.Context, userID string, ttl time.Duration) (string, error) {
	t := &domain.Reset{Token: randomToken(), UserID: userID, ExpiresAt: time.Now().Add(ttl)}
	if err := a.store.Resets().Create(ctx, t); err != nil {
		return "", err
	}
	return a.cfg.PublicURL + "/?reset=" + t.Token, nil
}

func (a *App) Reset(ctx context.Context, token, password, ip string) (*Session, error) {
	if a.Limit.Limited("forgot:"+ip, 10) {
		return nil, fail(429, "too_many_requests")
	}
	if weakPassword(password) {
		return nil, fail(400, "weak_password")
	}
	t, err := a.store.Resets().Consume(ctx, token)
	if err != nil {
		return nil, fail(400, "bad_token")
	}
	u, err := a.store.Users().ByID(ctx, t.UserID)
	if err != nil {
		return nil, fail(400, "bad_token")
	}
	a.setPassword(u, password)
	if err := a.store.Users().Update(ctx, u); err != nil {
		return nil, err
	}
	a.audit(ctx, u.ID, "password_reset", "", ip)
	return &Session{Token: a.userToken(u), User: public(u)}, nil
}

func (a *App) setPassword(u *domain.User, pw string) {
	u.Salt = newSalt()
	u.PassHash = hashPassword(pw, u.Salt)
	u.TokenVersion++ // every session, app and panel, is signed out
}

// ---------- profile ----------

func (a *App) UpdateProfile(ctx context.Context, u *domain.User, name, currentPassword, newPassword string, ip string) (*Session, error) {
	if n := strings.TrimSpace(name); n != "" {
		if len(n) > 80 {
			n = n[:80]
		}
		u.Name = n
	}
	if newPassword != "" {
		if !checkPassword(u.PassHash, u.Salt, currentPassword) {
			return nil, fail(401, "bad_credentials")
		}
		if weakPassword(newPassword) {
			return nil, fail(400, "weak_password")
		}
		a.setPassword(u, newPassword)
		a.audit(ctx, u.ID, "password_change", "", ip)
	}
	if err := a.store.Users().Update(ctx, u); err != nil {
		return nil, err
	}
	return &Session{Token: a.userToken(u), User: public(u)}, nil
}

var avatarTypes = map[string]bool{"image/jpeg": true, "image/png": true, "image/webp": true}

func (a *App) SetAvatar(ctx context.Context, u *domain.User, contentType string, data []byte) (int, error) {
	if len(data) == 0 {
		return 0, fail(400, "bad_request")
	}
	if !avatarTypes[contentType] {
		return 0, fail(400, "bad_content_type")
	}
	ver, err := a.store.Users().SetAvatar(ctx, u.ID, contentType, data)
	if err != nil {
		return 0, err
	}
	u.AvatarVer = ver
	return ver, nil
}

func (a *App) DeleteAvatar(ctx context.Context, u *domain.User) (int, error) {
	ver, err := a.store.Users().DeleteAvatar(ctx, u.ID)
	if err != nil {
		return 0, err
	}
	u.AvatarVer = ver
	return ver, nil
}

func (a *App) Avatar(ctx context.Context, userID string) (string, []byte, error) {
	return a.store.Users().GetAvatar(ctx, userID)
}

func (a *App) DeleteAccount(ctx context.Context, u *domain.User, password, ip string) error {
	if !checkPassword(u.PassHash, u.Salt, password) {
		return fail(401, "bad_credentials")
	}
	if u.Role == domain.RoleAdmin {
		return fail(400, "is_admin")
	}
	a.audit(ctx, u.ID, "account_deleted", u.Email, ip)
	return a.store.Users().Delete(ctx, u.ID) // cascades: owned workspaces, memberships, data
}
