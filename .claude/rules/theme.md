---
paths:
  - "src/features/theme/**"
  - "src/app/layout.tsx"
  - "src/components/Header/**"
  - "src/styles/**"
  - "src/**/*.module.css"
---

# Тема и цветовые схемы

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
это мост между MUI и CSS Modules. `src/styles/variables.css` — переменные, не зависящие от схемы
(например, `--paragraph-gap`: нижний паддинг `p`, от него считаются соседние отступы).
