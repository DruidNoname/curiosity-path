'use client';

import React from 'react';
import {useRecipeBySlug} from "@/features/recipes/hooks";
import {Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography} from "@mui/material";
import styles from "./style.module.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Recipe as RecipeType} from "@/features/recipes/types";
import SingleEntryTitle from "../../../components/SingleEntry/SingleEntryTitle";
import {IngredientsList} from "@/app/recipes/[slug]/components/IngredientsList";
import Loader from "@/ui/Loader";
import {UNIT_MAP} from "@/features/recipes/const";
import MainNAsideLayout from "@/components/Layouts/MainNAsideLayout";
import RecipeCalculator from "@/app/recipes/[slug]/components/RecipeCalculator";
import RecipeInstructions from "@/app/recipes/[slug]/components/RecipeInstructions";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import RecipeIntro from "@/app/recipes/[slug]/components/RecipeIntro";
import RecipeTips from "@/app/recipes/[slug]/components/RecipeTips";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
    params: Promise<{ slug: string }>;
}
const Recipe: React.FC<Props> = ({ params }) =>  {
    const { slug } = React.use(params);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    const { data, isLoading } = useRecipeBySlug(slug);
    const recipe: RecipeType | undefined = data?.recipe;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleMultiplierChange = (newMultiplier: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('multiplier', newMultiplier.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const rawIngs = recipe?.ingredients_flat || [];
    const notes = recipe?.notes || null;

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
            <Box className={styles.recipeContainer}>
                <SingleEntryTitle title={recipe?.name || ''} isLoading={isLoading}/>
                <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />
                <MainNAsideLayout
                    mainContent={
                        <>
                            <RecipeIntro imageUrl={recipe?.image_url || ''} imageTitle={recipe?.name || 'Изображение блюда'} recipePreview={recipe?.summary || ''} />
                            {isMobile && <>
                                <IngredientsList ingredients={ ingredientsWithFixedUnits } isLoading={isLoading}/>
                                <Accordion sx={{mb: 2}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h5" sx={{ paddingBottom: 0 }}>
                                        Калькулятор расчёта ингредиентов
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <RecipeCalculator
                                            ingredients={ingredientsWithFixedUnits}
                                            setMultiplier={handleMultiplierChange}
                                            disabled={isLoading}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </>}
                            <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />
                            <RecipeInstructions recipe={recipe} />
                        </>
                    }
                    asideContent={
                        <>
                            {!isMobile &&
                                <>
                                    <IngredientsList ingredients={ ingredientsWithFixedUnits } isLoading={isLoading}/>
                                    <RecipeCalculator
                                        ingredients={ingredientsWithFixedUnits}
                                        setMultiplier={handleMultiplierChange}
                                        disabled={isLoading}
                                    />
                                </>
                            }
                            { notes && <RecipeTips notes={notes} /> }
                        </>
                    }
                    asideClassName={styles.layoutAside}
                />
            </Box>
        </ErrorBoundary>
    );
};

export default Recipe;