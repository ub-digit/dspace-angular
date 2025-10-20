#!/bin/bash
source .env

# Overwrite GIT_REVISION with first argument if passed
if [ -n "$1" ]; then
  GUB_ANGULAR_VERSION=$1
fi

docker push docker.ub.gu.se/dspace-angular:dspace-8_x-${GUB_ANGULAR_VERSION}
docker push docker.ub.gu.se/dspace-angular:dspace-8_x-${GUB_ANGULAR_VERSION}-dist
