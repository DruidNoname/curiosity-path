'use client';

import React from "react";
import {Box, Pagination, Typography} from "@mui/material";
import {useCourses, useRecipes} from "@/features/recipes/hooks";
import {PER_PAGE} from "@/helpers/const";
import {RecipeListItem} from "@/features/recipes/types";
import Loader from "@/ui/Loader";
import { EntryPreview } from "@/modules";
import EntriesListLayout from "@/components/Layouts/EntriesListLayout";
import Courses from "@/app/recipes/[category]/components/Courses";
import {useParams} from "next/navigation";


const RecipesCat: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const params = useParams();
    const slug = params?.category as string;

    const {
        data: courses,
        isLoading: isLoadingCourses,
    } = useCourses();

    const course = courses?.find(c => c.slug === slug);
    const courseId = course?.id || undefined;

    const {
        data,
        isLoading,
    } = useRecipes(page, PER_PAGE, courseId, !!courseId );

    const {
        recipes = [],
        totalPages = 1,
    } = data || {};

    if (isLoading || isLoadingCourses) return <Loader/>;

    return(
        <Box sx={{px: '24px'}}>
            <Typography variant={'h3'} sx={{mt: '16px', mb: '24px'}}>
                Книга рецептов
            </Typography>
            <EntriesListLayout
                mainContent={
                    <>
                        { recipes?.map((item: RecipeListItem) => {
                            const recipe = item?.recipe;

                            return(
                                <EntryPreview
                                    entryId={recipe.id}
                                    entrySlug={`/recipes/${slug}/${item.slug}`}
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

                asideContent={
                 <Courses/>
                }
            />
        </Box>
    );
};

export default RecipesCat;