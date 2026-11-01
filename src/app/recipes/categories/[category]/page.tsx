'use client';

import React, {Suspense} from "react";
import {Box} from "@mui/material";
import Pagination from "@/ui/Pagination";
import {usePageParam} from "@/helpers/usePageParam";
import {useCourses, useRecipes} from "@/features/recipes/hooks";
import {PER_PAGE} from "@/config/pagination";
import {RecipeListItem} from "@/features/recipes/types";
import Loader from "@/ui/Loader";
import { RecipePreview } from "@/modules/EntryPreview";
import MainNAsideLayout from "@/components/Layouts/MainNAsideLayout";
import Courses from "@/app/recipes/components/Courses";
import {useParams} from "next/navigation";
import Title from "@/components/Title";

const RecipesCatContent: React.FC = () => {
    const { page, setPage } = usePageParam();
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
            <Title title={course?.name ? `Категория ${course.name}` : 'Без категории'} isLoading={isLoading}/>
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
const RecipesCat: React.FC = () => (
    <Suspense fallback={<Loader/>}>
        <RecipesCatContent/>
    </Suspense>
);

export default RecipesCat;