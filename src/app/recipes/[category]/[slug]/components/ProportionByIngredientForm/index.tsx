import React from "react";
import styles from './style.module.css';
import {Ingredient} from "@/features/recipes/types";
import {Box, Button, Input, InputAdornment, Typography} from "@mui/material";
import Select from '@/ui/Select';

type Props = {
    ingredients: Ingredient[];
    setMultiplier: (value: number) => void
    setOpen: (value: false) => void;
};
export const ProportionByIngredientForm: React.FC<Props> = ({ingredients, setMultiplier, setOpen}) => {
    const options = React.useMemo(() =>
            ingredients?.map(ing => ({
                value: ing.id,
                label: ing.name,
                amount: ing.amount,
                unit: ing.unit,
            })) || [],
        [ingredients]
    );

    const [selected, setSelected] = React.useState<typeof options[0] | null>(
        options[0] || null
    );

    const [inputValue, setInputValue] = React.useState(
        selected ? selected.amount : ''
    );

    React.useEffect(() => {
        if (selected) {
            setInputValue(selected.amount);
        }
    }, [selected]);

    // Если нет опций, показываем заглушку
    if (!options.length) {
        return <Typography>Нет ингредиентов</Typography>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        // Здесь можно парсить значение и обновлять selected если нужно
    };

    const handleClick = () => {
        const initialAmount = selected?.amount as number;
        const result= +inputValue / initialAmount;
        setMultiplier(Number(result.toFixed(2)));
        setOpen(false);
    };


    return(
        <Box className={styles.Changer}>
            <Box sx={{display: { md: 'flex' }, justifyContent: 'space-between', gap: '16px',  width: '100%', mb: 2, alignItems: 'center'}}>

                <Select
                    className={styles.Select}
                    options={options || []}
                    value={selected}
                    onChange={(value) => setSelected(value)}
                />
                <Input
                    value={inputValue}
                    className={styles.Input}
                    onChange={handleInputChange}
                    endAdornment={
                        <InputAdornment component={'span'} position="end" sx={{ lineHeight: '24px', paddingBottom: '0'}}>
                            <Typography component="span" variant="body2">
                                {selected?.unit || ''}
                            </Typography>
                        </InputAdornment>
                    }
                />
            </Box>
            <Button variant={'contained'} fullWidth onClick={handleClick}>Пересчитать количество ингредиентов</Button>
        </Box>
    );
};
