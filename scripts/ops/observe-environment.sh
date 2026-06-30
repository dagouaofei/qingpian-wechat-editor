#!/usr/bin/env bash
# Strict observation / monitoring check for staging or production.
# Reuses status-environment.sh for baseline output; fails closed on anomalies.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/ops/common.sh
source "${SCRIPT_DIR}/common.sh"
# shellcheck source=scripts/ops/observe-checks.sh
source "${SCRIPT_DIR}/observe-checks.sh"

OPS_ENV_NAME="${1:-}"
if [[ -z "${OPS_ENV_NAME}" ]]; then
  usage_environments
  exit 1
fi

resolve_environment_config "${OPS_ENV_NAME}"
require_ops_prerequisites
require_env_file_accessible

log_info "=== Observe: ${OPS_ENV_NAME} ==="

# Baseline summary (informational; same path as deploy/rollback status)
bash "${SCRIPT_DIR}/status-environment.sh" "${OPS_ENV_NAME}" || true

log_info "--- Strict checks ---"

observe_assert_systemd_active
observe_assert_health_ok
observe_assert_version_ok
observe_print_resource_summary
observe_print_recent_service_errors
observe_check_public_http_surface

if [[ "${OBSERVE_FAILURES}" -gt 0 ]]; then
  log_err "OBSERVE FAILED: ${OPS_ENV_NAME} · ${OBSERVE_FAILURES} check(s) failed"
  exit 1
fi

log_ok "OBSERVE OK: ${OPS_ENV_NAME} · all strict checks passed"
