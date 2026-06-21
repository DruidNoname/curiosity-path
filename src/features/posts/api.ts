import {ADDON_POSTS_URL, CAPOEIRA_CATEGORY_ID, POSTS_URL} from "./const";
import {urls} from "@/config/urls";
import {PER_PAGE} from "@/helpers/const";
import {WP_REST_API_Post} from "wp-types";
import {PostsResponse, PostsByTodayResponse, SongsResponse, TransformedPost} from "./types";

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
            ...post,
            // Добавляем удобные поля для изображений
            featuredImage: featuredMedia ? {
                full: featuredMedia.source_url,
                thumbnail: featuredMedia.media_details?.sizes?.thumbnail?.source_url,
                medium: featuredMedia.media_details?.sizes?.medium?.source_url,
                large: featuredMedia.media_details?.sizes?.large?.source_url,
                alt: featuredMedia.alt_text || post.title.rendered,
                caption: featuredMedia.caption?.rendered || '',
            } : null,
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

export const fetchPost = async (slug: string): Promise<TransformedPost> => {
    const res = await fetch(`${POSTS_URL}?slug=${slug}&_embed`);
    if (!res.ok) throw new Error('Ошибка при получении поста');
    const posts = await res.json();
    const post = posts[0] || null;
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
        posts,
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage: perPage
    };
};

export const fetchPostsByTag = async (tagSlug: string, page: number = 1, perPage: number = PER_PAGE) => {
    try {
        // Сначала получаем ID тега по slug
        const tagResponse = await fetch(
            `${urls.api}/tags?slug=${tagSlug}`
        );
        const tags = await tagResponse.json();

        if (!tags.length) {
            throw new Error('Тег не найден');
        }

        const tagId = tags[0].id;

        // Получаем посты по ID тега
        const response = await fetch(
            `${urls.api}/posts?tags=${tagId}&page=${page}&per_page=${perPage}&_embed`
        );

        if (!response.ok) {
            throw new Error('Ошибка при загрузке постов');
        }

        const posts = await response.json();
        const total = response.headers.get('X-WP-Total');
        const totalPages = response.headers.get('X-WP-TotalPages');

        return {
            posts,
            total: total ? parseInt(total) : 0,
            totalPages: totalPages ? parseInt(totalPages) : 1,
            tag: tags[0]
        };
    } catch (error) {
        console.error('Error fetching posts by tag:', error);
        throw error;
    }
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
            featuredImage: featuredMedia ? {
                full: featuredMedia.source_url,
                thumbnail: featuredMedia.media_details?.sizes?.thumbnail?.source_url,
                medium: featuredMedia.media_details?.sizes?.medium?.source_url,
                large: featuredMedia.media_details?.sizes?.large?.source_url,
                alt: featuredMedia.alt_text || song.title.rendered,
                caption: featuredMedia.caption?.rendered || '',
            } : null,
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
