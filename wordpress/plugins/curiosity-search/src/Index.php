<?php

namespace CuriositySearch;

use WP_Post;

/**
 * Таблица основ слов: какая основа в какой записи и сколько раз.
 *
 * Своя таблица, а не полнотекстовый индекс MySQL: тот не индексирует слова короче
 * трёх букв, а на общем хостинге эту настройку не поменять. И морфологии у него нет.
 */
final class Index
{
    /** Где встретилась основа: в заголовке совпадение весит больше. */
    public const FIELD_BODY = 0;
    public const FIELD_TITLE = 1;

    /** Версия схемы таблицы: поменялась — `install()` перестроит её при обновлении плагина. */
    public const SCHEMA_VERSION = '1';
    private const SCHEMA_OPTION = 'curiosity_search_schema';

    public function __construct(private Stemmer $stemmer)
    {
    }

    public static function table(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'curiosity_search_index';
    }

    /**
     * Создаёт таблицу. Сравнение основ бинарное (`utf8mb4_bin`): они и так
     * нормализованы, а «умное» сравнение MySQL склеило бы, например, «е» и «ё»
     * по своим правилам и сломало бы точное совпадение.
     */
    public static function install(): void
    {
        if (get_option(self::SCHEMA_OPTION) === self::SCHEMA_VERSION) {
            return;
        }

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $table = self::table();
        // dbDelta придирчив к формату: два пробела после PRIMARY KEY, поля по строке
        dbDelta("CREATE TABLE {$table} (
  post_id bigint(20) unsigned NOT NULL,
  stem varchar(" . Stemmer::MAX_STEM_LENGTH . ") NOT NULL,
  field tinyint(1) unsigned NOT NULL,
  weight smallint(5) unsigned NOT NULL,
  PRIMARY KEY  (stem,field,post_id),
  KEY post_id (post_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;");

        update_option(self::SCHEMA_OPTION, self::SCHEMA_VERSION);
    }

    /** Попадает ли запись в поиск: только опубликованные записи блога. */
    public static function isSearchable(WP_Post $post): bool
    {
        return $post->post_type === 'post' && $post->post_status === 'publish' && $post->post_password === '';
    }

    /** Текст записи для индекса: анонс и тело, без шорткодов и разметки. */
    public static function bodyText(WP_Post $post): string
    {
        return Text::toPlain($post->post_excerpt . ' ' . strip_shortcodes($post->post_content));
    }

    /** Переиндексирует запись; неопубликованную — убирает из индекса. */
    public function indexPost(WP_Post $post): void
    {
        $this->removePost($post->ID);
        if (!self::isSearchable($post)) {
            return;
        }

        $rows = [];
        $fields = [
            self::FIELD_TITLE => Text::toPlain($post->post_title),
            self::FIELD_BODY => self::bodyText($post),
        ];
        foreach ($fields as $field => $text) {
            foreach ($this->stemmer->countStems($text) as $stem => $count) {
                $rows[] = [$post->ID, $stem, $field, min($count, 65535)];
            }
        }

        global $wpdb;
        $table = self::table();
        // вставка пачками: в длинной записи тысячи основ, по запросу на каждую — долго
        foreach (array_chunk($rows, 500) as $chunk) {
            $placeholders = implode(',', array_fill(0, count($chunk), '(%d,%s,%d,%d)'));
            $wpdb->query($wpdb->prepare(
                "INSERT INTO {$table} (post_id, stem, field, weight) VALUES {$placeholders}",
                array_merge(...$chunk),
            ));
        }
    }

    public function removePost(int $postId): void
    {
        global $wpdb;
        $wpdb->delete(self::table(), ['post_id' => $postId], ['%d']);
    }

    /**
     * Полная переиндексация, порциями — чтобы не держать в памяти весь блог.
     *
     * @param callable(int $done, int $total): void|null $progress
     * @return int сколько записей проиндексировано
     */
    public function reindexAll(int $batchSize = 50, ?callable $progress = null): int
    {
        global $wpdb;
        $wpdb->query('TRUNCATE TABLE ' . self::table());

        $ids = get_posts([
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'fields' => 'ids',
            'orderby' => 'ID',
            'order' => 'ASC',
        ]);

        $done = 0;
        foreach (array_chunk($ids, $batchSize) as $chunk) {
            foreach (get_posts(['post__in' => $chunk, 'posts_per_page' => -1, 'orderby' => 'post__in']) as $post) {
                $this->indexPost($post);
                $done++;
            }
            if ($progress) {
                $progress($done, count($ids));
            }
            // кеш WP_Post растёт с каждой порцией — на тысяче записей это заметно
            wp_cache_flush_runtime();
        }

        return $done;
    }
}
