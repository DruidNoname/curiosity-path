import {useQueries, useQuery} from '@tanstack/react-query';
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
export const useTagsByIds = (tagIds: number[]) => {
    const tagQueries = useQueries({
        queries: tagIds.map(id => ({
            queryKey: ['tag', 'id', id],
            queryFn: async (): Promise<WP_REST_API_Tag> => {
                const res = await fetch(`${TAGS_URL}/${id}`);

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(
                        errorData.message ||
                        `Ошибка при получении данных о теге ${id}: ${res.status}`
                    );
                }

                return await res.json();
            },
            enabled: !!id,
            staleTime: 1000 * 60 * 5,
            retry: 1,
            // Для Next.js важно обрабатывать ошибки gracefully
            throwOnError: false
        }))
    });

    // Группируем результаты для удобства
    const tags = tagQueries
        .map(query => query.data)
        .filter((tag): tag is WP_REST_API_Tag => tag !== undefined);

    const isLoading = tagQueries.some(query => query.isLoading);
    const isError = tagQueries.some(query => query.isError);
    const errors = tagQueries
        .map(query => query.error)
        .filter((error): error is Error => error !== null);

    return {
        tags,
        isLoading,
        isError,
        errors,
        // Индивидуальные статусы для каждого запроса
        queries: tagQueries,
        // Функция для получения конкретного тега по id
        getTagById: (id: string | number) =>
            tagQueries.find(q => q.data?.id === id)?.data,
        // Статусы загрузки для каждого id
        isLoadingIds: tagIds.map((_, index) => tagQueries[index]?.isLoading),
        isErrorIds: tagIds.map((_, index) => tagQueries[index]?.isError)
    };
};




