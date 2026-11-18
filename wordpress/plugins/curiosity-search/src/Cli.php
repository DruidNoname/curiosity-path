<?php

namespace CuriositySearch;

use WP_CLI;

/**
 * Команды WP-CLI.
 *
 * ## EXAMPLES
 *
 *     wp curiosity-search reindex
 *     wp curiosity-search search "по лесу"
 */
final class Cli
{
    public function __construct(private Index $index, private Stemmer $stemmer, private Search $search)
    {
    }

    /**
     * Перестраивает индекс по всем опубликованным записям.
     *
     * ## OPTIONS
     *
     * [--batch=<size>]
     * : Сколько записей брать за раз.
     * ---
     * default: 50
     * ---
     */
    public function reindex(array $args, array $assoc): void
    {
        $started = microtime(true);
        $done = $this->index->reindexAll(
            max(1, (int) $assoc['batch']),
            fn(int $done, int $total) => WP_CLI::log("{$done} / {$total}"),
        );
        WP_CLI::success(sprintf('Проиндексировано записей: %d за %.1f с', $done, microtime(true) - $started));
    }

    /**
     * Ищет по индексу — проверить выдачу без фронта.
     *
     * <query>
     * : Строка запроса.
     */
    public function search(array $args): void
    {
        $stems = $this->stemmer->queryStems($args[0]);
        WP_CLI::log('Основы запроса: ' . implode(', ', $stems));

        $found = $this->search->find($stems, 1, 20);
        WP_CLI::log("Найдено: {$found['total']}");
        foreach ($found['ids'] as $id) {
            WP_CLI::log("  {$id}  " . get_the_title($id));
        }
    }
}
