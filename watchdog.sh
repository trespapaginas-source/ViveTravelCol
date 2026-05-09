#!/bin/bash
cd /home/z/my-project
echo "Watchdog started at $(date)" >> /home/z/my-project/watchdog.log
while true; do
  # Truncate dev.log to prevent it from growing too large
  > /home/z/my-project/dev.log
  node node_modules/next/dist/bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  echo "Server died at $(date), restarting in 2s..." >> /home/z/my-project/watchdog.log
  sleep 2
done
