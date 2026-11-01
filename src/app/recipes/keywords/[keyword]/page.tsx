'use client';

import React, {Suspense} from "react";
import {Box} from "@mui/material";
import Pagination from "@/ui/Pagination";
import {usePageParam} from "@/helpers/usePageParam";
import {useKeywordId, useKeywords, useRecipesByTagSlug} from "@/features/recipes/hooks";
import {PER_PAGE} from "@/config/pagination";
import {RecipeListItem} from "@/features/recipes/types";
import Loader from "@/ui/Loader";
import { RecipePreview } from "@/modules/EntryPreview";
import MainNAsideLayout from "@/components/Layouts/MainNAsideLayout";
import Courses from "@/app/recipes/components/Courses";
import {notFound, useParams} from "next/navigation";
import Title from "@/components/Title";

const RecipesKeywordContent: React.FC = () => {
    const { page, setPage } = usePageParam();
    const params = useParams();
    const slug = params?.keyword as string;

    const { data: keywords } = useKeywords();
    const keywordName = keywords?.find(k => k.slug === slug)?.name;

    // Тот же запрос, что внутри useRecipesByTagSlug, — из кеша, второго обращения к WP нет.
    const { data: keywordId } = useKeywordId(slug);
    // Адрес из чужих рук может вести на несуществующий ключевое слово. Страница клиентская, так что
    // статус ответа останется 200, но показываем общую «не найдено», а не пустой список.
    if (keywordId === null) notFound();

    const {
        data,
        isLoading,
    } = useRecipesByTagSlug(page, PER_PAGE, `${slug}`);

    const {
        recipes = [],
        totalPages = 1,
    } = data || {};

    if (isLoading) return <Loader/>;

    return(
        <Box sx={{px: '24px'}}>
            <Title title={keywordName ? `Ключевое слово: ${keywordName}` : ''} isLoading={isLoading}/>
            <MainNAsideLayout
                mainContent={
                    <>
                        { recipes?.map((item: RecipeListItem) => {
                            const recipe = item?.recipe;

                            return(
                                <RecipePreview
                                    entryId={recipe.id}
                                    entrySlug={`/recipes/${item.slug}`}
                                    entryTitle={recipe.name || 'Без названия'}
                                    entryPreview={recipe.summary || ''}
                                    entryImage={recipe.image_url}
                                    entryTags={item.wprm_keyword}
                                    key={`recipe_${recipe.id}`}
                                />
                            );
                        })}
                        { totalPages > 1 &&
                            <Pagination
                                sx={{ mt: 3, mb: 4 }}
                                count={totalPages}
                                page={Math.min(page, totalPages)}
                                onChange={(_e, newPage) => setPage(newPage)}
                                disabled={isLoading}
                            />
                        }
                    </>
                }

                asideContent={
                 <Courses/>
                }
            />
        </Box>
    );
};

// usePageParam читает useSearchParams, а без Suspense вокруг него Next не соберёт страницу.
const RecipesKeyword: React.FC = () => (
    <Suspense fallback={<Loader/>}>
        <RecipesKeywordContent/>
    </Suspense>
);

export default RecipesKeyword;