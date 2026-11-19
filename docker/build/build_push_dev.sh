#!/usr/bin/env bash
set -e

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
source ./image_names.sh
source ./build_dev.sh
source ./push_dev.sh
