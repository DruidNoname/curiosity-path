<?php

namespace CuriositySearch;

use WP_Post;
use WP_REST_Request;
use WP_REST_Response;

/**
 * `GET /wp-json/custom/v1/search?q=лес&page=1&per_page=5&exclude_category_ids=144`
 *
 * Ответ — общий контракт списка фронтенда: `{ posts, total, totalPages, currentPage, perPage }`.
 * Запись — в форме стандартного REST (`title.rendered`, `excerpt.rendered`, …), плюс
 * `postTags` и `matchedWords` — словоформы, по которым запись нашлась, для подсветки.
 */
final class Rest
{
    private const MAX_QUERY_LENGTH = 200;
    /** Больше слов в запросе — уже не поиск, а вставленный абзац; лишние отбрасываются. */
    private const MAX_STEMS = 10;
    private const MAX_PER_PAGE = 50;

    public function __construct(private Stemmer $stemmer, private Search $search)
    {
    }

    public function register(): void
    {
        register_rest_route('custom/v1', '/search', [
            'methods' => 'GET',
            'callback' => [$this, 'handle'],
            'permission_callback' => '__return_true',
            'args' => [
                'q' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => fn($value) => mb_substr(trim((string) $value), 0, self::MAX_QUERY_LENGTH),
                ],
                'page' => ['type' => 'integer', 'default' => 1, 'minimum' => 1],
                'per_page' => ['type' => 'integer', 'default' => 5, 'minimum' => 1, 'maximum' => self::MAX_PER_PAGE],
                'exclude_category_ids' => [
                    'type' => 'string',
                    'default' => '',
                    'description' => 'ID рубрик через запятую: записи из них не ищутся',
                ],
            ],
        ]);
    }

    public function handle(WP_REST_Request $request): WP_REST_Response
    {
        $page = (int) $request['page'];
        $perPage = (int) $request['per_page'];
        $stems = array_slice($this->stemmer->queryStems((string) $request['q']), 0, self::MAX_STEMS);
        $exclude = array_values(array_filter(array_map('intval', explode(',', (string) $request['exclude_category_ids']))));

        $found = $this->search->find($stems, $page, $perPage, $exclude);
        $posts = $found['ids']
            ? get_posts(['post__in' => $found['ids'], 'orderby' => 'post__in', 'posts_per_page' => -1])
            : [];

        return new WP_REST_Response([
            'posts' => array_map(fn(WP_Post $post) => $this->toResponse($post, $stems), $posts),
            'total' => $found['total'],
            'totalPages' => max(1, (int) ceil($found['total'] / $perPage)),
            'currentPage' => $page,
            'perPage' => $perPage,
        ]);
    }

    /** @param list<string> $stems */
    private function toResponse(WP_Post $post, array $stems): array
    {
        // фильтры анонса и контента (the_excerpt, the_content) ждут «текущую запись»
        $GLOBALS['post'] = $post;
        setup_postdata($post);

        $content = apply_filters('the_content', $post->post_content);
        $excerpt = apply_filters('the_excerpt', get_the_excerpt($post));
        $title = get_the_title($post);

        wp_reset_postdata();

        return [
            'id' => $post->ID,
            'slug' => $post->post_name,
            'date' => mysql_to_rfc3339($post->post_date),
            'link' => get_permalink($post),
            'title' => ['rendered' => $title],
            'excerpt' => ['rendered' => $excerpt],
            'content' => ['rendered' => $content],
            'postTags' => array_map(fn($tag) => [
                'id' => $tag->term_id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'link' => get_tag_link($tag),
            ], wp_get_post_tags($post->ID)),
            'matchedWords' => $this->stemmer->matchedWords(
                Text::toPlain($title) . ' ' . Index::bodyText($post),
                $stems,
            ),
        ];
    }
}
