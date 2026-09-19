#!/usr/bin/env node
/* Anjam CLI — administrative tasks straight on the database (run on the server as root):
     anjam admin reset [username]      new administrator (or new password for an existing one), printed once
     anjam admin list | admin delete <username>
     anjam registration [open|invite|closed]
     anjam invite create [note]        one-time sign-up code   ·   anjam invite list
     anjam users                       list app users
     anjam user disable|enable|delete <email>
     anjam user reset-link <email>     24 h password-reset link for a user
     anjam backup [file]               consistent SQLite copy
     anjam stats
*/
'use strict';
const path = require('path'); const fs = require('fs'); const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const DATA_DIR = process.env.ANJAM_DATA || path.join(__dirname, 'data');
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
const ADMIN_PATH = process.env.ADMIN_PATH || 'admin';
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'anjam.sqlite'));
db.exec(`CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, pass_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at INTEGER NOT NULL, token_version INTEGER NOT NULL DEFAULT 0, last_login_at INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS invites (code TEXT PRIMARY KEY, created_at INTEGER NOT NULL, used_by TEXT, used_at INTEGER, note TEXT NOT NULL DEFAULT '');
  CREATE TABLE IF NOT EXISTS resets (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);`);
const scrypt = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const randPass = () => { const a = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'; return Array.from(crypto.randomBytes(18), (b) => a[b % a.length]).join(''); };
const [cmd, sub, ...rest] = process.argv.slice(2);
const out = (o) => console.log(typeof o === 'string' ? o : JSON.stringify(o, null, 2));
const when = (ts) => (ts ? new Date(ts).toISOString().slice(0, 16).replace('T', ' ') : '-');
const has = (t) => db.prepare(`SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table' AND name=?`).get(t).n > 0;
const regMode = () => (db.prepare("SELECT v FROM settings WHERE k = 'registration'").get() || {}).v || process.env.REGISTRATION || 'invite';

switch (`${cmd || ''} ${sub || ''}`.trim()) {
  case 'admin reset': {
    const username = rest[0] || (db.prepare('SELECT username FROM admins ORDER BY created_at LIMIT 1').get() || {}).username || 'admin_' + crypto.randomBytes(3).toString('hex');
    const password = rest[1] || randPass(); const salt = crypto.randomBytes(16).toString('hex');
    db.prepare(`INSERT INTO admins (username, pass_hash, salt, created_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(username) DO UPDATE SET pass_hash = excluded.pass_hash, salt = excluded.salt, token_version = token_version + 1`).run(username, scrypt(password, salt), salt, Date.now());
    if (process.env.ANJAM_QUIET) { console.log(`${username}\n${password}`); break; }
    console.log(`\n  Administrator\n  Username: ${username}\n  Password: ${password}\n\n  Panel:    ${PUBLIC_URL || 'https://<host>'}/${ADMIN_PATH}\n  (shown once; every session of this administrator has been signed out)\n`);
    break;
  }
  case 'admin list': out(db.prepare('SELECT username, created_at, last_login_at FROM admins').all().map((a) => `${a.username}\tcreated ${when(a.created_at)}\tlast login ${when(a.last_login_at)}`).join('\n') || '(none)'); break;
  case 'admin delete': { const r = db.prepare('DELETE FROM admins WHERE username = ?').run(rest[0] || ''); out(r.changes ? 'deleted' : 'no such admin'); break; }
  case 'registration': out(`registration: ${regMode()}`); break;
  case 'registration open': case 'registration invite': case 'registration closed':
    db.prepare("INSERT INTO settings (k, v) VALUES ('registration', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(sub); out(`registration: ${sub}`); break;
  case 'invite create': { const code = crypto.randomBytes(4).toString('hex').toUpperCase(); db.prepare('INSERT INTO invites (code, created_at, note) VALUES (?, ?, ?)').run(code, Date.now(), rest.join(' ').slice(0, 80)); out(code); break; }
  case 'invite list': out(db.prepare('SELECT * FROM invites ORDER BY created_at DESC').all().map((i) => `${i.code}\t${i.used_by ? 'used ' + when(i.used_at) : 'free'}\t${i.note}`).join('\n') || '(none)'); break;
  case 'users': out(has('users') ? db.prepare('SELECT email, name, disabled, created_at, last_sync_at FROM users ORDER BY created_at').all().map((u) => `${u.email}\t${u.name}\t${u.disabled ? 'DISABLED' : 'active'}\tjoined ${when(u.created_at)}\tsync ${when(u.last_sync_at)}`).join('\n') || '(none)' : '(none)'); break;
  case 'user disable': case 'user enable': { const r = db.prepare('UPDATE users SET disabled = ?, token_version = token_version + 1 WHERE email = ?').run(sub === 'disable' ? 1 : 0, (rest[0] || '').toLowerCase()); out(r.changes ? sub + 'd' : 'no such user'); break; }
  case 'user delete': { const u = db.prepare('SELECT id FROM users WHERE email = ?').get((rest[0] || '').toLowerCase()); if (!u) { out('no such user'); break; } db.prepare('DELETE FROM items WHERE user_id = ?').run(u.id); db.prepare('DELETE FROM users WHERE id = ?').run(u.id); out('deleted'); break; }
  case 'user reset-link': { const u = db.prepare('SELECT id FROM users WHERE email = ?').get((rest[0] || '').toLowerCase()); if (!u) { out('no such user'); break; } const token = crypto.randomBytes(24).toString('base64url'); db.prepare('INSERT INTO resets (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, u.id, Date.now() + 24 * 3600e3); out(`${PUBLIC_URL}/?reset=${token}`); break; }
  case 'backup': case `backup ${sub || ''}`.trim(): { const f = sub || path.join(process.env.ANJAM_BACKUP_DIR || DATA_DIR, `anjam-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.sqlite`); db.exec(`VACUUM INTO '${f.replace(/'/g, "''")}'`); out(f); break; }
  case 'stats': { const n = (s) => (db.prepare(s).get() || {}).n || 0; out({ users: has('users') ? n('SELECT COUNT(*) n FROM users') : 0, tasks: has('items') ? n("SELECT COUNT(*) n FROM items WHERE type='task' AND deleted=0") : 0, admins: n('SELECT COUNT(*) n FROM admins'), registration: regMode(), db: fs.statSync(path.join(DATA_DIR, 'anjam.sqlite')).size }); break; }
  default: console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].split('\n').slice(1).join('\n')); process.exitCode = cmd ? 1 : 0;
}
