#!/usr/bin/env bash
# ============================================================
#  Anjam — One-Command Installer for Ubuntu 22.04+ / Debian 12+
#  Usage:
#    bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/install.sh)
#
#  Options:
#    --domain <domain>        domain for Anjam (DNS must point to server IP)
#    --admin-email <email>    administrator e-mail address
#    --admin-pass <pass>      administrator password (auto-generated if empty)
#    --admin-name <name>      administrator display name
#    --registration <mode>    sign-up mode: open, invite, closed (default: invite)
#    --port <port>            internal backend port (default: 8787)
#    --version <tag>          release tag to install (default: latest)
#    -y, --yes                non-interactive mode (use defaults/flags)
# ============================================================

set -euo pipefail

REPO="AbolfazlTafakori/anjam"
DOMAIN="" ADMIN_EMAIL="" ADMIN_PASS="" ADMIN_NAME="" REGISTRATION="" PORT="" TAG="latest" YES=0

while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) DOMAIN=$2; shift 2;;
    --admin-email) ADMIN_EMAIL=$2; shift 2;;
    --admin-pass) ADMIN_PASS=$2; shift 2;;
    --admin-name) ADMIN_NAME=$2; shift 2;;
    --registration) REGISTRATION=$2; shift 2;;
    --port) PORT=$2; shift 2;;
    --version) TAG=$2; shift 2;;
    --repo) REPO=$2; shift 2;;
    -y|--yes) YES=1; shift;;
    -h|--help)
      sed -n '3,15p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1;;
  esac
done

[[ $EUID -ne 0 ]] && { echo "Please run as root:  sudo bash install.sh"; exit 1; }
command -v apt-get >/dev/null || { echo "This installer supports Ubuntu/Debian (apt)."; exit 1; }

# ── Colors & Styling ─────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

C1='\033[38;5;197m'
C2='\033[38;5;203m'
C3='\033[38;5;209m'
CG='\033[38;5;46m'
CY='\033[38;5;226m'
CW='\033[1;37m'

step()    { echo -e "\n${BOLD}${CYAN}━━━ $1 ━━━${NC}"; }
info()    { echo -e "  ${CYAN}[•]${NC} $1"; }
success() { echo -e "  ${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "  ${YELLOW}[!]${NC} $1"; }
error()   { echo -e "\n  ${RED}[✗] $1${NC}\n"; exit 1; }

ask() {
  local var=$1 prompt=$2 def=${3:-}
  if [[ $YES -eq 1 || -n ${!var} ]]; then
    [[ -n ${!var} ]] || printf -v "$var" '%s' "$def"
    return
  fi
  read -rp "$(echo -e "  ${CYAN}▸${NC} $prompt${def:+ [${DIM}$def${NC}]}: ")" ans
  printf -v "$var" '%s' "${ans:-$def}"
}

askpw() {
  local var=$1 prompt=$2
  if [[ $YES -eq 1 || -n ${!var} ]]; then return; fi
  while true; do
    read -rsp "$(echo -e "  ${CYAN}▸${NC} $prompt ${DIM}(empty = auto-generate)${NC}: ")" a; echo
    [[ -z "$a" ]] && return
    read -rsp "$(echo -e "  ${CYAN}▸${NC} Repeat password: ")" b; echo
    [[ "$a" == "$b" ]] && { printf -v "$var" '%s' "$a"; return; }
    warn "Passwords do not match, please try again."
  done
}

# ── Banner ───────────────────────────────────────────────────
clear
echo ""
echo -e "${C1}   █████╗ ███╗   ██╗     ██╗ █████╗ ███╗   ███╗"
echo -e "${C1}  ██╔══██╗████╗  ██║     ██║██╔══██╗████╗ ████║"
echo -e "${C2}  ███████║██╔██╗ ██║     ██║███████║██╔████╔██║"
echo -e "${C2}  ██╔══██║██║╚██╗██║██   ██║██╔══██║██║╚██╔╝██║"
echo -e "${C3}  ██║  ██║██║ ╚████║╚█████╔╝██║  ██║██║ ╚═╝ ██║"
echo -e "${C3}  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝     ╚═╝${NC}"
echo ""
echo -e "  ${CW}Anjam Workspace${NC}  ${DIM}+${NC}  ${CG}One-Click Installer${NC}"
echo ""
echo -e "  ${DIM}┌─────────────────────────────────────────────────┐${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Version   ${NC}  ${TAG:-latest}                            ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Stack     ${NC}  Go (Backend) · React · Nginx         ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Features  ${NC}  Offline Sync · E2EE · Admin · SSL    ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${CY}Platform  ${NC}  Ubuntu 22.04+ / Debian 12+           ${DIM}│${NC}"
echo -e "  ${DIM}└─────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${DIM}Developed by${NC} ${CW}Abolfazl Tafakori${NC}"
echo ""

ENV=/etc/anjam/anjam.env
UPGRADE=0

if [[ -f "$ENV" ]]; then
  UPGRADE=1
  set -a; . "$ENV"; set +a
  DOMAIN=${DOMAIN:-${PUBLIC_URL#https://}}
  PORT=${PORT:-8787}

  # If run interactively with no specific flags, present quick options
  if [[ $YES -eq 0 && -z "${DOMAIN:-}" && -z "${PORT:-}" ]]; then
    warn "An existing Anjam installation was detected."
    echo ""
    echo "    [1] Upgrade in place (keeps data and configuration)"
    echo "    [2] Open Management Menu (anjam)"
    echo "    [3] Reinstall"
    echo "    [4] Safe Uninstall"
    echo "    [0] Exit"
    echo ""
    read -rp "  Choice [1]: " ex_ch
    case "${ex_ch:-1}" in
      1) ;;
      2)
        if [[ -x /usr/local/bin/anjam ]]; then
          exec /usr/local/bin/anjam
        elif [[ -f /opt/anjam/deploy/anjam ]]; then
          exec bash /opt/anjam/deploy/anjam
        fi
        ;;
      3) UPGRADE=0 ;;
      4)
        if [[ -x /usr/local/bin/anjam ]]; then
          exec /usr/local/bin/anjam uninstall
        fi
        ;;
      0) echo "Exiting."; exit 0 ;;
      *) ;;
    esac
  fi
fi

IP=$(curl -fsS -4 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

step "Configuration Setup"
ask DOMAIN "Domain for Anjam (DNS must already point to $IP)" "$DOMAIN"
[[ -n "$DOMAIN" ]] || error "A domain is required (for HTTPS / Let's Encrypt)."
DOMAIN=${DOMAIN#https://}; DOMAIN=${DOMAIN#http://}; DOMAIN=${DOMAIN%%/*}

ask PORT "Internal port (behind Nginx, not public)" "${PORT:-8787}"

# Port conflict validation
holder=$(ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -o 'users:(("[^"]*"' | head -1 | cut -d'"' -f2 || true)
if [[ -n "$holder" && "$holder" != "anjam" ]]; then
  error "Port $PORT is already used by '$holder'. Please choose another port."
fi

# Domain conflict check in existing nginx configs
other=$(grep -lsE "^\s*server_name\s+.* $DOMAIN " /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf 2>/dev/null | grep -v '/anjam' || true)
if [[ -n "$other" ]]; then
  error "$DOMAIN is already served by: $other. Please choose another domain."
fi

if [[ $UPGRADE -eq 0 ]]; then
  ask ADMIN_EMAIL "Administrator e-mail (also signs in to app)" "admin@$DOMAIN"
  ask ADMIN_NAME  "Administrator display name" "Admin"
  askpw ADMIN_PASS "Administrator password"
  ask REGISTRATION "Sign-up mode (open / invite / closed)" "invite"
fi
[[ $REGISTRATION =~ ^(open|invite|closed|)$ ]] || error "Registration mode must be 'open', 'invite', or 'closed'."

step "1/5  System Dependencies"
export DEBIAN_FRONTEND=noninteractive
missing=()
for pkg in curl nginx certbot; do
  dpkg -s "$pkg" >/dev/null 2>&1 || missing+=("$pkg")
done

if ((${#missing[@]})); then
  info "Installing required packages: ${missing[*]}..."
  apt-get update -qq
  apt-get install -y -qq --no-upgrade "${missing[@]}" >/dev/null
  success "Installed dependencies: ${missing[*]}"
else
  success "Required packages (nginx, certbot, curl) are already installed"
fi
systemctl is-active -q nginx || systemctl start nginx

step "2/5  Anjam Core & Assets ($TAG)"
id -u anjam >/dev/null 2>&1 || useradd --system --home /opt/anjam --shell /usr/sbin/nologin anjam
mkdir -p /opt/anjam/bin /opt/anjam/deploy /var/lib/anjam /etc/anjam

RAW="https://raw.githubusercontent.com/$REPO/main"
info "Downloading deployment scripts from GitHub..."
for f in anjam anjam.service nginx-anjam.conf nginx-anjam-zones.conf fetch-release.sh anjam.env.example; do
  curl -fsSL "$RAW/deploy/$f" -o "/opt/anjam/deploy/$f"
done

info "Fetching release binary and web bundle..."
REPO="$REPO" bash /opt/anjam/deploy/fetch-release.sh "$TAG"
install -m 755 /opt/anjam/deploy/anjam /usr/local/bin/anjam
success "Installed management CLI to /usr/local/bin/anjam"

step "3/5  Environment & Security Setup"
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
sed -i '/^$/d' "$ENV"
chmod 600 "$ENV"
set -a; . "$ENV"; set +a
chown -R anjam:anjam /var/lib/anjam

admins=$(/opt/anjam/bin/anjam stats 2>/dev/null | grep -o '"admins": [0-9]*' | grep -o '[0-9]*' || echo 0)
if [[ $UPGRADE -eq 0 || "$admins" == "0" ]]; then
  ADMIN_EMAIL=${ADMIN_EMAIL:-admin@$DOMAIN}
  CRED=$(ANJAM_QUIET=1 /opt/anjam/bin/anjam admin reset "$ADMIN_EMAIL" "${ADMIN_PASS:-}" "${ADMIN_NAME:-Admin}" 2>/dev/null)
  [[ -n "$ADMIN_PASS" ]] || ADMIN_PASS=$(sed -n 2p <<<"$CRED")
  /opt/anjam/bin/anjam registration "${REGISTRATION:-invite}" >/dev/null 2>&1 || true
  printf 'PANEL_URL=https://%s/%s\nADMIN_EMAIL=%s\nADMIN_PASS=%s\n' "$DOMAIN" "$ADMIN_PATH" "$ADMIN_EMAIL" "$ADMIN_PASS" > /etc/anjam/install-result.env
  chmod 600 /etc/anjam/install-result.env
  success "Administrator configured"
fi
chown -R anjam:anjam /var/lib/anjam

step "4/5  Systemd Service Setup"
install -m 644 /opt/anjam/deploy/anjam.service /etc/systemd/system/anjam.service
systemctl daemon-reload
systemctl enable -q anjam
systemctl restart anjam
sleep 2
if curl -fsS "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then
  success "Anjam systemd service is active & healthy"
else
  warn "Service started but health check pending — check journalctl -u anjam"
fi

step "5/5  Nginx Reverse Proxy & SSL"
SITE=/etc/nginx/sites-available/anjam

nginx_apply() {
  local tls=$1
  install -m 644 /opt/anjam/deploy/nginx-anjam-zones.conf /etc/nginx/conf.d/anjam-zones.conf
  sed "s/anjam.abolfazltafakori.com/$DOMAIN/g; s/127.0.0.1:8787/127.0.0.1:$PORT/g" /opt/anjam/deploy/nginx-anjam.conf > "$SITE"
  sed -i 's|    location /api/auth/ {|    location /.well-known/acme-challenge/ { root /var/lib/anjam/acme; }\n    location /api/auth/ {|' "$SITE"
  if [[ $tls -eq 1 ]]; then
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
  if nginx -t -q 2>/dev/null; then
    systemctl reload nginx
    return 0
  fi
  rm -f /etc/nginx/sites-enabled/anjam
  warn "Nginx rejected vhost configuration. Retrying..."
  nginx -t 2>&1 | tail -3
  return 1
}

mkdir -p /var/lib/anjam/acme
chown anjam:anjam /var/lib/anjam/acme

if [[ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
  nginx_apply 1
  RC=/etc/letsencrypt/renewal/$DOMAIN.conf
  if [[ -f "$RC" ]] && grep -q '^authenticator = nginx' "$RC"; then
    sed -i '/^installer = /d; s/^authenticator = nginx/authenticator = webroot/' "$RC"
    grep -q '^webroot_path' "$RC" || printf 'webroot_path = /var/lib/anjam/acme,\n[[webroot_map]]\n%s = /var/lib/anjam/acme\n' "$DOMAIN" >> "$RC"
    grep -q '^renew_hook' "$RC" || sed -i '/^\[renewalparams\]/a renew_hook = systemctl reload nginx' "$RC"
  fi
  success "Existing SSL certificate loaded"
else
  nginx_apply 0 || error "Failed to configure Nginx"
  info "Obtaining Let's Encrypt certificate..."
  if certbot certonly --webroot -w /var/lib/anjam/acme -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --deploy-hook "systemctl reload nginx" -q; then
    nginx_apply 1
    success "SSL certificate issued and active"
  else
    warn "Certbot was unable to complete challenge for $DOMAIN."
    warn "Ensure DNS A-record points to $IP. Anjam is listening on HTTP: http://$DOMAIN"
  fi
fi

# ── Summary Card ─────────────────────────────────────────────
. /etc/anjam/install-result.env 2>/dev/null || true
echo ""
echo -e "${GREEN}  ┌────────────────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}  │${NC}              ${BOLD}Anjam Installation Complete!${NC}              ${GREEN}│${NC}"
echo -e "${GREEN}  ├────────────────────────────────────────────────────────┤${NC}"
echo -e "  │ ${BOLD}App URL:${NC}     ${CYAN}https://$DOMAIN${NC}"
echo -e "  │ ${BOLD}Admin Panel:${NC} ${CYAN}https://$DOMAIN/$ADMIN_PATH${NC}"
echo -e "  │ ${BOLD}E-mail:${NC}      ${ADMIN_EMAIL:-(unchanged)}"
echo -e "  │ ${BOLD}Password:${NC}    ${ADMIN_PASS:-(unchanged — view with: anjam creds)}"
echo -e "  │ ${BOLD}Version:${NC}     $(/opt/anjam/bin/anjam version 2>/dev/null || echo "$TAG")"
echo -e "  │ ${BOLD}CLI Tool:${NC}    ${GREEN}anjam${NC}  (type 'anjam' for management menu)"
echo -e "${GREEN}  └────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${DIM}Credentials saved to /etc/anjam/install-result.env (chmod 600, root only).${NC}"
echo -e "  ${DIM}Run ${BOLD}anjam${NC}${DIM} anytime to access the interactive management console.${NC}"
echo ""
