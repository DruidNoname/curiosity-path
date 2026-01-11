import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {PER_PAGE, POSTS_URL} from "./const";
import {fetchPostsByTag} from "@/features/posts/api";
import {WP_REST_API_Post} from "wp-types";

interface PostsResponse {
    posts: WP_REST_API_Post[],
    total: number,
    totalPages: number,
    currentPage: number,
    perPage: number
};

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
}

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
}


export const usePostsByTag = (tagSlug: string, page = 1, perPage = PER_PAGE) => {
    return useQuery({
        queryKey: ['posts', 'tag', tagSlug, page, perPage],
        queryFn: () => fetchPostsByTag(tagSlug, page, perPage),
        enabled: !!tagSlug,
        staleTime: 5 * 60 * 1000, // 5 минут
        // keepPreviousData: true,
    });
};
