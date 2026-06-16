#!/usr/bin/env bash
# Shared helpers for staging/production ops scripts.
set -euo pipefail

OPS_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${OPS_SCRIPT_DIR}/../.." && pwd)"

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
NC=$'\033[0m'

log_info() { printf '%s\n' "$*"; }
log_ok() { printf '%s%s%s\n' "${GREEN}" "$*" "${NC}"; }
log_warn() { printf '%s%s%s\n' "${YELLOW}" "$*" "${NC}"; }
log_err() { printf '%s%s%s\n' "${RED}" "$*" "${NC}" >&2; }

usage_environments() {
  cat <<'EOF'
Usage environments: staging | production

Examples:
  pnpm ops:deploy:staging -- origin/sprint/s11-production-ops-go-live
  pnpm ops:deploy:production -- edc1fd7 --confirm-production
  pnpm ops:status:staging
  pnpm ops:rollback:staging -- <commit>
EOF
}

resolve_environment_config() {
  local env_name="$1"
  case "${env_name}" in
    staging)
      OPS_APP_DIR="${OPS_APP_DIR:-/opt/qingpian-wechat-editor/staging}"
      OPS_SERVICE="${OPS_SERVICE:-qingpian-wechat-editor-staging}"
      OPS_PORT="${OPS_PORT:-3001}"
      OPS_ENV_FILE="${OPS_ENV_FILE:-${OPS_APP_DIR}/.env}"
      OPS_HEALTH_URL="${OPS_HEALTH_URL:-http://127.0.0.1:3001/api/health}"
      OPS_VERSION_URL="${OPS_VERSION_URL:-http://127.0.0.1:3001/api/version}"
      OPS_APP_ENV="${OPS_APP_ENV:-staging}"
      ;;
    production)
      OPS_APP_DIR="${OPS_APP_DIR:-/opt/qingpian-wechat-editor/production}"
      OPS_SERVICE="${OPS_SERVICE:-qingpian-wechat-editor-production}"
      OPS_PORT="${OPS_PORT:-3000}"
      OPS_ENV_FILE="${OPS_ENV_FILE:-${OPS_APP_DIR}/.env}"
      OPS_HEALTH_URL="${OPS_HEALTH_URL:-http://127.0.0.1:3000/api/health}"
      OPS_VERSION_URL="${OPS_VERSION_URL:-http://127.0.0.1:3000/api/version}"
      OPS_APP_ENV="${OPS_APP_ENV:-production}"
      ;;
    *)
      log_err "Unknown environment: ${env_name}"
      usage_environments
      exit 1
      ;;
  esac
  OPS_LOCK_FILE="${OPS_APP_DIR}/.deploy.lock"
}

require_command() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    log_err "Required command not found: ${cmd}"
    exit 1
  fi
}

require_ops_prerequisites() {
  require_command git
  require_command corepack
  require_command curl
  require_command systemctl
  require_command flock
}

acquire_deploy_lock() {
  mkdir -p "${OPS_APP_DIR}"
  exec 9>"${OPS_LOCK_FILE}"
  if ! flock -n 9; then
    log_err "Another deploy/rollback is in progress for ${OPS_ENV_NAME} (${OPS_LOCK_FILE})"
    exit 1
  fi
}

release_deploy_lock() {
  flock -u 9 || true
}

git_is_exact_commit() {
  local ref="$1"
  git -C "${OPS_APP_DIR}" cat-file -e "${ref}^{commit}" >/dev/null 2>&1
}

resolve_git_ref() {
  local env_name="$1"
  local ref="$2"

  if [[ -z "${ref}" ]]; then
    log_err "Missing target commit/ref argument"
    exit 1
  fi

  git -C "${OPS_APP_DIR}" fetch origin --prune --tags

  if [[ "${env_name}" == "production" ]]; then
    if [[ "${ref}" == *"/"* ]]; then
      log_err "production deploy requires an exact commit hash, not a branch/ref: ${ref}"
      exit 1
    fi
    if ! git_is_exact_commit "${ref}"; then
      log_err "production deploy target is not a resolvable commit: ${ref}"
      exit 1
    fi
    RESOLVED_COMMIT="$(git -C "${OPS_APP_DIR}" rev-parse "${ref}^{commit}")"
  else
    if git_is_exact_commit "${ref}"; then
      RESOLVED_COMMIT="$(git -C "${OPS_APP_DIR}" rev-parse "${ref}^{commit}")"
    else
      git -C "${OPS_APP_DIR}" fetch origin "${ref}" || true
      RESOLVED_COMMIT="$(git -C "${OPS_APP_DIR}" rev-parse "FETCH_HEAD^{commit}")"
    fi
  fi

  RESOLVED_COMMIT_SHORT="$(git -C "${OPS_APP_DIR}" rev-parse --short=12 "${RESOLVED_COMMIT}")"
}

current_deployed_commit() {
  if [[ -d "${OPS_APP_DIR}/.git" ]]; then
    git -C "${OPS_APP_DIR}" rev-parse HEAD 2>/dev/null || echo "unknown"
  else
    echo "unknown"
  fi
}

load_env_file_safely() {
  if [[ ! -f "${OPS_ENV_FILE}" ]]; then
    log_err "Environment file not found: ${OPS_ENV_FILE}"
    exit 1
  fi
  set -a
  # shellcheck disable=SC1090
  source "${OPS_ENV_FILE}"
  set +a
}

curl_json_field() {
  local url="$1"
  local field="$2"
  curl -fsS "${url}" | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
    const value = data['${field}'];
    if (value === undefined || value === null) process.exit(2);
    process.stdout.write(String(value));
  "
}

check_health_and_version() {
  local expected_env="$1"
  local expected_sha="$2"

  log_info "Checking ${OPS_HEALTH_URL} ..."
  local health_ok
  health_ok="$(curl_json_field "${OPS_HEALTH_URL}" "ok" || true)"
  if [[ "${health_ok}" != "true" ]]; then
    log_err "Health check failed: ${OPS_HEALTH_URL}"
    curl -fsS "${OPS_HEALTH_URL}" || true
    exit 1
  fi
  log_ok "Health OK"

  log_info "Checking ${OPS_VERSION_URL} ..."
  local version_env version_sha
  version_env="$(curl_json_field "${OPS_VERSION_URL}" "environment")"
  version_sha="$(curl_json_field "${OPS_VERSION_URL}" "gitSha")"

  if [[ "${version_env}" != "${expected_env}" ]]; then
    log_err "/api/version environment mismatch: expected=${expected_env} actual=${version_env}"
    exit 1
  fi

  if [[ "${version_sha}" != "${expected_sha}" && "${version_sha}" != "${expected_sha:0:7}" && "${version_sha}" != "${expected_sha:0:12}" ]]; then
    log_warn "/api/version gitSha=${version_sha} (expected ${expected_sha}) — verify short hash prefix"
  fi
  log_ok "Version OK · env=${version_env} · gitSha=${version_sha}"
}

print_systemd_status() {
  systemctl is-active "${OPS_SERVICE}" || true
  systemctl show "${OPS_SERVICE}" -p ActiveState -p SubState -p MainPID --no-pager || true
}
