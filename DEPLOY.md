# Развёртывание ai-cardio.ru

Стек: Next.js (standalone) + nginx (443 SSL) + certbot (Let's Encrypt с авто-обновлением).
Образ собирается в **GitHub Actions** и публикуется в **GHCR** (GitHub Container Registry).
**VPS ничего не собирает** — только тянет готовый образ. Это критично для маленьких VPS (1ГБ RAM).

## Архитектура CI/CD

```
git push main → GitHub Actions (build.yml) → ghcr.io/cardio-assistant/landing:latest
                                                            ↓
                                          sudo ./deploy.sh --update на VPS
                                                            ↓
                                                  docker compose pull + up
```

## 0. Что нужно перед первым деплоем

1. **VPS на Ubuntu 22.04+** с публичным IP. Хватит 1 vCPU / 1ГБ RAM.
2. **DNS A-записи** (у регистратора домена):
   - `ai-cardio.ru` → IP сервера
   - `www.ai-cardio.ru` → IP сервера
   Проверка: `dig +short ai-cardio.ru` должен вернуть IP. Без этого certbot не выдаст сертификат.
3. **Открытые порты 80 и 443** на VPS (`ufw allow 80/tcp && ufw allow 443/tcp` если ufw активен).
4. **Пароль приложения Яндекса** для SMTP: https://id.yandex.ru/security → «Пароли приложений» → «Почта».

## 1. Первая публикация образа (один раз)

На своём ноутбуке/локально:

```bash
git push origin main
```

GitHub Actions автоматически:
- Собирает образ из `Dockerfile`
- Пушит в `ghcr.io/cardio-assistant/landing:latest` (+ тег с короткой sha коммита)

Прогресс можно смотреть: **GitHub repo → Actions**.

### Сделать пакет публичным (рекомендуется)

После первой успешной сборки:
1. GitHub → твоя страница организации **Cardio-Assistant** → вкладка **Packages**
2. Кликнуть на пакет `landing`
3. Справа **Package settings** → внизу **Change visibility** → **Public**

После этого VPS сможет тянуть образ без логина. Если оставишь приватным — нужно будет заполнить `GHCR_USER`/`GHCR_TOKEN` в `.env` на сервере (см. ниже).

## 2. Развёртывание на VPS (одной командой)

На свежем VPS:

```bash
git clone https://github.com/Cardio-Assistant/landing.git /opt/ai-cardio
cd /opt/ai-cardio

cp .env.example .env
nano .env
# Заполнить SMTP_PASS (пароль приложения Яндекса).
# Если пакет приватный — заполнить GHCR_USER и GHCR_TOKEN.

sudo ./deploy.sh
```

Что произойдёт:
1. Поставится Docker (если не стоял).
2. Скачается готовый образ из GHCR (~100МБ, без сборки).
3. Поднимется временный nginx :80, certbot выпустит Let's Encrypt.
4. Переключение на production-конфиг nginx с SSL.
5. Старт всего стека.

Через ~1–2 минуты сайт открывается на **https://ai-cardio.ru**.

## 3. Обновление кода

```bash
# Локально:
git push origin main
# ждёшь зелёного билда GitHub Actions (~3-5 минут)

# На VPS:
ssh user@vps
cd /opt/ai-cardio
./deploy.sh --update
```

Команда `--update` делает только `docker compose pull && docker compose up -d` — это секунды, без пересборки и без переключения SSL-конфигов.

## 4. Если пакет приватный

Сгенерируй Personal Access Token на GitHub:
1. **Settings → Developer settings → Personal access tokens (classic) → Generate new token**
2. Scope: **только `read:packages`**
3. Скопировать токен (показывается один раз)
4. На VPS в `.env`:
   ```
   GHCR_USER=твой-github-username
   GHCR_TOKEN=ghp_xxxxxxxxxxxx
   ```
5. `sudo ./deploy.sh` сам сделает `docker login ghcr.io`.

## 5. Локальная сборка образа (если не хочешь ждать CI)

Если нужно собрать локально и запушить в GHCR вручную:

```bash
# Залогиниться (один раз):
echo $GHCR_TOKEN | docker login ghcr.io -u твой-github-username --password-stdin

# Собрать и запушить:
docker build -t ghcr.io/cardio-assistant/landing:latest .
docker push ghcr.io/cardio-assistant/landing:latest

# На VPS:
./deploy.sh --update
```

Или через compose-override для локального запуска без push:

```bash
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d
```

## Полезные команды

```bash
docker compose logs -f                # все логи
docker compose logs -f app            # только приложение
docker compose logs -f nginx          # только nginx
docker compose ps                     # статус контейнеров
docker compose restart                # перезапуск
docker compose down                   # остановить всё
./deploy.sh --update                  # быстро: pull + restart (для CI/CD цикла)
sudo ./deploy.sh --renew              # форс-обновление сертификата
sudo ./deploy.sh --staging            # тестовый сертификат LE (для отладки)
```

## Проверка SMTP

После деплоя отправь тестовую заявку через форму. Письмо должно прийти на `SMTP_TO`.
Если не пришло — смотри логи:

```bash
docker compose logs app | tail -50
```

Типичные ошибки:
- **`535 5.7.8 Error: authentication failed`** — неверный `SMTP_PASS`. Должен быть «пароль приложения», не основной.
- **Письма в спаме** — проверь папку «Спам», добавь отправителя в адресную книгу.

## Структура

```
.
├─ .github/workflows/build.yml         # CI: build & push в GHCR
├─ Dockerfile                          # multi-stage Next.js standalone
├─ docker-compose.yml                  # production (pull из GHCR)
├─ docker-compose.build.yml            # override для локальной сборки
├─ deploy.sh                           # one-command deploy
├─ .env.example                        # шаблон переменных
├─ nginx/conf.d/
│  ├─ init.conf.template               # HTTP-only для выпуска cert
│  └─ app.conf.template                # production SSL (443)
├─ certbot/                            # генерится автоматически (gitignored)
└─ src/app/api/contact/route.ts        # API формы заявок (SMTP Yandex)
```

## Безопасность

- HSTS (1 год), X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Rate limit формы (5 заявок/мин на IP) + honeypot
- SMTP-пароль в `.env` на хосте, не в образе
- `.env` в `.gitignore` — никогда не коммить
