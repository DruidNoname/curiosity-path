// Jest не читает .env-файлы, поэтому config/urls взял бы дефолтные прод-адреса.
// Подставляем заведомо фиктивные значения, чтобы тесты случайно не обращались
// к настоящему домену и не зависели от окружения разработчика.
process.env.NEXT_PUBLIC_WORDPRESS_URL ??= 'https://wp.test';
process.env.NEXT_PUBLIC_BASE_URL ??= 'https://site.test';
