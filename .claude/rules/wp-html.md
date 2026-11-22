---
paths:
  - "src/helpers/wp-html/**"
  - "src/helpers/wp-text/**"
  - "src/ui/WpHtml/**"
---

# Работа с HTML из WordPress

WP отдаёт готовый HTML в `title.rendered`, `excerpt.rendered`, `content.rendered`.

- **На страницу такой HTML попадает только через `<WpHtml />` из `@/ui/WpHtml`**, который
  вызывает конвейер сам; голый `dangerouslySetInnerHTML` запрещён eslint (см. CLAUDE.md).
  Санитизация внутри — `getCleanEntry` из `@/helpers/wp-html`, единственная её точка: `sanitize-html` с явным
  белым списком тегов и атрибутов, затем доработка разметки (спойлеры → `<details>`, обёртки
  для одиночных картинок, ограничение ширины `<figure>`, чистка пустых параграфов,
  схлопывание цепочек `<br>`).
- `createExcerpt` — то же плюс обрезка по длине. `createTips` разбирает шорткоды `[wprm-tip]`;
  содержимое советов тоже обязано пройти через `getCleanEntry`, оно уходит в
  `dangerouslySetInnerHTML`.
- **Это дорогие функции** (`sanitize-html` + `DOMParser`). `WpHtml` мемоизирует результат
  `useMemo` по входу; если функция зовётся напрямую (вне `WpHtml`), мемоизировать так же.
  Список превью — через `React.memo` (см. `PostPreview`). Комментарии в коде, объясняющие
  зачем, — не удалять при рефакторинге.
- **Внутри `helpers/wp-html` запись в `innerHTML` разрешена** (исключение в eslint-конфиге):
  конвейер правит разметку на отсоединённом DOM уже после `sanitize-html`. Новый шаг
  обязан работать только с тем, что прошло санитизацию.
- `helpers/wp-html/index.ts` помечен `'use client'`, потому что конвейер опирается на
  `DOMParser`. Без DOM `pipeline` уходит в регекспный фолбэк.

## Заголовок как текст против заголовка как разметки

WP отдаёт заголовки HTML-строкой, и от того, куда эта строка попадёт, зависит,
чем её обрабатывать. Перепутать легко, а видно только глазами на странице.

- **Строка идёт в `dangerouslySetInnerHTML`** (разметка нужна: `<em>`, `<code>`) →
  `getCleanEntry` из `@/helpers/wp-html`.
- **Строка идёт в текст** — тултип, `alt`, `<meta>`, `document.title`, любой текстовый
  узел React → `toPlainText` из `@/helpers/wp-text`. В текстовом узле браузер сущности
  не раскодирует, и `&#8230;` покажется буквально.
- **Своих `replace(/<[^>]*>/g, '')` не писать.** Такой стрип снимает теги, но оставляет
  сущности — ровно половина работы. Три копии этого регекспа уже находились в
  `PostCalendar`, `HistoryWidget` и `alt` внутри `features/posts/api.ts`.
- Заголовок, который заведомо уйдёт в текст, лучше раскодировать один раз в дата-слое
  (см. `getPostsByDate` в `modules/PostCalendar/utils.ts`), а не на каждую отрисовку.
- **Заголовки в этом блоге разметки не содержат** — проверено по всем 745 записям и 26
  рецептам, тегов нет ни одного (поле заголовка в обоих редакторах WP не даёт
  форматирования). Поэтому заголовок везде идёт через `toPlainText`, и ни один из них
  не попадает в `dangerouslySetInnerHTML`. Анонсы и тело записи — наоборот, разметку
  содержат всегда, там `getCleanEntry`.
- **Всё, что идёт на страницу разметкой, — через `WpHtml`**, включая данные WP Recipe Maker
  (`recipe.summary`, `instructions_flat[].text` — `prepare="entry"`, шорткоды `[wprm-tip]` —
  `prepare="tips"`). Раньше `getCleanEntry` трижды забывали, теперь это ловит линтер.

## Устройство `helpers/wp-html`

```
wp-html/
  index.ts       публичный API: getCleanEntry, createExcerpt, createTips
  sanitize.ts    белый список тегов и атрибутов — что вообще имеет право дойти до страницы
  pipeline.ts    строка → DOMParser → шаги по очереди → строка; фолбэк без DOM
  clean.ts       getCleanEntry = sanitize + pipeline
  excerpt.ts     createExcerpt
  tips.ts        createTips
  types.ts       HtmlTransform = (doc: Document) => void
  transforms/    по файлу на шаг + index.ts со списком TRANSFORMS
```

- **Шаг конвейера — это `HtmlTransform`**: функция, которая мутирует документ на месте.
  Новая доработка разметки добавляется файлом в `transforms/` и строкой в `TRANSFORMS`,
  а не ветвлением внутри существующего шага.
- **Порядок шагов задан списком `TRANSFORMS`** и имеет значение: спойлеры разворачиваются
  до чистки пустых параграфов.
- **Правки разметки делаются на дереве, не регекспом по строке.** Регекспы остались только
  в фолбэке `pipeline.ts` (нет DOM) и в разборе шорткодов `tips.ts` (там это не HTML).
- Шаги тестируются поштучно через `applyTransforms(html, [шаг])`.
