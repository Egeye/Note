#!/usr/bin/env bash

export LC_ALL=zh_CN.GBK

PIDFILE=front-end.pid
if [ -f "$PIDFILE" ] && kill -0 $(cat "$PIDFILE"); then
echo "***** front-end is already running. *****"
exit 1
elif !([ -f front-end.jar ]); then
echo "***** file data is missing. *****"
else nohup java -jar front-end.jar &
echo $! > ${PIDFILE}
echo "***** start front-end success. *****"
fi
