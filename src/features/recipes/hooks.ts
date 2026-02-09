import {RECIPES_URL} from "@/features/recipes/const";
import {PER_PAGE} from "@/helpers/const";
import { useQuery } from '@tanstack/react-query';
import {RecipesResponse} from "@/features/recipes/types";
export const useRecipes = (page  = 1, perPage  = PER_PAGE) => {
    return useQuery<RecipesResponse>({
        queryKey: ['recipes', page, perPage],
        queryFn: async () => {
            const res = await fetch(`${RECIPES_URL}?page=${page}&per_page=${perPage}`);
            if (!res.ok) throw new Error('Ошибка при получении рецептов');

            const total = res.headers.get('X-WP-Total') || '0';
            const totalPages = res.headers.get('X-WP-TotalPages')  || '1';
            const recipes = await res.json();

            return {
                recipes,
                total: parseInt(total, 10),
                totalPages: parseInt(totalPages, 10),
                currentPage: page,
                perPage: perPage
            };
        },
        staleTime: 1000 * 60 * 5
    });
};