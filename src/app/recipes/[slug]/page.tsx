'use client';

import React from 'react';
import {useRecipeBySlug} from "@/features/recipes/hooks";
import {Box, Container, Divider, Typography} from "@mui/material";
import styles from "./style.module.css";
import Skeleton from "@/ui/Skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Recipe as RecipeType} from "@/features/recipes/types";
import SingleEntryTitle from "../../../components/SingleEntry/SingleEntryTitle";
import {IngredientsList} from "@/app/recipes/[slug]/components/IngredientsList";

// import {useRouter} from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}
const Recipe: React.FC<Props> = ({ params }) =>  {
    const { slug } = React.use(params);

    const { data, isLoading } = useRecipeBySlug(slug);
    const recipe: RecipeType = data?.recipe || [];

    const createInstructionsList = (recipeData: RecipeType) => {
        const instructionsFlat = recipeData?.instructions_flat || [];
        if (instructionsFlat.length === 0) {
            return []; // Или можно вернуть [<Box key="no-instructions">Нет инструкций</Box>]
        }

        return instructionsFlat.map((step) => {
            return (
                <Box key={step.text.slice(0, 8)}>
                    <div dangerouslySetInnerHTML={{ __html: step.text || '' }} />
                </Box>
            );
        });
    };

    return(
        <ErrorBoundary componentName={'Recipe'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }} className={styles.Post}>
                    <SingleEntryTitle title={recipe?.name || ''} isLoading={isLoading}/>
                    <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />
                    <IngredientsList ingredients={recipe?.ingredients_flat }/>
                    <Box sx={{ typography: 'body1' }}>
                        { isLoading ?
                            <>
                                <Skeleton width={200}/><br/>
                                <Skeleton width={350}/><br/>
                                <Skeleton width={200}/><br/>
                            </>
                            :
                            <>
                                <Typography
                                    variant="body1"
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: recipe?.summary }}
                                />
                                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />


                                <Typography variant={'h5'} sx={{mb: 2}}>
                                    Приготовление:
                                </Typography>
                                { createInstructionsList(recipe) }
                            </>
                        }
                    </Box>
                </Box>
            </Container>
        </ErrorBoundary>
    );
};

export default Recipe;