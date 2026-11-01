import { KEYWORDS_URL, RECIPES_URL } from './const';
import { RecipeListItem, RecipesResponse } from './types';
import { PER_PAGE } from '@/config/pagination';

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

export type FetchRecipesParams = {
    page?: number;
    perPage?: number;
    /** id раздела (wprm_course). */
    courseId?: number;
    /** id ключевого слова (wprm_keyword). */
    keywordId?: number;
};

export const fetchRecipes = async ({
    page = 1,
    perPage = PER_PAGE,
    courseId,
    keywordId,
}: FetchRecipesParams = {}): Promise<RecipesResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
    });
    if (courseId) params.set('wprm_course', String(courseId));
    if (keywordId) params.set('wprm_keyword', String(keywordId));

    const res = await fetch(`${RECIPES_URL}?${params}`);
    if (!res.ok) throw new Error('Ошибка при получении рецептов');

    const total = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const recipes: RecipeListItem[] = await res.json();

    return {
        recipes,
        total: parseInt(total, 10),
        totalPages: parseInt(totalPages, 10),
        currentPage: page,
        perPage,
    };
};

// null — ключевого слова с таким slug нет (страница отдаёт «не найдено»); исключение —
// WordPress не ответил. Раньше ответ не проверялся, и любая ошибка сервера выглядела
// как «такого ключевого слова нет».
export const fetchKeywordId = async (slug: string): Promise<number | null> => {
    const res = await fetch(`${KEYWORDS_URL}?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Ошибка при получении ключевого слова');

    const keywords: { id: number }[] = await res.json();
    return keywords[0]?.id ?? null;
};

export type TaxonomyParams = {
    orderby?: string;
    order?: string;
    perPage?: number;
    hideEmpty?: boolean;
};

/** Список терминов таксономии WP Recipe Maker (разделы, ключевые слова). */
export const fetchTaxonomy = async <T>(
    url: string,
    label: string,
    { orderby = 'count', order = 'desc', perPage = 100, hideEmpty = true }: TaxonomyParams = {},
): Promise<T[]> => {
    const params = new URLSearchParams({
        per_page: String(perPage),
        orderby,
        order,
        ...(hideEmpty && { hide_empty: 'true' }),
    });
    const res = await fetch(`${url}?${params}`);
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Ошибка при получении ${label}`);
    }
    return res.json();
};
