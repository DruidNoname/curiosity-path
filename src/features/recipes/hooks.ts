import {RECIPES_URL} from "@/features/recipes/const";
import {PER_PAGE} from "@/helpers/const";
import { useQuery } from '@tanstack/react-query';
import {RecipeListItem, RecipesResponse} from "@/features/recipes/types";
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

export const useRecipeBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['recipe', slug],
        queryFn: async () => {
            if (!slug) throw new Error('Slug is required');

            const searchRes = await fetch(`${RECIPES_URL}?slug=${slug}`);
            if (!searchRes.ok) throw new Error('Recipe not found');

            const recipes = await searchRes.json();
            const targetRecipe = recipes.find((recipe: RecipeListItem) => recipe.slug === slug);

            if (!targetRecipe) {
                throw new Error('Recipe not found');
            }

            const recipeRes = await fetch(`${RECIPES_URL}/${targetRecipe.id}`);
            if (!recipeRes.ok) throw new Error('Failed to fetch recipe details');

            const recipeData = await recipeRes.json();
            return recipeData;
        },
        enabled: !!slug, // Запрос выполнится только если slug передан[citation:7]
        staleTime: 1000 * 60 * 5
    });
};