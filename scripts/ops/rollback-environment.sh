#!/usr/bin/env bash
# Roll back application code to a known commit (no DB migration rollback).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/ops/common.sh
source "${SCRIPT_DIR}/common.sh"

OPS_ENV_NAME="${1:-}"
shift || true

if [[ -z "${OPS_ENV_NAME}" ]]; then
  usage_environments
  exit 1
fi

resolve_environment_config "${OPS_ENV_NAME}"
require_ops_prerequisites

TARGET_REF=""
CONFIRM_PRODUCTION=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --confirm-production)
      CONFIRM_PRODUCTION=true
      shift
      ;;
    --)
      shift
      TARGET_REF="${1:-}"
      shift || true
      break
      ;;
    *)
      if [[ -z "${TARGET_REF}" ]]; then
        TARGET_REF="$1"
      else
        log_err "Unexpected argument: $1"
        exit 1
      fi
      shift
      ;;
  esac
done

if [[ -z "${TARGET_REF}" ]]; then
  log_err "Missing rollback target commit"
  echo "Example: pnpm ops:rollback:${OPS_ENV_NAME} -- <commit>"
  exit 1
fi

if [[ "${OPS_ENV_NAME}" == "production" && "${CONFIRM_PRODUCTION}" != "true" ]]; then
  log_err "production rollback requires --confirm-production"
  exit 1
fi

acquire_deploy_lock
trap release_deploy_lock EXIT

log_warn "Code rollback only — database migrations are NOT reverted."
log_warn "If a non-reversible migration was applied, stop and perform manual DBA review."

BEFORE_COMMIT="$(current_deployed_commit)"
resolve_git_ref "${OPS_ENV_NAME}" "${TARGET_REF}"

log_info "=== Rollback ${OPS_ENV_NAME} ==="
log_info "Before: ${BEFORE_COMMIT}"
log_info "Target: ${RESOLVED_COMMIT} (${RESOLVED_COMMIT_SHORT})"

git -C "${OPS_APP_DIR}" checkout --detach "${RESOLVED_COMMIT}"
rm -rf "${OPS_APP_DIR}/.next"

export APP_ENV="${OPS_APP_ENV}"
export APP_VERSION="${APP_VERSION:-release-1}"
export APP_GIT_SHA="${RESOLVED_COMMIT_SHORT}"
export APP_BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"

load_env_file_safely

(
  cd "${OPS_APP_DIR}"
  corepack pnpm install --frozen-lockfile
  corepack pnpm exec prisma generate
)

if ! (
  cd "${OPS_APP_DIR}"
  corepack pnpm build
); then
  log_err "Rollback build failed — service not restarted."
  exit 1
fi

sudo systemctl restart "${OPS_SERVICE}"
sleep 2

check_health_and_version "${OPS_APP_ENV}" "${RESOLVED_COMMIT_SHORT}"

log_ok "Rollback complete · code=${RESOLVED_COMMIT_SHORT} · DB unchanged"
