'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const DATA_DIR = process.env.ANJAM_DATA || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const secretFile = path.join(DATA_DIR, 'secret.key');
if (!fs.existsSync(secretFile)) fs.writeFileSync(secretFile, crypto.randomBytes(48).toString('hex'), { mode: 0o600 });

const pkg = require('../package.json');

module.exports = Object.freeze({
  version: pkg.version,
  port: +process.env.PORT || 8787,
  bind: process.env.BIND || '0.0.0.0',
  dataDir: DATA_DIR,
  dbFile: path.join(DATA_DIR, 'anjam.sqlite'),
  secret: fs.readFileSync(secretFile, 'utf8').trim(),
  publicUrl: (process.env.PUBLIC_URL || '').replace(/\/+$/, ''),
  adminPath: (process.env.ADMIN_PATH || 'admin').replace(/^\/+|\/+$/g, ''),
  registrationDefault: process.env.REGISTRATION || 'invite',
  smtpUrl: process.env.SMTP_URL || '',
  mailFrom: process.env.MAIL_FROM || 'Anjam <no-reply@localhost>',
  releasesRepo: process.env.RELEASES_REPO || 'AbolfazlTafakori/anjam',
  webDir: path.resolve(__dirname, '..', '..', 'web'),
  userTokenDays: 90,
  adminTokenHours: 12,
});
