import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Button} from "@mui/material";

type Props = {
    setMultiplier: (value: number) => void;
}
// простой калькулятор
// нужна форма, где в селекте представлен ингредиент, по умолчанию первый,
// при выборе в окошко с кол-вом автоматически подставляется его кол-во по рецепту,
// после смены кол-ва и нажатия кнопки ок, вычисляется множитель,
// и все другие ингредиенты умножаются на него

export const RecipeCalcButtons: React.FC<Props> = ({setMultiplier}) => {

    return(
        <Box sx={{ display: 'flex', gap: '16px', mb: 3 }}>
            <Button variant={'outlined'} onClick={() => setMultiplier(2)}>x2</Button>
            <Button variant={'outlined'} onClick={() => setMultiplier(3)}>x3</Button>
            <Button variant={'outlined'} onClick={() => setMultiplier(0.5)}>x0.5</Button>
            <Button variant={'outlined'}>Пропорция по ингредиенту</Button>
        </Box>
    );
};