import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {TAGS_URL} from "./const";
import {WP_REST_API_Tag} from "wp-types";
export const useTags = () => {
    return useQuery<{ tags: WP_REST_API_Tag[]; count: number }>({
        queryKey: ['tags'],
        queryFn: async () => {
            const res = await fetch(TAGS_URL);
            if (!res.ok) throw new Error('Ошибка при получении тегов');

            const tags: WP_REST_API_Tag[] = await res.json();

            return {
                tags,
                count: tags.length
            };
        },
        staleTime: 1000 * 60 * 5
    });
};

export const useTag = (slug: string) => {
    return useQuery<WP_REST_API_Tag | null>({
        queryKey: ['tag', slug],
        queryFn: async () => {
            const res = await fetch(`${TAGS_URL}?slug=${slug}`);
            if (!res.ok) throw new Error('Ошибка при получении данных о теге');

            const data = await res.json();
            return data[0] || null;
        },

        enabled: !!slug,
        staleTime: 1000 * 60 * 5
    });
};
