#!/usr/bin/env bash
# One-command deploy для Ubuntu 22.04+
# Тянет готовый образ из GHCR — на VPS ничего не собирается.
#
# Usage:
#   sudo ./deploy.sh                          # полный pipeline (pull + up)
#   sudo ./deploy.sh --skip-docker-install    # если Docker уже стоит
#   sudo ./deploy.sh --staging                # выпуск тестового сертификата LE
#   ./deploy.sh --renew                       # форс-обновление сертификата
#   ./deploy.sh --update                      # быстро: только pull + restart

set -euo pipefail

DOMAIN="ai-cardio.ru"
ALT_DOMAIN="www.ai-cardio.ru"
EMAIL="alexosipov03@yandex.com"
STAGING=0
SKIP_DOCKER_INSTALL=0
RENEW_ONLY=0
UPDATE_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --staging) STAGING=1 ;;
    --skip-docker-install) SKIP_DOCKER_INSTALL=1 ;;
    --renew) RENEW_ONLY=1 ;;
    --update) UPDATE_ONLY=1 ;;
    *) echo "Unknown arg: $arg"; exit 1 ;;
  esac
done

log()  { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[deploy]\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31m[deploy]\033[0m %s\n' "$*" >&2; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

compose() {
  if command -v docker >/dev/null && docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

install_docker() {
  if command -v docker >/dev/null 2>&1; then
    log "Docker уже установлен — пропускаю установку"
    return
  fi
  if [[ "$SKIP_DOCKER_INSTALL" -eq 1 ]]; then
    err "Docker не найден, а --skip-docker-install передан"
    exit 1
  fi
  log "Устанавливаю Docker для Ubuntu…"
  apt-get update
  apt-get install -y ca-certificates curl gnupg lsb-release
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    | tee /etc/apt/sources.list.d/docker.list >/dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
  log "Docker установлен: $(docker --version)"
}

ensure_env() {
  if [[ ! -f .env ]]; then
    if [[ -f .env.example ]]; then
      err "Файл .env не найден. Скопируй .env.example → .env и заполни:"
      err "  cp .env.example .env && nano .env"
    else
      err "Файл .env не найден"
    fi
    exit 1
  fi
  set -a; . ./.env; set +a
}

ghcr_login() {
  # Если пакет публичный — auth не нужен. Для приватного — задай GHCR_USER + GHCR_TOKEN в .env
  if [[ -n "${GHCR_USER:-}" && -n "${GHCR_TOKEN:-}" ]]; then
    log "Логинюсь в ghcr.io как $GHCR_USER…"
    echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
  fi
}

prepare_dirs() {
  mkdir -p certbot/www certbot/conf nginx/conf.d
}

use_init_conf() {
  cp nginx/conf.d/init.conf.template nginx/conf.d/default.conf
  rm -f nginx/conf.d/app.conf
}

use_app_conf() {
  cp nginx/conf.d/app.conf.template nginx/conf.d/default.conf
}

issue_cert() {
  log "Поднимаю nginx во временном HTTP-режиме для ACME challenge…"
  use_init_conf
  compose up -d nginx

  log "Запрашиваю сертификат Let's Encrypt для $DOMAIN, $ALT_DOMAIN…"
  local staging_flag=""
  [[ "$STAGING" -eq 1 ]] && staging_flag="--staging"

  compose run --rm --entrypoint "" certbot certbot certonly \
    --webroot -w /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos --no-eff-email \
    --non-interactive \
    $staging_flag \
    -d "$DOMAIN" -d "$ALT_DOMAIN"

  if [[ ! -f certbot/conf/options-ssl-nginx.conf ]]; then
    log "Загружаю рекомендованные SSL-параметры certbot…"
    curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
      -o certbot/conf/options-ssl-nginx.conf
    curl -fsSL https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
      -o certbot/conf/ssl-dhparams.pem
  fi
}

renew_cert() {
  ensure_env
  log "Обновляю сертификат…"
  compose run --rm --entrypoint "" certbot certbot renew --webroot -w /var/www/certbot
  compose exec nginx nginx -s reload
}

quick_update() {
  ensure_env
  ghcr_login
  log "Тяну свежий образ из GHCR…"
  compose pull app
  log "Перезапускаю приложение…"
  compose up -d app
  log "✅ Обновлено"
}

main() {
  if [[ "$RENEW_ONLY" -eq 1 ]]; then
    renew_cert
    exit 0
  fi
  if [[ "$UPDATE_ONLY" -eq 1 ]]; then
    quick_update
    exit 0
  fi

  install_docker
  ensure_env
  ghcr_login
  prepare_dirs

  log "Тяну готовый образ приложения из GHCR…"
  compose pull app

  if [[ -d certbot/conf/live/$DOMAIN ]]; then
    log "Сертификат уже существует — пропускаю выпуск"
  else
    issue_cert
  fi

  log "Активирую production-конфиг nginx и запускаю весь стек…"
  use_app_conf
  compose up -d

  log "Жду готовности приложения…"
  for i in {1..30}; do
    if compose exec -T app wget -qO- http://127.0.0.1:3000/about >/dev/null 2>&1; then
      log "Приложение готово"
      break
    fi
    sleep 2
  done

  log ""
  log "✅ Готово. Сайт должен быть доступен на https://$DOMAIN"
  log ""
  log "Полезное:"
  log "  Логи:       docker compose logs -f"
  log "  Обновить:   ./deploy.sh --update   (только pull + restart, без вопросов)"
  log "  Cert renew: ./deploy.sh --renew"
}

main "$@"
