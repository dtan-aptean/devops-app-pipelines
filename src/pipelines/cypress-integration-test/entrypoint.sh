#!/bin/sh
npm install typescript
# This will exec the CMD from Dockerfile, i.e. "cypress run"
exec "$@"