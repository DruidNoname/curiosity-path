import {COURSES_URL, KEYWORDS_URL, RECIPES_URL, STALE_1H, STALE_5M} from "@/features/recipes/const";
import {PER_PAGE} from "@/helpers/const";
import { useQuery } from '@tanstack/react-query';
import {
    Course,
    Keyword,
    RecipeListItem,
    RecipesResponse,
    UseCoursesParams,
    UseKeywordsParams
} from "@/features/recipes/types";
import {urls} from "@/config/urls";


type TaxonomyParams = {
    orderby?: string;
    order?: string;
    perPage?: number;
    hideEmpty?: boolean;
};

const useTaxonomy = <T>(url: string, cacheKey: string, {
    orderby = 'count',
    order = 'desc',
    perPage = 100,
    hideEmpty = true,
}: TaxonomyParams) =>
    useQuery<T[]>({
        queryKey: [cacheKey, { orderby, order, perPage, hideEmpty }],
        queryFn: async () => {
            const params = new URLSearchParams({
                per_page: String(perPage),
                orderby,
                order,
                ...(hideEmpty && { hide_empty: 'true' }),
            });
            const res = await fetch(`${url}?${params}`);
            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.message || `Ошибка при получении ${cacheKey}`);
            }
            return res.json();
        },
        staleTime: STALE_5M,
    });

const useTagId = (tagSlug?: string) => {
    return useQuery({
        queryKey: ['tag-id', tagSlug],
        queryFn: async () => {
            if (!tagSlug) return null;
            const res = await fetch(`${urls.api}/wprm_keyword?slug=${tagSlug}`);
            const tags = await res.json();
            return tags.length > 0 ? tags[0].id : null;
        },
        enabled: !!tagSlug,
        staleTime: STALE_1H,
    });
};



export const useRecipes = (
    page = 1,
    perPage = PER_PAGE,
    courseID?: number,
    enabled?: boolean,
    tagId?: number  // Принимаем готовый ID вместо slug
) => {
    return useQuery<RecipesResponse>({
        queryKey: ['recipes', page, perPage, courseID, tagId],
        queryFn: async () => {
            let url = `${RECIPES_URL}?page=${page}&per_page=${perPage}`;

            if (courseID) {
                url += `&wprm_course=${courseID}`;
            }

            if (tagId) {
                url += `&wprm_keyword=${tagId}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error('Ошибка при получении рецептов');

            const total = res.headers.get('X-WP-Total') || '0';
            const totalPages = res.headers.get('X-WP-TotalPages') || '1';
            const recipes = await res.json();

            return {
                recipes,
                total: parseInt(total, 10),
                totalPages: parseInt(totalPages, 10),
                currentPage: page,
                perPage: perPage
            };
        },
        staleTime: STALE_5M,
        enabled: enabled ?? true,
    });
};

export const useRecipesByTagSlug = (
    page = 1,
    perPage = PER_PAGE,
    tagSlug?: string
) => {
    const { data: tagId } = useTagId(tagSlug);

    return useRecipes(page, perPage, undefined, !!tagSlug && !!tagId, tagId || undefined);
};

export const useCourses = (params: UseCoursesParams = {}) =>
    useTaxonomy<Course>(COURSES_URL, 'courses', params);

export const useKeywords = (params: UseKeywordsParams = {}) =>
    useTaxonomy<Keyword>(KEYWORDS_URL, 'keywords', params);

export const useRecipeBySlug = (slug: string) =>
    useQuery<RecipeListItem>({
        queryKey: ['recipe', slug],
        queryFn: async () => {
            const res = await fetch(`${RECIPES_URL}?slug=${slug}`);
            if (!res.ok) throw new Error('Recipe not found');

            const recipes: RecipeListItem[] = await res.json();
            const recipe = recipes[0];

            if (!recipe) throw new Error('Recipe not found');
            return recipe;
        },
        enabled: !!slug,
        staleTime: STALE_5M,
    });
