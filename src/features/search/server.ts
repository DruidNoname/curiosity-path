/**
 * Поисковый индекс по всем записям блога — в памяти серверной функции.
 *
 * Только для route handler (`app/api/search/route.ts`): тянет весь блог из WP
 * и держит его в памяти, в клиентский бандл этому модулю нельзя.
 *
 * Индекс строится при первом запросе и живёт, пока жив процесс. На Vercel это
 * значит: после простоя функция засыпает, и первый поиск снова ждёт сборки.
 * Устаревший индекс отдаётся как есть, а новый собирается в фоне.
 */
import MiniSearch from 'minisearch';
import {extractTags} from '@/features/posts/api';
import {CAPOEIRA_CATEGORY_ID} from '@/features/posts/const';
import type {PostTag} from '@/features/posts/types';
import {getSnippetsFromSentences, highlightText, toSentences} from '@/helpers/search-snippets';
import {toPlainText} from '@/helpers/wp-text';
import {createStemMatcher, stemWord, tokenize} from './stem';
import {INDEX_CONCURRENCY, INDEX_PAGE_SIZE, INDEX_TTL, POSTS_URL} from './const';
import type {SearchHit, SearchResponse} from './types';

/** Запись в памяти: вместо HTML — уже нарезанные предложения, они в разы легче. */
interface IndexedPost {
    id: number;
    slug: string;
    date: string;
    title: string;
    excerpt: string;
    postTags: PostTag[];
    sentences: string[];
    excerptSentences: string[];
}

interface SearchIndex {
    search: MiniSearch<{id: number; title: string; text: string}>;
    posts: Map<number, IndexedPost>;
    builtAt: number;
    /** Сколько заняла сборка, мс — для оценки холодного старта. */
    buildMs: number;
}

const fetchPage = async (page: number) => {
    const params = new URLSearchParams({
        page: String(page),
        per_page: String(INDEX_PAGE_SIZE),
        status: 'publish',
        categories_exclude: String(CAPOEIRA_CATEGORY_ID),
        _fields: 'id,slug,date,title,excerpt,content,_links.wp:term,_embedded',
        _embed: 'wp:term',
    });
    const res = await fetch(`${POSTS_URL}?${params}`, {cache: 'no-store'});
    if (!res.ok) throw new Error(`Индекс поиска: WP ответил ${res.status} на странице ${page}`);

    return {
        posts: (await res.json()) as any[],
        totalPages: Number(res.headers.get('X-WP-TotalPages') || '1'),
    };
};

const fetchAllPosts = async (): Promise<any[]> => {
    const first = await fetchPage(1);
    const rest: any[] = [];

    for (let page = 2; page <= first.totalPages; page += INDEX_CONCURRENCY) {
        const batch = Array.from(
            {length: Math.min(INDEX_CONCURRENCY, first.totalPages - page + 1)},
            (_, i) => fetchPage(page + i),
        );
        for (const {posts} of await Promise.all(batch)) rest.push(...posts);
    }

    return [...first.posts, ...rest];
};

const toIndexedPost = (post: any): IndexedPost => ({
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: toPlainText(post.title?.rendered),
    excerpt: post.excerpt?.rendered ?? '',
    postTags: extractTags(post),
    sentences: toSentences(post.content?.rendered ?? ''),
    excerptSentences: toSentences(post.excerpt?.rendered ?? ''),
});

const buildIndex = async (): Promise<SearchIndex> => {
    const startedAt = Date.now();
    const posts = (await fetchAllPosts()).map(toIndexedPost);

    const search = new MiniSearch<{id: number; title: string; text: string}>({
        fields: ['title', 'text'],
        tokenize,
        // null выбрасывает слово из индекса и из запроса — так отсекаются служебные
        processTerm: (term) => stemWord(term),
        searchOptions: {
            // все слова запроса должны найтись в записи — как у WP
            combineWith: 'AND',
            boost: {title: 2},
        },
    });
    search.addAll(posts.map((post) => ({
        id: post.id,
        title: post.title,
        text: [...post.excerptSentences, ...post.sentences].join(' '),
    })));

    return {
        search,
        posts: new Map(posts.map((post) => [post.id, post])),
        builtAt: Date.now(),
        buildMs: Date.now() - startedAt,
    };
};

let current: SearchIndex | null = null;
let building: Promise<SearchIndex> | null = null;

const rebuild = (): Promise<SearchIndex> => {
    building ??= buildIndex()
        .then((index) => (current = index))
        .finally(() => {
            building = null;
        });
    return building;
};

/** Индекс: готовый — сразу, устаревший — тоже сразу, но с пересборкой в фоне. */
export const getSearchIndex = async (): Promise<SearchIndex> => {
    if (!current) return rebuild();

    if (Date.now() - current.builtAt > INDEX_TTL) {
        // ошибка фоновой сборки не должна ронять запрос: старый индекс ещё годен
        rebuild().catch((error) => console.error('Индекс поиска не пересобрался:', error));
    }
    return current;
};

const toHit = (post: IndexedPost, query: string): SearchHit => {
    const matcher = createStemMatcher(query);
    const fromContent = getSnippetsFromSentences(post.sentences, matcher);
    const found = fromContent.snippets.length
        ? fromContent
        : getSnippetsFromSentences(post.excerptSentences, matcher);

    return {
        id: post.id,
        slug: post.slug,
        date: post.date,
        title: post.title,
        titleParts: highlightText(post.title, matcher),
        excerpt: post.excerpt,
        postTags: post.postTags,
        snippets: found.snippets.length ? found : null,
    };
};

export const searchPosts = (
    index: SearchIndex,
    query: string,
    page: number,
    perPage: number,
): SearchResponse => {
    const results = query ? index.search.search(query) : [];
    const totalPages = Math.max(1, Math.ceil(results.length / perPage));
    const hits = results
        .slice((page - 1) * perPage, page * perPage)
        .map(({id}) => index.posts.get(id))
        .filter((post): post is IndexedPost => Boolean(post))
        .map((post) => toHit(post, query));

    return {posts: hits, total: results.length, totalPages, currentPage: page, perPage};
};
