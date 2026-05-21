# Развёртывание ai-cardio.ru

Полностью контейнерное развёртывание: Next.js (standalone) + nginx (443 SSL) + certbot (Let's Encrypt с авто-обновлением).

## Что понадобится перед началом

1. **VPS на Ubuntu 22.04+** с публичным IP.
2. **A-записи DNS:**
   - `ai-cardio.ru` → IP сервера
   - `www.ai-cardio.ru` → IP сервера
   (Проверь: `dig +short ai-cardio.ru` должен отдать IP сервера.)
3. **Открытые порты 80 и 443** на VPS.
4. **Пароль приложения Яндекса** для SMTP — создаётся здесь: https://id.yandex.ru/security → «Пароли приложений» → «Почта».

## Развёртывание одной командой

На свежем VPS:

```bash
# 1) Залить проект
git clone <repo-url> /opt/ai-cardio && cd /opt/ai-cardio

# 2) Заполнить .env
cp .env.example .env
nano .env   # вставить SMTP_PASS (пароль приложения Яндекса)

# 3) Одна команда — всё остальное
sudo ./deploy.sh
```

Что произойдёт:
1. Поставится Docker (если ещё не стоял).
2. Соберётся образ приложения.
3. Поднимется временный nginx на :80 для ACME-challenge.
4. Certbot выпустит сертификат Let's Encrypt для `ai-cardio.ru` и `www.ai-cardio.ru`.
5. Подключится production-конфиг nginx с SSL.
6. Стартуют все три контейнера: `app`, `nginx`, `certbot` (последний раз в 12ч проверяет обновление сертификата).

Через ~1–2 минуты сайт доступен на **https://ai-cardio.ru**.

## Обновление кода

```bash
cd /opt/ai-cardio
git pull
sudo ./deploy.sh
```

Сертификат не перевыпускается — повторно используется существующий.

## Проверка SMTP

После деплоя отправь тестовую заявку через форму на сайте. Письмо должно прийти на `SMTP_TO`. Если не пришло:

```bash
docker compose logs app | grep -i smtp
docker compose logs app | grep -i mail
```

Типовые проблемы:
- **`535 5.7.8 Error: authentication failed`** — неверный `SMTP_PASS`. Сгенерируй именно «пароль приложения» (не основной пароль аккаунта).
- **Письма уходят в спам** — добавь домен Яндекс-почты в SPF/DKIM на стороне отправителя (если у тебя свой домен у Яндекса) или просто проверь папку «Спам».

## Полезные команды

```bash
docker compose logs -f                      # все логи
docker compose logs -f app                  # только приложение
docker compose logs -f nginx                # только nginx
docker compose restart                      # перезапуск
docker compose down                         # остановить всё
sudo ./deploy.sh --renew                    # форс-обновление сертификата
sudo ./deploy.sh --staging                  # тестовый сертификат (для отладки)
```

## Структура

```
.
├─ Dockerfile                          # multi-stage сборка Next.js standalone
├─ docker-compose.yml                  # app + nginx + certbot
├─ deploy.sh                           # one-command deploy
├─ .env.example                        # шаблон переменных
├─ nginx/conf.d/
│  ├─ init.conf.template               # HTTP-only для выпуска сертификата
│  └─ app.conf.template                # production SSL config (443)
├─ certbot/
│  ├─ conf/                            # сертификаты (создастся автоматически)
│  └─ www/                             # webroot для ACME (создастся автоматически)
└─ src/app/api/contact/route.ts        # API формы заявок (SMTP Yandex)
```

## Безопасность

- Включён HSTS (1 год), X-Frame-Options, X-Content-Type-Options.
- Форма защищена rate limit (5 запросов/мин на IP) и honeypot-полем.
- SMTP-пароль никогда не попадает в Docker-образ — читается из `.env` на хосте через `env_file`.
- Не коммить `.env` в git (он уже в `.gitignore`).

## Тестирование локально перед деплоем

```bash
pnpm install
pnpm build
pnpm start
# открой http://localhost:3000/about
```

Для теста SMTP создай локальный `.env.local` с тем же содержимым, что и `.env` на сервере.
