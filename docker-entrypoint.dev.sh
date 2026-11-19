#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == npm && "${2:-}" == run ]]; then
  cd /app
  mkdir -p /cache
  # Serialize installs when multiple development containers share the cache.
  exec 9>/cache/.install.lock
  flock 9

  if [[ ! -d /cache/node_modules ]] ||
     ! sha256sum --check --status /cache/.dependency-manifests; then
    : > /cache/.dependency-manifests
    cp package.json package-lock.json /cache/
    npm ci --prefix /cache --include=dev
    (cd /cache && sha256sum package.json package-lock.json) > /cache/.dependency-manifests
  fi

  exec 9>&-

  if [[ ! -e node_modules && ! -L node_modules ]]; then
    ln -s /cache/node_modules node_modules
  fi
fi

exec "$@"
