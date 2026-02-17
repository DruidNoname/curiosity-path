'use client';

import React from "react";
import {Box, Pagination, Typography} from "@mui/material";
import { useRecipes } from "@/features/recipes/hooks";
import {PER_PAGE} from "@/helpers/const";
import {RecipeListItem} from "@/features/recipes/types";
import Loader from "@/ui/Loader";
import { EntryPreview } from "@/modules/components/EntryPreview";

const Recipes: React.FC = () => {
    const [page, setPage] = React.useState(1);

    const {
        data,
        isLoading,
        isError,
        error
    } = useRecipes(page, PER_PAGE);

    const {
        recipes = [],
        total = 0,
        totalPages = 1,
    } = data || {};

    console.log(recipes);
    return(
        <Box sx={{px: '24px'}}>
            <Typography variant={'h3'} sx={{mt: '16px', mb: '24px'}}>
                Книга рецептов
            </Typography>
            { isLoading
                ?
                <Loader/>
                :
                <>
                    { recipes?.map((item: RecipeListItem) => {
                        const recipe = item?.recipe;

                        return(
                            <EntryPreview
                                entryId={recipe.id}
                                entrySlug={`/recipes/${item.slug}`}
                                entryTitle={recipe.name || 'Без названия'}
                                entryPreview={recipe.summary || ''}
                                entryImage={recipe.image_url}
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
        </Box>
    );
};

export default Recipes;