#!/usr/bin/env bash
# Show deployment status for staging or production.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/ops/common.sh
source "${SCRIPT_DIR}/common.sh"

OPS_ENV_NAME="${1:-}"
if [[ -z "${OPS_ENV_NAME}" ]]; then
  usage_environments
  exit 1
fi

resolve_environment_config "${OPS_ENV_NAME}"
require_ops_prerequisites

DEPLOYED_COMMIT="$(current_deployed_commit)"
DEPLOYED_SHORT="$(git -C "${OPS_APP_DIR}" rev-parse --short=12 HEAD 2>/dev/null || echo unknown)"

log_info "=== Status: ${OPS_ENV_NAME} ==="
log_info "Environment: ${OPS_ENV_NAME}"
log_info "App directory: ${OPS_APP_DIR}"
log_info "Systemd service: ${OPS_SERVICE}"
log_info "Listen port: ${OPS_PORT}"
log_info "Deployed commit: ${DEPLOYED_COMMIT} (${DEPLOYED_SHORT})"

print_systemd_status

if curl -fsS "${OPS_HEALTH_URL}" >/dev/null 2>&1; then
  health_ok="$(curl_json_field "${OPS_HEALTH_URL}" "ok" || echo false)"
  db_status="$(curl_json_field "${OPS_HEALTH_URL}" "database" || echo unknown)"
  log_info "Health: ok=${health_ok} database=${db_status}"
else
  log_warn "Health endpoint unreachable: ${OPS_HEALTH_URL}"
fi

if curl -fsS "${OPS_VERSION_URL}" >/dev/null 2>&1; then
  version_env="$(curl_json_field "${OPS_VERSION_URL}" "environment" || echo unknown)"
  version_sha="$(curl_json_field "${OPS_VERSION_URL}" "gitSha" || echo unknown)"
  version_build="$(curl_json_field "${OPS_VERSION_URL}" "buildTime" || echo unknown)"
  log_info "Version API: environment=${version_env} gitSha=${version_sha} buildTime=${version_build}"
else
  log_warn "Version endpoint unreachable: ${OPS_VERSION_URL}"
fi
