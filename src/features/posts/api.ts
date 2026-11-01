import {ADDON_POSTS_URL, CAPOEIRA_CATEGORY_ID, POSTS_URL} from "./const";
import {PER_PAGE} from "@/config/pagination";
import {toPlainText} from "@/helpers/wp-text";
import {WP_REST_API_Post} from "wp-types";
import {FeaturedImage, PostsResponse, PostsByTodayResponse, PostTag, PostWithTags, SongsResponse, TransformedPost} from "./types";

// Запрос с _embed уже приносит термины записи в _embedded['wp:term'] — массив по таксономиям
// (рубрики, теги). Берём теги оттуда, а не отдельным запросом на каждый тег: иначе список
// из 10 записей тянул ещё по запросу на каждый уникальный тег (N+1).
const extractTags = (post: any): PostTag[] =>
    (post._embedded?.['wp:term'] ?? [])
        .flat()
        .filter((term: any) => term?.taxonomy === 'post_tag')
        .map(({id, name, slug, link}: any) => ({id, name, slug, link}));

const withTags = (post: any): PostWithTags => ({...post, postTags: extractTags(post)});

// Размеры, из которых собирается srcSet превью. thumbnail (150×150) квадратный и обрезанный —
// в превью не годится; full может весить мегабайты, он идёт в набор, только если других нет.
const SRCSET_SIZES = ['medium', 'medium_large', 'large'] as const;

type MediaSize = { source_url?: string; width?: number };

// srcSet в формате `url 300w, url 768w`: браузер сам берёт размер под ширину экрана и плотность
// пикселей. Раньше превью всегда получало medium (300px, у вертикальных снимков — 169px
// по ширине), и на телефоне во всю ширину экрана картинка расплывалась.
export const buildSrcSet = (media: any): string => {
    const sizes: Record<string, MediaSize> = media?.media_details?.sizes ?? {};
    const candidates: MediaSize[] = SRCSET_SIZES.map(name => sizes[name]).filter(Boolean);
    if (candidates.length === 0) {
        candidates.push({ source_url: media?.source_url, width: media?.media_details?.width });
    }
    const byWidth = new Map<number, string>();
    for (const { source_url, width } of candidates) {
        if (source_url && width && !byWidth.has(width)) byWidth.set(width, source_url);
    }
    return [...byWidth].sort(([a], [b]) => a - b).map(([w, url]) => `${url} ${w}w`).join(', ');
};

const toFeaturedImage = (media: any, renderedTitle: string): FeaturedImage => ({
    full: media.source_url,
    thumbnail: media.media_details?.sizes?.thumbnail?.source_url,
    medium: media.media_details?.sizes?.medium?.source_url,
    large: media.media_details?.sizes?.large?.source_url,
    srcSet: buildSrcSet(media),
    alt: media.alt_text || toPlainText(renderedTitle),
    caption: media.caption?.rendered || '',
});

export const fetchPosts = async (page: number = 1, perPage: number = PER_PAGE): Promise<PostsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        status: 'publish',
        categories_exclude: CAPOEIRA_CATEGORY_ID.toString()
    });

    const res = await fetch(
        `${POSTS_URL}?${params.toString()}&_embed`
    );

    if (!res.ok) throw new Error('Ошибка при получении постов');

    const total = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const posts = await res.json();

    // Трансформируем посты, добавляя удобный доступ к featured image
    const transformedPosts = posts.map((post: any) => {
        // Получаем featured image из _embedded если оно есть
        const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

        return {
            ...withTags(post),
            // Добавляем удобные поля для изображений
            featuredImage: featuredMedia ? toFeaturedImage(featuredMedia, post.title.rendered) : null,
            // Или просто URL если нужно только это
            featuredImageUrl: featuredMedia?.source_url || null,
        };
    });

    return {
        posts: transformedPosts,
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage: perPage
    };
};

export const fetchPostsByMonth = async (
    page: number = 1,
    perPage: number = 90,
    selectedMonth?: { start: Date; end: Date }
): Promise<PostsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        orderby: 'date',
        order: 'desc',
        categories_exclude: String(CAPOEIRA_CATEGORY_ID)
    });

    // WordPress API использует параметры after и before
    if (selectedMonth) {
        // Форматируем даты в ISO строки
        const after = selectedMonth.start.toISOString();
        const before = selectedMonth.end.toISOString();

        params.append('after', after);
        params.append('before', before);
    }

    const res = await fetch(`${POSTS_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('Ошибка при получении постов');

    const total = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const posts = await res.json();

    return {
        posts,
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage: perPage
    };
};

export const fetchPostsByToday = async (
    month: number,
    day: number,
    today: Date
): Promise<PostsByTodayResponse> => {
    const apiUrl = `${ADDON_POSTS_URL}/${month}/${day}?exclude_category_ids=${CAPOEIRA_CATEGORY_ID}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
        throw new Error(`Ошибка API: ${res.status}`);
    }

    const posts: WP_REST_API_Post[] = await res.json();

    return {
        posts,
        count: posts.length,
        date: today.toISOString().split('T')[0],
        month,
        day
    };
};

// null — записи с таким slug нет (страница отдаёт 404); исключение — WordPress не ответил.
// Различать их важно: опечатка в адресе — это «не найдено», а не «ошибка».
export const fetchPost = async (slug: string): Promise<TransformedPost | null> => {
    const res = await fetch(`${POSTS_URL}?slug=${encodeURIComponent(slug)}&_embed`);
    if (!res.ok) throw new Error('Ошибка при получении поста');
    const posts = await res.json();
    const post = posts[0];
    if (!post) return null;
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    return {
        ...post,
        featuredImageUrl: featuredMedia?.source_url || null,
    };
};

export const fetchPostsBySearch = async (search: string, page: number = 1, perPage: number = PER_PAGE): Promise<PostsResponse> => {
    const params = new URLSearchParams({
        search,
        page: page.toString(),
        per_page: perPage.toString(),
        status: 'publish',
        categories_exclude: CAPOEIRA_CATEGORY_ID.toString()
    });

    const res = await fetch(`${POSTS_URL}?${params.toString()}&_embed`);
    if (!res.ok) throw new Error('Ошибка при поиске постов');

    const total = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const posts = await res.json();

    return {
        posts: posts.map(withTags),
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage: perPage
    };
};

// Принимает id, а не slug: страница тега и так загружает тег через useTag, и раньше
// эта функция повторяла тот же запрос /tags?slug=… — да ещё на каждой странице пагинации.
export const fetchPostsByTag = async (tagId: number, page: number = 1, perPage: number = PER_PAGE): Promise<PostsResponse> => {
    const params = new URLSearchParams({
        tags: tagId.toString(),
        page: page.toString(),
        per_page: perPage.toString(),
        status: 'publish',
    });

    const res = await fetch(`${POSTS_URL}?${params.toString()}&_embed`);
    if (!res.ok) throw new Error('Ошибка при загрузке постов');

    const total = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const posts = await res.json();

    return {
        posts: posts.map(withTags),
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage: perPage
    };
};

export const fetchCapoeiraSongs = async (page: number = 1, perPage: number = PER_PAGE): Promise<SongsResponse> => {
    // Используем параметр categories для фильтрации по рубрике
    // ID рубрики "capoeira songs" нужно заменить на актуальный
    const res = await fetch(
        `${POSTS_URL}?page=${page}&per_page=${perPage}&status=publish&categories=${CAPOEIRA_CATEGORY_ID}`
    );

    if (!res.ok) throw new Error('Ошибка при получении постов из рубрики capoeira songs');

    const total = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const songs = await res.json();

    const transformedPosts = songs.map((song: any) => {
        const featuredMedia = song._embedded?.['wp:featuredmedia']?.[0];

        return {
            ...song,
            featuredImage: featuredMedia ? toFeaturedImage(featuredMedia, song.title.rendered) : null,
            featuredImageUrl: featuredMedia?.source_url || null,
        };
    });

    return {
        songs: transformedPosts,
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage: perPage
    };
};
