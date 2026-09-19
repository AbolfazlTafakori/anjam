package app

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
)

// ======================================================= workspaces & members

type WorkspaceView struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	Personal bool              `json:"personal"`
	Role     domain.MemberRole `json:"role"`
	OwnerID  string            `json:"ownerId"`
}

func (a *App) Workspaces(ctx context.Context, u *domain.User) ([]WorkspaceView, error) {
	if _, err := a.ensurePersonalWorkspace(ctx, u); err != nil {
		return nil, err
	}
	list, err := a.store.Workspaces().ForUser(ctx, u.ID)
	if err != nil {
		return nil, err
	}
	out := make([]WorkspaceView, 0, len(list))
	for _, w := range list {
		role, _ := a.store.Workspaces().MemberRole(ctx, w.ID, u.ID)
		out = append(out, WorkspaceView{ID: w.ID, Name: w.Name, Personal: w.Personal, Role: role, OwnerID: w.OwnerID})
	}
	return out, nil
}

func (a *App) CreateWorkspace(ctx context.Context, u *domain.User, name string) (*WorkspaceView, error) {
	name = strings.TrimSpace(name)
	if name == "" || len(name) > 80 {
		return nil, fail(400, "invalid")
	}
	w := &domain.Workspace{ID: newID(), Name: name, OwnerID: u.ID, CreatedAt: time.Now(), UpdatedAt: time.Now()}
	if err := a.store.Workspaces().Create(ctx, w, &domain.Member{WorkspaceID: w.ID, UserID: u.ID, Role: domain.MemberOwner, JoinedAt: time.Now()}); err != nil {
		return nil, err
	}
	return &WorkspaceView{ID: w.ID, Name: w.Name, Role: domain.MemberOwner, OwnerID: u.ID}, nil
}

func (a *App) RenameWorkspace(ctx context.Context, u *domain.User, wsID, name string) error {
	w, role, err := a.access(ctx, u, wsID)
	if err != nil {
		return err
	}
	if role != domain.MemberOwner {
		return fail(403, "forbidden")
	}
	w.Name = strings.TrimSpace(name)
	if w.Name == "" {
		return fail(400, "invalid")
	}
	return a.store.Workspaces().Update(ctx, w)
}

func (a *App) DeleteWorkspace(ctx context.Context, u *domain.User, wsID string) error {
	w, role, err := a.access(ctx, u, wsID)
	if err != nil {
		return err
	}
	if role != domain.MemberOwner || w.Personal {
		return fail(403, "forbidden")
	}
	return a.store.Workspaces().Delete(ctx, wsID)
}

func (a *App) Members(ctx context.Context, u *domain.User, wsID string) ([]domain.Member, error) {
	if _, _, err := a.access(ctx, u, wsID); err != nil {
		return nil, err
	}
	return a.store.Workspaces().Members(ctx, wsID)
}

// AddMember shares a workspace with an existing account by e-mail.
func (a *App) AddMember(ctx context.Context, u *domain.User, wsID, email string, role domain.MemberRole, ip string) error {
	_, myRole, err := a.access(ctx, u, wsID)
	if err != nil {
		return err
	}
	if myRole != domain.MemberOwner {
		return fail(403, "forbidden")
	}
	if role != domain.MemberEditor && role != domain.MemberViewer {
		return fail(400, "bad_role")
	}
	target, err := a.store.Users().ByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if err != nil {
		return fail(404, "user_not_found")
	}
	if target.ID == u.ID {
		return fail(400, "invalid")
	}
	if err := a.store.Workspaces().AddMember(ctx, &domain.Member{WorkspaceID: wsID, UserID: target.ID, Role: role, JoinedAt: time.Now()}); err != nil {
		return err
	}
	a.audit(ctx, u.ID, "member_add", target.Email+"@"+wsID, ip)
	return nil
}

func (a *App) RemoveMember(ctx context.Context, u *domain.User, wsID, userID string) error {
	w, myRole, err := a.access(ctx, u, wsID)
	if err != nil {
		return err
	}
	if userID == w.OwnerID {
		return fail(400, "invalid")
	}
	if myRole != domain.MemberOwner && userID != u.ID { // members may leave on their own
		return fail(403, "forbidden")
	}
	return a.store.Workspaces().RemoveMember(ctx, wsID, userID)
}

// access resolves a workspace the user belongs to and their role in it.
func (a *App) access(ctx context.Context, u *domain.User, wsID string) (*domain.Workspace, domain.MemberRole, error) {
	role, err := a.store.Workspaces().MemberRole(ctx, wsID, u.ID)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil, "", fail(404, "not_found")
		}
		return nil, "", err
	}
	w, err := a.store.Workspaces().ByID(ctx, wsID)
	if err != nil {
		return nil, "", fail(404, "not_found")
	}
	return w, role, nil
}

// ======================================================= sync

type SyncRequest struct {
	Cursors map[string]int64 `json:"cursors"` // workspaceId → last seq seen
	Changes []domain.Change  `json:"changes"`
}
type SyncResponse struct {
	Applied    []string           `json:"applied"`
	Changes    []domain.Change    `json:"changes"`
	Cursors    map[string]int64   `json:"cursors"`
	Workspaces []WorkspaceView    `json:"workspaces"`
	Now        int64              `json:"now"`
}

// Sync applies the client's changes to every workspace it may write to, then returns what
// it has not seen yet in every workspace it belongs to. Last-write-wins per entity.
func (a *App) Sync(ctx context.Context, u *domain.User, req SyncRequest, ip string) (*SyncResponse, error) {
	if len(req.Changes) > 5000 {
		return nil, fail(400, "bad_request")
	}
	spaces, err := a.Workspaces(ctx, u)
	if err != nil {
		return nil, err
	}
	roles := map[string]domain.MemberRole{}
	for _, w := range spaces {
		roles[w.ID] = w.Role
	}
	byWS := map[string][]domain.Change{}
	for _, c := range req.Changes {
		if roles[c.WorkspaceID].CanWrite() {
			byWS[c.WorkspaceID] = append(byWS[c.WorkspaceID], c)
		}
	}
	resp := &SyncResponse{Applied: []string{}, Changes: []domain.Change{}, Cursors: map[string]int64{}, Workspaces: spaces, Now: time.Now().UnixMilli()}
	for wsID, changes := range byWS {
		applied, err := a.store.Sync().Apply(ctx, wsID, changes)
		if err != nil {
			return nil, err
		}
		resp.Applied = append(resp.Applied, applied...)
	}
	for _, w := range spaces {
		since := req.Cursors[w.ID]
		rows, err := a.store.Sync().Since(ctx, w.ID, since, 5000)
		if err != nil {
			return nil, err
		}
		cursor := since
		for _, c := range rows {
			if c.Seq > cursor {
				cursor = c.Seq
			}
		}
		resp.Changes = append(resp.Changes, rows...)
		resp.Cursors[w.ID] = cursor
	}
	u.LastSyncAt, u.LastIP = time.Now(), ip
	_ = a.store.Users().Update(ctx, u)
	return resp, nil
}
