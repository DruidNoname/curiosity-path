import { QueryClient } from '@tanstack/react-query';
import {POSTS_URL} from "./const";
import {urls} from "@/config/urls";
import {PER_PAGE} from "@/helpers/const";

// Функции для префетчинга на сервере
export async function prefetchPosts(queryClient: QueryClient) {
    await queryClient.prefetchQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await fetch(POSTS_URL);
            return res.json();
        },
    });
}

export async function prefetchPost(slug: string, queryClient: QueryClient) {
    await queryClient.prefetchQuery({
        queryKey: ['posts', slug],
        queryFn: async () => {
            const res = await fetch(`${POSTS_URL}?slug=${slug}`);
            const posts = await res.json();
            return posts[0] || null;
        },
    });
}

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