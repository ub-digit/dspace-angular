#!/bin/bash
if test "$1" = ""
then
  docker compose build
  ./push.sh
else
  GUB_ANGULAR_VERSION=$1 docker compose build
  ./push.sh $1
fi
