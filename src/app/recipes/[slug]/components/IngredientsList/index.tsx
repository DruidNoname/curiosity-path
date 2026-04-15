import React from "react";
import { useSearchParams } from 'next/navigation';
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Typography} from "@mui/material";
import {Ingredient} from "@/features/recipes/types";
import {convertFractions, processNumber} from "@/features/recipes/utils";

type Props = {
    ingredients: Ingredient[];
    isLoading: boolean;
};

export const IngredientsList: React.FC<Props> = ({ ingredients, isLoading }) => {
    const searchParams = useSearchParams();

    const multiplier = React.useMemo(() => {
        const urlMultiplier = searchParams.get('multiplier');
        return urlMultiplier ? parseFloat(urlMultiplier) : 1;
    }, [searchParams]);

    const ingredientItems = React.useMemo(() => {
        if (!ingredients) return [];

        return ingredients.map(ing => {
            const notesPart = ing.notes ? ` (${ing.notes})` : '';
            const amountUnitPart = [
                ing.amount !== undefined && ing.amount !== null ? (processNumber(convertFractions(ing.amount) * multiplier)) : '',
                ing.unit || ''
            ].filter(part => part !== '').join(' ');

            const ingredientText = `${ing.name || ''}${notesPart}${amountUnitPart ? ': ' + amountUnitPart : ''}`;

            return (
                <li key={ing.id || ing.uid}>
                    {ingredientText}
                </li>
            );
        });
    }, [ingredients, multiplier]);

    return(
        <ErrorBoundary componentName={'IngredientsList'}>
            <Box sx={{display: {lg: 'flex'}, justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start'}}>
                <div>
                    <Typography variant={'h4'}>
                        Ингредиенты:
                    </Typography>
                    <ul>
                        { ingredientItems }
                    </ul>
                </div>
            </Box>
        </ErrorBoundary>
    );
};