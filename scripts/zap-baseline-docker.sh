#!/usr/bin/env bash
set -euo pipefail
# OWASP ZAP baseline scan against a web target (DAST / passive pen-test style checks).
# Requires Docker. Reports are written to ./security-reports/

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TARGET="${SECURITY_TARGET_URL:-${BASE_URL:-https://example.com}}"
OUT_DIR="${ZAP_REPORT_DIR:-$ROOT/security-reports}"
mkdir -p "$OUT_DIR"

echo "Running ZAP baseline against: $TARGET"
echo "Reports: $OUT_DIR"

docker run --rm \
  -v "$OUT_DIR:/zap/wrk/:rw" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t "$TARGET" -r zap-report.html -J zap-out.json
