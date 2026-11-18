import {NextRequest, NextResponse} from 'next/server';
import {getSearchIndex, searchPosts} from '@/features/search/server';
import {parsePage} from '@/helpers/usePageParam/params';
import {PER_PAGE} from '@/config/pagination';

const MAX_PER_PAGE = 50;

/**
 * Регион функции на Vercel — Франкфурт, поближе к WP на Мастерхосте. Из региона
 * по умолчанию (США) скачивание всего блога для индекса рвалось: `Connect Timeout`
 * и `read ETIMEDOUT` посреди ответа. Остальные функции сайта не трогаем.
 */
export const preferredRegion = 'fra1';

/** Сборка индекса — около 10 секунд при хорошей связи; запас на медленный канал. */
export const maxDuration = 60;

/**
 * Поиск по словоформам: `/api/search?q=лес&page=2&per_page=5`.
 * Ответ — общий контракт списка `{ posts, total, totalPages, currentPage, perPage }`.
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const query = (params.get('q') ?? '').trim();
    const page = parsePage(params.get('page'));
    const perPage = Math.min(MAX_PER_PAGE, parsePage(params.get('per_page') ?? String(PER_PAGE)));

    const startedAt = Date.now();
    try {
        const index = await getSearchIndex();
        const indexMs = Date.now() - startedAt;
        const result = searchPosts(index, query, page, perPage);
        const searchMs = Date.now() - startedAt - indexMs;

        return NextResponse.json(result, {
            headers: {
                // Видно во вкладке Network → Timing: сколько ждали индекс и сколько искали.
                'Server-Timing': `index;dur=${indexMs};desc="wait for index (build ${index.buildMs}ms)", search;dur=${searchMs}`,
                'X-Search-Index-Size': String(index.posts.size),
            },
        });
    } catch (error) {
        console.error('Поиск упал:', error);
        return NextResponse.json({message: 'Поиск временно недоступен'}, {status: 502});
    }
}
