'use strict';
/* Express app assembly: middleware, API routers, static web app, panel and download pages. */
const path = require('path');
const fs = require('fs');
const express = require('express');
const config = require('./config');
const mail = require('./mail');
const releases = require('./releases');
const { fail, wrap } = require('./http');
const auth = require('./routes/auth');
const { me, sync } = require('./routes/me');
const admin = require('./routes/admin');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: '4mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  // The desktop app runs from file://, so the API is CORS-open; auth is bearer-token, never cookies.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---- public API ----
app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'anjam', version: config.version, registration: auth.registrationMode(), mail: mail.enabled() }));
app.get('/api/releases', wrap(async (_req, res) => res.json({ release: await releases.latest(), server: config.publicUrl })));
app.use('/api/auth', auth.router);
app.use('/api/me', me);
app.use('/api/sync', sync);
app.use('/api/admin', admin);
app.use('/api', (_req, res) => fail(res, 404, 'not_found'));

// ---- pages ----
if (fs.existsSync(config.webDir)) {
  const page = (name) => (_req, res) => res.sendFile(path.join(config.webDir, name));
  app.get('/' + config.adminPath, page('admin.html'));
  if (config.adminPath !== 'admin') app.get('/admin', (_req, res) => res.status(404).type('text').send('Not found'));
  app.get('/download', page('download.html'));
  app.use(express.static(config.webDir, {
    index: 'index.html', etag: true,
    setHeaders: (res, p) => res.setHeader('Cache-Control', p.endsWith('.woff2') ? 'public, max-age=31536000, immutable' : 'no-cache'),
  }));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.type === 'entity.too.large' ? 413 : 500).json({ error: 'server_error' });
});

module.exports = app;
