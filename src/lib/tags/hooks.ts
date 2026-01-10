import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {TAGS_URL} from "./const";
export function useTags() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await fetch(TAGS_URL);
            if (!res.ok) throw new Error('Ошибка при получении тегов');

            const tags = await res.json();

            // Создаём карту тегов для удобного доступа
            const tagsMap = Object.fromEntries(
                tags.map((tag: any) => [
                    tag.id,
                    {
                        name: tag.name,
                        slug: tag.slug,
                        description: tag.description || '',
                        count: tag.count || 0
                    }
                ])
            );

            return {
                tags,           // Массив всех тегов
                tagsMap,        // Карта {id: {name, slug}}
                count: tags.length
            };
        },
        staleTime: 1000 * 60 * 5 // 5 минут
    });
}
