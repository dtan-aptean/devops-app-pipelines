#!/bin/sh
npm install typescript puppeteer
# This will exec the CMD from Dockerfile, i.e. "cypress run"
exec "$@"