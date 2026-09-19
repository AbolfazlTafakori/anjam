// Package sqlite implements domain.Store on SQLite (modernc.org/sqlite, pure Go, no cgo).
// This is the only package that contains SQL.
package sqlite

import (
	"context"
	"database/sql"
	"embed"
	"errors"
	"fmt"
	"os"
	"sort"
	"strings"
	"time"

	_ "modernc.org/sqlite"

	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
)

//go:embed all:migrations
var migrations embed.FS

type Store struct {
	db   *sql.DB
	file string
}

func Open(file string) (*Store, error) {
	db, err := sql.Open("sqlite", file+"?_pragma=busy_timeout(5000)&_pragma=foreign_keys(ON)&_pragma=journal_mode(WAL)")
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1) // SQLite: one writer; serialising avoids SQLITE_BUSY under load
	s := &Store{db: db, file: file}
	if err := s.migrate(); err != nil {
		return nil, err
	}
	return s, nil
}

func (s *Store) migrate() error {
	if _, err := s.db.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at INTEGER NOT NULL)`); err != nil {
		return err
	}
	entries, err := migrations.ReadDir("migrations")
	if err != nil {
		return err
	}
	names := make([]string, 0, len(entries))
	for _, e := range entries {
		if strings.HasSuffix(e.Name(), ".sql") {
			names = append(names, e.Name())
		}
	}
	sort.Strings(names)
	for _, n := range names {
		var done int
		_ = s.db.QueryRow(`SELECT COUNT(*) FROM schema_migrations WHERE name = ?`, n).Scan(&done)
		if done > 0 {
			continue
		}
		body, _ := migrations.ReadFile("migrations/" + n)
		if _, err := s.db.Exec(string(body)); err != nil {
			return fmt.Errorf("migration %s: %w", n, err)
		}
		if _, err := s.db.Exec(`INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)`, n, now()); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) Close() error { return s.db.Close() }
func (s *Store) SizeBytes() int64 {
	st, err := os.Stat(s.file)
	if err != nil {
		return 0
	}
	return st.Size()
}
func (s *Store) Backup(ctx context.Context, toFile string) error {
	_, err := s.db.ExecContext(ctx, `VACUUM INTO '`+strings.ReplaceAll(toFile, "'", "''")+`'`)
	return err
}

func (s *Store) Users() domain.UserRepo           { return userRepo{s.db} }
func (s *Store) Workspaces() domain.WorkspaceRepo { return wsRepo{s.db} }
func (s *Store) Sync() domain.SyncRepo            { return syncRepo{s.db} }
func (s *Store) Invites() domain.InviteRepo       { return inviteRepo{s.db} }
func (s *Store) Resets() domain.ResetRepo         { return resetRepo{s.db} }
func (s *Store) Settings() domain.SettingsRepo    { return settingsRepo{s.db} }
func (s *Store) Audit() domain.AuditRepo          { return auditRepo{s.db} }

// ---------- helpers ----------

func now() int64 { return time.Now().UnixMilli() }
func ms(t time.Time) int64 {
	if t.IsZero() {
		return 0
	}
	return t.UnixMilli()
}
func tm(v int64) time.Time {
	if v == 0 {
		return time.Time{}
	}
	return time.UnixMilli(v)
}
func b2i(b bool) int {
	if b {
		return 1
	}
	return 0
}
func notFound(err error) error {
	if errors.Is(err, sql.ErrNoRows) {
		return domain.ErrNotFound
	}
	return err
}
