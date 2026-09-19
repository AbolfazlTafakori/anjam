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
if [[ -d /opt/anjam/app/.git ]]; then git -c safe.directory=/opt/anjam/app -C /opt/anjam/app pull --ff-only; else git clone --depth 1 "$REPO" /opt/anjam/app; fi
[[ -f /etc/anjam/anjam.env ]] || { sed "s#https://anjam.abolfazltafakori.com#https://$DOMAIN#" /opt/anjam/app/deploy/anjam.env.example > /etc/anjam/anjam.env; chmod 600 /etc/anjam/anjam.env; }
# random panel path, like the other panels on this host family
grep -q '^ADMIN_PATH=' /etc/anjam/anjam.env || echo "ADMIN_PATH=panel-$(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \n')" >> /etc/anjam/anjam.env
sed -i '/^ADMIN_PATH=admin$/d' /etc/anjam/anjam.env
bash /opt/anjam/app/deploy/server-deploy.sh --no-restart

# management command + first administrator (printed once, also kept in /etc/anjam/install-result.env)
install -m 755 /opt/anjam/app/deploy/anjam /usr/local/bin/anjam
set -a; . /etc/anjam/anjam.env; set +a
mkdir -p "$ANJAM_DATA"; chown anjam:anjam "$ANJAM_DATA"
if [[ "$(/opt/anjam/node/bin/node /opt/anjam/app/server/cli.js stats | grep -o '"admins": [0-9]*' | grep -o '[0-9]*')" == "0" ]]; then
  CRED=$(ANJAM_QUIET=1 /opt/anjam/node/bin/node /opt/anjam/app/server/cli.js admin reset)
  ADMIN_USER=$(sed -n 1p <<<"$CRED"); ADMIN_PASS=$(sed -n 2p <<<"$CRED")
  printf 'PANEL_URL=https://%s/%s\nADMIN_USER=%s\nADMIN_PASS=%s\n' "$DOMAIN" "$ADMIN_PATH" "$ADMIN_USER" "$ADMIN_PASS" > /etc/anjam/install-result.env; chmod 600 /etc/anjam/install-result.env
fi
chown -R anjam:anjam "$ANJAM_DATA"

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
cat <<R

  ┌──────────────────────────────────────────────┐
  │        Anjam Installation Complete!          │
  ├──────────────────────────────────────────────┤
  │ App:      https://$DOMAIN
  │ Panel:    https://$DOMAIN/$ADMIN_PATH
  │ Username: ${ADMIN_USER:-(unchanged; see: anjam creds)}
  │ Password: ${ADMIN_PASS:-(unchanged)}
  │ Manage:   anjam   (menu)  ·  anjam admin reset
  └──────────────────────────────────────────────┘
R
