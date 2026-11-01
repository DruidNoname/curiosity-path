import {COURSES_URL, KEYWORDS_URL, STALE_1H, STALE_5M} from "@/features/recipes/const";
import {PER_PAGE} from "@/config/pagination";
import { skipToken, useQuery } from '@tanstack/react-query';
import {
    Course,
    Keyword,
    RecipeListItem,
    RecipesResponse,
    UseCoursesParams,
    UseKeywordsParams
} from "@/features/recipes/types";
import {fetchKeywordId, fetchRecipeBySlug, fetchRecipes, fetchTaxonomy, TaxonomyParams} from "./api";

// Фабрика для однотипных списков терминов: useCourses и useKeywords отличаются только
// адресом и ключом кеша. Сам запрос — в api.ts.
const useTaxonomy = <T>(url: string, cacheKey: string, {
    orderby = 'count',
    order = 'desc',
    perPage = 100,
    hideEmpty = true,
}: TaxonomyParams) =>
    useQuery<T[]>({
        queryKey: [cacheKey, { orderby, order, perPage, hideEmpty }],
        queryFn: () => fetchTaxonomy<T>(url, cacheKey, { orderby, order, perPage, hideEmpty }),
        staleTime: STALE_5M,
    });

/** id ключевого слова рецептов по slug; null — такого ключевого слова нет. */
export const useKeywordId = (slug?: string) =>
    useQuery<number | null>({
        queryKey: ['keyword-id', slug],
        queryFn: slug ? () => fetchKeywordId(slug) : skipToken,
        staleTime: STALE_1H,
    });

export const useRecipes = (
    page = 1,
    perPage = PER_PAGE,
    courseID?: number,
    enabled?: boolean,
    tagId?: number
) => {
    return useQuery<RecipesResponse>({
        queryKey: ['recipes', page, perPage, courseID, tagId],
        queryFn: () => fetchRecipes({ page, perPage, courseId: courseID, keywordId: tagId }),
        staleTime: STALE_5M,
        enabled: enabled ?? true,
    });
};

export const useRecipesByTagSlug = (
    page = 1,
    perPage = PER_PAGE,
    tagSlug?: string
) => {
    const { data: tagId } = useKeywordId(tagSlug);

    return useRecipes(page, perPage, undefined, !!tagSlug && !!tagId, tagId || undefined);
};

export const useCourses = (params: UseCoursesParams = {}) =>
    useTaxonomy<Course>(COURSES_URL, 'courses', params);

export const useKeywords = (params: UseKeywordsParams = {}) =>
    useTaxonomy<Keyword>(KEYWORDS_URL, 'keywords', params);

export const useRecipeBySlug = (slug: string) =>
    useQuery<RecipeListItem | null>({
        queryKey: ['recipe', slug],
        queryFn: () => fetchRecipeBySlug(slug),
        enabled: !!slug,
        staleTime: STALE_5M,
    });
