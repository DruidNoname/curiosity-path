import { QueryClient } from '@tanstack/react-query';
import {POSTS_URL} from "./const";

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