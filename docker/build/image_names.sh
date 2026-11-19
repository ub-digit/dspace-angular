#!/usr/bin/env bash

if [[ -n "${1:-}" ]]; then
  GUB_ANGULAR_VERSION=$1
else
  source ./.env
fi

PRODUCTION_IMAGE="docker.ub.gu.se/dspace-angular:dspace-10.1-${GUB_ANGULAR_VERSION}-dist"
DEVELOPMENT_IMAGE="docker.ub.gu.se/dspace-angular:dspace-10.1-dev"
