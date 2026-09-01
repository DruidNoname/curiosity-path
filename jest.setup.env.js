// Jest не читает .env-файлы, а config/urls требует обязательные переменные.
// Задаём заведомо фиктивные значения, чтобы тесты не зависели от окружения разработчика.
process.env.NEXT_PUBLIC_WORDPRESS_URL ??= 'https://wp.test';
process.env.NEXT_PUBLIC_BASE_URL ??= 'https://site.test';
