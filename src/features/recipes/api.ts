import { RECIPES_URL } from './const';
import { RecipeListItem } from './types';

/**
 * Чистые fetch-функции рецептов, без React, — чтобы их можно было звать и из
 * хуков, и из серверных компонентов (например, из generateMetadata).
 */
export const fetchRecipeBySlug = async (slug: string): Promise<RecipeListItem> => {
    const res = await fetch(`${RECIPES_URL}?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Recipe not found');

    const recipes: RecipeListItem[] = await res.json();
    const recipe = recipes[0];

    if (!recipe) throw new Error('Recipe not found');
    return recipe;
};
