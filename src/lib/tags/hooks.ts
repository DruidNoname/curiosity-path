import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {TAGS_URL} from "./const";
export function useTags() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await fetch(TAGS_URL);
            if (!res.ok) throw new Error('Ошибка при получении тегов');

            const tags = await res.json();

            return {
                tags,           // Массив всех тегов
                count: tags.length
            };
        },
        staleTime: 1000 * 60 * 5 // 5 минут
    });
}
