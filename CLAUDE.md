# CLAUDE.md

Фронтенд «Журнала открытой миру» — Next.js App Router поверх headless-WordPress.
Данные берутся из WP REST API (`/wp-json/wp/v2`, плюс кастомный `/wp-json/custom/v1`),
рецепты — из плагина WP Recipe Maker (`wprm_*`).

## Стек

- Next.js 16 (App Router) + React 19, TypeScript strict
- MUI 6 (`@mui/material`) + Emotion — основная UI-библиотека
- CSS Modules для локальных стилей, Tailwind 4 подключён через postcss, но в компонентах не используется
- TanStack Query 5 — основной дата-слой
- Apollo Client — GraphQL, ровно одно место: виджет тегов на главной
- Jest + ts-jest + Testing Library
- Yarn 4 с `nodeLinker: node-modules` (`.yarnrc.yml` в git), версия закреплена полем
  `packageManager` в `package.json` и ставится через Corepack (`corepack enable`).
  Всё, что импортирует код или конфиги, объявляется в `package.json` явно, — на чужие
  транзитивные зависимости, которые случайно оказались в `node_modules`, не полагаться
- Шрифт: локальный Roboto Mono через `next/font/local` (`src/assets/fonts/robotoMono.ts`)

## Команды

```bash
npm run dev            # дев-сервер
npm run build          # прод-сборка
npm test               # jest
npm run test:watch
npm run test:coverage
npm run lint           # eslint (flat-конфиг)
npx tsc --noEmit       # типы
```

Конфиг линтера один — `eslint.config.js` (flat). `next/core-web-vitals` подключён через
`FlatCompat`, потому что `eslint-config-next@15.x` ещё не отдаёт flat-конфиг; при обновлении
пакета до 16.x слой совместимости можно убрать.

## Структура

```
src/
  app/           роуты App Router; локальные компоненты роута лежат рядом в components/
  modules/       составные блоки предметной области (EntryPreview, PostCalendar)
  components/    переиспользуемые компоненты (Header, Footer, Layouts, ErrorBoundary)
  ui/            тонкие обёртки над MUI (Link, Buttons, Spoiler, Pagination, Loader, Skeleton, Image, Select, Calendar)
  features/      вертикальные срезы: posts, recipes, tags, breath, query, theme
  config/        urls (единая точка правды по адресам), site, pagination, graphql (Apollo client)
  helpers/       утилиты общего назначения; каждая — папкой: wp-html, wp-text, usePageParam
  styles/        глобальный css + точка расширения для css-переменных
  assets/        шрифты и изображения
```

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
- **Ключ запроса** — `[entity, ...params]`: `['posts', page, perPage]`, `['posts', 'tag', slug, page, perPage]`, `['recipe', slug]`.
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
  имя нужно для диагностики, указывать всегда.
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
  `useSearchParams`: без него статическая страница не собирается. Поэтому у `/` и
  `/tag/[slug]` страница разделена на `…Content` и тонкую обёртку с Suspense.
- `Math.min(page, totalPages)` в `page` — чтобы MUI не ругался, когда в адресе номер
  больше, чем есть страниц.

Так сделаны `/`, `/search` и `/tag/[slug]`. Списки рецептов
(`/recipes/categories/[category]`, `/recipes/keywords/[keyword]`) пока на локальном
`useState` — при правках их стоит перевести на тот же хук.

## Работа с HTML из WordPress

WP отдаёт готовый HTML в `title.rendered`, `excerpt.rendered`, `content.rendered`.
Что из этого чем обрабатывать — правило сквозное, поэтому оно здесь; устройство
конвейера и подробности — в `.claude/rules/wp-html.md`.

- **Всё, что уходит в `dangerouslySetInnerHTML`, обязано пройти через `getCleanEntry`**
  из `@/helpers/wp-html` — включая данные WP Recipe Maker (`recipe.summary`,
  `instructions_flat[].text`, шорткоды `[wprm-tip]`). Это уже трижды забывали.
- **Строка идёт в текст** — тултип, `alt`, `<meta>`, `document.title`, любой текстовый
  узел React → `toPlainText` из `@/helpers/wp-text`. Заголовки в этом блоге разметки
  не содержат и везде идут через `toPlainText`; анонсы и тело записи — через `getCleanEntry`.
- **Своих `replace(/<[^>]*>/g, '')` не писать.** Такой стрип снимает теги, но оставляет
  сущности, и `&#8230;` покажется буквально.
- **`getCleanEntry` и `createExcerpt` дорогие** (`sanitize-html` + `DOMParser`): результат
  мемоизировать — `useMemo` по входной строке, список превью через `React.memo`
  (см. `PostPreview`). Комментарии в коде, объясняющие зачем, не удалять.

## Тематические правила

Узкие разделы вынесены в `.claude/rules/`. Claude Code подгружает каждый файл, только
когда читает или правит файл из его `paths:` во фронтматтере, — поэтому, правя код
вручную или через другой инструмент, заглядывайте туда сами.

| Файл | О чём | Когда подгружается |
|---|---|---|
| `breather.md` | Бризер: звук, таймер, пауза, план фаз | `src/features/breath/**`, `src/app/breather/**` |
| `wp-html.md` | конвейер `helpers/wp-html`, заголовок как текст и как разметка | `src/helpers/wp-html/**`, `src/helpers/wp-text/**` |
| `metadata.md` | `generateMetadata`, превью ссылок | `src/app/**/page.tsx`, `src/app/**/layout.tsx`, `wp-text`, `config/site.ts` |
| `theme.md` | цветовые схемы без FOUC, мост MUI ↔ CSS Modules | `src/features/theme/**`, `src/app/layout.tsx`, `Header`, `src/styles/**`, `*.module.css` |

Новое правило, касающееся одной области, кладётся туда же отдельным файлом с `paths:`;
правило, которое нужно везде, — сюда.

## Тесты

`jest.config.js`, окружение jsdom, алиас `@/` настроен, фиктивные env-переменные —
в `jest.setup.env.js`. Сейчас покрыты `src/helpers/wp-html` (каждый шаг конвейера отдельно),
`src/helpers/wp-text`, `src/helpers/usePageParam`, `src/config/urls`, `modules/PostCalendar/utils.ts`,
`features/breath/plan.ts` и `app/about/utils.ts` (103 теста, 16 сьютов).
Тесты кладутся рядом с кодом, в той же папке: `clean.test.ts`, `params.test.ts`, `utils.test.ts`.

## Журнал изменений

`CHANGELOG.md` в корне — что менялось в проекте, по датам, от новых к старым.
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
- **У кнопки-тумблера нельзя переключать `type`.** React успевает перерисовать кнопку
  внутри обработки клика, и браузер выполняет действие по умолчанию уже для нового
  типа: `button` → `submit` превращал «Остановить» в перезапуск. Тип оставляют
  постоянным, а ветвление держат в обработчике (см. `BreathForm`).
- **В `.env.local` лежит `JWT_SECRET`.** Не тащить env-файлы в артефакты сборки, тарболы и
  сторонние сервисы (актуально для скилла `vercel-deploy`, он архивирует каталог целиком).

## Известные долги

Держать в голове при правках в соответствующих местах:

- Отрисовка целиком клиентская: серверные `page.tsx` у постов и рецептов — тонкие
  обёртки ради метаданных, данные по-прежнему грузятся в браузере. Осознанное решение:
  блог личный, сторонний трафик не нужен, поэтому SSR контента не делали.
- `generateMetadata` есть только у `/[slug]` и `/recipes/[slug]`. У страниц тега, поиска
  и статических — дефолты из корневого layout. `sitemap.ts`/`robots.ts`,
  `loading.tsx`/`error.tsx`/`not-found.tsx` отсутствуют.
- `useTagsByIds` делает по запросу на каждый тег (N+1). На странице тега тег грузится дважды:
  отдельно в `useTag` и внутри `fetchPostsByTag`.
- Apollo подключён глобально в `ClientLayout` ради одного виджета.
- Пагинация списков рецептов всё ещё на локальном `useState(1)` — в отличие от списков
  постов, ссылку с номером страницы там переслать нельзя.

## Skills

`.claude/skills/` и `.claude/rules/` версионируются и общие для команды, `.claude/settings.local.json`
игнорируется как локальная настройка. Здесь лежат:

- `react-best-practices` — гайдлайны Vercel по перформансу React/Next. Смотреть при работе
  с загрузкой данных, бандлом и ререндерами; правила грепаются в
  `.claude/skills/react-best-practices/references/rules/`.
- `vercel-deploy` — быстрый безавторизационный деплой превью. Перед запуском прочитать
  раздел про секреты в его `SKILL.md`.
