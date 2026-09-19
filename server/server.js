/* Anjam sync server — Node ≥ 22.13 (built-in node:sqlite).
   Accounts, admin panel API, invites, password reset, and last-write-wins item sync
   for the desktop, web (PWA) and future Android clients. */
'use strict';
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const express = require('express');

const PORT = +process.env.PORT || 8787;
const BIND = process.env.BIND || '0.0.0.0'; // behind nginx set BIND=127.0.0.1 so the port is never public
const DATA_DIR = process.env.ANJAM_DATA || path.join(__dirname, 'data');
const SECRET_FILE = path.join(DATA_DIR, 'secret.key');
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, ''); // e.g. https://anjam.example.com — used in reset links
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase();     // this email becomes admin on sign-up (else: the first user)
const SMTP_URL = process.env.SMTP_URL || '';                            // smtp://user:pass@host:587 — optional, enables reset e-mails
const MAIL_FROM = process.env.MAIL_FROM || 'Anjam <no-reply@localhost>';
const TOKEN_DAYS = 90;

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(48).toString('hex'), { mode: 0o600 });
const SECRET = fs.readFileSync(SECRET_FILE, 'utf8').trim();

// ---------- DB ----------
const db = new DatabaseSync(path.join(DATA_DIR, 'anjam.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
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
`);
// migrations for databases created by v1
for (const col of ['role TEXT NOT NULL DEFAULT \'user\'', 'disabled INTEGER NOT NULL DEFAULT 0', 'last_sync_at INTEGER NOT NULL DEFAULT 0', 'last_ip TEXT NOT NULL DEFAULT \'\'', 'token_version INTEGER NOT NULL DEFAULT 0']) {
  try { db.exec(`ALTER TABLE users ADD COLUMN ${col}`); } catch {}
}
const q = {
  userByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  userById: db.prepare('SELECT * FROM users WHERE id = ?'),
  insertUser: db.prepare('INSERT INTO users (id, email, name, pass_hash, salt, created_at, role) VALUES (?, ?, ?, ?, ?, ?, ?)'),
  countUsers: db.prepare('SELECT COUNT(*) AS n FROM users'),
  countAdmins: db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'"),
  allUsers: db.prepare(`SELECT u.id, u.email, u.name, u.created_at, u.role, u.disabled, u.last_sync_at, u.last_ip,
      (SELECT COUNT(*) FROM items i WHERE i.user_id = u.id AND i.type = 'task' AND i.deleted = 0) AS tasks,
      (SELECT COUNT(*) FROM items i WHERE i.user_id = u.id AND i.type = 'list' AND i.deleted = 0) AS lists
    FROM users u ORDER BY u.created_at DESC`),
  setPassword: db.prepare('UPDATE users SET pass_hash = ?, salt = ?, token_version = token_version + 1 WHERE id = ?'),
  setName: db.prepare('UPDATE users SET name = ? WHERE id = ?'),
  setDisabled: db.prepare('UPDATE users SET disabled = ?, token_version = token_version + 1 WHERE id = ?'),
  setRole: db.prepare('UPDATE users SET role = ? WHERE id = ?'),
  touchSync: db.prepare('UPDATE users SET last_sync_at = ?, last_ip = ? WHERE id = ?'),
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),
  deleteItems: db.prepare('DELETE FROM items WHERE user_id = ?'),
  getItem: db.prepare('SELECT updated_at FROM items WHERE user_id = ? AND id = ?'),
  upsert: db.prepare(`INSERT INTO items (user_id, id, type, data, updated_at, deleted, server_seq) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, id) DO UPDATE SET type = excluded.type, data = excluded.data, updated_at = excluded.updated_at, deleted = excluded.deleted, server_seq = excluded.server_seq`),
  since: db.prepare('SELECT id, type, data, updated_at, deleted, server_seq FROM items WHERE user_id = ? AND server_seq > ? ORDER BY server_seq LIMIT 5000'),
  maxSeq: db.prepare('SELECT COALESCE(MAX(server_seq), 0) AS s FROM items WHERE user_id = ?'),
  countItems: db.prepare("SELECT COUNT(*) AS n FROM items WHERE deleted = 0 AND type = 'task'"),
  signups7: db.prepare('SELECT COUNT(*) AS n FROM users WHERE created_at > ?'),
  active7: db.prepare('SELECT COUNT(*) AS n FROM users WHERE last_sync_at > ?'),
  getSetting: db.prepare('SELECT v FROM settings WHERE k = ?'),
  setSetting: db.prepare('INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v'),
  invites: db.prepare('SELECT * FROM invites ORDER BY created_at DESC LIMIT 200'),
  invite: db.prepare('SELECT * FROM invites WHERE code = ?'),
  addInvite: db.prepare('INSERT INTO invites (code, created_at, note) VALUES (?, ?, ?)'),
  useInvite: db.prepare('UPDATE invites SET used_by = ?, used_at = ? WHERE code = ?'),
  delInvite: db.prepare('DELETE FROM invites WHERE code = ?'),
  addReset: db.prepare('INSERT INTO resets (token, user_id, expires_at) VALUES (?, ?, ?)'),
  getReset: db.prepare('SELECT * FROM resets WHERE token = ? AND used = 0 AND expires_at > ?'),
  useReset: db.prepare('UPDATE resets SET used = 1 WHERE token = ?'),
  audit: db.prepare('INSERT INTO audit (ts, actor, action, target, ip) VALUES (?, ?, ?, ?, ?)'),
  auditList: db.prepare('SELECT * FROM audit ORDER BY ts DESC LIMIT 100'),
};
// Make sure there is always an admin: ADMIN_EMAIL if set, else the oldest account.
if (ADMIN_EMAIL && q.userByEmail.get(ADMIN_EMAIL)) q.setRole.run('admin', q.userByEmail.get(ADMIN_EMAIL).id);
if (q.countAdmins.get().n === 0) { const first = db.prepare('SELECT id FROM users ORDER BY created_at LIMIT 1').get(); if (first) q.setRole.run('admin', first.id); }
const setting = (k, dflt) => { const r = q.getSetting.get(k); return r ? r.v : dflt; };
const registration = () => setting('registration', process.env.ALLOW_REGISTER === '0' ? 'closed' : 'open'); // open | invite | closed
const audit = (actor, action, target, ip) => q.audit.run(Date.now(), actor, action, target || '', ip || '');

// ---------- auth helpers ----------
const scrypt = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const b64u = (b) => Buffer.from(b).toString('base64url');
const safeEq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
function signToken(u) {
  const payload = b64u(JSON.stringify({ sub: u.id, v: u.token_version || 0, exp: Date.now() + TOKEN_DAYS * 864e5 }));
  return `${payload}.${crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')}`;
}
function userFromToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!safeEq(sig, crypto.createHmac('sha256', SECRET).update(payload).digest('base64url'))) return null;
  try {
    const p = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (p.exp < Date.now()) return null;
    const u = q.userById.get(p.sub);
    return u && !u.disabled && (u.token_version || 0) === (p.v || 0) ? u : null;
  } catch { return null; }
}
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, created_at: u.created_at });
const validEmail = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length < 200;
const passwordProblem = (p) => typeof p !== 'string' ? 'weak_password' : p.length < 8 ? 'weak_password' : p.length > 200 ? 'weak_password' : !/[0-9]/.test(p) || !/[a-zA-Z؀-ۿ]/.test(p) ? 'weak_password' : null;

const hits = new Map();
function limited(ip, max = 30) {
  const now = Date.now(); const rec = hits.get(ip) || { n: 0, t: now };
  if (now - rec.t > 15 * 60e3) { rec.n = 0; rec.t = now; }
  rec.n += 1; hits.set(ip, rec); return rec.n > max;
}

// ---------- optional e-mail ----------
let mailer = null;
if (SMTP_URL) { try { mailer = require('nodemailer').createTransport(SMTP_URL); } catch { console.warn('SMTP_URL set but nodemailer is not installed: npm i nodemailer'); } }
async function sendMail(to, subject, text) { if (!mailer) return false; await mailer.sendMail({ from: MAIL_FROM, to, subject, text }); return true; }

// ---------- app ----------
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: '4mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
const fail = (res, code, error) => res.status(code).json({ error });

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'anjam', version: 2, registration: registration(), mail: !!mailer, users: q.countUsers.get().n }));

// ---------- auth ----------
app.post('/api/auth/register', (req, res) => {
  if (limited(req.ip)) return fail(res, 429, 'too_many_requests');
  const mode = registration();
  const { email, password, name, invite } = req.body || {};
  if (mode === 'closed') return fail(res, 403, 'registration_closed');
  if (!validEmail(email)) return fail(res, 400, 'invalid_email');
  const pp = passwordProblem(password); if (pp) return fail(res, 400, pp);
  if (!String(name || '').trim()) return fail(res, 400, 'name_required');
  const lower = email.toLowerCase();
  if (q.userByEmail.get(lower)) return fail(res, 409, 'email_taken');
  let inv = null;
  if (mode === 'invite') { inv = typeof invite === 'string' && q.invite.get(invite.trim().toUpperCase()); if (!inv || inv.used_by) return fail(res, 403, 'invite_required'); }
  const id = crypto.randomUUID(); const salt = crypto.randomBytes(16).toString('hex');
  const role = (ADMIN_EMAIL && lower === ADMIN_EMAIL) || q.countUsers.get().n === 0 ? 'admin' : 'user';
  q.insertUser.run(id, lower, String(name).trim().slice(0, 80), scrypt(password, salt), salt, Date.now(), role);
  if (inv) q.useInvite.run(id, Date.now(), inv.code);
  audit(id, 'register', lower, req.ip);
  const u = q.userById.get(id);
  res.json({ token: signToken(u), user: publicUser(u) });
});

app.post('/api/auth/login', (req, res) => {
  if (limited(req.ip)) return fail(res, 429, 'too_many_requests');
  const { email, password } = req.body || {};
  const u = validEmail(email) && q.userByEmail.get(email.toLowerCase());
  if (!u || typeof password !== 'string' || !safeEq(scrypt(password, u.salt), u.pass_hash)) return fail(res, 401, 'bad_credentials');
  if (u.disabled) return fail(res, 403, 'account_disabled');
  audit(u.id, 'login', '', req.ip);
  res.json({ token: signToken(u), user: publicUser(u) });
});

// Forgot password: with SMTP the link is e-mailed; without it the admin creates the link from the panel.
app.post('/api/auth/forgot', async (req, res) => {
  if (limited(req.ip, 10)) return fail(res, 429, 'too_many_requests');
  const { email } = req.body || {};
  const u = validEmail(email) && q.userByEmail.get(email.toLowerCase());
  if (!u || !mailer) return res.json({ ok: true, mailed: false }); // never reveal whether the e-mail exists
  const token = crypto.randomBytes(24).toString('base64url');
  q.addReset.run(token, u.id, Date.now() + 60 * 60e3);
  const link = `${PUBLIC_URL || ''}/?reset=${token}`;
  try { await sendMail(u.email, 'Anjam — بازیابی رمز / password reset', `برای تعیین رمز جدید روی این لینک بزنید (۱ ساعت اعتبار دارد):\n${link}\n\nOpen this link to set a new password (valid for 1 hour).`); } catch (e) { console.error(e); }
  res.json({ ok: true, mailed: true });
});
app.post('/api/auth/reset', (req, res) => {
  if (limited(req.ip, 10)) return fail(res, 429, 'too_many_requests');
  const { token, password } = req.body || {};
  const r = typeof token === 'string' && q.getReset.get(token, Date.now());
  if (!r) return fail(res, 400, 'bad_token');
  const pp = passwordProblem(password); if (pp) return fail(res, 400, pp);
  const salt = crypto.randomBytes(16).toString('hex');
  q.setPassword.run(scrypt(password, salt), salt, r.user_id); q.useReset.run(token);
  audit(r.user_id, 'password_reset', '', req.ip);
  const u = q.userById.get(r.user_id);
  res.json({ token: signToken(u), user: publicUser(u) });
});

function auth(req, res, next) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  const u = m && userFromToken(m[1]);
  if (!u) return fail(res, 401, 'unauthorized');
  req.user = u; next();
}
app.get('/api/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));
app.post('/api/me', auth, (req, res) => {
  const { name, currentPassword, newPassword } = req.body || {};
  if (typeof name === 'string' && name.trim()) q.setName.run(name.trim().slice(0, 80), req.user.id);
  if (newPassword !== undefined) {
    if (typeof currentPassword !== 'string' || !safeEq(scrypt(currentPassword, req.user.salt), req.user.pass_hash)) return fail(res, 401, 'bad_credentials');
    const pp = passwordProblem(newPassword); if (pp) return fail(res, 400, pp);
    const salt = crypto.randomBytes(16).toString('hex'); q.setPassword.run(scrypt(newPassword, salt), salt, req.user.id);
    audit(req.user.id, 'password_change', '', req.ip);
    const u = q.userById.get(req.user.id); return res.json({ user: publicUser(u), token: signToken(u) });
  }
  res.json({ user: publicUser(q.userById.get(req.user.id)) });
});
app.post('/api/me/delete', auth, (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !safeEq(scrypt(password, req.user.salt), req.user.pass_hash)) return fail(res, 401, 'bad_credentials');
  if (req.user.role === 'admin' && q.countAdmins.get().n <= 1) return fail(res, 400, 'last_admin');
  q.deleteItems.run(req.user.id); q.deleteUser.run(req.user.id); audit(req.user.id, 'account_deleted', '', req.ip);
  res.json({ ok: true });
});

// ---------- sync ----------
const ITEM_TYPES = new Set(['task', 'list', 'settings']);
app.post('/api/sync', auth, (req, res) => {
  const { since = 0, changes = [] } = req.body || {};
  if (!Array.isArray(changes) || changes.length > 5000) return fail(res, 400, 'bad_request');
  let seq = q.maxSeq.get(req.user.id).s; const applied = [];
  db.exec('BEGIN');
  try {
    for (const c of changes) {
      if (!c || typeof c.id !== 'string' || c.id.length > 64 || !ITEM_TYPES.has(c.type)) continue;
      const updatedAt = Number(c.updatedAt) || Date.now();
      const cur = q.getItem.get(req.user.id, c.id);
      if (cur && cur.updated_at >= updatedAt) continue;
      const data = JSON.stringify(c.data ?? null); if (data.length > 200000) continue;
      seq += 1; q.upsert.run(req.user.id, c.id, c.type, data, updatedAt, c.deleted ? 1 : 0, seq); applied.push(c.id);
    }
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  q.touchSync.run(Date.now(), req.ip || '', req.user.id);
  const rows = q.since.all(req.user.id, Number(since) || 0).map((r) => ({ id: r.id, type: r.type, data: JSON.parse(r.data), updatedAt: r.updated_at, deleted: !!r.deleted, seq: r.server_seq }));
  res.json({ applied, changes: rows, cursor: rows.length ? rows[rows.length - 1].seq : Number(since) || 0, now: Date.now() });
});

// ---------- admin ----------
const admin = [auth, (req, res, next) => (req.user.role === 'admin' ? next() : fail(res, 403, 'forbidden'))];
app.get('/api/admin/overview', admin, (_req, res) => {
  const week = Date.now() - 7 * 864e5;
  res.json({ users: q.countUsers.get().n, admins: q.countAdmins.get().n, tasks: q.countItems.get().n, signups7: q.signups7.get(week).n, active7: q.active7.get(week).n,
    registration: registration(), mail: !!mailer, publicUrl: PUBLIC_URL, dbBytes: fs.statSync(path.join(DATA_DIR, 'anjam.sqlite')).size, uptime: Math.round(process.uptime()) });
});
app.get('/api/admin/users', admin, (_req, res) => res.json({ users: q.allUsers.all() }));
app.post('/api/admin/users/:id', admin, (req, res) => {
  const u = q.userById.get(req.params.id); if (!u) return fail(res, 404, 'not_found');
  const { action, value } = req.body || {};
  const self = u.id === req.user.id;
  switch (action) {
    case 'disable': if (self) return fail(res, 400, 'cannot_self'); q.setDisabled.run(1, u.id); break;
    case 'enable': q.setDisabled.run(0, u.id); break;
    case 'make_admin': q.setRole.run('admin', u.id); break;
    case 'remove_admin': if (self && q.countAdmins.get().n <= 1) return fail(res, 400, 'last_admin'); q.setRole.run('user', u.id); break;
    case 'rename': q.setName.run(String(value || '').trim().slice(0, 80), u.id); break;
    case 'delete': if (self) return fail(res, 400, 'cannot_self'); q.deleteItems.run(u.id); q.deleteUser.run(u.id); break;
    case 'reset_link': { const token = crypto.randomBytes(24).toString('base64url'); q.addReset.run(token, u.id, Date.now() + 24 * 60 * 60e3); audit(req.user.id, 'admin_' + action, u.email, req.ip); return res.json({ ok: true, link: `${PUBLIC_URL || ''}/?reset=${token}`, expiresIn: '24h' }); }
    case 'wipe_data': q.deleteItems.run(u.id); break;
    default: return fail(res, 400, 'bad_action');
  }
  audit(req.user.id, 'admin_' + action, u.email, req.ip);
  res.json({ ok: true });
});
app.get('/api/admin/settings', admin, (_req, res) => res.json({ registration: registration() }));
app.post('/api/admin/settings', admin, (req, res) => {
  const { registration: r } = req.body || {};
  if (!['open', 'invite', 'closed'].includes(r)) return fail(res, 400, 'bad_request');
  q.setSetting.run('registration', r); audit(req.user.id, 'settings_registration', r, req.ip);
  res.json({ registration: r });
});
app.get('/api/admin/invites', admin, (_req, res) => res.json({ invites: q.invites.all() }));
app.post('/api/admin/invites', admin, (req, res) => {
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  q.addInvite.run(code, Date.now(), String((req.body || {}).note || '').slice(0, 80)); audit(req.user.id, 'invite_create', code, req.ip);
  res.json({ code });
});
app.post('/api/admin/invites/:code/delete', admin, (req, res) => { q.delInvite.run(req.params.code); res.json({ ok: true }); });
app.get('/api/admin/audit', admin, (_req, res) => res.json({ audit: q.auditList.all() }));
app.get('/api/admin/backup', admin, (_req, res) => {
  const tmp = path.join(DATA_DIR, `backup-${Date.now()}.sqlite`);
  db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}'`);
  res.setHeader('Content-Disposition', `attachment; filename="anjam-backup-${new Date().toISOString().slice(0, 10)}.sqlite"`);
  res.sendFile(tmp, () => fs.unlink(tmp, () => {}));
});

// ---------- static web app (PWA) + admin page ----------
const WEB_DIR = path.join(__dirname, '..', 'web');
if (fs.existsSync(WEB_DIR)) {
  app.get('/admin', (_req, res) => res.sendFile(path.join(WEB_DIR, 'admin.html')));
  // Everything revalidates (ETag) so updates land on the next load; only the font is cached long-term.
  app.use(express.static(WEB_DIR, { index: 'index.html', etag: true, setHeaders: (res, p) => { res.setHeader('Cache-Control', p.endsWith('.woff2') ? 'public, max-age=31536000, immutable' : 'no-cache'); } }));
}
app.use('/api', (_req, res) => fail(res, 404, 'not_found'));
app.use((err, _req, res, _next) => { console.error(err); res.status(err.type === 'entity.too.large' ? 413 : 500).json({ error: 'server_error' }); });

http.createServer(app).listen(PORT, BIND, () => console.log(`Anjam server on http://${BIND}:${PORT}  data=${DATA_DIR}  registration=${registration()}  mail=${!!mailer}`));
