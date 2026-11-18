import {urls} from '@/config/urls';

/** Свой route handler Next, ищет по индексу в памяти (`app/api/search/route.ts`). */
export const SEARCH_URL = urls.searchApi;

/** Записи WP для индекса: по 100 за запрос (больше WP не отдаёт). */
export const POSTS_URL = `${urls.api}/posts`;
export const INDEX_PAGE_SIZE = 100;
/** Сколько страниц выкачивать одновременно — общий хостинг WP параллель не любит. */
export const INDEX_CONCURRENCY = 4;

/** Через сколько индекс считается устаревшим и пересобирается в фоне. */
export const INDEX_TTL = 1000 * 60 * 15;

export const SEARCH_STALE_TIME = 1000 * 60 * 5;
