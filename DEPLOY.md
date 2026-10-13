# Развертывание ai-cardio.ru

Стек: Next.js standalone + nginx + certbot. Docker-образ собирается в GitHub Actions и публикуется в GHCR.

## Что нужно

1. VPS на Ubuntu 22.04+ с публичным IP.
2. DNS A-записи для `ai-cardio.ru` и `www.ai-cardio.ru`.
3. Открытые порты 80 и 443.
4. Почтовый ящик для заявок формы (российский сервис; сейчас support@ai-cardio.ru на Beget).

## Первый деплой

```bash
git clone https://github.com/Cardio-Assistant/landing.git /opt/ai-cardio
cd /opt/ai-cardio

cp .env.example .env
nano .env
```

В `.env` заполните:

```bash
SMTP_HOST=smtp.beget.com
SMTP_PORT=465
SMTP_USER=support@ai-cardio.ru
SMTP_PASS='пароль ящика'
SMTP_FROM=support@ai-cardio.ru
SMTP_TO=support@ai-cardio.ru
```

`deploy.sh` читает `.env` как bash-скрипт: значение с `$`, `` ` ``, `!` или пробелами берите в одинарные кавычки.

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

## Демо и рабочая система

```
браузер → https://ai-cardio.ru/              → nginx → лендинг (app:3000, на VPS)
браузер → https://ai-cardio.ru/web/          → nginx → демо (cardio-web-demo:3000, на VPS)
браузер → https://app.ai-cardio.ru/web/      → nginx → frps:7001 ═tunnel═► ПК web:3001
                                                                         ПК: web → api → ML
```

**Демо** (`ai-cardio.ru/web`) — web-приложение, собранное с `DEMO_MODE=true`: все ответы api берутся из памяти, на
вымышленных данных, без сервера, базы и ML; изменения не сохраняются. Образ собирается в репозитории `web`
(`docker-compose.demo.yml`, см. `web/docs/DEMO.md`) и переносится на VPS без реестра:

```bash
# в репозитории web
docker compose -f docker-compose.demo.yml build
docker save cardio-web-demo:latest | gzip -1 | ssh <vps> 'gunzip | docker load'
# на VPS
cd /root/landing && docker compose up -d web-demo
```

Сервис `web-demo` (образ `cardio-web-demo:latest`, сеть `web`, `mem_limit 768m`, healthcheck) описан в
`docker-compose.override.yml` на VPS, вне git. nginx (`location /web/` в `nginx/conf.d/app.conf.template`) пропускает
тело запроса до 2 МБ, больше — тот же JSON-ответ 413, что и само демо. Если контейнер не запущен — заставка
`__demo_soon.html`.

**Рабочая система** (`app.ai-cardio.ru/web`) — без открытой регистрации (вход по приглашению администратора),
`noindex`. Она крутится на ПК без публичного IP, их связывает обратный туннель frp: ПК сам подключается к VPS.
Конфиг nginx — `nginx/conf.d/app.ai-cardio.conf.template` (на VPS лежит как `app.ai-cardio.conf`, сертификат —
отдельный, `certbot certonly --webroot -d app.ai-cardio.ru`).

Наружу открыт только порт `7000` (к нему подключается ПК). Порт `7001` живёт
внутри docker-сети и доступен только nginx'у. Всё уже прошито в `docker-compose.yml`
(сервис `frps`) и `proxy/`.

**На VPS:**
1. Задать общий секрет туннеля: `openssl rand -hex 32`, вписать в `.env` как `FRP_TOKEN`.
2. Открыть порт `7000/tcp` в firewall (80/443 уже нужны для сайта).
3. Обычный `sudo ./deploy.sh` — он поднимет и `frps` вместе с nginx.

**На ПК:**
1. Поставить `frpc` (бинарь с github.com/fatedier/frp/releases).
2. Взять `proxy/frpc.toml`, вписать `serverAddr = <IP VPS>`, задать тот же `FRP_TOKEN`
   (env или `/etc/frp/frpc.env`). Запустить: Linux — `proxy/frpc.service`; Windows —
   `frpc.exe -c frpc.toml` (автозапуск через Task Scheduler / nssm).
3. Поднять стек (в репо `api`): `docker compose -p cardio-unified -f docker-compose.unified.yml up -d` —
   web встанет на `:3001`, ровно туда смотрит `frpc`. В `api/.env`: `APP_BASE_URL=https://app.ai-cardio.ru/web`,
   `APP_SIGNUP_ENABLED=false`, `NEXT_PUBLIC_SIGNUP_ENABLED=false`, `NEXT_PUBLIC_APP_URL=https://app.ai-cardio.ru/web`.

**Проверка:** `https://ai-cardio.ru/` → лендинг; `https://ai-cardio.ru/web/auth` → «Войти в демонстрацию»;
`https://app.ai-cardio.ru/web/auth` → вход без вкладки «Регистрация». Если вместо него заставка «Сервис временно
недоступен» (`nginx/html/__app_unavailable.html`, на VPS лежит в `certbot/www/`) — не поднят frpc на ПК или не запущен web:3001.

## Проверка формы

После деплоя отправьте тестовую заявку через форму на сайте (с отметкой согласия). Письмо должно прийти на `SMTP_TO`.

Если письмо не пришло:

```bash
docker compose logs app | tail -50
```

Типичные причины:

- неверные `SMTP_USER` / `SMTP_PASS` (или пароль с `$`/`!` без кавычек в `.env`);
- закрыт исходящий порт 465 у хостинга;
- письмо ушло в спам: у домена должны быть SPF, DKIM и DMARC.

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
└─ src/app/api/contact/route.ts        # API формы заявок (e-mail)
```

## Безопасность

- `.env` остается на хосте и не попадает в образ.
- Форма ограничена rate limit: 5 заявок в минуту на IP.
- В форме есть honeypot-поле против простых ботов.
- Не коммитьте реальные пароли SMTP и токены GHCR.

## Персональные данные (152-ФЗ)

На сайте два документа: `/legal/privacy` (политика сайта) и `/legal/consent-contacts` (согласие для формы)
(тексты — `src/legal/content/`, реквизиты и сроки — `src/legal/operator.ts`). Согласия на регистрацию и пользовательского
соглашения веб-приложения на сайте нет (решение 13.10.2026): у приложения свои документы. Редиректов со старых адресов
не делаем: `/legal/consent-registration` и `/legal/terms` должны отдавать 404.

- Форма не отправится без отметки «Я даю согласие…»; `api/contact` отвечает 400 на запрос без `consent: true` и
  дописывает в заявку редакцию согласия (подтверждение по ч. 3 ст. 9).
- Заявки уходят **только по e-mail** (SMTP `smtp.beget.com`, ящик support@ai-cardio.ru) через российский почтовый
  сервис: трансграничной передачи нет, и Политика (раздел 5), и согласие (п. 5) говорят именно это. Не подключайте
  иностранный канал (мессенджер, облачную форму) без новой редакции обоих документов.
- Политика обещает хранить журналы веб-сервера не дольше 3 месяцев (`RETENTION.webLogsMonths`): настройте
  ротацию журналов nginx и docker (в `docker-compose.yml` она не задана), иначе срок не выполняется.
- Не подключайте аналитику, рекламные скрипты и внешние шрифты/CDN: Политика и уведомление о cookie говорят,
  что их нет.
