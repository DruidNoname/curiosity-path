# CLAUDE.md

Фронтенд «Журнала открытой миру» — Next.js App Router поверх headless-WordPress.
Данные берутся из WP REST API (`/wp-json/wp/v2`, плюс кастомный `/wp-json/custom/v1`),
рецепты — из плагина WP Recipe Maker (`wprm_*`).

## Стек

- Next.js 16 (App Router) + React 19, TypeScript strict
- Node 24: `engines.node` в `package.json` — `24.x`. Vercel берёт версию оттуда, поверх
  настроек проекта; `@types/node` держать на той же мажорной версии
- MUI 9 (`@mui/material`) + Emotion — основная UI-библиотека; календари — `@mui/x-date-pickers` 9
- CSS Modules для локальных стилей, Tailwind 4 подключён через postcss, но в компонентах не используется
- TanStack Query 5 — основной дата-слой
- Apollo Client — GraphQL, ровно одно место: виджет тегов на главной. Учебный, держится
  намеренно; `ApolloProvider` стоит внутри виджета, а не в `ClientLayout`, чтобы Apollo
  не ехал в бандл остальных страниц
- Jest + ts-jest + Testing Library
- Yarn 4 с `nodeLinker: node-modules` (`.yarnrc.yml` в git), версия закреплена полем
  `packageManager` в `package.json` и ставится через Corepack (`corepack enable`).
  Всё, что импортирует код или конфиги, объявляется в `package.json` явно, — на чужие
  транзитивные зависимости, которые случайно оказались в `node_modules`, не полагаться
- Шрифт: локальный Roboto Mono через `next/font/local` (`src/assets/fonts/robotoMono.ts`)

## Команды

```bash
yarn install           # зависимости (Yarn 4; сначала один раз `corepack enable`)
yarn dev               # дев-сервер
yarn build             # прод-сборка
yarn test              # jest
yarn test:watch
yarn test:coverage
yarn lint              # eslint (flat-конфиг)
yarn typecheck         # типы: next typegen + tsc --noEmit
```

Типы проверять через `yarn typecheck`, а не голым `tsc --noEmit`. Объявления для
`*.svg` и картинок лежат в `next-env.d.ts`, а его Next генерирует сам при `dev`/`build`,
в git он не хранится. На свежем клоне и в CI голый `tsc` падает на импортах `.svg`;
`next typegen` создаёт файл без полной сборки.

Конфиг линтера один — `eslint.config.mjs` (flat), `next/core-web-vitals` импортируется
из `eslint-config-next` напрямую. Расширение `.mjs` — потому что `package.json` без
`"type": "module"`. `eslint-config-next` тянет свои `typescript-eslint` и
`eslint-plugin-react-hooks`: версии в нашем `package.json` держать не ниже его, иначе
в `node_modules` окажутся две копии плагина и eslint упадёт с `Cannot redefine plugin`.

## Структура

```
src/
  app/           роуты App Router; локальные компоненты роута лежат рядом в components/
  modules/       составные блоки предметной области (EntryPreview, PostCalendar)
  components/    переиспользуемые компоненты (Header, Footer, Layouts, ErrorBoundary)
  ui/            тонкие обёртки над MUI (Link, Buttons, Spoiler, Highlight, Pagination, Loader, Skeleton, Image, Select, Calendar, WpHtml)
  features/      вертикальные срезы: posts, recipes, tags, search, breath, query, theme
  config/        urls (единая точка правды по адресам), site, pagination, graphql (Apollo client)
  helpers/       утилиты общего назначения; каждая — папкой: wp-html, wp-text, search-snippets, usePageParam, useIsClient
  styles/        глобальный css + точка расширения для css-переменных
  assets/        шрифты и изображения
```

Свои плагины WordPress (эндпоинты `custom/v1/*`: поиск, записи по дню) — в отдельном
репозитории `curiosity-path-wp`, локально `~/PhpstormProjects/curiosity-path-wp`. Меняешь
ответ эндпоинта — поправь типы в `src/features/*/types.ts` здесь.

Направление зависимостей — сверху вниз: `app` → `modules` → `components` → `ui`.
`ui` не знает ни о чём выше себя. `features/*` могут импортироваться с любого уровня.

Алиас путей — `@/*` → `./src/*`. Относительные пути вида `../../../modules/...` не использовать.

## Анатомия feature-модуля

Эталон — `src/features/posts/` и `src/features/recipes/`:

```
features/<name>/
  api.ts     чистые async-функции fetch, без React
  hooks.ts   обёртки useQuery поверх api.ts
  const.ts   URL-ы (собираются из config/urls) и staleTime
  types.ts   типы ответов
```

Правила:

- **Компоненты никогда не фетчат напрямую** — только через хук из `features/*/hooks.ts`.
- **Ключ запроса** — `[entity, ...params]`: `['posts', page, perPage]`, `['posts', 'tag', tagId, page, perPage]`, `['recipe', slug]`.
- **Контракт ответа списка** — единый во всех api-функциях:
  ```ts
  { posts, total, totalPages, currentPage, perPage }
  ```
  где `total` и `totalPages` читаются из заголовков `X-WP-Total` и `X-WP-TotalPages`.
- **Не копипастить однотипные запросы.** Образец — дженерик-фабрика `useTaxonomy<T>`
  в `features/recipes/hooks.ts`, на которой сидят `useCourses` и `useKeywords`.
- **Все URL — из `config/urls`.** Домен в коде допустим ровно в одном месте — в объекте
  `DEFAULTS` внутри `config/urls`; в фичах и компонентах его быть не должно.

## Конфигурация и переменные окружения

`src/config/urls/index.ts` — единственная точка правды по внешним адресам.

Основные переменные:

- `NEXT_PUBLIC_WORDPRESS_URL` — корень WordPress
- `NEXT_PUBLIC_BASE_URL` — корень фронтенда

Если переменная не задана, берётся дефолт из `DEFAULTS` в том же файле — единственное
место, где домены записаны в коде. Сделано так, чтобы сборка не ломалась там, где
окружение ещё не настроено: preview-деплой, свежий клон, CI. Env всегда перекрывает
дефолт, поэтому переезд бэкенда не требует правки кода.

Остальные адреса выводятся из корня WP и переопределяются переменными только при
нестандартных путях инсталляции: `NEXT_PUBLIC_WORDPRESS_API_URL` (`/wp-json`),
`NEXT_PUBLIC_WORDPRESS_API_BASE` (`/wp-json/wp/v2`),
`NEXT_PUBLIC_WORDPRESS_ADDON_API_URL` (`/wp-json/custom/v1`),
`NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` (`/graphql`). Хвостовые слэши срезаются, так что
`https://wp.test/` и `https://wp.test` эквивалентны.

Шаблон — `.env.example` (единственный env-файл в git). Контракт покрыт тестом
`src/config/urls/index.test.ts`.

Что важно помнить:

- **`NEXT_PUBLIC_*` подставляются статически на этапе сборки.** Обращаться к ним можно
  только полным литералом `process.env.NEXT_PUBLIC_FOO`; динамический доступ
  `process.env[name]` молча вернёт `undefined`. И значение фиксируется в момент сборки —
  поменять его без пересборки нельзя.
- **Всё `NEXT_PUBLIC_*` уезжает в клиентский бандл.** Секретам там не место.
- **`.env.local` перекрывает `.env.production`** даже при прод-сборке, поэтому локальный
  `next build` берёт значения из `.env.local`. В логе сборки видно, какие файлы подхвачены.
- **На Vercel env задаётся в настройках проекта** — env-файлы в git не попадают, так что
  без настройки там работают дефолты из `DEFAULTS`.
- Jest env-файлы не читает, поэтому фиктивные значения проставляет `jest.setup.env.js`.

## Компоненты

- Один компонент = папка `Name/index.tsx` + при необходимости `style.module.css`.
- Каждая страница и каждый крупный модуль обёрнуты в `<ErrorBoundary componentName="..." />` —
  имя нужно для диагностики, указывать всегда. Запасной экран — `ErrorBoundary/Fallback`
  на цветах темы; «Попробовать снова» сбрасывает границу без перезагрузки страницы.
  Свой экран можно передать пропом `fallback`.
- **Кнопка, отрисованная не как `<button>`** (`Button`, `IconButton`, `MenuItem`, день
  календаря с `component={Link}` или `'a'`), получает `nativeButton={false}` — иначе
  MUI 9 ругается в консоли (см. `Nav`, `PostCalendar/DayWithLink`).
- Импорты MUI — только верхнего уровня (`@mui/material`, `@mui/material/Button`).
  Глубокие импорты `@mui/*/*/*` запрещены правилом eslint `no-restricted-imports`.
- **Ссылки — обычный `<Link>` из `@mui/material`.** В теме (`BaseTheme/dsBaseTheme.ts`)
  для `MuiLink` задан `defaultProps.component = NextLink`, поэтому вся навигация идёт
  через `next/link` с клиентскими переходами и prefetch. Не писать `component={'a'}` —
  это перебивает дефолт и возвращает полную перезагрузку страницы.

## Пагинация

Номер страницы живёт в URL (`/tag/les?page=3`), а не в стейте компонента, — чтобы
ссылку на конкретную страницу можно было переслать, положить в закладки и вернуться
к ней кнопкой «назад».

Единая точка — хук `usePageParam` из `@/helpers/usePageParam`:

```tsx
const { page, setPage } = usePageParam();
const { data } = usePosts(page, PER_PAGE);
...
<Pagination count={totalPages} page={Math.min(page, totalPages)}
            onChange={(_e, next) => setPage(next)} />
```

- **Первая страница параметра не получает** — `/` вместо `/?page=1`.
- **Остальные query-параметры сохраняются**: на `/search?q=лес` пагинация не потеряет
  запрос.
- **Мусор в параметре — это первая страница.** По ссылке из чужих рук приходит что
  угодно; `?page=abc`, `?page=0`, `?page=-3` не должны ничего ронять.
- **Компонент с `usePageParam` обязан быть под `<Suspense>`.** Этого требует
  `useSearchParams`: без него статическая страница не собирается. Поэтому у `/`,
  `/tag/[slug]` и списков рецептов страница разделена на `…Content` и тонкую обёртку
  с Suspense.
- `Math.min(page, totalPages)` в `page` — чтобы MUI не ругался, когда в адресе номер
  больше, чем есть страниц.

Так сделаны все списки: `/`, `/search`, `/tag/[slug]`, `/recipes/categories/[category]`
и `/recipes/keywords/[keyword]`. Компонент пагинации — обёртка `@/ui/Pagination`, не
`Pagination` из MUI напрямую.

## Работа с HTML из WordPress

WP отдаёт готовый HTML в `title.rendered`, `excerpt.rendered`, `content.rendered`.
Что из этого чем обрабатывать — правило сквозное, поэтому оно здесь; устройство
конвейера и подробности — в `.claude/rules/wp-html.md`.

- **HTML на страницу — только через `<WpHtml html={…} />` из `@/ui/WpHtml`.** Он принимает
  сырой HTML из API и сам прогоняет его через конвейер: `prepare="entry"` (по умолчанию,
  `getCleanEntry`), `"excerpt"` (`createExcerpt`, обрезка анонса, `maxLength`) или `"tips"`
  (`createTips`, шорткоды `[wprm-tip]`). Чистить заранее и передавать между компонентами
  очищенное не нужно — передаётся сырой HTML. Снаружи это `Typography` (`variant`,
  `component`, `sx`, `className`), по умолчанию `div` без своей типографики; пустой после
  очистки HTML не рендерит ничего.
- **Голый `dangerouslySetInnerHTML`, запись в `innerHTML`/`outerHTML` и `insertAdjacentHTML`
  запрещены** правилом `no-restricted-syntax` в `eslint.config.mjs`. Раньше правило
  «не забыть `getCleanEntry`» держалось на памяти и трижды нарушалось. Исключения —
  `ui/WpHtml` и конвейер `helpers/wp-html`, прописаны в самом конфиге. `eslint-disable`
  в `src/` не действует (`noInlineConfig`), так что обойти запрет комментарием нельзя.
- **Строка идёт в текст** — тултип, `alt`, `<meta>`, `document.title`, любой текстовый
  узел React → `toPlainText` из `@/helpers/wp-text`. Заголовки в этом блоге разметки
  не содержат и везде идут через `toPlainText`; анонсы и тело записи — через `WpHtml`.
- **Своих `replace(/<[^>]*>/g, '')` не писать.** Такой стрип снимает теги, но оставляет
  сущности, и `&#8230;` покажется буквально.
- **Конвейер дорогой** (`sanitize-html` + `DOMParser`). `WpHtml` мемоизирует результат по
  входу сам, у каждого экземпляра свой кеш; список превью при этом остаётся под
  `React.memo` (см. `PostPreview`). Комментарии в коде, объясняющие зачем, не удалять.

## Тематические правила

Узкие разделы вынесены в `.claude/rules/`. Claude Code подгружает каждый файл, только
когда читает или правит файл из его `paths:` во фронтматтере, — поэтому, правя код
вручную или через другой инструмент, заглядывайте туда сами.

| Файл | О чём | Когда подгружается |
|---|---|---|
| `breather.md` | Бризер: звук, таймер, пауза, план фаз | `src/features/breath/**`, `src/app/breather/**` |
| `wp-html.md` | конвейер `helpers/wp-html`, `WpHtml`, заголовок как текст и как разметка | `src/helpers/wp-html/**`, `src/helpers/wp-text/**`, `src/ui/WpHtml/**` |
| `metadata.md` | `generateMetadata`, превью ссылок | `src/app/**/page.tsx`, `src/app/**/layout.tsx`, `wp-text`, `config/site.ts` |
| `theme.md` | цветовые схемы без FOUC, мост MUI ↔ CSS Modules | `src/features/theme/**`, `src/app/layout.tsx`, `Header`, `src/styles/**`, `*.module.css` |

Новое правило, касающееся одной области, кладётся туда же отдельным файлом с `paths:`;
правило, которое нужно везде, — сюда.

## Тесты

`jest.config.js`, окружение jsdom, алиас `@/` настроен, фиктивные env-переменные —
в `jest.setup.env.js`. Сейчас покрыты `src/helpers/wp-html` (каждый шаг конвейера отдельно),
`src/helpers/wp-text`, `src/helpers/search-snippets`, `src/helpers/usePageParam`, `src/helpers/useIsClient`, `src/config/urls`, `features/search/href.ts`, `modules/PostCalendar/utils.ts`,
`features/posts/api.ts` (`fetchPostsByTag` и `buildSrcSet`), `features/recipes/api.ts`, `features/breath/plan.ts`,
`app/about/utils.ts`, `ui/Loader/variants.ts`, `ui/WpHtml`, `components/ErrorBoundary` и
`modules/EntryPreview/components/PostPreview` (172 теста, 26 сьютов). Стили `*.module.css`
в тестах заменяет заглушка `jest.style-stub.js`.
Тесты кладутся рядом с кодом, в той же папке: `clean.test.ts`, `params.test.ts`, `utils.test.ts`.

## Журнал изменений

`.claude/CHANGELOG.md` — что менялось в проекте, по датам, от новых к старым.
**Каждая доработка добавляет туда запись в той же ветке**, под заголовком с датой и с
категорией: Добавлено, Изменено, Исправлено или Документация. Пишется для человека: что
изменилось для сайта или проекта, а не какие файлы тронуты. Номер пулл-реквеста
дописывается, когда он известен.

## Грабли

- **Route handler называется `route.ts`, не `router.ts`.** Файл с другим именем Next просто
  не подхватит, и код будет молча мёртвым (такой уже находился в `app/tag/[slug]/`).
- **`params` в App Router — это Promise** (Next 15+). В клиентских страницах разворачивается
  через `React.use(params)`, см. `app/[slug]/page.tsx`.
- **`cache()` из `react` работает только в серверных компонентах.** В клиентском дереве он
  ничего не мемоизирует. `QueryClient` создаётся `makeQueryClient()` и хранится в
  `useState` с ленивым инициализатором (см. `ClientLayout`) — иначе клиент пересоздавался
  бы на каждом рендере вместе со всем кешем запросов.
- **Стили MUI-компонентов css-модулем не перебиваются.** Тема задаёт кнопкам капс,
  разрядку и полужирный эмоушен-классом, а эмоушен вставляет свои стили в `<head>`
  после CSS-модулей — при равной специфичности побеждает он. Правится через `sx`
  (кладётся поверх темы) или `&&` внутри `styled` (см. `ui/Buttons/TextButton`).
- **То, что есть только в браузере, — через `useIsClient`.** `window`, сегодняшняя дата,
  выбранная тема: прочитанные прямо в рендере, они разводят серверный HTML с клиентским
  при гидрации. `useState` + `setState` в `useEffect` линтер запрещает
  (`react-hooks/set-state-in-effect`); `useIsClient` из `@/helpers/useIsClient` даёт
  `false` до гидрации и `true` после. Если значение нужно только в обработчике, читать
  его там, без хука.
- **У кнопки-тумблера нельзя переключать `type`.** React успевает перерисовать кнопку
  внутри обработки клика, и браузер выполняет действие по умолчанию уже для нового
  типа: `button` → `submit` превращал «Остановить» в перезапуск. Тип оставляют
  постоянным, а ветвление держат в обработчике (см. `BreathForm`).
- **В `.env.local` лежит `JWT_SECRET`.** Не тащить env-файлы в артефакты сборки, тарболы и
  сторонние сервисы (актуально для скилла `vercel-deploy`, он архивирует каталог целиком).

## Известные долги

Ведутся в `.claude/TECH_DEBT.md`: что сделано не так, чем это мешает и как отдать долг,
плюс осознанные решения, которые чинить не надо (например, клиентская отрисовка
контента). Перед правками в данных, роутах, зависимостях или конфиге линтера —
заглянуть туда. Закрыл пункт — удали его оттуда и запиши в `CHANGELOG.md`; нашёл новый
долг — добавь.

## Харнесс: песочница и git-хуки

### Песочница

`.claude/settings.json` включает песочницу Claude Code (bubblewrap; на Linux нужен ещё
`socat`) и держит то, что касается только этого проекта: домены сайта в `allowedDomains`,
закрытые env-файлы, разрешения на `yarn test/lint/tsc/build`. Общая часть — запись
только в проект и кеш Yarn, реестры пакетов и GitHub в сети, закрытые `~/.ssh`, `~/.aws`,
токены `gh`, запрет `push --force` и `reset --hard` — живёт в `~/.claude/settings.json`
на машине и в репозиторий не входит. Включение песочницы и запрет env-файлов
продублированы здесь намеренно: на машине без общего файла проект всё равно под защитой.
Понадобился новый домен (например, для деплоя) — дописать его, а не выключать песочницу.

На Ubuntu 24.04+ песочница сама не стартует: AppArmor-профиль `unpriv_bwrap` отнимает
у процессов внутри bwrap право на вложенный user namespace, и каждая команда падает с
`apply-seccomp: write /proc/self/setgroups ... Permission denied`. Чинится на машине,
не в репозитории: копия `/usr/local/libexec/claude-bwrap` со своим профилем
`/etc/apparmor.d/claude-bwrap` (`flags=(unconfined) { userns, }`) и путь к ней в
`/etc/claude-code/managed-settings.json` (`sandbox.bwrapPath` читается только оттуда).
После этого — полный перезапуск Claude Code. Системный `kernel.apparmor_restrict_unprivileged_userns=0`
не трогать: он снимает защиту со всей машины.

Yarn 4 внутри песочницы: стандартный `HTTPS_PROXY` он не читает, ждёт `YARN_HTTPS_PROXY`,
а `yarn add` вдобавок ищет `@types` на `algolia.net`, которого нет в списке доменов.
Поэтому зависимости ставятся так:
`YARN_TS_ENABLE_AUTO_TYPES=false YARN_HTTPS_PROXY="$HTTPS_PROXY" yarn add -D <пакет>`.
Скрипты зависимостей в Yarn 4.18 выключены по умолчанию (`enableScripts: false`) — не включать.
Если Yarn всё равно рвёт соединение (`Canceled because of SSL destruction`), команда
запускается вне песочницы.

**`git stash`, `checkout`, `reset` и `restore` не запускать в песочнице, если они затронут
`.claude/settings.json`.** Песочница держит его только для чтения, и git падает на полпути:
`stash` уже спрятал изменения, а рабочую папку откатил не до конца. Сравнить с другой
версией кода можно без stash: `git archive main | tar -x -C "$TMPDIR/…"` и сборка там.

Боевой `curiosity-path.ru` для проверок не годится — он нестабилен; проверять на
`curiosity-path.vercel.app`. С машины разработчика Vercel напрямую недоступен (IP
блокируются), так что это проверка в браузере.

**Серверный `fetch` в Node не ходит через прокси песочницы** (`EAI_AGAIN`): переменную
`HTTPS_PROXY` он читает, только если задан `NODE_USE_ENV_PROXY=1`. Без неё `next start`
в песочнице не достаёт WordPress, и несуществующая запись отвечает 200 вместо 404 —
недоступный WP по задумке не 404 (см. `.claude/rules/metadata.md`). Проверять сервер:
`NODE_USE_ENV_PROXY=1 yarn start`.

### Git-хуки

`lefthook.yml`, подключаются скриптом `postinstall` при `yarn install`.
- **pre-commit** (параллельно, только по застейдженным файлам): `eslint --max-warnings=0`,
  `yarn typecheck`, `jest --findRelatedTests`. Код сайта сейчас без единого предупреждения
  линтера — держать так, иначе коммит не пройдёт.
- **pre-push**: весь `yarn test`.

Песочница не даёт писать в `.git/hooks` (иначе агент мог бы подложить скрипт, который
выполнится уже без песочницы), поэтому изнутри неё `postinstall` молча ничего не делает.
Первый раз на свежем клоне — `yarn lefthook install` вне песочницы. `--no-verify`,
`-n` и `LEFTHOOK=0` агентам запрещены в `~/.claude/settings.json`.

### CI

`.github/workflows/ci.yml`, на каждый PR и push в `main`, три параллельные задачи:
- **Линтер, типы, тесты, сборка** — то же, что в хуках, плюс `yarn build`.
- **Уязвимые зависимости** — `yarn npm audit`. Блокирует только high/critical в
  production-зависимостях; полный аудит с dev-зависимостями идёт отчётом
  (`continue-on-error`): старых находок в eslint/babel/jest десятки, на сайт они не едут.
  Появилась блокирующая находка — обновить пакет (`yarn up` или `yarn up -R` для
  транзитивного), а не ослаблять проверку.
- **Секреты в коммитах** — gitleaks.

Локально аудит гоняется вне песочницы (Yarn через её прокси рвёт соединение). У
`yarn npm audit` успешный ответ тоже помечен `YN0001` («No audit suggestions») — по
коду ошибки его от сбоя сети не отличить, смотреть на текст и exit code.

## Skills

`.claude/skills/`, `.claude/rules/` и `.claude/settings.json` версионируются и общие для команды,
`.claude/settings.local.json` игнорируется как локальная настройка.

Здесь лежат:

- `react-best-practices` — гайдлайны Vercel по перформансу React/Next. Смотреть при работе
  с загрузкой данных, бандлом и ререндерами; правила грепаются в
  `.claude/skills/react-best-practices/references/rules/`.
- `vercel-deploy` — быстрый безавторизационный деплой превью. Перед запуском прочитать
  раздел про секреты в его `SKILL.md`.
