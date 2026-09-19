// Package domain holds the entities and repository contracts of Anjam.
// It has no dependencies on HTTP, SQL or any framework: the application layer
// (internal/app) orchestrates these types, and adapters (internal/store, internal/httpapi)
// implement or consume them.
package domain

import (
	"context"
	"errors"
	"time"
)

// ---------- errors the application layer maps to HTTP ----------

var (
	ErrNotFound     = errors.New("not_found")
	ErrConflict     = errors.New("conflict")
	ErrForbidden    = errors.New("forbidden")
	ErrUnauthorized = errors.New("unauthorized")
	ErrInvalid      = errors.New("invalid")
)

// ---------- identity ----------

type Role string

const (
	RoleUser  Role = "user"
	RoleAdmin Role = "admin" // granted only by the installer / CLI, never by sign-up
)

type User struct {
	ID           string
	Email        string
	Name         string
	PassHash     string
	Salt         string
	Role         Role
	Disabled     bool
	TokenVersion int
	CreatedAt    time.Time
	LastSyncAt   time.Time
	LastIP       string
}

// ---------- workspaces (the "Notion" part) ----------

// A Workspace is the unit of sharing. Every user owns a personal one; more can be
// created and members added with a role. Databases and items belong to a workspace.
type Workspace struct {
	ID        string
	Name      string
	OwnerID   string
	Personal  bool
	CreatedAt time.Time
	UpdatedAt time.Time
}

type MemberRole string

const (
	MemberOwner  MemberRole = "owner"
	MemberEditor MemberRole = "editor"
	MemberViewer MemberRole = "viewer"
)

func (r MemberRole) CanWrite() bool { return r == MemberOwner || r == MemberEditor }

type Member struct {
	WorkspaceID string
	UserID      string
	Role        MemberRole
	JoinedAt    time.Time
	// denormalised for listings
	Email string
	Name  string
}

// A Database is a typed collection inside a workspace (a task list today; any
// property schema tomorrow). Schema is a JSON document describing its properties.
type Database struct {
	ID          string
	WorkspaceID string
	Name        string
	Color       string
	Icon        string
	Kind        string // "tasks"
	Schema      []byte // JSON
	Order       float64
	Deleted     bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Seq         int64 // workspace-scoped monotonic sequence for sync
}

// An Item is a row of a database: a task, with its properties as JSON.
type Item struct {
	ID          string
	WorkspaceID string
	DatabaseID  string
	Props       []byte // JSON: title, notes, due, time, priority, tags, subtasks, done, ...
	Deleted     bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Seq         int64
}

// ---------- sync ----------

// Change is one entity in a sync exchange, in either direction.
type Change struct {
	Kind        string          `json:"kind"` // "database" | "item" | "workspace"
	ID          string          `json:"id"`
	WorkspaceID string          `json:"workspaceId"`
	Data        RawJSON         `json:"data,omitempty"`
	UpdatedAt   int64           `json:"updatedAt"` // unix ms, client clock; last-write-wins
	Deleted     bool            `json:"deleted,omitempty"`
	Seq         int64           `json:"seq,omitempty"`
}

// RawJSON keeps JSON payloads opaque to the domain.
type RawJSON []byte

func (r RawJSON) MarshalJSON() ([]byte, error) {
	if len(r) == 0 {
		return []byte("null"), nil
	}
	return r, nil
}
func (r *RawJSON) UnmarshalJSON(b []byte) error { *r = append((*r)[:0], b...); return nil }

// ---------- misc ----------

type Invite struct {
	Code      string
	Note      string
	CreatedAt time.Time
	UsedBy    string
	UsedAt    time.Time
}

type Reset struct {
	Token     string
	UserID    string
	ExpiresAt time.Time
	Used      bool
}

type AuditEntry struct {
	At     time.Time
	Actor  string
	Action string
	Target string
	IP     string
}

type Registration string

const (
	RegistrationOpen   Registration = "open"
	RegistrationInvite Registration = "invite"
	RegistrationClosed Registration = "closed"
)

// ---------- repository contracts ----------

type UserRepo interface {
	ByEmail(ctx context.Context, email string) (*User, error)
	ByID(ctx context.Context, id string) (*User, error)
	Create(ctx context.Context, u *User) error
	Update(ctx context.Context, u *User) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]UserSummary, error)
	Count(ctx context.Context) (int, error)
	CountAdmins(ctx context.Context) (int, error)
	Stats(ctx context.Context, since time.Time) (signups, active int, err error)
	SignupsPerDay(ctx context.Context, since time.Time) (map[string]int, error)
}

type UserSummary struct {
	User
	Tasks     int
	Databases int
}

type WorkspaceRepo interface {
	Create(ctx context.Context, w *Workspace, owner *Member) error
	ByID(ctx context.Context, id string) (*Workspace, error)
	ForUser(ctx context.Context, userID string) ([]Workspace, error)
	Update(ctx context.Context, w *Workspace) error
	Delete(ctx context.Context, id string) error
	Members(ctx context.Context, wsID string) ([]Member, error)
	MemberRole(ctx context.Context, wsID, userID string) (MemberRole, error)
	AddMember(ctx context.Context, m *Member) error
	RemoveMember(ctx context.Context, wsID, userID string) error
	PersonalOf(ctx context.Context, userID string) (*Workspace, error)
}

type SyncRepo interface {
	// Apply keeps the newer version of each change (last-write-wins) inside the workspace,
	// assigns sequence numbers, and returns the ids it accepted.
	Apply(ctx context.Context, wsID string, changes []Change) (applied []string, err error)
	// Since returns every change in the workspace after seq, oldest first.
	Since(ctx context.Context, wsID string, seq int64, limit int) ([]Change, error)
	CountItems(ctx context.Context, wsID string, onlyOpen bool) (int, error)
	CountAllTasks(ctx context.Context) (total, doneRecently int, err error)
	DeleteWorkspaceData(ctx context.Context, wsID string) error
}

type InviteRepo interface {
	List(ctx context.Context) ([]Invite, error)
	Get(ctx context.Context, code string) (*Invite, error)
	Create(ctx context.Context, i *Invite) error
	Use(ctx context.Context, code, userID string) error
	Delete(ctx context.Context, code string) error
}

type ResetRepo interface {
	Create(ctx context.Context, r *Reset) error
	Consume(ctx context.Context, token string) (*Reset, error) // returns and marks used, or ErrNotFound
}

type SettingsRepo interface {
	Get(ctx context.Context, key, dflt string) (string, error)
	Set(ctx context.Context, key, value string) error
}

type AuditRepo interface {
	Add(ctx context.Context, e AuditEntry) error
	List(ctx context.Context, limit int) ([]AuditEntry, error)
}

// Store bundles every repository plus lifecycle. One implementation: internal/store/sqlite.
type Store interface {
	Users() UserRepo
	Workspaces() WorkspaceRepo
	Sync() SyncRepo
	Invites() InviteRepo
	Resets() ResetRepo
	Settings() SettingsRepo
	Audit() AuditRepo
	Backup(ctx context.Context, toFile string) error
	SizeBytes() int64
	Close() error
}
