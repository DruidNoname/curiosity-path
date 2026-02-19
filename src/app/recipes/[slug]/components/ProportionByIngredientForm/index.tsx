import React from "react";
import {Ingredient} from "@/features/recipes/types";
import {Box, Button, Input} from "@mui/material";
import Select from '@/ui/Select';

type Props = {
    ingredients: Ingredient[];
};
export const ProportionByIngredientForm: React.FC<Props> = ({ingredients}) => {

    return(
        <Box>
            <Select/>
            <Input/>
            <Button variant={'outlined'}>Пойдёт</Button>
        </Box>
    );
};
