'use strict';
/* /api/me — profile, password, account deletion. /api/sync — item sync. */
const { Router } = require('express');
const { q, audit, transaction } = require('../db');
const sec = require('../security');
const { fail, requireUser, publicUser } = require('../http');

const me = Router();
me.use(requireUser);

me.get('/', (req, res) => res.json({ user: publicUser(req.user) }));

me.post('/', (req, res) => {
  const { name, currentPassword, newPassword } = req.body || {};
  if (typeof name === 'string' && name.trim()) q.users.setName.run(name.trim().slice(0, 80), req.user.id);
  if (newPassword !== undefined) {
    if (!sec.checkPassword(req.user, currentPassword)) return fail(res, 401, 'bad_credentials');
    const pp = sec.passwordProblem(newPassword); if (pp) return fail(res, 400, pp);
    const { salt, hash } = sec.hashPassword(newPassword);
    q.users.setPassword.run(hash, salt, req.user.id);
    audit(req.user.id, 'password_change', '', req.ip);
    const u = q.users.byId.get(req.user.id);
    return res.json({ user: publicUser(u), token: sec.userToken(u) });
  }
  res.json({ user: publicUser(q.users.byId.get(req.user.id)) });
});

me.post('/delete', (req, res) => {
  if (!sec.checkPassword(req.user, (req.body || {}).password)) return fail(res, 401, 'bad_credentials');
  if (req.user.role === 'admin') return fail(res, 400, 'is_admin'); // demote first: anjam admin remove <email>
  transaction(() => { q.items.removeUser.run(req.user.id); q.users.remove.run(req.user.id); });
  audit(req.user.id, 'account_deleted', '', req.ip);
  res.json({ ok: true });
});

/* Sync: last-write-wins per item. The client pushes items with its own updatedAt; the server keeps the newer copy,
   assigns a monotonic server_seq, and returns everything past the client's cursor. */
const ITEM_TYPES = new Set(['task', 'list', 'settings']);
const sync = Router();
sync.post('/', requireUser, (req, res) => {
  const { since = 0, changes = [] } = req.body || {};
  if (!Array.isArray(changes) || changes.length > 5000) return fail(res, 400, 'bad_request');
  const userId = req.user.id;
  const applied = [];
  transaction(() => {
    let seq = q.items.maxSeq.get(userId).s;
    for (const c of changes) {
      if (!c || typeof c.id !== 'string' || c.id.length > 64 || !ITEM_TYPES.has(c.type)) continue;
      const updatedAt = Number(c.updatedAt) || Date.now();
      const cur = q.items.get.get(userId, c.id);
      if (cur && cur.updated_at >= updatedAt) continue;
      const data = JSON.stringify(c.data ?? null);
      if (data.length > 200000) continue;
      seq += 1;
      q.items.upsert.run(userId, c.id, c.type, data, updatedAt, c.deleted ? 1 : 0, seq);
      applied.push(c.id);
    }
  });
  q.users.touchSync.run(Date.now(), req.ip || '', userId);
  const rows = q.items.since.all(userId, Number(since) || 0).map((row) => ({ id: row.id, type: row.type, data: JSON.parse(row.data), updatedAt: row.updated_at, deleted: !!row.deleted, seq: row.server_seq }));
  res.json({ applied, changes: rows, cursor: rows.length ? rows[rows.length - 1].seq : Number(since) || 0, now: Date.now() });
});

module.exports = { me, sync };
