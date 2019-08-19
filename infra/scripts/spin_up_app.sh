#!/usr/local/bin/bash
# Author:
#   Alan Tai
# Program:
#   Spin up the fan systems
# Date:
#   08/02/2019

set -e

# export variables
finish() {
  local existcode=$?
  cd $CWD
  exit $existcode
}

trap "finish" INT TERM

# build base img
docker build -t alantai/node_app_ef:0.0.0 \
  -f ./infra/Dockerfiles/Dockerfile.development.node .

docker run -it --rm --name node_app_ef \
  --log-opt mode=non-blocking \
  --log-opt max-buffer-size=4m \
  --log-opt max-size=100m \
  --log-opt max-file=5 \
  alantai/node_app_ef:0.0.0 \
  /bin/sh

