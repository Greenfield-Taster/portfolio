# Портфоліо — Anastasiia Horbachova

Персональний сайт-портфоліо: досвід, проєкти та стек. Англійською.
Живе на https://horbachova.com

**Стек:** React 19 · Vite · TypeScript · SCSS · GSAP + ScrollTrigger · Lenis ·
three · EmailJS. Локально все піднімає .NET Aspire.

## Структура

- `frontend/` — сам сайт. Тільки ця тека їде в продакшн.
- `WebStarter.AppHost/` — Aspire AppHost, піднімає Vite разом із сервером.
- `WebStarter.Server/` — ASP.NET Core. Для локальної розробки; сайт від нього
  не залежить.
- `docs/` — спека, план і дизайн-напрямки.

## Запуск

```powershell
aspire start          # усе разом
```

Тільки фронтенд:

```powershell
cd frontend
npm install
npm run dev
```

### Відоме: `npm install` тут падає

На цій машині звичайний `npm install` / `npm i` (npm 11.4.2) падає з
помилкою arborist `Cannot read properties of null (reading 'edgesOut')`.
Робочий обхід:

```powershell
npx --yes npm@12 install
```

**Не додавайте `--legacy-peer-deps`** — цей прапорець мовчки не ставить
транзитивні peer-залежності, і тести потім падають незрозуміло чому. Це вже
коштувало часу кілька разів під час збірки цього сайту.

## Тести

```powershell
cd frontend
npm test              # модульні (117 тестів)
npm run lint

npm run e2e           # з кореня: наскрізні, Playwright (6 тестів)
```

CI в репозиторії наразі немає. Якщо колись з'явиться, `playwright.config.ts`
пінить `channel: 'chromium'` — тут скорочений `chromium-headless-shell` не
завантажився (мережеві таймаути до CDN Playwright), тож тести запускаються
через повний Chrome for Testing замість окремого shell-бінарника. У CI цей
канал треба встановити явно кроком `npx playwright install chromium`, інакше
пін не спрацює.

## Контент

Увесь текст сайту лежить у `frontend/src/data/`. Новий проєкт — це один
об'єкт у `projects.ts`; компоненти чіпати не треба. Порядок задається полем
`order`: усе з резюме має менші номери, ніж проєкти з GitHub.

## Матеріали, яких ще бракує

Кожен пункт — просто файл, який треба покласти на місце; код міняти не треба.

| Матеріал | Куди покласти | Що зміниться, коли з'явиться |
|---|---|---|
| Портрет | `frontend/public/portrait.jpg` | Секція About зараз показує навмисний плейсхолдер «AH» замість фото |
| Скриншоти проєктів | `frontend/public/projects/*.webp`, тоді `cover` у відповідному проєкті в `projects.ts` | Картки зараз показують згенерований плейсхолдер |
| Соцпревʼю (OG-картинка) | `frontend/public/og.png` | Вже є згенероване зображення; замінити на актуальне за потреби |
| Ключі EmailJS | `frontend/.env` (за зразком `frontend/.env.example`) | Форма зараз валідна, але чесно повідомляє, що не підключена |
| Опис `citadel-roof-tech` | `frontend/src/data/projects.ts` | Картка проєкту зараз має короткий підсумок замість розгорнутого опису |

## Відоме обмеження: JSON-LD і бот-прев'ю

JSON-LD у `<head>` вставляється клієнтським JavaScript, тому в HTML, який
віддає сервер, його немає. Google виконує JavaScript і побачить розмітку;
більшість ботів, що генерують прев'ю посилань (Telegram, LinkedIn, Slack),
JavaScript не виконують і JSON-LD не побачать. Для них картку несуть звичайні
теги Open Graph у `index.html` — саме тому існує `og.png`. Це свідома ціна
статичного сайту без пререндеру.

## Деплой

Cloudflare Pages, тека `frontend/dist`. В продакшн їде тільки ця тека —
`WebStarter.AppHost` і `WebStarter.Server` лишаються в репозиторії лише для
локального оркестрування.

```powershell
cd frontend
npm run build
```

Налаштування збірки в Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `frontend`

Змінні середовища для форми — з `frontend/.env.example`.

`frontend/public/_headers` вже задає кешування для хешованих ассетів і базові
security-заголовки; Cloudflare Pages підхоплює цей файл автоматично.
`_redirects` не потрібен: сайт — одна сторінка без клієнтського роутера.

Підключення репозиторію до Cloudflare Pages та перемикання домену
`horbachova.com` на новий деплой — окремий крок, який виконує сама
Анастасія, коли буде готова. Старий деплой на HIC.UA FTP та репозиторій
`horbachova` лишаються недоторканими, доки новий сайт не підтверджено живим.
