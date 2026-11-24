# Codex в curiosity-path

В начале работы прочитай [.claude/CLAUDE.md](.claude/CLAUDE.md). Это общие соглашения проекта об архитектуре, WordPress API, компонентах, командах Yarn, тестах и git-хуках. Записи о доработках добавляй в [.claude/CHANGELOG.md](.claude/CHANGELOG.md). Перед изменениями данных, маршрутов, зависимостей или ESLint сверься с [.claude/TECH_DEBT.md](.claude/TECH_DEBT.md).

## Тематические правила

Перед чтением или правкой кода открой все правила, подходящие по полю `paths` в [.claude/rules](.claude/rules). При пересечении областей применяй оба правила. Например, для `src/helpers/wp-text/` нужны правила и про HTML, и про метаданные.

| Область | Правило |
|---|---|
| Дыхательный таймер и страница бризера | [breather.md](.claude/rules/breather.md) |
| Обработка HTML и текста WordPress, компонент WpHtml | [wp-html.md](.claude/rules/wp-html.md) |
| Страницы и layout App Router, текст для превью, конфигурация сайта | [metadata.md](.claude/rules/metadata.md) |
| Тема MUI, корневой layout, Header, глобальные стили и CSS Modules | [theme.md](.claude/rules/theme.md) |

## Навыки

При работе с производительностью React и Next.js прочитай [react-best-practices](.claude/skills/react-best-practices/SKILL.md). При запросе на деплой прочитай [vercel-deploy](.claude/skills/vercel-deploy/SKILL.md) и следуй разделу о подготовке архива без секретов. Пути к ресурсам навыка отсчитывай от каталога его SKILL.md.

## Песочница и доступ

Выполняй команды в песочнице Codex. Для проверок используй `yarn test`, `yarn lint`, `yarn typecheck` и `yarn build`. Соблюдай проектные ограничения из [.claude/settings.json](.claude/settings.json):

- Пропускай чтение `.env`, `.env.local`, `.env.*.local` и `.env.production`. Исключай все `.env*` из редактирования. Для знакомства с переменными читай `.env.example`.
- Проектные домены для сетевых обращений — `curiosity-path.ru`, `www.curiosity-path.ru` и `suffer.curiosity-path.ru`. Соблюдай действующие разрешения среды Codex при сетевых запросах и запуске команд.
- Сохраняй git-хуки включёнными. Избегай `git push --force` и `git reset --hard`.
