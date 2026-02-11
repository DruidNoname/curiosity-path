'use client';

import React from 'react';
import {useRecipeBySlug} from "@/features/recipes/hooks";
import {Box, Container, Divider, Typography} from "@mui/material";
import styles from "@/app/[slug]/style.module.css";
import Skeleton from "@/ui/Skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Recipe as RecipeType} from "@/features/recipes/types";
import EntryTitle from "../../../components/SingleEntry/EntryTitle";

// import {useRouter} from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}
const Recipe: React.FC<Props> = ({ params }) =>  {
    const { slug } = React.use(params);

    const { data, isLoading, isError, error } = useRecipeBySlug(slug);
    const recipe: RecipeType = data?.recipe || [];

    const ingredientList = (recipeData: RecipeType) => {
        if (!recipeData?.ingredients_flat) return [];

        return recipeData.ingredients_flat.map(ing => {
            // Формируем строку с примечанием в скобках
            const notesPart = ing.notes ? ` (${ing.notes})` : '';

            // Формируем строку с количеством и единицей измерения
            const amountUnitPart = [
                ing.amount !== undefined && ing.amount !== null ? ing.amount : '',
                ing.unit || ''
            ].filter(part => part !== '').join(' ');

            // Собираем части
            const ingredientText = `${ing.name || ''}${notesPart}${amountUnitPart ? ': ' + amountUnitPart : ''}`;

            return (
                <li key={ing.id || ing.uid}>
                    {ingredientText}
                </li>
            );
        });
    };


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
                <EntryTitle title={recipe?.name || ''} isLoading={isLoading}/>
                <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />

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
                                Ингредиенты:
                            </Typography>
                            <ul>
                                { ingredientList(recipe) }
                            </ul>

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