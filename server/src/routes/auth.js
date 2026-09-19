'use strict';
/* /api/auth — register, login, forgot, reset */
const { Router } = require('express');
const crypto = require('crypto');
const config = require('../config');
const { q, setting, audit } = require('../db');
const sec = require('../security');
const mail = require('../mail');
const { fail, wrap, publicUser } = require('../http');

const r = Router();
const registrationMode = () => setting('registration', config.registrationDefault); // open | invite | closed

r.post('/register', (req, res) => {
  if (sec.limited(req.ip)) return fail(res, 429, 'too_many_requests');
  const { email, password, name, invite } = req.body || {};
  if (!sec.validEmail(email)) return fail(res, 400, 'invalid_email');
  const mode = registrationMode();
  if (mode === 'closed') return fail(res, 403, 'registration_closed');
  const pp = sec.passwordProblem(password); if (pp) return fail(res, 400, pp);
  if (!String(name || '').trim()) return fail(res, 400, 'name_required');
  const lower = email.toLowerCase();
  if (q.users.byEmail.get(lower)) return fail(res, 409, 'email_taken');
  let inv = null;
  if (mode === 'invite') {
    inv = typeof invite === 'string' && q.invites.get.get(invite.trim().toUpperCase());
    if (!inv || inv.used_by) return fail(res, 403, 'invite_required');
  }
  const id = crypto.randomUUID(); const { salt, hash } = sec.hashPassword(password);
  q.users.insert.run(id, lower, String(name).trim().slice(0, 80), hash, salt, Date.now(), 'user');
  if (inv) q.invites.use.run(id, Date.now(), inv.code);
  audit(id, 'register', lower, req.ip);
  const u = q.users.byId.get(id);
  res.json({ token: sec.userToken(u), user: publicUser(u) });
});

r.post('/login', (req, res) => {
  if (sec.limited(req.ip)) return fail(res, 429, 'too_many_requests');
  const { email, password } = req.body || {};
  const u = sec.validEmail(email) && q.users.byEmail.get(email.toLowerCase());
  if (!u || !sec.checkPassword(u, password)) return fail(res, 401, 'bad_credentials');
  if (u.disabled) return fail(res, 403, 'account_disabled');
  audit(u.id, 'login', '', req.ip);
  res.json({ token: sec.userToken(u), user: publicUser(u) });
});

// Never reveals whether the address exists. Mails a link when SMTP is configured; otherwise the admin issues one.
r.post('/forgot', wrap(async (req, res) => {
  if (sec.limited(req.ip, 10)) return fail(res, 429, 'too_many_requests');
  const { email } = req.body || {};
  const u = sec.validEmail(email) && q.users.byEmail.get(email.toLowerCase());
  if (!u || !mail.enabled()) return res.json({ ok: true, mailed: false });
  const token = sec.randomToken();
  q.resets.add.run(token, u.id, Date.now() + 3600e3);
  const link = `${config.publicUrl}/?reset=${token}`;
  try { await mail.send(u.email, 'Anjam — بازیابی رمز / password reset', `برای تعیین رمز جدید روی این لینک بزنید (۱ ساعت اعتبار دارد):\n${link}\n\nOpen this link to set a new password (valid for 1 hour).`); }
  catch (e) { console.error('mail failed:', e.message); }
  res.json({ ok: true, mailed: true });
}));

r.post('/reset', (req, res) => {
  if (sec.limited(req.ip, 10)) return fail(res, 429, 'too_many_requests');
  const { token, password } = req.body || {};
  const row = typeof token === 'string' && q.resets.get.get(token, Date.now());
  if (!row) return fail(res, 400, 'bad_token');
  const pp = sec.passwordProblem(password); if (pp) return fail(res, 400, pp);
  const { salt, hash } = sec.hashPassword(password);
  q.users.setPassword.run(hash, salt, row.user_id); q.resets.use.run(token);
  audit(row.user_id, 'password_reset', '', req.ip);
  const u = q.users.byId.get(row.user_id);
  res.json({ token: sec.userToken(u), user: publicUser(u) });
});

module.exports = { router: r, registrationMode };
