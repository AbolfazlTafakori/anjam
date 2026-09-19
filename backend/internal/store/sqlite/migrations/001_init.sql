-- Anjam schema v1: identity, workspaces, databases, items, sync sequences, invites, resets, settings, audit.
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  pass_hash     TEXT NOT NULL,
  salt          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user',
  disabled      INTEGER NOT NULL DEFAULT 0,
  token_version INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL,
  last_sync_at  INTEGER NOT NULL DEFAULT 0,
  last_ip       TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS workspaces (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  owner_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  personal   INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  seq        INTEGER NOT NULL DEFAULT 0          -- last sequence number handed out in this workspace
);

CREATE TABLE IF NOT EXISTS members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL,                    -- owner | editor | viewer
  joined_at    INTEGER NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);
CREATE INDEX IF NOT EXISTS members_user ON members(user_id);

CREATE TABLE IF NOT EXISTS databases (
  id           TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  color        TEXT NOT NULL DEFAULT '',
  icon         TEXT NOT NULL DEFAULT '',
  kind         TEXT NOT NULL DEFAULT 'tasks',
  schema       TEXT NOT NULL DEFAULT '{}',
  ord          REAL NOT NULL DEFAULT 0,
  deleted      INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL,
  seq          INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS databases_ws_seq ON databases(workspace_id, seq);

CREATE TABLE IF NOT EXISTS items (
  id           TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  database_id  TEXT NOT NULL,
  props        TEXT NOT NULL DEFAULT '{}',
  deleted      INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL,
  seq          INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS items_ws_seq ON items(workspace_id, seq);
CREATE INDEX IF NOT EXISTS items_db ON items(database_id);

CREATE TABLE IF NOT EXISTS invites (
  code       TEXT PRIMARY KEY,
  note       TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  used_by    TEXT,
  used_at    INTEGER
);

CREATE TABLE IF NOT EXISTS resets (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS audit (
  ts     INTEGER NOT NULL,
  actor  TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  ip     TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS audit_ts ON audit(ts);
