# ATELIER Configurator — Архітектурний план

Статус: **E1 (фундамент) — виконано. E2 (MVP конфігуратора) — виконано.** Далі: E3 (розширення), E4 (Worker/Telegram).

## Виконані етапи

### E1 — Рефакторинг конфігурації ✅
- `src/store/config.ts` — zustand store конфігурації: `defaultConfig` (клон shipped-пресету),
  історія undo/redo (ліміт 50), `commit` (з історією), `replace` (без історії),
  `beginEdit`/`endEdit` (текстові поля = один крок історії), `reset`; хук `useBrand()`.
- Усі storefront-компоненти читають конфігурацію через `useBrand()` замість статичного `activeBrand`.
- Головна та info-сторінки винесені в client-view компоненти; server-сторінки — тонкі обгортки
  (метадані, generateStaticParams і 404 лишилися статичними).

### E2 — MVP конфігуратора ✅
- `/configure` — фулскрін-оверлей: TopBar (Desktop/Mobile, Undo/Redo/Reset, Edit/Preview, «Надіслати макет»),
  Sidebar (Бренд / Hero / Каталог, українською), live-прев'ю справжнього магазину.
- Клік-редагування: `useEditable()` додає підсвітку/виділення; активні лише доки конфігуратор змонтований
  (`editor.active`) і в Edit Mode — публічний сайт не зачіпається.
- Бренд: назва, текст логотипа, логотип-зображення, палітра (5 пресетів + 6 color-пікерів), контакти.
- Hero: фото (upload/демо), затемнення (слайдер), надзаголовок, заголовок, кнопка, підпис.
- Каталог: заголовок секції, колонки desktop 2/3/4 і mobile 1/2 (CSS-змінні `--product-columns*`),
  назви/ціни/фото товарів, порядок (↑↓), приховування; приховані товари зникають з усіх сторінок.
- Завантажені фото стискаються в dataURL (canvas → WebP ≤10 МБ, `src/lib/image.ts`), рендер через `SmartImage`.
- Desktop/Mobile прев'ю: media-запити сайту переведено на `@container` (обгортка `.storefront`),
  fluid-типографіка на `cqw` — у вузькому фреймі рендериться справжня мобільна верстка.
- Режим перегляду: інструменти зникають, магазин виглядає як живий; плаваюча кнопка повернення.
- Модалка «Надіслати макет»: поля (ім'я, контакт, бренд, побажання, доп. функції),
  скриншот прев'ю (html-to-image → JPEG), POST на `NEXT_PUBLIC_SUBMIT_ENDPOINT`;
  якщо endpoint не налаштований — завантаження конфігурації JSON-файлом (чесний фолбек).
- Плаваюча кнопка «Налаштувати під свій бренд» на публічних сторінках (`.configure-cta` у globals.css).
- Перевірено Playwright-ом: live-редагування, undo, режим перегляду, мобільний фрейм, мобільний редактор
  (нижня панель), консоль без помилок; tsc/vitest чисті.

---

## 1. Результати аналізу існуючного проєкту

### 1.1 Що вже готове (переваги)

- **`src/config/types.ts` + `brands.ts`** — проєкт уже централізовано конфігурується через `BrandConfig`:
  назва, логотип (текст/зображення), favicon, палітра, шрифти, SEO, hero (eyebrow/title/image/cta/caption),
  набір і **порядок секцій** (`featuredSections`), заголовки секцій, колекції, 8 демо-товарів, соцмережі, контакти.
- **Кольори й шрифти подаються як CSS-змінні** (`layout.tsx`: `--background`, `--text`, `--accent`, `--font-*`) →
  зміна теми = зміна змінних, без переписування стилів.
- **Три пресети брендів** (`atelier`, `form`, `object`) уже доводять, що шаблон конфігурується без ломки дизайну.
- **`zustand` v5 уже в залежностях** (кошик) — природне місце для store конфігурації.
- **`motion`** уже є — плавні анімації панелей конфігуратора.
- Image picker матиме готовий набір демо-фото: `public/images/*` (7 фото).

### 1.2 Що потрібно адаптувати (гепи)

| Проблема | Де | Рішення |
|---|---|---|
| `activeBrand` — module-level константа, статичний імпорт у ~15 файлах | `Header`, `Footer`, `ProductCard`, `page.tsx`, … | Перевести споживання на `useBrand()` (zustand selector). Без конфігуратора store ініціалізується з `activeBrand` → поведінка звичайного сайту не змінюється. |
| Головна — server component, не оновлюється live | `app/page.tsx` | Винести секції (Hero, Arrivals, Editorial, Collections, Story) у client-компоненти; `page.tsx` стає тонкою обгорткою. |
| Жорстко зашиті тексти | nav-посилання в `Header.tsx`; eyebrow/заголовки в `page.tsx` ("CURATED FOR YOU", "NEW SEASON / NEW FORMS", "THE NEW PERSPECTIVE", "EST. FOR EVERY DAY"); marquee-line | Додати ці поля в конфіг (`nav[]`, `home.*`, `hero.*`). |
| Сітка товарів зафіксована в CSS (4 / 2 колонки) | `globals.css` `.product-grid` | Динамічний inline `grid-template-columns` з конфігу (desktop 2/3/4, mobile 1/2) з контролем `--brand-*`. |
| Затемнення hero та позиція тексту зафіксовані в CSS | `.hero-shade`, `.hero-bottom` | `hero.shade` (0–80%), `hero.textPosition` (left-bottom / centered / left-top), готові композиції. |
| `next/image` не працює з `blob:` URL | завантажені фото | Завантажені фото стискаються через canvas → **dataURL (WebP, ~1600px)**; у прев'ю рендер через `<img>` для dataURL (next/image — лише для статичних шляхів). |

### 1.3 Висновок

Масштабного переписування не потрібно. Потрібно: (а) перевести читання `activeBrand` на реактивний store,
(б) розширити `BrandConfig` полями конфігуратора, (в) додати configurator-шар поверх існуючих компонентів.

---

## 2. Модель конфігурації (розширення `BrandConfig`)

Нові поля (усі опціональні з безпечними дефолтами):

```ts
type NavItem = { id: string; label: string; href: string; visible: boolean };

type StoreConfig = BrandConfig & {
  logo: { text: string; image?: string };          // image = dataURL або статичний шлях
  nav: NavItem[];                                   // редаговані підписи навігації
  hero: BrandConfig["hero"] & {
    textPosition: "left-bottom" | "centered" | "left-top";
    shade: number;                                  // 0..0.8
    mobileImage?: string;
    composition: "classic" | "split" | "minimal";   // готові варіанти
  };
  home: BrandConfig["home"] & {
    desktopColumns: 2 | 3 | 4;
    mobileColumns: 1 | 2;
    sections: Array<SectionKey>;                    // впорядкований список із visibility
  };
  products: ConfigurableProduct[];                  // name/price/image/order/hidden
  collections: EditableCollection[];                // title/description/image
};

type SectionKey = "arrivals" | "editorial" | "collections" | "story" | "newsletter";

type ConfigurableProduct = Product & {
  customImage?: string;   // dataURL; рендер має пріоритет над images[0]
  hidden?: boolean;
};
```

`SectionKey` тягнеться з існуючого `featuredSections` — секції вже рендеряться з масиву, тож порядок
і показ/приховування майже готові, додається лише UI переміщення (вгору/вниз кнопками, без drag-and-drop).

---

## 3. Архітектура

### 3.1 Шари

```
src/
  config/
    types.ts            — розширені типи (StoreConfig)
    defaults.ts         — дефолтна конфігурація (на базі існуючого пресету atelier)
  store/
    config.ts           — zustand: config, undo/redo (власна історія), editMode, device, selection
    configHistory.ts    — commit/snapshot логіка (дискретні дії; текст — commit на blur/debounce)
    cart.ts             — без змін
  components/
    storefront/         — Header, Hero, ProductGrid, ProductCard, Collections, Footer
                          (перенесені з кореня components/, читають useBrand(), мінімальні правки)
    configurator/
      ConfiguratorShell.tsx   — компонує TopBar + Sidebar + Preview
      PreviewToolbar.tsx      — Desktop/Mobile, Undo/Redo, Reset, Edit/Preview toggle
      Sidebar.tsx             — розділи: Бренд / Hero / Товари / Секції / Контакти
      PropertyControls.tsx    — текстові поля, кольорові свотчі, селекти, слайдери
      ImagePicker.tsx         — upload (з стисненням) + вибір із демо-фото
      Editable.tsx            — обгортка «клікни й редагуй» (підсвітка, outline, aria)
      SubmissionModal.tsx     — форма заявки → POST на Worker
  app/
    configure/page.tsx  — сторінка конфігуратора (клієнтська)
    page.tsx та ін.     — звичайний сайт: компоненти читають дефолтну конфігурацію
workers/
  telegram/             — окремий Cloudflare Worker (не в Next-бандлі)
    src/index.ts        — валідація, rate limit, Telegram Bot API (sendMessage + sendPhoto)
    wrangler.toml
```

### 3.2 Потік даних

1. `useStoreConfig()` — zustand store, ініціалізація з `defaults` (= поточний `activeBrand`).
2. Storefront-компоненти замінюють `import { activeBrand }` → `useBrand()` (selector; для
   server-залишків типу `generateStaticParams` лишається статичний `activeBrand`).
3. Конфігуратор на `/configure` рендерить **ті самі storefront-компоненти** у центральній області
   (in-page, не iframe) — редагування store миттєво перерендерює прев'ю.
4. Клік по `Editable`-елементу → `selectElement(id)` → Sidebar показує властивості саме цього елемента.
5. Preview Mode: `editMode = false` → підсвітки/панелі зникають, навігація та кошик працюють як на живому сайті.

### 3.3 Чому in-page прев'ю, а не iframe

iframe дав би ізоляцію, але додав би postMessage-протокол, дублювання store, проблеми з
прокруткою/висотою та повільний перший рендер. Оскільки конфігурація — простий serializable-об'єкт,
а компоненти вже клієнтські, in-page рендер дає той самий результат без інфраструктури.

### 3.4 Редагування без ломки дизайну (межі свободи)

- Тексти — вільні (з валідацією довжини, tooltip «занадто довгий текст»).
- Фото — тільки заміна (upload/демо), без обрізки довільних блоків; aspect-ratio фіксує CSS.
- Композиції — лише з готового списку (`composition`, `textPosition`, колонки, порядок секцій).
- Жодних довільних HTML/CSS-редакторів.

---

## 4. UX-сценарії

### 4.1 Перший запуск
Демо-сайт ATELIER → плаваюча кнопка/банер «Налаштувати під свій бренд» → `/configure` у Edit Mode,
онбординг-підказка (1 рядок): «Клікніть на будь-який елемент, щоб змінити його».

### 4.2 Клік-редагування
- Edit Mode: редактовані елементи мають тонкий outline + іконку олівця при hover.
- Клік на назву бренду → поле «Назва бренду» у сайдбарі, фокус, миттєве оновлення логотипа.
- Клік на фото hero → ImagePicker (upload + 7 демо-фото + слайдер затемнення).
- Клік на товар → назва, ціна, фото, перемикачі «показати/приховати», стрілки перестановки.

### 4.3 Device перемикач
Desktop → контейнер прев'ю фіксує ширину ~1280px; Mobile → ~390px ( framed, скрол збережено).
Дані про пристрій — лише візуальні (справжня адаптивність і так у CSS).

### 4.4 Надсилання
«Надіслати макет» → компактна модалка (ім'я, контакт, бренд, побажання, чекбокси доп. функцій)
→ POST на Worker → повідомлення в Telegram (контакти + конфіг JSON + завантажені фото, до 10 MB сумарно)
→ успіх показуємо **лише після** 2xx від Worker; помилка — зрозуміле повідомлення і збережений чернеткою конфіг.

### 4.5 Відновлення
`localStorage` (zustand persist): конфіг без зображень + зображення як стиснуті dataURL.
При завантаженні — валідація структури; невалідний конфіг → тихий фолбек на дефолт.
«Скинути» повертає дефолт (з підтвердженням), «Скасувати/Повторити» — історія store.

---

## 5. Відправка в Telegram (Worker)

- Endpoint: `NEXT_PUBLIC_SUBMIT_ENDPOINT` (env) → `https://<worker>.workers.dev/api/submit`.
- Worker: перевірка полів (zod-подібна валідація вручну), обмеження JSON ≤ 256 KB, фото ≤ 5 MB/шт,
  rate limit по IP (наприклад 3 заявки/год, KV або in-memory map), honeypot-поле проти спаму.
- Формат: `sendMessage` — структуроване резюме (контакти, бренд, кольори, hero, каталог, секції,
  побажання, доп. функції); конфіг повністю — прикріпленим `sendDocument` (JSON).
- Фото користувача — `sendPhoto` (до 4 шт). Токен — лише `wrangler secret put TELEGRAM_BOT_TOKEN`.
- Скриншот прев'ю — опційно, етап 5+ (html-to-image); не критично, бо JSON структурований.

---

## 6. План реалізації (мапа на ваші етапи)

| Етап | Обсяг | Приблизна вага |
|---|---|---|
| **E1. Рефакторинг конфігурації** (фундамент) | `useBrand()` замість `activeBrand` у storefront; секції home → client-компоненти; `defaults.ts`; поведінка звичайного сайту не змінюється | ~1/3 роботи MVP |
| **E2. MVP конфігуратора** (ваш Етап 3) | `/configure`: TopBar (device, reset, submit), Sidebar (Бренд/Hero/Товари), Editable-підсвітки, ImagePicker, колонки, Edit/Preview | ядро |
| **E3. Розширення** (ваш Етап 4) | секції (порядок/visibility/заголовки), шрифти зі списку, композиції hero, undo/redo, localStorage | — |
| **E4. Telegram** (ваш Етап 5) | SubmissionModal + Cloudflare Worker + secrets + фото | — |
| **E5. Полірування** (ваш Етап 6) | клавіатурна доступність, мобільний layout редактора (нижня панель), тести на конфіг-логіку (vitest уже підключений) | — |

Примітка: перед написанням коду звірю API з локальною документацією `node_modules/next/dist/docs/`
(Next 16 у проєкті має відхилення від звичних конвенцій — вказано в AGENTS.md).

---

## 7. Що свідомо НЕ робимо (фіксація scope)

Немає: drag-and-drop довільних блоків, CMS, акаунтів, БД, автопублікації, SaaS-механіки,
конструктора принтів, повного веббілдера. Конфігуратор — sales-демо поверх готового шаблону.

## 8. Відкриті питання (потрібні рішення замовника)

1. Рендер прев'ю: **in-page (рекомендовано)** чи iframe.
2. Мова UI конфігуратора: українська / англійська / двомовна (сайт англійською).
3. Telegram-бот і Cloudflare Worker: чи вже існують (токен, URL), чи створюю скелет із нуля.
4. Скриншот прев'ю в заявку — потрібен у v1 чи відкласти (JSON надходить у будь-якому разі).
5. Початок робіт: з E1 (фундамент) — рекомендовано.
