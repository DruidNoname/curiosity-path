'use client';

import React from "react";
import {Box, Link, Pagination, Paper, Typography} from "@mui/material";
import { useRecipes } from "@/features/recipes/hooks";
import {PER_PAGE} from "@/helpers/const";
import PostPreview from "@/components/PostPreview";
import {RecipeListItem} from "@/features/recipes/types";

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
            { recipes?.map((item: RecipeListItem) => {
                const recipe = item?.recipe;

                return(
                    <Paper key={`recipe_${recipe.id}`}  sx={{
                        p: 2,
                        display: 'flex',
                        gap: '16px'
                    }}>
                        <Box sx={{ width: 200, flexShrink: 0 }}>
                            <img
                                src={recipe.image_url}
                                alt={recipe.name}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '4px'
                                }}
                            />
                        </Box>
                        <Box>
                            <Link href={`/recipes/${item.slug}`} >{recipe.name}</Link>
                            <Typography
                                variant={'body1'}
                                sx={{mt: '16px', mb: '24px'}}
                                component="p"
                                dangerouslySetInnerHTML={{ __html: recipe.summary }}
                            />
                        </Box>

                    </Paper>
                );
            })
            }

            {/*<Pagination*/}
            {/*    sx={{ mt: 3, mb: 4 }}*/}
            {/*    count={totalPages}*/}
            {/*    page={page}*/}
            {/*    onChange={(_e, newPage) => {*/}
            {/*        setPage(newPage);*/}
            {/*        window.scrollTo({ top: 0, behavior: 'smooth' });*/}
            {/*    }}*/}
            {/*    disabled={isLoading}*/}
            {/*/>*/}

        </Box>
    );
};

export default Recipes;