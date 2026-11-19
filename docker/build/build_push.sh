#!/usr/bin/env bash
set -e

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
source ./image_names.sh
source ./build.sh
source ./push.sh
