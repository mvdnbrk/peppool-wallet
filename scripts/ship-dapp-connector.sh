#!/usr/bin/env bash
# Stage all changes, commit if needed, push current HEAD to origin/dapp-connector.
# Usage:
#   ./scripts/ship-dapp-connector.sh              # push only (no local changes)
#   ./scripts/ship-dapp-connector.sh "message"   # commit all + push
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

git add -A

if ! git diff --cached --quiet; then
  if [ -z "${1:-}" ]; then
    echo "You have uncommitted changes. Commit them with a message, then push:"
    echo "  ./scripts/ship-dapp-connector.sh \"describe your changes\""
    exit 1
  fi
  git commit -m "$1"
fi

git push origin HEAD:dapp-connector
echo "origin/dapp-connector is now at $(git rev-parse --short HEAD)"
