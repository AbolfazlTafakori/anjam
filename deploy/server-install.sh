#!/usr/bin/env bash
# One-time install on the host (run as root). Isolated by design:
#  - its own system user `anjam` (no shell), its own Node 22 runtime in /opt/anjam/node
#    (the host's /usr/bin/node is untouched), its own data dir, env file, nginx vhost and zones.
set -euo pipefail
DOMAIN="${1:-anjam.abolfazltafakori.com}"
REPO="${2:-https://github.com/AbolfazlTafakori/anjam.git}"
NODE_VER="${NODE_VER:-22.20.0}"
[[ $EUID -eq 0 ]] || { echo "run as root"; exit 1; }

id -u anjam >/dev/null 2>&1 || useradd --system --home /opt/anjam --shell /usr/sbin/nologin anjam
mkdir -p /opt/anjam /var/lib/anjam /etc/anjam

# private Node runtime
if [[ ! -x /opt/anjam/node/bin/node ]]; then
  arch=$(uname -m); case $arch in x86_64) a=x64;; aarch64) a=arm64;; *) echo "unsupported arch $arch"; exit 1;; esac
  curl -fsSL "https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-linux-${a}.tar.xz" -o /tmp/node.tar.xz
  mkdir -p /opt/anjam/node && tar -xJf /tmp/node.tar.xz -C /opt/anjam/node --strip-components=1 && rm /tmp/node.tar.xz
fi
/opt/anjam/node/bin/node -v

# code
if [[ -d /opt/anjam/app/.git ]]; then git -C /opt/anjam/app pull --ff-only; else git clone --depth 1 "$REPO" /opt/anjam/app; fi
[[ -f /etc/anjam/anjam.env ]] || { sed "s#https://anjam.abolfazltafakori.com#https://$DOMAIN#" /opt/anjam/app/deploy/anjam.env.example > /etc/anjam/anjam.env; chmod 600 /etc/anjam/anjam.env; }
bash /opt/anjam/app/deploy/server-deploy.sh --no-restart

# service
install -m 644 /opt/anjam/app/deploy/anjam.service /etc/systemd/system/anjam.service
systemctl daemon-reload && systemctl enable --now anjam
sleep 1 && curl -fsS http://127.0.0.1:8787/api/health && echo

# nginx (own vhost + own zones file)
install -m 644 /opt/anjam/app/deploy/nginx-anjam-zones.conf /etc/nginx/conf.d/anjam-zones.conf
sed "s/anjam.abolfazltafakori.com/$DOMAIN/" /opt/anjam/app/deploy/nginx-anjam.conf > /etc/nginx/sites-available/anjam
ln -sf /etc/nginx/sites-available/anjam /etc/nginx/sites-enabled/anjam
nginx -t && systemctl reload nginx
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect || echo "certbot failed — run: certbot --nginx -d $DOMAIN"
echo "Anjam is live at https://$DOMAIN  (admin: https://$DOMAIN/admin)"
