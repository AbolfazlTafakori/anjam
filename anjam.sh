#!/usr/bin/env bash
# ============================================================
#  Anjam — Interactive Terminal Launcher & Management CLI
#  Usage:
#    bash <(curl -fsSL https://raw.githubusercontent.com/AbolfazlTafakori/anjam/main/anjam.sh)
#    or: anjam
# ============================================================

REPO="AbolfazlTafakori/anjam"
REPO_RAW="https://raw.githubusercontent.com/${REPO}/main"
CLI_PATH="/usr/local/bin/anjam"

if [[ "${ANJAM_ALLOW_NON_ROOT:-0}" != "1" && $EUID -ne 0 ]]; then
    if command -v sudo >/dev/null 2>&1; then
        exec sudo bash "$0" "$@"
    else
        echo -e "\033[0;31mError: This script must be run as root (or with sudo).\033[0m"
        exit 1
    fi
fi

# If Anjam is already installed and local CLI exists, run it directly
if [[ -x "$CLI_PATH" && -d "/opt/anjam" ]]; then
    exec "$CLI_PATH" "$@"
fi

# If deploy/anjam exists locally in current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/deploy/anjam" ]]; then
    chmod +x "${SCRIPT_DIR}/deploy/anjam"
    exec "${SCRIPT_DIR}/deploy/anjam" "$@"
fi

# Otherwise, offer to run installer
clear
echo ""
echo -e "\033[38;5;197m   █████╗ ███╗   ██╗     ██╗ █████╗ ███╗   ███╗\033[0m"
echo -e "\033[38;5;197m  ██╔══██╗████╗  ██║     ██║██╔══██╗████╗ ████║\033[0m"
echo -e "\033[38;5;203m  ███████║██╔██╗ ██║     ██║███████║██╔████╔██║\033[0m"
echo -e "\033[38;5;203m  ██╔══██║██║╚██╗██║██   ██║██╔══██║██║╚██╔╝██║\033[0m"
echo -e "\033[38;5;209m  ██║  ██║██║ ╚████║╚█████╔╝██║  ██║██║ ╚═╝ ██║\033[0m"
echo -e "\033[38;5;209m  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝     ╚═╝\033[0m"
echo ""
echo -e "  \033[1;37mAnjam Workspace\033[0m  \033[2m·\033[0m  \033[0;32mInteractive Management\033[0m"
echo ""
echo -e "  \033[1;33m! Anjam is not yet installed on this server.\033[0m"
echo ""
read -rp "  Would you like to install Anjam now? [Y/n]: " ans
if [[ "$ans" =~ ^[Nn]$ ]]; then
    echo "Exiting."
    exit 0
fi

echo ""
echo "Starting Anjam installer..."
bash <(curl -fsSL "${REPO_RAW}/install.sh") "$@"
