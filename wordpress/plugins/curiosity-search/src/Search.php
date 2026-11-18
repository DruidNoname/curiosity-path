<?php

namespace CuriositySearch;

/**
 * Поиск по таблице основ: записи, где есть все основы запроса.
 *
 * Сортировка — по весу: сколько раз встретились основы, совпадение в заголовке
 * весит втрое больше. При равном весе — сначала новые.
 */
final class Search
{
    public const TITLE_BOOST = 3;

    /**
     * @param list<string> $stems основы запроса, без повторов
     * @param list<int> $excludeCategoryIds записи из этих рубрик не ищутся
     * @return array{ids: list<int>, total: int}
     */
    public function find(array $stems, int $page, int $perPage, array $excludeCategoryIds = []): array
    {
        if (!$stems) {
            return ['ids' => [], 'total' => 0];
        }

        global $wpdb;
        $table = Index::table();
        $stemPlaceholders = implode(',', array_fill(0, count($stems), '%s'));
        $params = $stems;

        $exclude = '';
        if ($excludeCategoryIds) {
            $catPlaceholders = implode(',', array_fill(0, count($excludeCategoryIds), '%d'));
            $exclude = "AND i.post_id NOT IN (
                SELECT tr.object_id FROM {$wpdb->term_relationships} tr
                JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
                WHERE tt.taxonomy = 'category' AND tt.term_id IN ({$catPlaceholders})
            )";
            $params = array_merge($params, $excludeCategoryIds);
        }

        // индекс чистится при снятии с публикации, но проверка статуса дешёвая и
        // страхует от рассинхрона (запись поменяли в обход хуков, прямым SQL)
        $matches = "SELECT i.post_id,
                SUM(i.weight * IF(i.field = %d, %d, 1)) AS score
            FROM {$table} i
            JOIN {$wpdb->posts} p ON p.ID = i.post_id
                AND p.post_type = 'post' AND p.post_status = 'publish'
            WHERE i.stem IN ({$stemPlaceholders}) {$exclude}
            GROUP BY i.post_id
            HAVING COUNT(DISTINCT i.stem) = %d";
        $matchParams = array_merge([Index::FIELD_TITLE, self::TITLE_BOOST], $params, [count($stems)]);

        $total = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM ({$matches}) m", $matchParams));

        $ids = $wpdb->get_col($wpdb->prepare(
            "SELECT m.post_id FROM ({$matches}) m
            JOIN {$wpdb->posts} p ON p.ID = m.post_id
            ORDER BY m.score DESC, p.post_date DESC
            LIMIT %d OFFSET %d",
            array_merge($matchParams, [$perPage, ($page - 1) * $perPage]),
        ));

        return ['ids' => array_map('intval', $ids), 'total' => $total];
    }
}
