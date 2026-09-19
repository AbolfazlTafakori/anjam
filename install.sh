#!/usr/bin/env bash
# Anjam — one-command installer for Ubuntu 22.04+ / Debian 12+
#
#   bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/install.sh)
#
# Asks for the domain, the administrator e-mail and password, and the registration mode, then runs on its own.
# Every question is also a flag; -y takes the defaults (a generated password):
#   --domain anjam.example.com  --admin-email you@example.com  --admin-pass 'secret'  --admin-name 'Abolfazl'
#   --registration open|invite|closed   --port 8787   --repo <git url>   -y
# Re-running upgrades in place and keeps the domain, the data, the administrator and the panel path.
# Isolated by design: own system user, own Node 22 runtime in /opt/anjam/node (the host's node is untouched),
# own data dir, env file, systemd unit, nginx vhost and rate-limit zones. Nothing shared with other apps.
set -euo pipefail

REPO="https://github.com/AbolfazlTafakori/anjam.git"
NODE_VER="22.20.0"
DOMAIN="" ADMIN_EMAIL="" ADMIN_PASS="" ADMIN_NAME="" REGISTRATION="" PORT="" YES=0
while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) DOMAIN=$2; shift 2;; --admin-email) ADMIN_EMAIL=$2; shift 2;; --admin-pass) ADMIN_PASS=$2; shift 2;;
    --admin-name) ADMIN_NAME=$2; shift 2;; --registration) REGISTRATION=$2; shift 2;; --port) PORT=$2; shift 2;;
    --repo) REPO=$2; shift 2;; -y|--yes) YES=1; shift;; -h|--help) sed -n '2,13p' "$0"; exit 0;;
    *) echo "unknown option: $1"; exit 1;;
  esac
done
[[ $EUID -eq 0 ]] || { echo "Run as root:  sudo bash install.sh"; exit 1; }
command -v apt-get >/dev/null || { echo "This installer supports Ubuntu/Debian (apt)."; exit 1; }

c() { printf '\033[%sm%s\033[0m' "$1" "$2"; }
say() { echo; c 1 "$1"; echo; }
ask() { local var=$1 prompt=$2 def=${3:-}; if [[ $YES -eq 1 || -n ${!var} ]]; then [[ -n ${!var} ]] || printf -v "$var" '%s' "$def"; return; fi
  read -rp "$prompt${def:+ [$def]}: " ans; printf -v "$var" '%s' "${ans:-$def}"; }
askpw() { local var=$1 prompt=$2; if [[ $YES -eq 1 || -n ${!var} ]]; then return; fi
  while true; do read -rsp "$prompt (empty = generate): " a; echo; [[ -z $a ]] && return; read -rsp "Repeat: " b; echo; [[ $a == "$b" ]] && { printf -v "$var" '%s' "$a"; return; }; echo "  passwords differ"; done; }

ENV=/etc/anjam/anjam.env; UPGRADE=0
if [[ -f $ENV ]]; then UPGRADE=1; set -a; . "$ENV"; set +a; DOMAIN=${DOMAIN:-${PUBLIC_URL#https://}}; PORT=${PORT:-8787}; fi

say "Anjam installer"
echo "  Persian/English to-do with sync — app + admin panel + management command."
[[ $UPGRADE -eq 1 ]] && echo "  Existing install found: upgrading in place (settings and data are kept)."
echo

# ---- questions ----
IP=$(curl -fsS -4 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
ask DOMAIN "Domain for Anjam (DNS must already point to $IP)" "$DOMAIN"
[[ -n $DOMAIN ]] || { echo "A domain is required (for HTTPS)."; exit 1; }
DOMAIN=${DOMAIN#https://}; DOMAIN=${DOMAIN#http://}; DOMAIN=${DOMAIN%%/*}
ask PORT "Internal port (behind nginx, not public)" "${PORT:-8787}"
if [[ $UPGRADE -eq 0 ]]; then
  ask ADMIN_EMAIL "Administrator e-mail (also signs in to the app)" "admin@$DOMAIN"
  ask ADMIN_NAME  "Administrator display name" "Admin"
  askpw ADMIN_PASS "Administrator password"
  ask REGISTRATION "Who can sign up in the app? open / invite / closed" "invite"
fi
[[ $REGISTRATION =~ ^(open|invite|closed|)$ ]] || { echo "registration must be open, invite or closed"; exit 1; }

# ---- packages ----
say "1/6  Packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl git nginx certbot python3-certbot-nginx xz-utils rsync >/dev/null

# ---- private Node runtime ----
say "2/6  Node $NODE_VER (private copy in /opt/anjam/node)"
id -u anjam >/dev/null 2>&1 || useradd --system --home /opt/anjam --shell /usr/sbin/nologin anjam
mkdir -p /opt/anjam /var/lib/anjam /etc/anjam
if [[ ! -x /opt/anjam/node/bin/node || "$(/opt/anjam/node/bin/node -v)" != "v$NODE_VER" ]]; then
  case $(uname -m) in x86_64) a=x64;; aarch64) a=arm64;; *) echo "unsupported CPU: $(uname -m)"; exit 1;; esac
  curl -fsSL "https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-linux-${a}.tar.xz" -o /tmp/anjam-node.tar.xz
  rm -rf /opt/anjam/node && mkdir -p /opt/anjam/node && tar -xJf /tmp/anjam-node.tar.xz -C /opt/anjam/node --strip-components=1 && rm -f /tmp/anjam-node.tar.xz
fi
NODE=/opt/anjam/node/bin/node; export PATH="/opt/anjam/node/bin:$PATH"

# ---- code ----
say "3/6  Code"
git config --global --add safe.directory /opt/anjam/app >/dev/null 2>&1 || true
if [[ -d /opt/anjam/app/.git ]]; then git -C /opt/anjam/app pull --ff-only -q; else rm -rf /opt/anjam/app; git clone -q --depth 1 "$REPO" /opt/anjam/app; fi
(cd /opt/anjam/app/server && npm ci --omit=dev --no-audit --no-fund -q 2>/dev/null || npm install --omit=dev --no-audit --no-fund -q)
"$NODE" /opt/anjam/app/scripts/build-web.js >/dev/null
install -m 755 /opt/anjam/app/deploy/anjam /usr/local/bin/anjam

# ---- config ----
say "4/6  Configuration"
[[ -n ${ADMIN_PATH:-} ]] || ADMIN_PATH="panel-$(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \n')"
cat > "$ENV" <<EOF
# /etc/anjam/anjam.env — written by install.sh (edit with: anjam env)
PORT=$PORT
BIND=127.0.0.1
ANJAM_DATA=/var/lib/anjam
PUBLIC_URL=https://$DOMAIN
ADMIN_PATH=$ADMIN_PATH
REGISTRATION=${REGISTRATION:-invite}
# Optional e-mail for password-reset links:
${SMTP_URL:+SMTP_URL=$SMTP_URL}
${MAIL_FROM:+MAIL_FROM=$MAIL_FROM}
EOF
sed -i '/^$/d' "$ENV"; chmod 600 "$ENV"
set -a; . "$ENV"; set +a
if [[ $UPGRADE -eq 0 || "$($NODE /opt/anjam/app/server/cli.js stats 2>/dev/null | grep -o '"admins": [0-9]*' | grep -o '[0-9]*')" == "0" ]]; then
  ADMIN_EMAIL=${ADMIN_EMAIL:-admin@$DOMAIN}
  CRED=$(ANJAM_QUIET=1 "$NODE" /opt/anjam/app/server/cli.js admin reset "$ADMIN_EMAIL" ${ADMIN_PASS:+"$ADMIN_PASS"} 2>/dev/null)
  [[ -n $ADMIN_PASS ]] || ADMIN_PASS=$(sed -n 2p <<<"$CRED")
  "$NODE" /opt/anjam/app/server/cli.js registration "${REGISTRATION:-invite}" >/dev/null 2>&1 || true
  [[ -z $ADMIN_NAME ]] || "$NODE" -e "const {DatabaseSync}=require('node:sqlite');new DatabaseSync('/var/lib/anjam/anjam.sqlite').prepare('UPDATE users SET name=? WHERE email=?').run(process.argv[1],process.argv[2])" "$ADMIN_NAME" "$ADMIN_EMAIL" 2>/dev/null || true
  printf 'PANEL_URL=https://%s/%s\nADMIN_EMAIL=%s\nADMIN_PASS=%s\n' "$DOMAIN" "$ADMIN_PATH" "$ADMIN_EMAIL" "$ADMIN_PASS" > /etc/anjam/install-result.env; chmod 600 /etc/anjam/install-result.env
fi
chown -R anjam:anjam /opt/anjam/app /var/lib/anjam

# ---- service ----
say "5/6  Service"
install -m 644 /opt/anjam/app/deploy/anjam.service /etc/systemd/system/anjam.service
systemctl daemon-reload; systemctl enable -q anjam; systemctl restart anjam
sleep 1; curl -fsS "http://127.0.0.1:$PORT/api/health" >/dev/null && echo "  service: running"

# ---- nginx + TLS ----
say "6/6  nginx + HTTPS"
install -m 644 /opt/anjam/app/deploy/nginx-anjam-zones.conf /etc/nginx/conf.d/anjam-zones.conf
sed "s/anjam.abolfazltafakori.com/$DOMAIN/; s/127.0.0.1:8787/127.0.0.1:$PORT/g" /opt/anjam/app/deploy/nginx-anjam.conf > /etc/nginx/sites-available/anjam
ln -sf /etc/nginx/sites-available/anjam /etc/nginx/sites-enabled/anjam
nginx -t -q && systemctl reload nginx
if [[ ! -d /etc/letsencrypt/live/$DOMAIN ]]; then
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect -q || echo "  certbot failed (is DNS for $DOMAIN pointing here?). Later: certbot --nginx -d $DOMAIN"
else certbot --nginx -d "$DOMAIN" --non-interactive --redirect -q 2>/dev/null || true; fi

. /etc/anjam/install-result.env 2>/dev/null || true
echo
c 32 "  ┌────────────────────────────────────────────────────────┐"; echo
c 32 "  │              Anjam Installation Complete!              │"; echo
c 32 "  ├────────────────────────────────────────────────────────┤"; echo
echo "  │ App:       https://$DOMAIN"
echo "  │ Panel:     https://$DOMAIN/$ADMIN_PATH"
echo "  │ E-mail:    ${ADMIN_EMAIL:-(unchanged)}"
echo "  │ Password:  ${ADMIN_PASS:-(unchanged — anjam creds)}"
echo "  │ Sign-ups:  ${REGISTRATION:-$( $NODE /opt/anjam/app/server/cli.js registration | cut -d' ' -f2 )}"
echo "  │ Manage:    anjam        (menu: status, log, update, backup, admin reset, invite create …)"
c 32 "  └────────────────────────────────────────────────────────┘"; echo
echo "  The administrator e-mail/password also sign in to the app like any user."
echo "  Credentials are kept in /etc/anjam/install-result.env (root only)."
