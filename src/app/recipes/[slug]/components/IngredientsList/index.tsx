import React from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import ErrorBoundary from "@/components/ErrorBoundary";
import {RecipeCalcButtons} from "../RecipeCalcButtons";
import {Typography} from "@mui/material";
import {Ingredient} from "@/features/recipes/types";
import {ProportionByIngredientForm} from "@/app/recipes/[slug]/components/ProportionByIngredientForm";

type Props = {
    ingredients: Ingredient[];
};

export const IngredientsList: React.FC<Props> = ({ ingredients }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const multiplier = React.useMemo(() => {
        const urlMultiplier = searchParams.get('multiplier');
        return urlMultiplier ? parseFloat(urlMultiplier) : 1;
    }, [searchParams]);

    const handleMultiplierChange = (newMultiplier: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('multiplier', newMultiplier.toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const ingredientItems = React.useMemo(() => {
        if (!ingredients) return [];

        return ingredients.map(ing => {
            const notesPart = ing.notes ? ` (${ing.notes})` : '';
            const amountUnitPart = [
                ing.amount !== undefined && ing.amount !== null ? (ing.amount * multiplier) : '',
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
            <RecipeCalcButtons setMultiplier={handleMultiplierChange}/>
            <Typography variant={'h5'} sx={{mb: 2}}>
                Ингредиенты:
            </Typography>
            <ul>
                { ingredientItems }
            </ul>
            <ProportionByIngredientForm ingredients={ingredients}/>
        </ErrorBoundary>
    );
};