import { useQuery } from '@tanstack/react-query';
import {urls} from "@/config/urls";

const API_URL = `${urls.api}/wp/v2/posts`;

// Хук для получения всех постов
export function usePosts(options = {}) {
    return useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Ошибка при получении постов');
            return res.json();
        },
        staleTime: 1000 * 60 * 5, // 5 минут
        ...options,
    });
}

// Хук для получения конкретного поста по slug
export function usePost(slug: string, options = {}) {
    return useQuery({
        queryKey: ['posts', slug],
        queryFn: async () => {
            const res = await fetch(`${API_URL}?slug=${slug}`);
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
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error('Ошибка при получении поста');
            return res.json();
        },
        enabled: !!id,
        ...options,
    });
}