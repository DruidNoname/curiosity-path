import {COURSES_URL, RECIPES_URL} from "@/features/recipes/const";
import {PER_PAGE} from "@/helpers/const";
import { useQuery } from '@tanstack/react-query';
import {Course, RecipeListItem, RecipesResponse, UseCoursesParams} from "@/features/recipes/types";
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

export const useCourses = ({
                               orderby = 'count',
                               order = 'desc',
                               perPage = 100,
                               hideEmpty = true
                           }: UseCoursesParams = {}) => {

    return useQuery<Course[]>({
        queryKey: ['courses', { orderby, order, perPage, hideEmpty }],
        queryFn: async () => {
            // Строим URL с параметрами
            const params = new URLSearchParams({
                per_page: perPage.toString(),
                orderby: orderby,
                order: order,
                ...(hideEmpty && { hide_empty: 'true' })
            });

            const res = await fetch(`${COURSES_URL}?${params}`);

            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.message || 'Ошибка при получении курсов');
            }

            const courses: Course[] = await res.json();

            return courses;
        },
        staleTime: 1000 * 60 * 5,
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
        enabled: !!slug,
        staleTime: 1000 * 60 * 5
    });
};

export const useWprmDiagnostic = () => {
    return useQuery({
        queryKey: ['wprm-diagnostic'],
        queryFn: async () => {
            const results: any = {
                endpoints: {},
                recipes: null,
                taxonomies: null
            };

            // 1. Проверяем базовый эндпоинт WPRM
            try {
                const wprmRes = await fetch('/wp-json/wprm/v1');
                results.endpoints['/wprm/v1'] = {
                    status: wprmRes.status,
                    ok: wprmRes.ok
                };
                if (wprmRes.ok) {
                    results.wprmInfo = await wprmRes.json();
                }
            } catch (e) {
                // @ts-ignore
                results.endpoints['/wprm/v1'] = { error: e.message };
            }

            // 2. Проверяем рецепты
            try {
                const recipesRes = await fetch('/wp-json/wp/v2/wprm_recipe?per_page=5');
                results.endpoints['/wp/v2/wprm_recipe'] = {
                    status: recipesRes.status,
                    ok: recipesRes.ok,
                    total: recipesRes.headers.get('X-WP-Total'),
                    totalPages: recipesRes.headers.get('X-WP-TotalPages')
                };

                if (recipesRes.ok) {
                    const recipes = await recipesRes.json();
                    results.recipes = recipes.map((r: any) => ({
                        id: r.id,
                        title: r.title?.rendered,
                        slug: r.slug,
                        // Ищем поля с таксономиями
                        taxonomies: Object.keys(r).filter(k =>
                            Array.isArray(r[k]) && r[k].length > 0 && typeof r[k][0] === 'object' && r[k][0]?.taxonomy
                        )
                    }));
                }
            } catch (e) {
                // @ts-ignore
                results.endpoints['/wp/v2/wprm_recipe'] = { error: e.message };
            }

            // 3. Проверяем возможные таксономии через рецепты
            if (results.recipes && results.recipes.length > 0) {
                // Берем первый рецепт и проверяем его _links
                const firstRecipeId = results.recipes[0].id;
                try {
                    const linksRes = await fetch(`/wp-json/wp/v2/wprm_recipe/${firstRecipeId}?_fields=id,_links`);
                    if (linksRes.ok) {
                        const linksData = await linksRes.json();
                        console.log('Links для рецепта:', linksData._links);

                        // В _links могут быть ссылки на таксономии
                        if (linksData._links) {
                            results.taxonomyLinks = Object.keys(linksData._links)
                                .filter(key => key.includes('wp:term') || key.includes('taxonomy'))
                                .map(key => linksData._links[key]);
                        }
                    }
                } catch (e) {
                    console.log('Не удалось получить _links');
                }
            }

            return results;
        },
        retry: false
    });
};