<?php
/**
 * Plugin Name: Curiosity Search
 * Description: Поиск по словоформам: свой индекс основ слов и эндпоинт custom/v1/search. «лес» находит «лесу» и «лесом», но не «всплески».
 * Version: 1.0.0
 * Requires PHP: 8.3
 * Author: Druid Adamantha + Claude
 * License: GPL v2 or later
 */

if (!defined('ABSPATH')) {
    exit;
}

$curiosity_search_autoload = __DIR__ . '/vendor/autoload.php';
if (!file_exists($curiosity_search_autoload)) {
    // плагин залили без vendor/ — лучше сказать об этом, чем упасть фатальной ошибкой
    add_action('admin_notices', static function () {
        echo '<div class="notice notice-error"><p>Curiosity Search: нет папки vendor/. '
            . 'Соберите плагин командой <code>composer install --no-dev</code> и загрузите заново.</p></div>';
    });
    return;
}
require_once $curiosity_search_autoload;

use CuriositySearch\Cli;
use CuriositySearch\Index;
use CuriositySearch\Rest;
use CuriositySearch\Search;
use CuriositySearch\Stemmer;

register_activation_hook(__FILE__, [Index::class, 'install']);
// обновление плагина файлами хук активации не вызывает — схему проверяем и при загрузке
add_action('plugins_loaded', [Index::class, 'install']);

/** Объекты плагина: создаются один раз и только когда нужны. */
function curiosity_search_services(): array
{
    static $services = null;
    if ($services === null) {
        $stemmer = new Stemmer();
        $search = new Search();
        $services = [
            'stemmer' => $stemmer,
            'search' => $search,
            'index' => new Index($stemmer),
        ];
    }
    return $services;
}

add_action('rest_api_init', static function () {
    $s = curiosity_search_services();
    (new Rest($s['stemmer'], $s['search']))->register();
});

// Индекс держится в актуальном виде сам: при сохранении запись переиндексируется
// (неопубликованная — убирается), при удалении — убирается.
add_action('save_post_post', static function (int $postId, WP_Post $post) {
    if (wp_is_post_revision($postId) || wp_is_post_autosave($postId)) {
        return;
    }
    curiosity_search_services()['index']->indexPost($post);
}, 20, 2);

add_action('deleted_post', static function (int $postId) {
    curiosity_search_services()['index']->removePost($postId);
});

if (defined('WP_CLI') && WP_CLI) {
    $s = curiosity_search_services();
    WP_CLI::add_command('curiosity-search', new Cli($s['index'], $s['stemmer'], $s['search']));
}
