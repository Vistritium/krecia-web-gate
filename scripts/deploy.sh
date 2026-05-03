#!/usr/bin/env bash
set -euo pipefail
trap 'status=$?; echo "ERROR: ${BASH_SOURCE[0]}:$LINENO: command failed with exit $status: $BASH_COMMAND" >&2' ERR

die() {
  trap - ERR
  echo "ERROR: $*" >&2
  exit 1
}

SOURCE_DIR="${SOURCE_DIR:-build}"

DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PORT="${DEPLOY_PORT:-8066}"

COPY_HOST="${COPY_HOST:-krecia.maciejnowicki.com}"

REMOTE_DIR="${REMOTE_DIR:-/home/kret/infra/kret-server/web-gate/content/webapp}"

: "${SSHPASS:?SSHPASS is required}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  die "Source directory does not exist: $SOURCE_DIR"
fi

if ! command -v sshpass >/dev/null; then
  die "sshpass is not installed"
fi

if ! command -v rsync >/dev/null; then
  die "rsync is not installed"
fi

if ! command -v ssh-keyscan >/dev/null; then
  die "ssh-keyscan is not installed"
fi

mkdir -p ~/.ssh
chmod 700 ~/.ssh

if ! ssh-keyscan -p "$DEPLOY_PORT" "$COPY_HOST" >> ~/.ssh/known_hosts; then
  die "Failed to scan SSH host key for $COPY_HOST:$DEPLOY_PORT"
fi

sshpass -e ssh \
  -p "$DEPLOY_PORT" \
  "$DEPLOY_USER@$COPY_HOST" \
  "mkdir -p '$REMOTE_DIR'"

sshpass -e rsync \
  --archive \
  --compress \
  --checksum \
  --delete \
  -e "ssh -p $DEPLOY_PORT" \
  "$SOURCE_DIR/" \
  "$DEPLOY_USER@$COPY_HOST:$REMOTE_DIR/"
