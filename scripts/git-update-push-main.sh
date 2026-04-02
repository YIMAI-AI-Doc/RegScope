#!/usr/bin/env bash
set -euo pipefail

git add .
git commit -m "update: 更新"
git push origin main
