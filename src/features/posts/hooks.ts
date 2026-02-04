import { useQuery } from '@tanstack/react-query';
import {ADDON_POSTS_URL, PER_PAGE, POSTS_URL} from "./const";
import {fetchPostsByTag} from "./api";
import {WP_REST_API_Post} from "wp-types";

export interface PostsResponse {
    posts: WP_REST_API_Post[],
    total: number,
    totalPages: number,
    currentPage: number,
    perPage: number
};

interface PostsByTodayResponse {
    posts: WP_REST_API_Post[];
    count: number;
    date: string;
    month: number;
    day: number;
}

export const usePosts = (page  = 1, perPage  = PER_PAGE) => {
    return useQuery<PostsResponse>({
        queryKey: ['posts', page, perPage],
        queryFn: async () => {
            const res = await fetch(`${POSTS_URL}?page=${page}&per_page=${perPage}`);
            if (!res.ok) throw new Error('Ошибка при получении постов');

            const total = res.headers.get('X-WP-Total') || '0';
            const totalPages = res.headers.get('X-WP-TotalPages')  || '1';
            const posts = await res.json();

            return {
                posts,
                total: parseInt(total, 10),
                totalPages: parseInt(totalPages, 10),
                currentPage: page,
                perPage: perPage
            };
        },
        staleTime: 1000 * 60 * 5
    });
};

export const usePostsByMonth = (
    page = 1,
    perPage = 90,
    selectedMonth?: { start: Date; end: Date }
) => {
    return useQuery<PostsResponse>({
        queryKey: ['posts', page, perPage, selectedMonth?.start, selectedMonth?.end],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: perPage.toString(),
                orderby: 'date',
                order: 'desc',
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
        },
        staleTime: 1000 * 60 * 5
    });
};

export const usePostsByToday = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate(); // 1-31

    const apiUrl = `${ADDON_POSTS_URL}/${currentMonth}/${currentDay}`;

    return useQuery<PostsByTodayResponse, Error>({
        queryKey: ['posts-by-today', currentMonth, currentDay],
        queryFn: async () => {
            const res = await fetch(apiUrl);

            if (!res.ok) {
                throw new Error(`Ошибка API: ${res.status}`);
            }

            const posts: WP_REST_API_Post[] = await res.json();

            return {
                posts,
                count: posts.length,
                date: today.toISOString().split('T')[0],
                month: currentMonth,
                day: currentDay
            };
        },
        staleTime: 1000 * 60 * 60 * 12, // 12 часов
        gcTime: 1000 * 60 * 60 * 24,    // 24 часа (вместо cacheTime)
    });
};


export const usePost = (slug: string, options = {}) => {
    return useQuery<WP_REST_API_Post>({
        queryKey: ['posts', slug],
        queryFn: async () => {
            const res = await fetch(`${POSTS_URL}?slug=${slug}`);
            if (!res.ok) throw new Error('Ошибка при получении поста');
            const posts = await res.json();
            return posts[0] || null; // WordPress возвращает массив
        },
        enabled: !!slug, // Запрос выполняется только если slug существует
        staleTime: 1000 * 60 * 10, // 10 минут
        ...options,
    });
};


export const usePostsByTag = (tagSlug: string, page = 1, perPage = PER_PAGE) => {
    return useQuery({
        queryKey: ['posts', 'tag', tagSlug, page, perPage],
        queryFn: () => fetchPostsByTag(tagSlug, page, perPage),
        enabled: !!tagSlug,
        staleTime: 5 * 60 * 1000, // 5 минут
        // keepPreviousData: true,
    });
};
