if test "$1" = ""
then
  source ./.env
else
  GUB_ANGULAR_VERSION=$1
fi

PRODUCION_IMAGE=docker.ub.gu.se/dspace-angular:dspace-8_x-${GUB_ANGULAR_VERSION}-dist
DEVELOPMENT_IMAGE=docker.ub.gu.se/dspace-angular:dspace-8_x-dev # No versioned image to save spacek, needs docker compose pull

