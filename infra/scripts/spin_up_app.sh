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

while :; do
  case $1 in
    -d|--docker)
      echo "Spin up Docker container for running the application"
      # build base img
      docker build -t alantai/node_app_ef:0.0.0 \
        -f ./infra/Dockerfiles/Dockerfile.development.node .

      # run docker conatiner
      docker run -it --rm --name node_app_ef \
        --log-opt mode=non-blocking \
        --log-opt max-buffer-size=4m \
        --log-opt max-size=100m \
        --log-opt max-file=5 \
        alantai/node_app_ef:0.0.0 \
        /bin/sh
    ;;
    -l|--local)
      echo "Install npm modules and then run the application"

      # install npm modules
      npm i --save request-promise \
        request \
        readline \
        moment && \
      node app.js

    ;;
    *) break
  esac
  shift
done

