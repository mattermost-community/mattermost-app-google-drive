#!/bin/sh
 if [ -f .env ]; then
     export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
 fi

 docker rm --force ${PROJECT} || true \