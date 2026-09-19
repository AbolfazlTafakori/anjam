'use strict';
/* Small HTTP helpers shared by every route module. */
const { userFromToken, adminFromToken } = require('./security');

const fail = (res, status, error, extra) => res.status(status).json({ error, ...extra });
const bearer = (req) => (/^Bearer (.+)$/.exec(req.headers.authorization || '') || [])[1];

/** Requires a valid app-user token → req.user */
function requireUser(req, res, next) {
  const u = userFromToken(bearer(req));
  if (!u) return fail(res, 401, 'unauthorized');
  req.user = u; next();
}
/** Requires a valid admin token → req.admin */
function requireAdmin(req, res, next) {
  const a = adminFromToken(bearer(req));
  if (!a) return fail(res, 401, 'unauthorized');
  req.admin = a; next();
}
/** Wraps async handlers so rejections reach the error middleware. */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, created_at: u.created_at });

module.exports = { fail, requireUser, requireAdmin, wrap, publicUser };
