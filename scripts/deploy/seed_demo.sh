#!/usr/bin/env bash
set -euo pipefail

ENV_FILE=${ENV_FILE:-.env.local}

if [ -f "$ENV_FILE" ]; then
  export ENV_FILE
fi

ts-node --esm scripts/deploy/seed_demo.ts
