#!/usr/bin/env bash
# Shared strict observation checks for staging/production (sourced by observe-environment.sh).
set -euo pipefail

OBSERVE_FAILURES=0

observe_pass() {
  log_ok "PASS · $*"
}

observe_fail() {
  log_err "FAIL · $*"
  OBSERVE_FAILURES=$((OBSERVE_FAILURES + 1))
}

observe_warn() {
  log_warn "WARN · $*"
}

observe_assert_systemd_active() {
  local state
  state="$(systemctl is-active "${OPS_SERVICE}" 2>/dev/null || echo unknown)"
  if [[ "${state}" == "active" ]]; then
    observe_pass "systemd ${OPS_SERVICE} active"
  else
    observe_fail "systemd ${OPS_SERVICE} not active (state=${state})"
  fi
}

observe_assert_health_ok() {
  local health_ok db_status
  if ! health_ok="$(curl_json_field "${OPS_HEALTH_URL}" "ok" 2>/dev/null)"; then
    observe_fail "health endpoint unreachable: ${OPS_HEALTH_URL}"
    return
  fi
  db_status="$(curl_json_field "${OPS_HEALTH_URL}" "database" 2>/dev/null || echo unknown)"

  if [[ "${health_ok}" == "true" ]]; then
    observe_pass "health ok=true"
  else
    observe_fail "health ok!=true (${OPS_HEALTH_URL})"
  fi

  if [[ "${db_status}" == "ok" ]]; then
    observe_pass "health database=ok"
  else
    observe_fail "health database!=ok (database=${db_status})"
  fi
}

observe_assert_version_ok() {
  local version_env version_sha
  if ! version_env="$(curl_json_field "${OPS_VERSION_URL}" "environment" 2>/dev/null)"; then
    observe_fail "version endpoint unreachable: ${OPS_VERSION_URL}"
    return
  fi
  version_sha="$(curl_json_field "${OPS_VERSION_URL}" "gitSha" 2>/dev/null || echo unknown)"

  if [[ "${version_env}" == "${OPS_APP_ENV}" ]]; then
    observe_pass "version environment=${version_env}"
  else
    observe_fail "version environment mismatch expected=${OPS_APP_ENV} actual=${version_env}"
  fi

  if [[ -n "${version_sha}" && "${version_sha}" != "unknown" ]]; then
    observe_pass "version gitSha=${version_sha}"
  else
    observe_fail "version gitSha missing"
  fi
}

observe_print_resource_summary() {
  local load_avg mem_line disk_line restart_count
  load_avg="$(awk '{print $1"/"$2"/"$3}' /proc/loadavg 2>/dev/null || echo unknown)"
  mem_line="$(free -m 2>/dev/null | awk '/^Mem:/ {printf "used=%sMB total=%sMB (%.0f%%)", $3, $2, ($3/$2)*100}' || echo unknown)"
  disk_line="$(df -h / 2>/dev/null | awk 'NR==2 {printf "root used=%s of %s", $5, $2}' || echo unknown)"
  restart_count="$(systemctl show "${OPS_SERVICE}" -p NRestarts --value 2>/dev/null || echo unknown)"

  log_info "Resources: load=${load_avg} · memory ${mem_line} · disk ${disk_line} · NRestarts=${restart_count}"

  if [[ "${restart_count}" != "unknown" && "${restart_count}" -gt 10 ]]; then
    observe_warn "systemd NRestarts=${restart_count} (investigate instability)"
  fi
}

observe_print_recent_service_errors() {
  local lines
  lines="$(journalctl -u "${OPS_SERVICE}" --since "24 hours ago" -p err --no-pager -n 5 2>/dev/null | sed '/^-- No entries --$/d' || true)"
  if [[ -n "${lines}" ]]; then
    log_warn "Recent service errors (last 5 · 24h):"
    printf '%s\n' "${lines}"
  else
    log_info "Recent service errors (24h): none"
  fi
}

observe_check_public_http_surface() {
  if [[ -z "${OPS_PUBLIC_URL:-}" ]]; then
    observe_warn "OPS_PUBLIC_URL unset — skipping public HTTP checks"
    return
  fi

  local host http_url status_line location robots_body cert_days

  host="$(node -e "
    try {
      const u = new URL(process.argv[1]);
      process.stdout.write(u.hostname);
    } catch {
      process.exit(1);
    }
  " "${OPS_PUBLIC_URL}")"

  http_url="http://${host}/"

  status_line="$(curl -sI --max-time 15 "${http_url}" | head -n 1 || true)"
  location="$(curl -sI --max-time 15 "${http_url}" | awk 'BEGIN{IGNORECASE=1} /^Location:/ {print $2}' | tr -d '\r' || true)"
  if [[ "${status_line}" == *"301"* || "${status_line}" == *"302"* ]] && [[ "${location}" == https://* ]]; then
    observe_pass "HTTP redirects to HTTPS (${http_url})"
  else
    observe_fail "HTTP→HTTPS redirect missing or invalid (${http_url})"
  fi

  status_line="$(curl -sI --max-time 15 "${OPS_PUBLIC_URL}/" | head -n 1 || true)"
  if [[ "${status_line}" == *"401"* ]]; then
    observe_pass "HTTPS entry requires auth (401 without credentials)"
  elif [[ "${status_line}" == *"200"* ]]; then
    observe_warn "HTTPS entry returned 200 without credentials — Basic Auth may be disabled"
  else
    observe_fail "HTTPS entry unexpected status: ${status_line:-empty}"
  fi

  if curl -sI --max-time 15 "${OPS_PUBLIC_URL}/" | awk 'BEGIN{IGNORECASE=1} /x-robots-tag/ {found=1} END{exit found?0:1}'; then
    if curl -sI --max-time 15 "${OPS_PUBLIC_URL}/" | awk 'BEGIN{IGNORECASE=1} /x-robots-tag/ && /noindex/ {ok=1} END{exit ok?0:1}'; then
      observe_pass "X-Robots-Tag includes noindex"
    else
      observe_fail "X-Robots-Tag missing noindex"
    fi
  else
    observe_fail "X-Robots-Tag header missing"
  fi

  robots_body="$(curl -fsS --max-time 15 "${OPS_PUBLIC_URL}/robots.txt" 2>/dev/null || true)"
  if [[ "${robots_body}" == *"Disallow: /"* || "${robots_body}" == *"Disallow:/"* ]]; then
    observe_pass "robots.txt Disallow: /"
  else
    observe_fail "robots.txt missing Disallow: /"
  fi

  if command -v openssl >/dev/null 2>&1; then
    cert_days="$(echo | openssl s_client -servername "${host}" -connect "${host}:443" 2>/dev/null \
      | openssl x509 -noout -enddate 2>/dev/null \
      | sed 's/notAfter=//' || true)"
    if [[ -n "${cert_days}" ]]; then
      log_info "TLS certificate expires: ${cert_days}"
      if echo | openssl s_client -servername "${host}" -connect "${host}:443" 2>/dev/null \
        | openssl x509 -checkend $((14 * 86400)) -noout >/dev/null 2>&1; then
        observe_pass "TLS certificate valid >14 days"
      else
        observe_fail "TLS certificate expires within 14 days (${cert_days})"
      fi
    else
      observe_fail "TLS certificate expiry could not be read"
    fi
  else
    observe_warn "openssl not available — skipping TLS expiry check"
  fi
}
