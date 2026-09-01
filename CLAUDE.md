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
  ui/            тонкие обёртки над MUI (Link, Pagination, Loader, Skeleton, Image, Select, Calendar)
  features/      вертикальные срезы: posts, recipes, tags, query, theme
  config/        urls (единая точка правды по адресам), graphql (Apollo client)
  helpers/       утилиты общего назначения (санитизация HTML, константы)
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
- **Все URL — из `config/urls`.** Хардкод доменов недопустим нигде, включая сам `config/urls`.

## Конфигурация и переменные окружения

`src/config/urls/index.ts` — единственная точка правды по внешним адресам. Значения
приходят только из env, хардкода доменов в коде нет.

Обязательные переменные (без них модуль бросает ошибку при загрузке, то есть сборка
падает громко, а не собирается с адресами `undefined/wp-json/...`):

- `NEXT_PUBLIC_WORDPRESS_URL` — корень WordPress
- `NEXT_PUBLIC_BASE_URL` — корень фронтенда

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
- **На Vercel env задаётся в настройках проекта** — env-файлы в git не попадают. Если
  обязательные переменные там не заданы, сборка упадёт с явным сообщением.
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

## Работа с HTML из WordPress

WP отдаёт готовый HTML в `title.rendered`, `excerpt.rendered`, `content.rendered`.

- **Любой такой HTML проходит через `getCleanEntry` из `@/helpers/utils`** перед подстановкой
  в `dangerouslySetInnerHTML`. Это единственная точка санитизации: `sanitize-html` с явным
  белым списком тегов и атрибутов, затем доработка разметки (спойлеры → `<details>`, обёртки
  для одиночных картинок, ограничение ширины `<figure>`, чистка пустых параграфов).
- `createExcerpt` — то же плюс обрезка по длине. `createTips` разбирает шорткоды `[wprm-tip]`.
- **Это дорогие функции** (`sanitize-html` + `DOMParser`). Результат обязательно мемоизировать:
  `useMemo` по входной строке, а список превью — через `React.memo` (см. `PostPreview`).
  В коде уже стоят комментарии, объясняющие зачем — не удалять их при рефакторинге.
- `helpers/utils.ts` помечен `'use client'`, потому что опирается на `DOMParser`.
  На сервере срабатывает фолбэк — регулярка, чистящая пустые параграфы.

## Тема и цветовые схемы

Связка хрупкая и размазана по трём файлам — менять только все три сразу:

1. `src/app/layout.tsx` — `<InitColorSchemeScript attribute="data-theme" defaultMode="system" />`
   стоит **первым элементом в `<body>`**. Блокирующий скрипт выставляет `data-theme` на `<html>`
   до первой отрисовки.
2. `src/features/theme/theme.ts` — `cssVariables.colorSchemeSelector: 'data-theme'` (должен
   совпадать с `attribute` выше) и обе схемы в `colorSchemes`. Тема **одна** на обе схемы:
   MUI генерирует статический CSS, scoped по `[data-theme="..."]`.
3. `src/features/theme/context/provider.tsx` — `defaultMode="system"` (совпадает с п.1).

Почему так: раньше активная тема выбиралась React-стейтом, который на сервере всегда был
светлым, — при сохранённой тёмной теме была вспышка светлой (FOUC). Сейчас разметка на сервере
и клиенте идентична, рассинхрона гидрации нет.

Переключение схемы — нативный `useColorScheme()` из `@mui/material/styles` (см. `Header`).

Цвета описаны в `features/theme/{Light,Dark}Theme/Colors.ts`; `buildCssVars` из
`features/theme/model/utils.ts` превращает их в CSS-переменные `--color-*` (включая
`*-rgb` варианты для `rgba()`). Через эти переменные css-модули получают доступ к цветам темы —
это мост между MUI и CSS Modules. `src/styles/variables.css` намеренно пуст, это точка
расширения для переменных, не зависящих от схемы.

## Тесты

`jest.config.js`, окружение jsdom, алиас `@/` настроен, фиктивные env-переменные —
в `jest.setup.env.js`. Сейчас покрыты `src/helpers/utils.ts` и `src/config/urls`
(33 теста, 2 сьюта). Тесты кладутся рядом с кодом: `utils.test.ts`, `index.test.ts`.

## Грабли

- **Route handler называется `route.ts`, не `router.ts`.** Файл с другим именем Next просто
  не подхватит, и код будет молча мёртвым (такой уже находился в `app/tag/[slug]/`).
- **`params` в App Router — это Promise** (Next 15+). В клиентских страницах разворачивается
  через `React.use(params)`, см. `app/[slug]/page.tsx`.
- **`cache()` из `react` работает только в серверных компонентах.** В `features/query/queryClient.tsx`
  он вызван в цепочке клиентского `ClientLayout` — это ошибка, при правке использовать
  `useState(() => new QueryClient())`.
- **В `.env.local` лежит `JWT_SECRET`.** Не тащить env-файлы в артефакты сборки, тарболы и
  сторонние сервисы (актуально для скилла `vercel-deploy`, он архивирует каталог целиком).

## Известные долги

Держать в голове при правках в соответствующих местах:

- Все `page.tsx` — клиентские, серверных компонентов нет. Отсюда нет `generateMetadata`
  (у всех страниц один title из root layout), нет `sitemap.ts`/`robots.ts`, нет
  `loading.tsx`/`error.tsx`/`not-found.tsx`.
- `useTagsByIds` делает по запросу на каждый тег (N+1). На странице тега тег грузится дважды:
  отдельно в `useTag` и внутри `fetchPostsByTag`.
- Apollo подключён глобально в `ClientLayout` ради одного виджета.
- Пагинация продублирована в каждом листинге локальным `useState(1)`; идёт работа над
  выносом её в URL (ветка `url-pagination-params`).

## Skills

`.claude/skills/` версионируется и общий для команды, `.claude/settings.local.json`
игнорируется как локальная настройка. Здесь лежат:

- `react-best-practices` — гайдлайны Vercel по перформансу React/Next. Смотреть при работе
  с загрузкой данных, бандлом и ререндерами; правила грепаются в
  `.claude/skills/react-best-practices/references/rules/`.
- `vercel-deploy` — быстрый безавторизационный деплой превью. Перед запуском прочитать
  раздел про секреты в его `SKILL.md`.
