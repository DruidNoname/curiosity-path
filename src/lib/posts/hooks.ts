import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {PER_PAGE, POSTS_URL} from "./const";
import {fetchPostsByTag} from "@/lib/posts/api";

export interface PostsCountResponse {
    count: number;
    status?: string;
}

export interface PostsCountError {
    message: string;
    code?: string;
    data?: {
        status: number;
    };
}


// Хук для получения всех постов
export function usePosts(page = 1, perPage = 10) {
    return useQuery({
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
}

// Хук для получения конкретного поста по slug
export function usePost(slug: string, options = {}) {
    return useQuery({
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
}

// Хук для получения поста по ID
export function usePostById(id: number, options = {}) {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: async () => {
            const res = await fetch(`${POSTS_URL}/${id}`);
            if (!res.ok) throw new Error('Ошибка при получении поста');
            return res.json();
        },
        enabled: !!id,
        ...options,
    });
}

export function usePostsByTag(tagSlug: string, page: number = 1, perPage: number = PER_PAGE) {
    return useQuery({
        queryKey: ['posts', 'tag', tagSlug, page, perPage],
        queryFn: () => fetchPostsByTag(tagSlug, page, perPage),
        enabled: !!tagSlug,
        staleTime: 5 * 60 * 1000, // 5 минут
        // keepPreviousData: true,
    });
};
