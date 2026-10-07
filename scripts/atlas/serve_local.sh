#!/bin/sh
# Local production server for checking the Research Atlas. The password here
# is for this machine only; Railway uses its own ATLAS_PASSWORD variable.
cd "$(dirname "$0")/../.." || exit 1
export ATLAS_PASSWORD="${ATLAS_PASSWORD:-local-check}"
exec npx next start -p "${PORT:-3105}"
