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

1. `composer build` → `build/curiosity-search.zip`.
2. Админка WP → «Плагины» → «Добавить новый» → «Загрузить плагин» → архив →
   «Установить» (при обновлении — «Заменить установленный») → «Активировать».
   Таблица индекса создаётся при активации.
3. Первый раз, а также после изменения правил стемминга — полная переиндексация
   по SSH из папки WP (WP-CLI запускать под PHP 8.3, иначе плагин не загрузится):
   ```bash
   cd ~/suffer.curiosity-path.ru/www
   php8.3 ~/bin/wp curiosity-search reindex
   php8.3 ~/bin/wp curiosity-search search "по лесу"   # проверить выдачу
   ```
   Пока идёт переиндексация, поиск находит не всё: таблица заполняется заново.
4. Проверка эндпоинта:
   `https://suffer.curiosity-path.ru/wp-json/custom/v1/search?q=лес`
