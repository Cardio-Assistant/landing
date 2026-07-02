# Развертывание ai-cardio.ru

Стек: Next.js standalone + nginx + certbot. Docker-образ собирается в GitHub Actions и публикуется в GHCR.

## Что нужно

1. VPS на Ubuntu 22.04+ с публичным IP.
2. DNS A-записи для `ai-cardio.ru` и `www.ai-cardio.ru`.
3. Открытые порты 80 и 443.
4. Telegram-бот для заявок: создайте его через `@BotFather`, добавьте в нужный чат и получите `chat_id`.

## Первый деплой

```bash
git clone https://github.com/Cardio-Assistant/landing.git /opt/ai-cardio
cd /opt/ai-cardio

cp .env.example .env
nano .env
```

В `.env` заполните:

```bash
TELEGRAM_BOT_TOKEN=1234567890:your_bot_token
TELEGRAM_CHAT_ID=-1001234567890
```

Если GHCR-пакет приватный, также заполните `GHCR_USER` и `GHCR_TOKEN` с правом `read:packages`.

```bash
sudo ./deploy.sh
```

## Обновление

```bash
git push origin main
```

После зеленого GitHub Actions на VPS:

```bash
cd /opt/ai-cardio
./deploy.sh --update
```

## Демо через туннель: `ai-cardio.ru/web/*` → домашний ПК

Лендинг отдаётся с VPS, а web-приложение (демо) крутится на домашнем ПК без
публичного IP. Их связывает обратный туннель frp: ПК сам подключается к VPS.

```
браузер → https://ai-cardio.ru/          → nginx → лендинг (app:3000, на VPS)
браузер → https://ai-cardio.ru/web/auth  → nginx → frps:7001 ═tunnel═► ПК web:3001
                                                                        ПК: web → api → ML
```

Наружу открыт только порт `7000` (к нему подключается ПК). Порт `7001` живёт
внутри docker-сети и доступен только nginx'у. Всё уже прошито в `docker-compose.yml`
(сервис `frps`), `nginx/conf.d/app.conf.template` (`location /web/`) и `proxy/`.

**На VPS:**
1. Задать общий секрет туннеля: `openssl rand -hex 32`, вписать в `.env` как `FRP_TOKEN`.
2. Открыть порт `7000/tcp` в firewall (80/443 уже нужны для сайта).
3. Обычный `sudo ./deploy.sh` — он поднимет и `frps` вместе с nginx.

**На домашнем ПК:**
1. Поставить `frpc` (бинарь с github.com/fatedier/frp/releases).
2. Взять `proxy/frpc.toml`, вписать `serverAddr = <IP VPS>`, задать тот же `FRP_TOKEN`
   (env или `/etc/frp/frpc.env`). Запустить: Linux — `proxy/frpc.service`; Windows —
   `frpc.exe -c frpc.toml` (автозапуск через Task Scheduler / nssm).
3. Поднять демо-стек из готовых образов (в репо `api`):
   `docker compose -f docker-compose.prod.yml up -d` — web встанет на `:3001`,
   ровно туда смотрит `frpc`.

**Проверка:** `https://ai-cardio.ru/` → лендинг; `https://ai-cardio.ru/web/auth`
→ страница входа демо с ПК. Если `/web/*` даёт 502 — не поднят frpc на ПК или не
запущен web:3001.

## Проверка Telegram

После деплоя отправьте тестовую заявку через форму на сайте. Сообщение должно прийти в чат, указанный в `TELEGRAM_CHAT_ID`.

Если сообщение не пришло:

```bash
docker compose logs app | tail -50
```

Типичные причины:

- неверный `TELEGRAM_BOT_TOKEN`;
- бот не добавлен в чат;
- указан неправильный `TELEGRAM_CHAT_ID`;
- для темы супергруппы нужен `TELEGRAM_THREAD_ID`.

## Полезные команды

```bash
docker compose logs -f
docker compose logs -f app
docker compose logs -f nginx
docker compose ps
docker compose restart
docker compose down
./deploy.sh --update
sudo ./deploy.sh --renew
sudo ./deploy.sh --staging
```

## Структура

```text
.
├─ .github/workflows/build.yml         # CI: build & push в GHCR
├─ Dockerfile                          # multi-stage Next.js standalone
├─ docker-compose.yml                  # production
├─ docker-compose.build.yml            # локальная сборка через compose
├─ deploy.sh                           # one-command deploy
├─ .env.example                        # шаблон переменных
├─ nginx/conf.d/                       # nginx templates
└─ src/app/api/contact/route.ts        # API формы заявок в Telegram
```

## Безопасность

- `.env` остается на хосте и не попадает в образ.
- Форма ограничена rate limit: 5 заявок в минуту на IP.
- В форме есть honeypot-поле против простых ботов.
- Не коммитьте реальные токены Telegram и GHCR.
