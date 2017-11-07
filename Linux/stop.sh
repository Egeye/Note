#!/usr/bin/env bash

PIDFILE=front-end.pid
if [ ! -f "$PIDFILE" ] || ! kill -0 "$(cat "$PIDFILE")"; then
echo "***** front-end is not running. *****"
else
PID="$(cat "$PIDFILE")"
kill -9 ${PID}
rm "$PIDFILE"
echo "***** stop front-end success. *****"
fi