# Журнал открытой миру

Фронтенд блога на Next.js (App Router) поверх headless-WordPress.

## Запуск

Нужны Node.js (версия — в поле `engines` в `package.json`) и Yarn 4. Yarn ставится через
Corepack, его версия закреплена полем `packageManager`:

```bash
corepack enable
yarn install
cp .env.example .env.local   # адреса WordPress и сайта; без него работают дефолты
yarn dev
```

Сайт откроется на [http://localhost:3000](http://localhost:3000).

## Команды

```bash
yarn dev            # дев-сервер
yarn build          # прод-сборка
yarn start          # запуск собранного
yarn test           # jest
yarn lint           # eslint
yarn tsc --noEmit   # проверка типов
```

## Документация

Устройство проекта, соглашения и грабли — в [`.claude/CLAUDE.md`](.claude/CLAUDE.md),
известный технический долг — в [`.claude/TECH_DEBT.md`](.claude/TECH_DEBT.md),
история изменений — в [`.claude/CHANGELOG.md`](.claude/CHANGELOG.md).
