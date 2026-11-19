#!/usr/bin/env bash
set -e

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
source ./build_dev.sh
source ./build_prod.sh
