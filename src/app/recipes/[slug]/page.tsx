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
import Loader from "@/ui/Loader";
import {UNIT_MAP} from "@/features/recipes/const";
import {ImageBordered} from "@/components/Images";

// import {useRouter} from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}
const Recipe: React.FC<Props> = ({ params }) =>  {
    const { slug } = React.use(params);

    const { data, isLoading } = useRecipeBySlug(slug);
    const recipe: RecipeType = data?.recipe || [];

    const createInstructionsList = (recipeData: RecipeType) => {
        const additionalImgs: string[] = [];
        const instructionsFlat = recipeData?.instructions_flat || [];
        if (instructionsFlat.length === 0) {
            return []; // Или можно вернуть [<Box key="no-instructions">Нет инструкций</Box>]
        }

        const steps = instructionsFlat.map((step, index) => {
            if (step?.image_url) {
                additionalImgs.push(step?.image_url);
            }
            return (
                <Box key={`instruction_step_${index}`}>
                    <div dangerouslySetInnerHTML={{ __html: step.text || '' }} />
                </Box>
            );
        });

        const images = additionalImgs.map(imgLink => <ImageBordered src={imgLink} sx={{ maxWidth: '350px;'}}/>);

        return(
            <>
                <Typography variant={'h4'} sx={{mb: 2}}>
                    Приготовление:
                </Typography>
                { steps }
                { images.length > 0 &&
                    <>
                        <Typography variant={'h4'} sx={{mb: 2}}>
                            Изображения:
                        </Typography>
                        { images }
                    </>
                }
            </>
        );
    };

    const rawIngs = recipe?.ingredients_flat || [];

    const ingredientsWithFixedUnits = rawIngs.map((ing) => {
        if (ing?.unit && ing.unit in UNIT_MAP) {
            return {
                ...ing,
                unit: UNIT_MAP[ing.unit]
            };
        } else if (!ing?.unit) {
            return {
                ...ing,
                unit: 'шт.'
            };
        }
        return ing;
    });

    if (isLoading) return <Loader />;

    return(
        <ErrorBoundary componentName={'Recipe'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }} className={styles.Post}>
                    <SingleEntryTitle title={recipe?.name || ''} isLoading={isLoading}/>
                    <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />
                    <IngredientsList ingredients={ ingredientsWithFixedUnits } isLoading={isLoading}/>
                    <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

                    { createInstructionsList(recipe) }
                </Box>
            </Container>
        </ErrorBoundary>
    );
};

export default Recipe;