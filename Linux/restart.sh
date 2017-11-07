#!/usr/bin/env bash

PIDFILE=front-end.pid
if [ ! -f "$PIDFILE" ] || ! kill -0 "$(cat "$PIDFILE")"; then
echo "***** front-end is not running. *****"
else
PID="$(cat "$PIDFILE")"
kill -9 ${PID}
echo "***** stop front-end success. *****"
nohup java -jar front-end.jar &
echo $! > ${PIDFILE}
echo "***** restart front-end success. *****"
fi