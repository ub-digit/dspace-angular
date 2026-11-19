#!/usr/bin/env bash
set -e

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
source ./image_names.sh
docker build -t "$DEVELOPMENT_IMAGE" -f ../../Dockerfile.dev ../..
