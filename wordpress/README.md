# Плагины WordPress

Свои плагины бэкенда (`suffer.curiosity-path.ru`). На хостинг они попадают отсюда,
а не наоборот: правка на сервере в обход репозитория потеряется при следующей заливке.

| Плагин | Что делает |
|---|---|
| `custom-posts-by-day` | `custom/v1/posts-by-day/{month}/{day}` — записи этого дня за все годы |
| `curiosity-search` | `custom/v1/search` — поиск по словоформам со своим индексом |

Хостинг: PHP 8.3 у сайта, но в SSH по умолчанию `php` — 7.2; нужная версия
вызывается явно, `php8.3`. MySQL 5.7. WP-CLI — `~/bin/wp`.

## curiosity-search

Свой индекс основ слов в таблице `{prefix}curiosity_search_index`: стеммер Snowball
(`wamania/php-stemmer`) сводит «лес», «лесу», «лесом» к «лес». Индекс обновляется
сам при сохранении записи; полная переиндексация — командой WP-CLI.

Ответ эндпоинта — общий контракт списка фронтенда `{ posts, total, totalPages,
currentPage, perPage }`; у каждой записи `matchedWords` — словоформы, по которым она
нашлась, фронт подсвечивает ровно их.

### Разработка

Нужны PHP ≥ 8.3 и Composer. WordPress локально не нужен.

```bash
cd wordpress/plugins/curiosity-search
composer install
composer test      # PHPUnit: стеммер и разбор текста
composer analyse   # PHPStan с заглушками WordPress, под PHP 8.3
composer build     # build/curiosity-search.zip для установки
```

### Установка и обновление

`plugin install` и `plugin activate` через WP-CLI на хостинге падают с
`mmap() failed: Cannot allocate memory` — консольному PHP не хватает памяти процесса.
Поэтому файлы заливаются по SSH, а всё остальное — из админки.

1. Собрать: `composer build` → `build/curiosity-search.zip`.
2. На своём компьютере залить архив:
   ```bash
   scp wordpress/plugins/curiosity-search/build/curiosity-search.zip u547315@u547315.ssh.masterhost.ru:~/
   ```
3. На сервере распаковать поверх (для первой установки и для обновления одинаково):
   ```bash
   cd ~/suffer.curiosity-path.ru/www
   unzip -o ~/curiosity-search.zip -d wp-content/plugins/ && rm ~/curiosity-search.zip
   ```
4. Первый раз — админка WP → «Плагины» → Curiosity Search → «Активировать»
   (создаётся таблица индекса).
5. Первый раз, а также после изменения правил стемминга — «Инструменты → Поиск по
   словоформам» → «Переиндексировать всё». Страница индексирует записи порциями
   по 25 и показывает прогресс; поиск во время переиндексации продолжает работать.
6. Проверка эндпоинта:
   `https://suffer.curiosity-path.ru/wp-json/custom/v1/search?q=лес`

Команды WP-CLI (`wp curiosity-search reindex`, `wp curiosity-search search "…"`) в
плагине есть — пригодятся на хостинге без этого ограничения.
