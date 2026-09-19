#!/usr/bin/env bash
# From the dev machine: push to GitHub, then update the server.   usage: bash deploy/push.sh [ssh-host]
set -euo pipefail
HOST="${1:-wui}"
git push origin main
ssh "$HOST" 'bash /opt/anjam/app/deploy/server-deploy.sh'
