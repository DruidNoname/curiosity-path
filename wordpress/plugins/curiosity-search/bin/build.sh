#!/usr/bin/env bash
# Собирает плагин для установки: build/curiosity-search.zip — без тестов и dev-зависимостей.
# Загружается в админке WP: «Плагины → Добавить новый → Загрузить плагин».
set -euo pipefail

cd "$(dirname "$0")/.."
OUT=build
DIR="$OUT/curiosity-search"

rm -rf "$OUT"
mkdir -p "$DIR"
cp -r curiosity-search.php composer.json composer.lock src "$DIR/"

# Зависимости ставятся в копию: dev-пакеты рабочей папки (phpunit, phpstan) не трогаем.
# Платформа PHP 8.3 зафиксирована в composer.json — версии подбираются под хостинг.
composer install --working-dir="$DIR" --no-dev --optimize-autoloader --no-interaction --quiet
rm "$DIR/composer.json" "$DIR/composer.lock"
# Пакеты кладут в дистрибутив свои тесты: у стеммера это 18 МБ словарей-фикстур.
# Плагину они не нужны, а лимит загрузки в админке WP на общем хостинге невелик.
find "$DIR/vendor" -mindepth 3 -maxdepth 3 -type d \( -name test -o -name tests -o -name Tests \) -prune -exec rm -rf {} +
find "$DIR/vendor" -mindepth 3 -maxdepth 3 -type f \( -name 'phpunit.xml*' -o -name '*.md' \) -delete

(cd "$OUT" && zip -qr curiosity-search.zip curiosity-search)
echo "Готово: $(pwd)/$OUT/curiosity-search.zip"
