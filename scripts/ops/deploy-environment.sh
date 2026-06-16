#!/usr/bin/env bash
# Deploy staging or production from a git ref/commit.
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
FIRST_IMPORT=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --confirm-production)
      CONFIRM_PRODUCTION=true
      shift
      ;;
    --first-import)
      FIRST_IMPORT=true
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
  log_err "Missing deploy target commit/ref"
  echo "Example: pnpm ops:deploy:${OPS_ENV_NAME} -- <git-ref>"
  exit 1
fi

if [[ "${OPS_ENV_NAME}" == "production" && "${CONFIRM_PRODUCTION}" != "true" ]]; then
  log_err "production deploy requires --confirm-production"
  exit 1
fi

mkdir -p "${OPS_APP_DIR}"
acquire_deploy_lock
trap release_deploy_lock EXIT

BEFORE_COMMIT="$(current_deployed_commit)"
log_info "=== Deploy ${OPS_ENV_NAME} ==="
log_info "App dir: ${OPS_APP_DIR}"
log_info "Service: ${OPS_SERVICE}"
log_info "Before commit: ${BEFORE_COMMIT}"
log_info "Target ref: ${TARGET_REF}"

if [[ ! -d "${OPS_APP_DIR}/.git" ]]; then
  log_err "Git repository not initialized at ${OPS_APP_DIR}. Clone the repo first."
  exit 1
fi

resolve_git_ref "${OPS_ENV_NAME}" "${TARGET_REF}"
log_info "Resolved commit: ${RESOLVED_COMMIT} (${RESOLVED_COMMIT_SHORT})"

git -C "${OPS_APP_DIR}" checkout --detach "${RESOLVED_COMMIT}"

rm -rf "${OPS_APP_DIR}/.next"

export APP_ENV="${OPS_APP_ENV}"
export APP_VERSION="${APP_VERSION:-release-1}"
export APP_GIT_SHA="${RESOLVED_COMMIT_SHORT}"
export APP_BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%S.000Z)"

(
  cd "${OPS_APP_DIR}"
  corepack pnpm install --frozen-lockfile
  corepack pnpm exec prisma generate
)

load_env_file_safely

(
  cd "${OPS_APP_DIR}"
  corepack pnpm db:migrate:deploy
)

if [[ "${FIRST_IMPORT}" == "true" ]]; then
  log_warn "Running first-time variant import (dry-run then apply) ..."
  (
    cd "${OPS_APP_DIR}"
    corepack pnpm style-admin:import-existing-variants:dry-run
    corepack pnpm style-admin:import-existing-variants
  )
fi

if ! (
  cd "${OPS_APP_DIR}"
  corepack pnpm build
); then
  log_err "Build failed — service not restarted; previous deployment remains active."
  exit 1
fi

sudo systemctl restart "${OPS_SERVICE}"
sleep 2

check_health_and_version "${OPS_APP_ENV}" "${RESOLVED_COMMIT_SHORT}"

AFTER_COMMIT="$(current_deployed_commit)"
log_ok "Deploy complete"
log_info "After commit: ${AFTER_COMMIT}"
print_systemd_status
