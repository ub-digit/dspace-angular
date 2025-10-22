#!/usr/bin/env bash
set -e

if [ "$1" = "yarn" ]; then
  # Run yarn with all arguments

  APP_DIR="/app"
  CACHE_DIR="/cache"
  NODE_MODULES_CACHE="$CACHE_DIR/node_modules"
  LOCK_HASH_FILE="$CACHE_DIR/.lock-hash"

  # Compute hash of dependency files
  NEW_HASH=$(sha256sum package.json yarn.lock | sha256sum | awk '{print $1}')
  OLD_HASH=$(cat "$LOCK_HASH_FILE" 2>/dev/null || echo "")

  # If cached deps are missing or outdated, reinstall
  if [ ! -d "$NODE_MODULES_CACHE" ]; then
    echo "⚙️  No cached node_modules found, installing fresh..."
    mkdir -p "$CACHE_DIR"
    cp package.json yarn.lock "$CACHE_DIR"/
    cd "$CACHE_DIR"
    yarn install --frozen-lockfile
    echo "$NEW_HASH" > "$LOCK_HASH_FILE"
    cd "$APP_DIR"
  elif [ "$NEW_HASH" != "$OLD_HASH" ]; then
    echo "🌀 Detected change in package.json or yarn.lock, updating dependencies..."
    cd "$CACHE_DIR"
    cp "$APP_DIR"/package.json "$APP_DIR"/yarn.lock ./
    yarn install --frozen-lockfile
    echo "$NEW_HASH" > "$LOCK_HASH_FILE"
    cd "$APP_DIR"
  else
    echo "✅ Dependencies unchanged, using cached modules."
  fi

  # Link cached node_modules into /app if not already
  if [ ! -d "$APP_DIR/node_modules" ]; then
    echo "🔗 Linking cached node_modules to /app..."
    ln -sf "$NODE_MODULES_CACHE" "$APP_DIR/node_modules"
  fi

  exec yarn "${@:2}"
else
  # Run whatever command is provided
  exec "$@"
fi
