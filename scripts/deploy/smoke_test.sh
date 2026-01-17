#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:3005}
ADMIN_TOKEN=${ADMIN_TOKEN:-}
PUBLIC_SITE_ID=${PUBLIC_SITE_ID:-}
PUBLIC_PAGE_SLUG=${PUBLIC_PAGE_SLUG:-}
PROJECT_ID=${PROJECT_ID:-}
CHAT_MESSAGE=${CHAT_MESSAGE:-"Tell me about Dubai investment"}
RATE_LIMIT_TEST=${RATE_LIMIT_TEST:-true}
RATE_LIMIT_ENDPOINT=${RATE_LIMIT_ENDPOINT:-"/api/projects/search?limit=1"}
RATE_LIMIT_REQUESTS=${RATE_LIMIT_REQUESTS:-130}

function request_public() {
  local method=$1
  local url=$2
  local data=${3:-}
  local tmp
  tmp=$(mktemp)
  local args=("-sS" "-o" "$tmp" "-w" "%{http_code}" "-X" "$method" "$url")
  if [ -n "$data" ]; then
    args+=("-H" "Content-Type: application/json" "-d" "$data")
  fi
  local code
  code=$(curl "${args[@]}")
  if [ "$code" -ge 400 ]; then
    echo "FAIL $method $url ($code)"
    cat "$tmp"
    rm "$tmp"
    exit 1
  fi
  rm "$tmp"
}

function request_admin() {
  local url=$1
  local optional=${2:-"false"}
  if [ -z "$ADMIN_TOKEN" ]; then
    echo "SKIP admin check (ADMIN_TOKEN not set): $url"
    return
  fi
  local tmp
  tmp=$(mktemp)
  local code
  code=$(curl -sS -o "$tmp" -w "%{http_code}" -H "Authorization: Bearer $ADMIN_TOKEN" "$url")
  if [ "$code" -eq 404 ] && [ "$optional" = "true" ]; then
    echo "WARN admin endpoint not found: $url"
    rm "$tmp"
    return
  fi
  if [ "$code" -ge 400 ]; then
    echo "FAIL GET $url ($code)"
    cat "$tmp"
    rm "$tmp"
    exit 1
  fi
  rm "$tmp"
}

echo "[smoke] BASE_URL=$BASE_URL"

# Admin health checks (require super-admin token)
request_admin "$BASE_URL/api/health"
request_admin "$BASE_URL/api/health/monetization"
request_admin "$BASE_URL/api/health/env" "true"
request_admin "$BASE_URL/api/health/billing" "true"
request_admin "$BASE_URL/api/billing/summary"
request_admin "$BASE_URL/api/billing/history"
request_admin "$BASE_URL/api/reports/summary"

# Public inventory search
request_public "GET" "$BASE_URL/api/projects/meta"
request_public "GET" "$BASE_URL/api/projects/search?limit=12"

# Public project detail (optional)
if [ -n "$PROJECT_ID" ]; then
  request_public "GET" "$BASE_URL/api/projects/$PROJECT_ID"
else
  echo "SKIP project detail (PROJECT_ID not set)"
fi

# Public chat preview
request_public "POST" "$BASE_URL/api/bot/preview/chat" "{\"message\":\"$CHAT_MESSAGE\"}"

# Rate limit test (public endpoint)
if [ "$RATE_LIMIT_TEST" = "true" ]; then
  echo "[smoke] rate limit test: $RATE_LIMIT_ENDPOINT ($RATE_LIMIT_REQUESTS requests)"
  limit_hit="false"
  for i in $(seq 1 "$RATE_LIMIT_REQUESTS"); do
    code=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE_URL$RATE_LIMIT_ENDPOINT")
    if [ "$code" -eq 429 ]; then
      limit_hit="true"
      break
    fi
  done
  if [ "$limit_hit" != "true" ]; then
    echo "FAIL rate limit not triggered for $RATE_LIMIT_ENDPOINT"
    exit 1
  fi
else
  echo "SKIP rate limit test (RATE_LIMIT_TEST=false)"
fi

# Public lead capture (optional)
if [ -n "$PUBLIC_SITE_ID" ] || [ -n "$PUBLIC_PAGE_SLUG" ]; then
  if [ -n "$PUBLIC_SITE_ID" ]; then
    LEAD_PAYLOAD="{\"name\":\"Smoke Test\",\"email\":\"smoke@entrestate.com\",\"message\":\"Smoke test lead\",\"siteId\":\"$PUBLIC_SITE_ID\",\"metadata\":{\"elapsedMs\":1200}}"
  else
    LEAD_PAYLOAD="{\"name\":\"Smoke Test\",\"email\":\"smoke@entrestate.com\",\"message\":\"Smoke test lead\",\"pageSlug\":\"$PUBLIC_PAGE_SLUG\",\"metadata\":{\"elapsedMs\":1200}}"
  fi
  request_public "POST" "$BASE_URL/api/leads" "$LEAD_PAYLOAD"
else
  echo "SKIP lead capture (PUBLIC_SITE_ID or PUBLIC_PAGE_SLUG not set)"
fi

echo "[smoke] All checks passed."
