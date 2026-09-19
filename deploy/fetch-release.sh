#!/usr/bin/env bash
# Downloads the server binary + web bundle of a release into /opt/anjam (run as root).
#   fetch-release.sh            latest
#   fetch-release.sh v1.3.0     a specific tag
set -euo pipefail
REPO="${REPO:-AbolfazlTafakori/anjam}"
TAG="${1:-latest}"
case $(uname -m) in x86_64) ARCH=amd64;; aarch64) ARCH=arm64;; *) echo "unsupported CPU: $(uname -m)"; exit 1;; esac
if [[ $TAG == latest ]]; then BASE="https://github.com/$REPO/releases/latest/download"; else BASE="https://github.com/$REPO/releases/download/$TAG"; fi
mkdir -p /opt/anjam/bin /opt/anjam/web
tmp=$(mktemp -d)
curl -fsSL "$BASE/anjam-server-linux-$ARCH" -o "$tmp/anjam"
curl -fsSL "$BASE/anjam-web.tar.gz" -o "$tmp/web.tar.gz"
chmod 755 "$tmp/anjam"
"$tmp/anjam" version >/dev/null
install -m 755 "$tmp/anjam" /opt/anjam/bin/anjam
rm -rf /opt/anjam/web.new && mkdir -p /opt/anjam/web.new && tar -xzf "$tmp/web.tar.gz" -C /opt/anjam/web.new
rm -rf /opt/anjam/web.old; [[ -d /opt/anjam/web ]] && mv /opt/anjam/web /opt/anjam/web.old; mv /opt/anjam/web.new /opt/anjam/web; rm -rf /opt/anjam/web.old
rm -rf "$tmp"
echo "anjam $(/opt/anjam/bin/anjam version) installed"
