'use strict';
/* Server health for the panel's overview: host, runtime, memory, disk, certificate. Read-only. */
const os = require('os');
const fs = require('fs');
const { execFileSync } = require('child_process');
const config = require('./config');

function diskFree(dir) {
  try { const s = fs.statfsSync(dir); return { free: s.bavail * s.bsize, total: s.blocks * s.bsize }; } catch { return null; }
}
function certExpiry() {
  const host = config.publicUrl.replace(/^https?:\/\//, '').split('/')[0];
  if (!host) return null;
  const pem = `/etc/letsencrypt/live/${host}/cert.pem`;
  if (!fs.existsSync(pem)) return null;
  try {
    const out = execFileSync('openssl', ['x509', '-enddate', '-noout', '-in', pem], { encoding: 'utf8', timeout: 3000 });
    const d = new Date(out.split('=')[1].trim()); return isNaN(d) ? null : d.getTime();
  } catch { return null; }
}
function info() {
  return {
    version: config.version, node: process.version, platform: `${os.type()} ${os.release()} ${os.arch()}`, hostname: os.hostname(),
    uptime: Math.round(process.uptime()), osUptime: os.uptime(), load: os.loadavg().map((x) => +x.toFixed(2)), cpus: os.cpus().length,
    memory: { total: os.totalmem(), free: os.freemem(), rss: process.memoryUsage().rss },
    disk: diskFree(config.dataDir), dbBytes: fs.existsSync(config.dbFile) ? fs.statSync(config.dbFile).size : 0,
    publicUrl: config.publicUrl, adminPath: config.adminPath, certExpiresAt: certExpiry(), dataDir: config.dataDir,
  };
}
module.exports = { info };
