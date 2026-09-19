package sqlite

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
)

// ======================================================= users

type userRepo struct{ db *sql.DB }

const userCols = `id, email, name, pass_hash, salt, role, disabled, token_version, created_at, last_sync_at, last_ip`

func scanUser(r interface{ Scan(...any) error }) (*domain.User, error) {
	var u domain.User
	var disabled int
	var created, lastSync int64
	var role string
	if err := r.Scan(&u.ID, &u.Email, &u.Name, &u.PassHash, &u.Salt, &role, &disabled, &u.TokenVersion, &created, &lastSync, &u.LastIP); err != nil {
		return nil, notFound(err)
	}
	u.Role, u.Disabled, u.CreatedAt, u.LastSyncAt = domain.Role(role), disabled == 1, tm(created), tm(lastSync)
	return &u, nil
}

func (r userRepo) ByEmail(ctx context.Context, email string) (*domain.User, error) {
	return scanUser(r.db.QueryRowContext(ctx, `SELECT `+userCols+` FROM users WHERE email = ?`, strings.ToLower(email)))
}
func (r userRepo) ByID(ctx context.Context, id string) (*domain.User, error) {
	return scanUser(r.db.QueryRowContext(ctx, `SELECT `+userCols+` FROM users WHERE id = ?`, id))
}
func (r userRepo) Create(ctx context.Context, u *domain.User) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO users (`+userCols+`) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
		u.ID, strings.ToLower(u.Email), u.Name, u.PassHash, u.Salt, string(u.Role), b2i(u.Disabled), u.TokenVersion, ms(u.CreatedAt), ms(u.LastSyncAt), u.LastIP)
	if err != nil && strings.Contains(err.Error(), "UNIQUE") {
		return domain.ErrConflict
	}
	return err
}
func (r userRepo) Update(ctx context.Context, u *domain.User) error {
	_, err := r.db.ExecContext(ctx, `UPDATE users SET email=?, name=?, pass_hash=?, salt=?, role=?, disabled=?, token_version=?, last_sync_at=?, last_ip=? WHERE id=?`,
		strings.ToLower(u.Email), u.Name, u.PassHash, u.Salt, string(u.Role), b2i(u.Disabled), u.TokenVersion, ms(u.LastSyncAt), u.LastIP, u.ID)
	return err
}
func (r userRepo) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM users WHERE id = ?`, id)
	return err
}
func (r userRepo) Count(ctx context.Context) (n int, err error) {
	err = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&n)
	return
}
func (r userRepo) CountAdmins(ctx context.Context) (n int, err error) {
	err = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users WHERE role = 'admin'`).Scan(&n)
	return
}
func (r userRepo) Stats(ctx context.Context, since time.Time) (signups, active int, err error) {
	if err = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users WHERE created_at > ?`, ms(since)).Scan(&signups); err != nil {
		return
	}
	err = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users WHERE last_sync_at > ?`, ms(since)).Scan(&active)
	return
}
func (r userRepo) SignupsPerDay(ctx context.Context, since time.Time) (map[string]int, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT date(created_at/1000,'unixepoch') d, COUNT(*) FROM users WHERE created_at > ? GROUP BY d`, ms(since))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := map[string]int{}
	for rows.Next() {
		var d string
		var n int
		if err := rows.Scan(&d, &n); err != nil {
			return nil, err
		}
		out[d] = n
	}
	return out, rows.Err()
}
func (r userRepo) List(ctx context.Context) ([]domain.UserSummary, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT `+userCols+`,
		(SELECT COUNT(*) FROM items i JOIN members m ON m.workspace_id = i.workspace_id AND m.user_id = u.id AND m.role = 'owner' WHERE i.deleted = 0),
		(SELECT COUNT(*) FROM databases d JOIN members m ON m.workspace_id = d.workspace_id AND m.user_id = u.id AND m.role = 'owner' WHERE d.deleted = 0)
		FROM users u ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.UserSummary
	for rows.Next() {
		var s domain.UserSummary
		var disabled int
		var created, lastSync int64
		var role string
		if err := rows.Scan(&s.ID, &s.Email, &s.Name, &s.PassHash, &s.Salt, &role, &disabled, &s.TokenVersion, &created, &lastSync, &s.LastIP, &s.Tasks, &s.Databases); err != nil {
			return nil, err
		}
		s.Role, s.Disabled, s.CreatedAt, s.LastSyncAt = domain.Role(role), disabled == 1, tm(created), tm(lastSync)
		s.PassHash, s.Salt = "", ""
		out = append(out, s)
	}
	return out, rows.Err()
}

// ======================================================= workspaces

type wsRepo struct{ db *sql.DB }

func scanWS(r interface{ Scan(...any) error }) (*domain.Workspace, error) {
	var w domain.Workspace
	var personal int
	var c, u int64
	if err := r.Scan(&w.ID, &w.Name, &w.OwnerID, &personal, &c, &u); err != nil {
		return nil, notFound(err)
	}
	w.Personal, w.CreatedAt, w.UpdatedAt = personal == 1, tm(c), tm(u)
	return &w, nil
}
func (r wsRepo) Create(ctx context.Context, w *domain.Workspace, owner *domain.Member) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if _, err := tx.ExecContext(ctx, `INSERT INTO workspaces (id, name, owner_id, personal, created_at, updated_at) VALUES (?,?,?,?,?,?)`, w.ID, w.Name, w.OwnerID, b2i(w.Personal), ms(w.CreatedAt), ms(w.UpdatedAt)); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `INSERT INTO members (workspace_id, user_id, role, joined_at) VALUES (?,?,?,?)`, w.ID, owner.UserID, string(owner.Role), ms(owner.JoinedAt)); err != nil {
		return err
	}
	return tx.Commit()
}
func (r wsRepo) ByID(ctx context.Context, id string) (*domain.Workspace, error) {
	return scanWS(r.db.QueryRowContext(ctx, `SELECT id, name, owner_id, personal, created_at, updated_at FROM workspaces WHERE id = ?`, id))
}
func (r wsRepo) PersonalOf(ctx context.Context, userID string) (*domain.Workspace, error) {
	return scanWS(r.db.QueryRowContext(ctx, `SELECT id, name, owner_id, personal, created_at, updated_at FROM workspaces WHERE owner_id = ? AND personal = 1`, userID))
}
func (r wsRepo) ForUser(ctx context.Context, userID string) ([]domain.Workspace, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT w.id, w.name, w.owner_id, w.personal, w.created_at, w.updated_at FROM workspaces w JOIN members m ON m.workspace_id = w.id WHERE m.user_id = ? ORDER BY w.personal DESC, w.created_at`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.Workspace
	for rows.Next() {
		w, err := scanWS(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *w)
	}
	return out, rows.Err()
}
func (r wsRepo) Update(ctx context.Context, w *domain.Workspace) error {
	_, err := r.db.ExecContext(ctx, `UPDATE workspaces SET name = ?, updated_at = ? WHERE id = ?`, w.Name, now(), w.ID)
	return err
}
func (r wsRepo) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM workspaces WHERE id = ?`, id)
	return err
}
func (r wsRepo) Members(ctx context.Context, wsID string) ([]domain.Member, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT m.workspace_id, m.user_id, m.role, m.joined_at, u.email, u.name FROM members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? ORDER BY m.joined_at`, wsID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.Member
	for rows.Next() {
		var m domain.Member
		var role string
		var j int64
		if err := rows.Scan(&m.WorkspaceID, &m.UserID, &role, &j, &m.Email, &m.Name); err != nil {
			return nil, err
		}
		m.Role, m.JoinedAt = domain.MemberRole(role), tm(j)
		out = append(out, m)
	}
	return out, rows.Err()
}
func (r wsRepo) MemberRole(ctx context.Context, wsID, userID string) (domain.MemberRole, error) {
	var role string
	err := r.db.QueryRowContext(ctx, `SELECT role FROM members WHERE workspace_id = ? AND user_id = ?`, wsID, userID).Scan(&role)
	return domain.MemberRole(role), notFound(err)
}
func (r wsRepo) AddMember(ctx context.Context, m *domain.Member) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO members (workspace_id, user_id, role, joined_at) VALUES (?,?,?,?) ON CONFLICT(workspace_id, user_id) DO UPDATE SET role = excluded.role`, m.WorkspaceID, m.UserID, string(m.Role), ms(m.JoinedAt))
	return err
}
func (r wsRepo) RemoveMember(ctx context.Context, wsID, userID string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM members WHERE workspace_id = ? AND user_id = ?`, wsID, userID)
	return err
}

// ======================================================= sync (databases + items, last-write-wins)

type syncRepo struct{ db *sql.DB }

func (r syncRepo) Apply(ctx context.Context, wsID string, changes []domain.Change) ([]string, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	var seq int64
	if err := tx.QueryRowContext(ctx, `SELECT seq FROM workspaces WHERE id = ?`, wsID).Scan(&seq); err != nil {
		return nil, notFound(err)
	}
	var applied []string
	for _, c := range changes {
		if c.ID == "" || len(c.ID) > 64 || len(c.Data) > 200_000 {
			continue
		}
		table := map[string]string{"database": "databases", "item": "items"}[c.Kind]
		if table == "" {
			continue
		}
		var cur int64
		err := tx.QueryRowContext(ctx, `SELECT updated_at FROM `+table+` WHERE id = ? AND workspace_id = ?`, c.ID, wsID).Scan(&cur)
		if err == nil && cur >= c.UpdatedAt {
			continue // server copy is newer or equal
		}
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		seq++
		data := c.Data
		if len(data) == 0 || c.Deleted {
			data = []byte("{}")
		}
		if c.Kind == "database" {
			var d struct {
				Name   string          `json:"name"`
				Color  string          `json:"color"`
				Icon   string          `json:"icon"`
				Kind   string          `json:"kind"`
				Order  float64         `json:"order"`
				Schema json.RawMessage `json:"schema"`
			}
			_ = json.Unmarshal(data, &d)
			if d.Kind == "" {
				d.Kind = "tasks"
			}
			if len(d.Schema) == 0 {
				d.Schema = []byte("{}")
			}
			_, err = tx.ExecContext(ctx, `INSERT INTO databases (id, workspace_id, name, color, icon, kind, schema, ord, deleted, created_at, updated_at, seq) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
				ON CONFLICT(id) DO UPDATE SET name=excluded.name, color=excluded.color, icon=excluded.icon, kind=excluded.kind, schema=excluded.schema, ord=excluded.ord, deleted=excluded.deleted, updated_at=excluded.updated_at, seq=excluded.seq`,
				c.ID, wsID, d.Name, d.Color, d.Icon, d.Kind, string(d.Schema), d.Order, b2i(c.Deleted), c.UpdatedAt, c.UpdatedAt, seq)
		} else {
			var it struct {
				DatabaseID string `json:"databaseId"`
			}
			_ = json.Unmarshal(data, &it)
			_, err = tx.ExecContext(ctx, `INSERT INTO items (id, workspace_id, database_id, props, deleted, created_at, updated_at, seq) VALUES (?,?,?,?,?,?,?,?)
				ON CONFLICT(id) DO UPDATE SET database_id=excluded.database_id, props=excluded.props, deleted=excluded.deleted, updated_at=excluded.updated_at, seq=excluded.seq`,
				c.ID, wsID, it.DatabaseID, string(data), b2i(c.Deleted), c.UpdatedAt, c.UpdatedAt, seq)
		}
		if err != nil {
			return nil, err
		}
		applied = append(applied, c.ID)
	}
	if _, err := tx.ExecContext(ctx, `UPDATE workspaces SET seq = ? WHERE id = ?`, seq, wsID); err != nil {
		return nil, err
	}
	return applied, tx.Commit()
}

func (r syncRepo) Since(ctx context.Context, wsID string, seq int64, limit int) ([]domain.Change, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT 'database', id, json_object('name', name, 'color', color, 'icon', icon, 'kind', kind, 'order', ord, 'schema', json(schema)), updated_at, deleted, seq FROM databases WHERE workspace_id = ? AND seq > ?
		UNION ALL
		SELECT 'item', id, props, updated_at, deleted, seq FROM items WHERE workspace_id = ? AND seq > ?
		ORDER BY seq LIMIT ?`, wsID, seq, wsID, seq, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.Change
	for rows.Next() {
		var c domain.Change
		var data string
		var deleted int
		if err := rows.Scan(&c.Kind, &c.ID, &data, &c.UpdatedAt, &deleted, &c.Seq); err != nil {
			return nil, err
		}
		c.WorkspaceID, c.Deleted, c.Data = wsID, deleted == 1, domain.RawJSON(data)
		out = append(out, c)
	}
	return out, rows.Err()
}
func (r syncRepo) CountItems(ctx context.Context, wsID string, onlyOpen bool) (n int, err error) {
	q := `SELECT COUNT(*) FROM items WHERE workspace_id = ? AND deleted = 0`
	if onlyOpen {
		q += ` AND COALESCE(json_extract(props, '$.done'), 0) = 0`
	}
	err = r.db.QueryRowContext(ctx, q, wsID).Scan(&n)
	return
}
func (r syncRepo) CountAllTasks(ctx context.Context) (total, doneRecently int, err error) {
	if err = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM items WHERE deleted = 0 AND COALESCE(json_extract(props,'$.done'),0) = 0`).Scan(&total); err != nil {
		return
	}
	err = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM items WHERE deleted = 0 AND json_extract(props,'$.done') = 1 AND COALESCE(json_extract(props,'$.completedAt'),0) > ?`, now()-7*86400000).Scan(&doneRecently)
	return
}
func (r syncRepo) DeleteWorkspaceData(ctx context.Context, wsID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	for _, q := range []string{`DELETE FROM items WHERE workspace_id = ?`, `DELETE FROM databases WHERE workspace_id = ?`, `UPDATE workspaces SET seq = seq + 1 WHERE id = ?`} {
		if _, err := tx.ExecContext(ctx, q, wsID); err != nil {
			return err
		}
	}
	return tx.Commit()
}

// ======================================================= invites / resets / settings / audit

type inviteRepo struct{ db *sql.DB }

func (r inviteRepo) List(ctx context.Context) ([]domain.Invite, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT code, note, created_at, COALESCE(used_by,''), COALESCE(used_at,0) FROM invites ORDER BY created_at DESC LIMIT 200`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.Invite
	for rows.Next() {
		var i domain.Invite
		var c, u int64
		if err := rows.Scan(&i.Code, &i.Note, &c, &i.UsedBy, &u); err != nil {
			return nil, err
		}
		i.CreatedAt, i.UsedAt = tm(c), tm(u)
		out = append(out, i)
	}
	return out, rows.Err()
}
func (r inviteRepo) Get(ctx context.Context, code string) (*domain.Invite, error) {
	var i domain.Invite
	var c, u int64
	err := r.db.QueryRowContext(ctx, `SELECT code, note, created_at, COALESCE(used_by,''), COALESCE(used_at,0) FROM invites WHERE code = ?`, code).Scan(&i.Code, &i.Note, &c, &i.UsedBy, &u)
	if err != nil {
		return nil, notFound(err)
	}
	i.CreatedAt, i.UsedAt = tm(c), tm(u)
	return &i, nil
}
func (r inviteRepo) Create(ctx context.Context, i *domain.Invite) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO invites (code, note, created_at) VALUES (?,?,?)`, i.Code, i.Note, ms(i.CreatedAt))
	return err
}
func (r inviteRepo) Use(ctx context.Context, code, userID string) error {
	_, err := r.db.ExecContext(ctx, `UPDATE invites SET used_by = ?, used_at = ? WHERE code = ?`, userID, now(), code)
	return err
}
func (r inviteRepo) Delete(ctx context.Context, code string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM invites WHERE code = ?`, code)
	return err
}

type resetRepo struct{ db *sql.DB }

func (r resetRepo) Create(ctx context.Context, t *domain.Reset) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO resets (token, user_id, expires_at) VALUES (?,?,?)`, t.Token, t.UserID, ms(t.ExpiresAt))
	return err
}
func (r resetRepo) Consume(ctx context.Context, token string) (*domain.Reset, error) {
	var t domain.Reset
	var exp int64
	err := r.db.QueryRowContext(ctx, `SELECT token, user_id, expires_at FROM resets WHERE token = ? AND used = 0 AND expires_at > ?`, token, now()).Scan(&t.Token, &t.UserID, &exp)
	if err != nil {
		return nil, notFound(err)
	}
	if _, err := r.db.ExecContext(ctx, `UPDATE resets SET used = 1 WHERE token = ?`, token); err != nil {
		return nil, err
	}
	t.ExpiresAt = tm(exp)
	return &t, nil
}

type settingsRepo struct{ db *sql.DB }

func (r settingsRepo) Get(ctx context.Context, key, dflt string) (string, error) {
	var v string
	err := r.db.QueryRowContext(ctx, `SELECT v FROM settings WHERE k = ?`, key).Scan(&v)
	if err == sql.ErrNoRows {
		return dflt, nil
	}
	return v, err
}
func (r settingsRepo) Set(ctx context.Context, key, value string) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v`, key, value)
	return err
}

type auditRepo struct{ db *sql.DB }

func (r auditRepo) Add(ctx context.Context, e domain.AuditEntry) error {
	_, err := r.db.ExecContext(ctx, `INSERT INTO audit (ts, actor, action, target, ip) VALUES (?,?,?,?,?)`, now(), e.Actor, e.Action, e.Target, e.IP)
	return err
}
func (r auditRepo) List(ctx context.Context, limit int) ([]domain.AuditEntry, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT ts, actor, action, target, ip FROM audit ORDER BY ts DESC LIMIT ?`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.AuditEntry
	for rows.Next() {
		var e domain.AuditEntry
		var ts int64
		if err := rows.Scan(&ts, &e.Actor, &e.Action, &e.Target, &e.IP); err != nil {
			return nil, err
		}
		e.At = tm(ts)
		out = append(out, e)
	}
	return out, rows.Err()
}
