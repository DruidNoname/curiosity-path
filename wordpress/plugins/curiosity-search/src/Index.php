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
     * Порция полной переиндексации: опубликованные записи по возрастанию ID, с `$offset`.
     *
     * Порциями — чтобы каждый запрос был коротким: на общем хостинге и время, и память
     * процесса ограничены. Индекс заранее не очищается — поиск работает и во время
     * переиндексации; записи, которых больше нет среди опубликованных, вычищаются
     * после последней порции.
     *
     * @return array{indexed: int, total: int, next: int|null} `next` — откуда продолжать, `null` — всё
     */
    public function reindexBatch(int $offset, int $limit): array
    {
        $ids = get_posts([
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $limit,
            'offset' => $offset,
            'fields' => 'ids',
            'orderby' => 'ID',
            'order' => 'ASC',
            'suppress_filters' => true,
        ]);

        foreach ($ids ? get_posts(['post__in' => $ids, 'posts_per_page' => -1, 'orderby' => 'post__in']) : [] as $post) {
            $this->indexPost($post);
        }

        $total = (int) wp_count_posts('post')->publish;
        $next = $offset + count($ids);
        $finished = count($ids) < $limit || $next >= $total;
        if ($finished) {
            $this->removeStale();
        }

        return ['indexed' => count($ids), 'total' => $total, 'next' => $finished ? null : $next];
    }

    /**
     * Полная переиндексация подряд, порциями.
     *
     * @param callable(int $done, int $total): void|null $progress
     * @return int сколько записей проиндексировано
     */
    public function reindexAll(int $batchSize = 50, ?callable $progress = null): int
    {
        $offset = 0;
        do {
            $batch = $this->reindexBatch($offset, $batchSize);
            $offset += $batch['indexed'];
            if ($progress) {
                $progress($offset, $batch['total']);
            }
            // кеш WP_Post растёт с каждой порцией — на тысяче записей это заметно
            wp_cache_flush_runtime();
        } while ($batch['next'] !== null);

        return $offset;
    }

    /** Убирает из индекса записи, которых больше нет среди опубликованных. */
    private function removeStale(): void
    {
        global $wpdb;
        $table = self::table();
        $wpdb->query("DELETE i FROM {$table} i
            LEFT JOIN {$wpdb->posts} p ON p.ID = i.post_id
                AND p.post_type = 'post' AND p.post_status = 'publish'
            WHERE p.ID IS NULL");
    }

    /** Сколько записей сейчас в индексе — для страницы в админке. */
    public static function indexedCount(): int
    {
        global $wpdb;
        return (int) $wpdb->get_var('SELECT COUNT(DISTINCT post_id) FROM ' . self::table());
    }
}
