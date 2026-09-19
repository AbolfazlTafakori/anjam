'use strict';
const config = require('./config');

let transport = null;
if (config.smtpUrl) {
  try { transport = require('nodemailer').createTransport(config.smtpUrl); }
  catch { console.warn('SMTP_URL is set but nodemailer is missing — run: npm install nodemailer'); }
}

const enabled = () => !!transport;
async function send(to, subject, text) {
  if (!transport) return false;
  await transport.sendMail({ from: config.mailFrom, to, subject, text });
  return true;
}

module.exports = { enabled, send };
