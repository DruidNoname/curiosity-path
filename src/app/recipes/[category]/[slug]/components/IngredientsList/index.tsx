import React from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import ErrorBoundary from "@/components/ErrorBoundary";
import {RecipeCalcButtons} from "../RecipeCalcButtons";
import {Box, Button, Paper, Typography} from "@mui/material";
import {Ingredient} from "@/features/recipes/types";
import {ProportionByIngredientForm} from "@/app/recipes/[category]/[slug]/components/ProportionByIngredientForm";
import {processNumber} from "@/features/recipes/utils";

type Props = {
    ingredients: Ingredient[];
    isLoading: boolean;
};

export const IngredientsList: React.FC<Props> = ({ ingredients, isLoading }) => {
    const [open, setOpen] = React.useState(false);
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
                ing.amount !== undefined && ing.amount !== null ? (processNumber(ing.amount * multiplier)) : '',
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
            <Box sx={{display: {lg: 'flex'}, justifyContent: 'space-between', gap: '16px'}}>
                <div>
                    <Typography variant={'h4'} sx={{mb: 2}}>
                        Ингредиенты:
                    </Typography>
                    <ul>
                        { ingredientItems }
                    </ul>
                </div>
                <Paper sx={{ mb: 3, padding: '16px', width: {lg: '400px'}}}>
                    <Typography variant={'h5'} sx={{mb: 3}}>
                        Изменить количество ингредиентов:
                    </Typography>
                    <RecipeCalcButtons setMultiplier={handleMultiplierChange} disabled={isLoading}/>

                    <Button sx={{display: 'block', width: '100%', mb: 3 }} variant={'outlined'} disabled={isLoading} onClick={() => setOpen(!open)}>Пропорция по ингредиенту</Button>
                    { open ?
                        <ProportionByIngredientForm ingredients={ingredients || []} setMultiplier={handleMultiplierChange} setOpen={setOpen}/> :
                        null
                    }
                </Paper>
            </Box>
        </ErrorBoundary>
    );
};