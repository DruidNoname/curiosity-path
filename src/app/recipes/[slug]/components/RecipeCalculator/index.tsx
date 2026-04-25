import React from "react";
import { Button, Paper, Typography } from "@mui/material";
import { Ingredient } from "@/features/recipes/types";
import { RecipeCalcButtons } from "../RecipeCalcButtons";
import { ProportionByIngredientForm } from "../ProportionByIngredientForm";

interface RecipeCalculatorProps {
    ingredients: Ingredient[];
    setMultiplier: (value: number) => void;
    disabled: boolean;
}

const RecipeCalculator: React.FC<RecipeCalculatorProps> = ({ ingredients, setMultiplier, disabled }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Paper sx={{ mb: 3, padding: "16px", width: { lg: "400px" }}}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Изменить количество ингредиентов:
            </Typography>
            <RecipeCalcButtons setMultiplier={setMultiplier} disabled={disabled} />

            <Button
                sx={{ display: "block", width: "100%", mb: 3 }}
                variant="outlined"
                disabled={disabled}
                onClick={() => setOpen(!open)}
            >
                Пропорция по ингредиенту
            </Button>
            {open ? (
                <ProportionByIngredientForm
                    ingredients={ingredients || []}
                    setMultiplier={setMultiplier}
                    setOpen={setOpen}
                />
            ) : null}
        </Paper>
    );
};

export default RecipeCalculator;
