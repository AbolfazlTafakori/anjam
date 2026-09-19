#!/usr/bin/env bash
# Update the running install from git (run as root on the host). Used by deploy/push.sh.
set -euo pipefail
APP=/opt/anjam/app; NODE=/opt/anjam/node/bin
export PATH="$NODE:$PATH"
cd "$APP"
git -c safe.directory=/opt/anjam/app pull --ff-only
(cd server && npm ci --omit=dev --no-audit --no-fund 2>/dev/null || npm install --omit=dev --no-audit --no-fund)
node scripts/build-web.js
chown -R anjam:anjam "$APP" /var/lib/anjam
[[ "${1:-}" == "--no-restart" ]] || { systemctl restart anjam; sleep 1; curl -fsS http://127.0.0.1:8787/api/health && echo; }
