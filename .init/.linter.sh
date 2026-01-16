#!/bin/bash
cd /home/kavia/workspace/code-generation/spendsense-analytics-dashboard-42054-41205/spendsense_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

