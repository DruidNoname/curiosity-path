import React from "react";
import {Box, Button} from "@mui/material";

type Props = {
    setMultiplier: (value: number) => void;
    disabled: boolean;
}
export const RecipeCalcButtons: React.FC<Props> = ({setMultiplier, disabled}) => {

    return(
        <>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: '16px',  width: '100%', mb: 2}}>
                <Button sx={{ width: '30%'}} variant={'outlined'} disabled={disabled}  onClick={() => setMultiplier(2)}>x2</Button>
                <Button sx={{ width: '30%'}} variant={'outlined'} disabled={disabled}  onClick={() => setMultiplier(3)}>x3</Button>
                <Button sx={{ width: '30%'}} variant={'outlined'} disabled={disabled}  onClick={() => setMultiplier(0.5)}>x0.5</Button>
            </Box>
        </>
    );
};