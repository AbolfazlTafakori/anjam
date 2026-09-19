'use strict';
/* Passwords, tokens, validation and abuse limits. No HTTP here. */
const crypto = require('crypto');
const config = require('./config');
const { q } = require('./db');

const scrypt = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const newSalt = () => crypto.randomBytes(16).toString('hex');
const safeEq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const hashPassword = (pw) => { const salt = newSalt(); return { salt, hash: scrypt(pw, salt) }; };
const checkPassword = (user, pw) => typeof pw === 'string' && safeEq(scrypt(pw, user.salt), user.pass_hash);

const randomPassword = (len = 18) => { const a = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'; return Array.from(crypto.randomBytes(len), (b) => a[b % a.length]).join(''); };
const randomToken = (bytes = 24) => crypto.randomBytes(bytes).toString('base64url');
const inviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

// ---- signed tokens: {sub|adm, v (token_version), exp} ----
const b64u = (s) => Buffer.from(s).toString('base64url');
const sign = (payload) => `${payload}.${crypto.createHmac('sha256', config.secret).update(payload).digest('base64url')}`;
function verify(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!safeEq(sig, crypto.createHmac('sha256', config.secret).update(payload).digest('base64url'))) return null;
  try { const p = JSON.parse(Buffer.from(payload, 'base64url').toString()); return p.exp > Date.now() ? p : null; } catch { return null; }
}
const userToken = (u) => sign(b64u(JSON.stringify({ sub: u.id, v: u.token_version || 0, exp: Date.now() + config.userTokenDays * 864e5 })));
const adminToken = (u) => sign(b64u(JSON.stringify({ adm: u.id, v: u.token_version || 0, exp: Date.now() + config.adminTokenHours * 3600e3 })));
function userFromToken(token) {
  const p = verify(token); if (!p || !p.sub) return null;
  const u = q.users.byId.get(p.sub);
  return u && !u.disabled && (u.token_version || 0) === (p.v || 0) ? u : null;
}
function adminFromToken(token) {
  const p = verify(token); if (!p || !p.adm) return null;
  const u = q.users.byId.get(p.adm);
  return u && u.role === 'admin' && !u.disabled && (u.token_version || 0) === (p.v || 0) ? u : null;
}

// ---- validation ----
const validEmail = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length < 200;
const passwordProblem = (pw) => (typeof pw !== 'string' || pw.length < 8 || pw.length > 200 || !/[0-9]/.test(pw) || !/[a-zA-Z؀-ۿ]/.test(pw)) ? 'weak_password' : null;

// ---- per-IP limiter (15 min window) + exponential tarpit for admin logins ----
const hits = new Map();
function limited(key, max = 30) {
  const now = Date.now(); const rec = hits.get(key) || { n: 0, t: now };
  if (now - rec.t > 15 * 60e3) { rec.n = 0; rec.t = now; }
  rec.n += 1; hits.set(key, rec); return rec.n > max;
}
const fails = new Map();
const tarpit = (ip) => new Promise((r) => setTimeout(r, Math.min(8000, fails.get(ip) ? 500 * 2 ** (fails.get(ip) - 1) : 0)));
const noteFail = (ip) => fails.set(ip, (fails.get(ip) || 0) + 1);
const clearFail = (ip) => fails.delete(ip);
setInterval(() => { const cut = Date.now() - 30 * 60e3; for (const [k, v] of hits) if (v.t < cut) hits.delete(k); }, 10 * 60e3).unref();

module.exports = { hashPassword, checkPassword, randomPassword, randomToken, inviteCode, userToken, adminToken, userFromToken, adminFromToken, validEmail, passwordProblem, limited, tarpit, noteFail, clearFail };
