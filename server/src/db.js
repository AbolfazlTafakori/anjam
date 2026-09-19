'use strict';
/* SQLite (node:sqlite, WAL) — schema, migrations and every prepared statement in one place.
   Nothing else in the server talks SQL. Swapping to Postgres means reimplementing this module only. */
const { DatabaseSync } = require('node:sqlite');
const config = require('./config');

const db = new DatabaseSync(config.dbFile);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL DEFAULT '',
    pass_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at INTEGER NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', disabled INTEGER NOT NULL DEFAULT 0,
    last_sync_at INTEGER NOT NULL DEFAULT 0, last_ip TEXT NOT NULL DEFAULT '', token_version INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS items (
    user_id TEXT NOT NULL, id TEXT NOT NULL, type TEXT NOT NULL,
    data TEXT NOT NULL, updated_at INTEGER NOT NULL, deleted INTEGER NOT NULL DEFAULT 0,
    server_seq INTEGER NOT NULL, PRIMARY KEY (user_id, id)
  );
  CREATE INDEX IF NOT EXISTS items_user_seq ON items(user_id, server_seq);
  CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS invites (code TEXT PRIMARY KEY, created_at INTEGER NOT NULL, used_by TEXT, used_at INTEGER, note TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS resets (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS audit (ts INTEGER NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, target TEXT NOT NULL DEFAULT '', ip TEXT NOT NULL DEFAULT '');
  CREATE INDEX IF NOT EXISTS audit_ts ON audit(ts);
`);
// migrations for databases created by earlier versions
for (const col of ["role TEXT NOT NULL DEFAULT 'user'", 'disabled INTEGER NOT NULL DEFAULT 0', 'last_sync_at INTEGER NOT NULL DEFAULT 0', "last_ip TEXT NOT NULL DEFAULT ''", 'token_version INTEGER NOT NULL DEFAULT 0']) {
  try { db.exec(`ALTER TABLE users ADD COLUMN ${col}`); } catch { /* exists */ }
}
db.exec('DROP TABLE IF EXISTS admins');

const p = (sql) => db.prepare(sql);
const q = {
  users: {
    byEmail: p('SELECT * FROM users WHERE email = ?'),
    byId: p('SELECT * FROM users WHERE id = ?'),
    insert: p('INSERT INTO users (id, email, name, pass_hash, salt, created_at, role) VALUES (?, ?, ?, ?, ?, ?, ?)'),
    count: p('SELECT COUNT(*) AS n FROM users'),
    countAdmins: p("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'"),
    list: p(`SELECT u.id, u.email, u.name, u.created_at, u.role, u.disabled, u.last_sync_at, u.last_ip,
      (SELECT COUNT(*) FROM items i WHERE i.user_id = u.id AND i.type = 'task' AND i.deleted = 0) AS tasks,
      (SELECT COUNT(*) FROM items i WHERE i.user_id = u.id AND i.type = 'list' AND i.deleted = 0) AS lists
      FROM users u ORDER BY u.created_at DESC`),
    setPassword: p('UPDATE users SET pass_hash = ?, salt = ?, token_version = token_version + 1 WHERE id = ?'),
    setName: p('UPDATE users SET name = ? WHERE id = ?'),
    setDisabled: p('UPDATE users SET disabled = ?, token_version = token_version + 1 WHERE id = ?'),
    setRole: p('UPDATE users SET role = ?, token_version = token_version + 1 WHERE id = ?'),
    touchSync: p('UPDATE users SET last_sync_at = ?, last_ip = ? WHERE id = ?'),
    remove: p('DELETE FROM users WHERE id = ?'),
    signupsSince: p('SELECT COUNT(*) AS n FROM users WHERE created_at > ?'),
    activeSince: p('SELECT COUNT(*) AS n FROM users WHERE last_sync_at > ?'),
    signupsPerDay: p("SELECT date(created_at / 1000, 'unixepoch') AS d, COUNT(*) AS n FROM users WHERE created_at > ? GROUP BY d"),
  },
  items: {
    get: p('SELECT updated_at FROM items WHERE user_id = ? AND id = ?'),
    upsert: p(`INSERT INTO items (user_id, id, type, data, updated_at, deleted, server_seq) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, id) DO UPDATE SET type = excluded.type, data = excluded.data, updated_at = excluded.updated_at, deleted = excluded.deleted, server_seq = excluded.server_seq`),
    since: p('SELECT id, type, data, updated_at, deleted, server_seq FROM items WHERE user_id = ? AND server_seq > ? ORDER BY server_seq LIMIT 5000'),
    maxSeq: p('SELECT COALESCE(MAX(server_seq), 0) AS s FROM items WHERE user_id = ?'),
    removeUser: p('DELETE FROM items WHERE user_id = ?'),
    countTasks: p("SELECT COUNT(*) AS n FROM items WHERE deleted = 0 AND type = 'task'"),
    doneTasksSince: p("SELECT COUNT(*) AS n FROM items WHERE type = 'task' AND deleted = 0 AND json_extract(data, '$.done') = 1 AND json_extract(data, '$.completedAt') > ?"),
  },
  settings: {
    get: p('SELECT v FROM settings WHERE k = ?'),
    set: p('INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v'),
  },
  invites: {
    list: p('SELECT * FROM invites ORDER BY created_at DESC LIMIT 200'),
    get: p('SELECT * FROM invites WHERE code = ?'),
    add: p('INSERT INTO invites (code, created_at, note) VALUES (?, ?, ?)'),
    use: p('UPDATE invites SET used_by = ?, used_at = ? WHERE code = ?'),
    remove: p('DELETE FROM invites WHERE code = ?'),
  },
  resets: {
    add: p('INSERT INTO resets (token, user_id, expires_at) VALUES (?, ?, ?)'),
    get: p('SELECT * FROM resets WHERE token = ? AND used = 0 AND expires_at > ?'),
    use: p('UPDATE resets SET used = 1 WHERE token = ?'),
  },
  audit: {
    add: p('INSERT INTO audit (ts, actor, action, target, ip) VALUES (?, ?, ?, ?, ?)'),
    list: p('SELECT * FROM audit ORDER BY ts DESC LIMIT ?'),
  },
};

const setting = (k, dflt) => { const r = q.settings.get.get(k); return r ? r.v : dflt; };
const audit = (actor, action, target = '', ip = '') => q.audit.add.run(Date.now(), String(actor), action, String(target), String(ip));
const transaction = (fn) => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { db.exec('ROLLBACK'); throw e; } };
const backupTo = (file) => db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);

module.exports = { db, q, setting, audit, transaction, backupTo };
