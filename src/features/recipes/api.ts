import { RECIPES_URL } from './const';
import { RecipeListItem } from './types';

/**
 * Чистые fetch-функции рецептов, без React, — чтобы их можно было звать и из
 * хуков, и из серверных компонентов (например, из generateMetadata).
 */
// null — рецепта с таким slug нет (страница отдаёт 404); исключение — WordPress не ответил.
export const fetchRecipeBySlug = async (slug: string): Promise<RecipeListItem | null> => {
    const res = await fetch(`${RECIPES_URL}?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Ошибка при получении рецепта');

    const recipes: RecipeListItem[] = await res.json();
    return recipes[0] ?? null;
};
