'use strict';
/* /api/admin — panel API. Only accounts with role 'admin' (granted by the installer / CLI) can sign in here. */
const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { q, setting, audit, transaction, backupTo } = require('../db');
const sec = require('../security');
const mail = require('../mail');
const releases = require('../releases');
const system = require('../system');
const { fail, requireAdmin, wrap } = require('../http');
const { registrationMode } = require('./auth');

const r = Router();

r.post('/login', wrap(async (req, res) => {
  if (sec.limited('admin:' + req.ip, 20)) return fail(res, 429, 'too_many_requests');
  await sec.tarpit(req.ip);
  const { email, password } = req.body || {};
  const u = sec.validEmail(email) && q.users.byEmail.get(email.toLowerCase());
  if (!u || u.role !== 'admin' || u.disabled || !sec.checkPassword(u, password)) {
    sec.noteFail(req.ip); audit('-', 'admin_login_failed', String(email || '').slice(0, 60), req.ip);
    return fail(res, 401, 'bad_credentials');
  }
  sec.clearFail(req.ip); audit(u.id, 'admin_login', '', req.ip);
  res.json({ token: sec.adminToken(u), admin: { email: u.email, name: u.name } });
}));

r.use(requireAdmin);

r.get('/me', (req, res) => res.json({ admin: { email: req.admin.email, name: req.admin.name } }));

r.post('/password', (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!sec.checkPassword(req.admin, currentPassword)) return fail(res, 401, 'bad_credentials');
  const pp = sec.passwordProblem(newPassword); if (pp) return fail(res, 400, pp);
  const { salt, hash } = sec.hashPassword(newPassword);
  q.users.setPassword.run(hash, salt, req.admin.id);
  audit(req.admin.id, 'admin_password_change', '', req.ip);
  res.json({ ok: true, token: sec.adminToken(q.users.byId.get(req.admin.id)) });
});

r.get('/overview', wrap(async (_req, res) => {
  const day = 864e5, now = Date.now();
  const perDay = Object.fromEntries(q.users.signupsPerDay.all(now - 30 * day).map((x) => [x.d, x.n]));
  const series = Array.from({ length: 30 }, (_, i) => { const d = new Date(now - (29 - i) * day).toISOString().slice(0, 10); return { d, n: perDay[d] || 0 }; });
  res.json({
    users: q.users.count.get().n, admins: q.users.countAdmins.get().n, tasks: q.items.countTasks.get().n,
    signups7: q.users.signupsSince.get(now - 7 * day).n, active7: q.users.activeSince.get(now - 7 * day).n, active1: q.users.activeSince.get(now - day).n,
    done7: q.items.doneTasksSince.get(now - 7 * day).n, signupsSeries: series,
    registration: registrationMode(), mail: mail.enabled(), system: system.info(), release: await releases.latest(), releaseStatus: releases.status(),
  });
}));

r.get('/users', (_req, res) => res.json({ users: q.users.list.all() }));

r.post('/users/:id', (req, res) => {
  const u = q.users.byId.get(req.params.id); if (!u) return fail(res, 404, 'not_found');
  const { action, value } = req.body || {};
  if (u.role === 'admin' && ['disable', 'delete', 'wipe_data'].includes(action)) return fail(res, 400, 'is_admin');
  switch (action) {
    case 'disable': q.users.setDisabled.run(1, u.id); break;
    case 'enable': q.users.setDisabled.run(0, u.id); break;
    case 'rename': q.users.setName.run(String(value || '').trim().slice(0, 80), u.id); break;
    case 'delete': transaction(() => { q.items.removeUser.run(u.id); q.users.remove.run(u.id); }); break;
    case 'wipe_data': q.items.removeUser.run(u.id); break;
    case 'reset_link': {
      const token = sec.randomToken(); q.resets.add.run(token, u.id, Date.now() + 24 * 3600e3);
      audit(req.admin.id, 'admin_reset_link', u.email, req.ip);
      return res.json({ ok: true, link: `${config.publicUrl}/?reset=${token}`, expiresIn: '24h' });
    }
    default: return fail(res, 400, 'bad_action');
  }
  audit(req.admin.id, 'admin_' + action, u.email, req.ip);
  res.json({ ok: true });
});

r.get('/settings', (_req, res) => res.json({ registration: registrationMode(), mail: mail.enabled(), publicUrl: config.publicUrl, adminPath: config.adminPath, releasesRepo: config.releasesRepo }));
r.post('/settings', (req, res) => {
  const { registration } = req.body || {};
  if (!['open', 'invite', 'closed'].includes(registration)) return fail(res, 400, 'bad_request');
  q.settings.set.run('registration', registration);
  audit(req.admin.id, 'settings_registration', registration, req.ip);
  res.json({ registration });
});

r.get('/invites', (_req, res) => res.json({ invites: q.invites.list.all() }));
r.post('/invites', (req, res) => {
  const code = sec.inviteCode();
  q.invites.add.run(code, Date.now(), String((req.body || {}).note || '').slice(0, 80));
  audit(req.admin.id, 'invite_create', code, req.ip);
  res.json({ code });
});
r.post('/invites/:code/delete', (req, res) => { q.invites.remove.run(req.params.code); res.json({ ok: true }); });

r.get('/audit', (req, res) => res.json({ audit: q.audit.list.all(Math.min(500, +req.query.limit || 150)) }));

r.get('/releases', wrap(async (_req, res) => res.json({ release: await releases.latest(), status: releases.status() })));

r.get('/backup', (req, res) => {
  const tmp = path.join(config.dataDir, `backup-${Date.now()}.sqlite`);
  backupTo(tmp);
  audit(req.admin.id, 'backup_download', '', req.ip);
  res.setHeader('Content-Disposition', `attachment; filename="anjam-backup-${new Date().toISOString().slice(0, 10)}.sqlite"`);
  res.sendFile(tmp, () => fs.unlink(tmp, () => {}));
});

module.exports = r;
