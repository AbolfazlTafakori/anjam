#!/usr/bin/env bash
# Anjam — one-command installer for Ubuntu 22.04+ / Debian 12+
#
#   bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/install.sh)
#
# Asks for the domain, the administrator e-mail and password, and the registration mode, then runs on its own.
# Every question is also a flag; -y takes the defaults (a generated password):
#   --domain anjam.example.com  --admin-email you@example.com  --admin-pass 'secret'  --admin-name 'Abolfazl'
#   --registration open|invite|closed   --port 8787   --version v1.3.0   -y
# Re-running upgrades in place and keeps the domain, the data, the administrator and the panel path.
# What it installs: one static Go binary + the web bundle from GitHub Releases, its own system user,
# data dir, env file, hardened systemd unit, nginx vhost with its own rate-limit zones, Let's Encrypt.
# Nothing is shared with other apps on the host — no runtime, no global packages.
# Isolation rules: never upgrades or restarts a package that is already installed (nginx keeps serving other sites),
# refuses a port or domain that something else already uses, only ever writes files named anjam*, never edits
# another vhost (certbot runs in certonly mode; the TLS block lives in our own file), and if our vhost would break
# `nginx -t` it is removed again before anything is reloaded.
set -euo pipefail

REPO="AbolfazlTafakori/anjam"
DOMAIN="" ADMIN_EMAIL="" ADMIN_PASS="" ADMIN_NAME="" REGISTRATION="" PORT="" TAG="latest" YES=0
while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) DOMAIN=$2; shift 2;; --admin-email) ADMIN_EMAIL=$2; shift 2;; --admin-pass) ADMIN_PASS=$2; shift 2;;
    --admin-name) ADMIN_NAME=$2; shift 2;; --registration) REGISTRATION=$2; shift 2;; --port) PORT=$2; shift 2;;
    --version) TAG=$2; shift 2;; --repo) REPO=$2; shift 2;; -y|--yes) YES=1; shift;; -h|--help) sed -n '2,14p' "$0"; exit 0;;
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
echo "  Persian/English to-do with sync, shared spaces, admin panel and management command."
[[ $UPGRADE -eq 1 ]] && echo "  Existing install found: upgrading in place (settings and data are kept)."
echo

IP=$(curl -fsS -4 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
ask DOMAIN "Domain for Anjam (DNS must already point to $IP)" "$DOMAIN"
[[ -n $DOMAIN ]] || { echo "A domain is required (for HTTPS)."; exit 1; }
DOMAIN=${DOMAIN#https://}; DOMAIN=${DOMAIN#http://}; DOMAIN=${DOMAIN%%/*}
ask PORT "Internal port (behind nginx, not public)" "${PORT:-8787}"
# Refuse a port that another program already listens on (our own service may hold it on an upgrade).
holder=$(ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -o 'users:(("[^"]*"' | head -1 | cut -d'"' -f2 || true)
if [[ -n $holder && $holder != anjam ]]; then echo "Port $PORT is already used by '$holder'. Pick another with --port."; exit 1; fi
# Refuse a domain that another enabled nginx site already answers for.
other=$(grep -lsE "^\s*server_name\s+.*$DOMAIN" /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf 2>/dev/null | grep -v '/anjam' || true)
if [[ -n $other ]]; then echo "$DOMAIN is already served by: $other. Anjam will not touch it — choose another domain."; exit 1; fi
if [[ $UPGRADE -eq 0 ]]; then
  ask ADMIN_EMAIL "Administrator e-mail (also signs in to the app)" "admin@$DOMAIN"
  ask ADMIN_NAME  "Administrator display name" "Admin"
  askpw ADMIN_PASS "Administrator password"
  ask REGISTRATION "Who can sign up in the app? open / invite / closed" "invite"
fi
[[ $REGISTRATION =~ ^(open|invite|closed|)$ ]] || { echo "registration must be open, invite or closed"; exit 1; }

say "1/5  Packages"
export DEBIAN_FRONTEND=noninteractive
# Install only what is missing; an already-installed nginx/certbot is never upgraded or restarted here.
missing=(); for pkg in curl nginx certbot; do dpkg -s "$pkg" >/dev/null 2>&1 || missing+=("$pkg"); done
if ((${#missing[@]})); then apt-get update -qq; apt-get install -y -qq --no-upgrade "${missing[@]}" >/dev/null; echo "  installed: ${missing[*]}"; else echo "  nginx, certbot, curl: already present (left untouched)"; fi
systemctl is-active -q nginx || systemctl start nginx

say "2/5  Anjam ($TAG)"
id -u anjam >/dev/null 2>&1 || useradd --system --home /opt/anjam --shell /usr/sbin/nologin anjam
mkdir -p /opt/anjam/bin /opt/anjam/deploy /var/lib/anjam /etc/anjam
RAW="https://raw.githubusercontent.com/$REPO/main"
for f in anjam anjam.service nginx-anjam.conf nginx-anjam-zones.conf fetch-release.sh anjam.env.example; do curl -fsSL "$RAW/deploy/$f" -o "/opt/anjam/deploy/$f"; done
REPO="$REPO" bash /opt/anjam/deploy/fetch-release.sh "$TAG"
install -m 755 /opt/anjam/deploy/anjam /usr/local/bin/anjam

say "3/5  Configuration"
[[ -n ${ADMIN_PATH:-} ]] || ADMIN_PATH="panel-$(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \n')"
cat > "$ENV" <<EOF
# /etc/anjam/anjam.env — written by install.sh (edit with: anjam env)
PORT=$PORT
BIND=127.0.0.1
ANJAM_DATA=/var/lib/anjam
ANJAM_WEB=/opt/anjam/web
PUBLIC_URL=https://$DOMAIN
ADMIN_PATH=$ADMIN_PATH
REGISTRATION=${REGISTRATION:-invite}
${SMTP_URL:+SMTP_URL=$SMTP_URL}
${MAIL_FROM:+MAIL_FROM=$MAIL_FROM}
EOF
sed -i '/^$/d' "$ENV"; chmod 600 "$ENV"
set -a; . "$ENV"; set +a
chown -R anjam:anjam /var/lib/anjam
admins=$(/opt/anjam/bin/anjam stats 2>/dev/null | grep -o '"admins": [0-9]*' | grep -o '[0-9]*' || echo 0)
if [[ $UPGRADE -eq 0 || "$admins" == "0" ]]; then
  ADMIN_EMAIL=${ADMIN_EMAIL:-admin@$DOMAIN}
  CRED=$(ANJAM_QUIET=1 /opt/anjam/bin/anjam admin reset "$ADMIN_EMAIL" "${ADMIN_PASS:-}" "${ADMIN_NAME:-Admin}" 2>/dev/null)
  [[ -n $ADMIN_PASS ]] || ADMIN_PASS=$(sed -n 2p <<<"$CRED")
  /opt/anjam/bin/anjam registration "${REGISTRATION:-invite}" >/dev/null 2>&1 || true
  printf 'PANEL_URL=https://%s/%s\nADMIN_EMAIL=%s\nADMIN_PASS=%s\n' "$DOMAIN" "$ADMIN_PATH" "$ADMIN_EMAIL" "$ADMIN_PASS" > /etc/anjam/install-result.env; chmod 600 /etc/anjam/install-result.env
fi
chown -R anjam:anjam /var/lib/anjam

say "4/5  Service"
install -m 644 /opt/anjam/deploy/anjam.service /etc/systemd/system/anjam.service
systemctl daemon-reload; systemctl enable -q anjam; systemctl restart anjam
sleep 1; curl -fsS "http://127.0.0.1:$PORT/api/health" >/dev/null && echo "  service: running"

say "5/5  nginx + HTTPS"
# Everything nginx-related lives in three files of our own: conf.d/anjam-zones.conf, sites-available/anjam and its
# symlink. nginx is only ever *reloaded* (graceful, other sites keep serving), and only after `nginx -t` passes
# with our files in place — otherwise they are withdrawn so nothing else on the host is affected.
SITE=/etc/nginx/sites-available/anjam
nginx_apply() {
  local tls=$1
  install -m 644 /opt/anjam/deploy/nginx-anjam-zones.conf /etc/nginx/conf.d/anjam-zones.conf
  sed "s/anjam.abolfazltafakori.com/$DOMAIN/g; s/127.0.0.1:8787/127.0.0.1:$PORT/g" /opt/anjam/deploy/nginx-anjam.conf > "$SITE"
  # ACME answers come from our own webroot, so certbot never has to edit nginx.
  sed -i 's|    location /api/auth/ {|    location /.well-known/acme-challenge/ { root /var/lib/anjam/acme; }\n    location /api/auth/ {|' "$SITE"
  if [[ $tls -eq 1 ]]; then
    # Serve on 443 with the certificate, and redirect plain http for our host name only.
    sed -i "/^    listen 80;$/d; /^    listen \[::\]:80;$/d" "$SITE"
    sed -i "s|^    server_name $DOMAIN;$|    server_name $DOMAIN;\n    listen 443 ssl;\n    listen [::]:443 ssl;\n    http2 on;\n    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;\n    ssl_session_timeout 1d; ssl_session_cache shared:anjam_ssl:2m; ssl_session_tickets off;\n    ssl_protocols TLSv1.2 TLSv1.3; ssl_prefer_server_ciphers off;|" "$SITE"
    cat >> "$SITE" <<NGX

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    location /.well-known/acme-challenge/ { root /var/lib/anjam/acme; }
    location / { return 301 https://\$host\$request_uri; }
}
NGX
  fi
  ln -sf "$SITE" /etc/nginx/sites-enabled/anjam
  if nginx -t -q 2>/dev/null; then systemctl reload nginx; return 0; fi
  rm -f /etc/nginx/sites-enabled/anjam; echo "  nginx rejected our vhost — withdrawn, other sites untouched:"; nginx -t 2>&1 | tail -3; return 1
}
mkdir -p /var/lib/anjam/acme; chown anjam:anjam /var/lib/anjam/acme
if [[ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
  nginx_apply 1
  # An older install let certbot's nginx plugin renew (it edits vhosts); switch our domain's renewal to webroot.
  RC=/etc/letsencrypt/renewal/$DOMAIN.conf
  if [[ -f $RC ]] && grep -q '^authenticator = nginx' "$RC"; then
    sed -i '/^installer = /d; s/^authenticator = nginx/authenticator = webroot/' "$RC"
    grep -q '^webroot_path' "$RC" || printf 'webroot_path = /var/lib/anjam/acme,
[[webroot_map]]
%s = /var/lib/anjam/acme
' "$DOMAIN" >> "$RC"
    grep -q '^renew_hook' "$RC" || sed -i '/^\[renewalparams\]/a renew_hook = systemctl reload nginx' "$RC"
    certbot renew --cert-name "$DOMAIN" --dry-run -q 2>/dev/null && echo "  certificate renewal: webroot (no nginx edits)" || echo "  note: renewal dry-run failed; check: certbot renew --cert-name $DOMAIN --dry-run"
  fi
else
  nginx_apply 0 || exit 1
  # certonly + webroot: certbot never edits any nginx file; renewals reload nginx gracefully through the deploy hook.
  if certbot certonly --webroot -w /var/lib/anjam/acme -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email        --deploy-hook "systemctl reload nginx" -q; then
    nginx_apply 1
  else
    echo "  certbot failed (is DNS for $DOMAIN pointing at $IP?). Anjam is up on http://$DOMAIN; re-run this installer once DNS is right."
  fi
fi

. /etc/anjam/install-result.env 2>/dev/null || true
echo
c 32 "  ┌────────────────────────────────────────────────────────┐"; echo
c 32 "  │              Anjam Installation Complete!              │"; echo
c 32 "  ├────────────────────────────────────────────────────────┤"; echo
echo "  │ App:       https://$DOMAIN"
echo "  │ Panel:     https://$DOMAIN/$ADMIN_PATH"
echo "  │ E-mail:    ${ADMIN_EMAIL:-(unchanged)}"
echo "  │ Password:  ${ADMIN_PASS:-(unchanged — anjam creds)}"
echo "  │ Version:   $(/opt/anjam/bin/anjam version)"
echo "  │ Manage:    anjam        (menu: status, log, update, backup, admin reset, invite create …)"
c 32 "  └────────────────────────────────────────────────────────┘"; echo
echo "  The administrator e-mail/password also sign in to the app like any user."
echo "  Credentials are kept in /etc/anjam/install-result.env (root only)."
