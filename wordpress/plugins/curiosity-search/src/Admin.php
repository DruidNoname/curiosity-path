<?php

namespace CuriositySearch;

use WP_REST_Request;
use WP_REST_Response;

/**
 * «Инструменты → Поиск по словоформам»: сколько записей в индексе и кнопка
 * полной переиндексации.
 *
 * Переиндексация идёт из браузера порциями: страница сама шлёт запрос за запросом
 * на `custom/v1/search/reindex`, пока записи не кончатся. Так каждый запрос
 * короткий — WP-CLI на хостинге упирается в лимит памяти процесса, а веб-запросы нет.
 */
final class Admin
{
    private const PAGE = 'curiosity-search';
    private const BATCH = 25;

    public function __construct(private Index $index)
    {
    }

    public function register(): void
    {
        add_action('admin_menu', function () {
            add_management_page(
                'Поиск по словоформам',
                'Поиск по словоформам',
                'manage_options',
                self::PAGE,
                [$this, 'render'],
            );
        });

        add_action('rest_api_init', function () {
            register_rest_route('custom/v1', '/search/reindex', [
                'methods' => 'POST',
                'callback' => [$this, 'reindexBatch'],
                // переиндексация — не для гостей: только администратор, с nonce из страницы
                'permission_callback' => fn() => current_user_can('manage_options'),
                'args' => [
                    'offset' => ['type' => 'integer', 'default' => 0, 'minimum' => 0],
                ],
            ]);
        });
    }

    public function reindexBatch(WP_REST_Request $request): WP_REST_Response
    {
        return new WP_REST_Response($this->index->reindexBatch((int) $request['offset'], self::BATCH));
    }

    public function render(): void
    {
        $indexed = Index::indexedCount();
        $total = (int) wp_count_posts('post')->publish;
        $endpoint = esc_url_raw(rest_url('custom/v1/search/reindex'));
        $nonce = wp_create_nonce('wp_rest');
        ?>
        <div class="wrap">
            <h1>Поиск по словоформам</h1>
            <p>
                В индексе: <strong id="cs-indexed"><?php echo esc_html((string) $indexed); ?></strong>
                из <?php echo esc_html((string) $total); ?> опубликованных записей.
                Индекс обновляется сам при сохранении записи; полная переиндексация нужна
                после установки плагина и после смены правил стемминга.
            </p>
            <p>
                <button type="button" class="button button-primary" id="cs-reindex">Переиндексировать всё</button>
                <span id="cs-status" style="margin-left: 1em;"></span>
            </p>
        </div>
        <script>
        (() => {
            const button = document.getElementById('cs-reindex');
            const status = document.getElementById('cs-status');
            const endpoint = <?php echo wp_json_encode($endpoint); ?>;
            const nonce = <?php echo wp_json_encode($nonce); ?>;

            button.addEventListener('click', async () => {
                button.disabled = true;
                let offset = 0;
                try {
                    while (offset !== null) {
                        const res = await fetch(`${endpoint}?offset=${offset}`, {
                            method: 'POST',
                            headers: {'X-WP-Nonce': nonce},
                            credentials: 'same-origin',
                        });
                        if (!res.ok) throw new Error(`сервер ответил ${res.status}`);
                        const batch = await res.json();
                        offset = batch.next;
                        status.textContent = offset === null
                            ? `Готово: ${batch.total} записей.`
                            : `${offset} / ${batch.total}…`;
                    }
                    location.reload();
                } catch (error) {
                    status.textContent = `Ошибка: ${error.message}. Можно нажать ещё раз — начнётся сначала.`;
                    button.disabled = false;
                }
            });
        })();
        </script>
        <?php
    }
}
