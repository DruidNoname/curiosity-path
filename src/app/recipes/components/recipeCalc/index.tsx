import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Button} from "@mui/material";

// простой калькулятор
// значения будут обновлять глобал стейт
// или локалсторадж, каждый раз после смены рецепта перезаписываться
// нужна форма, где в селекте представлен ингредиент, по умолчанию первый,
// при выборе в окошко с кол-вом автоматически подставляется его кол-во по рецепту,
// после смены кол-ва и нажатия кнопки ок, вычисляется множитель,
// и все другие ингредиенты умножаются на него

export const RecipeCalc: React.FC = () => {
    return(
        <ErrorBoundary componentName={'RecipeCalc'}>
            <Box>
                <Button>x2</Button>
                <Button>x3</Button>
                <Button>x0.5</Button>
                <Button>Пропорция по ингредиенту</Button>
            </Box>
        </ErrorBoundary>
    );
};