'use client';

import React from "react";
import {Box, Pagination} from "@mui/material";
import {useKeywords, useRecipes, useRecipesByTagSlug} from "@/features/recipes/hooks";
import {PER_PAGE} from "@/helpers/const";
import {RecipeListItem} from "@/features/recipes/types";
import Loader from "@/ui/Loader";
import { RecipePreview } from "@/modules/EntryPreview";
import MainNAsideLayout from "@/components/Layouts/MainNAsideLayout";
import Courses from "@/app/recipes/components/Courses";
import {useParams} from "next/navigation";
import Title from "@/components/Title";

const RecipesKeyword: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const params = useParams();
    const slug = params?.keyword as string;

    const { data: keywords } = useKeywords();
    const keywordName = keywords?.find(k => k.slug === slug)?.name;

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
                                page={page}
                                onChange={(_e, newPage) => {
                                    setPage(newPage);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
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

export default RecipesKeyword;