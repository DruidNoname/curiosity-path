'use client';

import React from 'react';
import {useRecipeBySlug} from "@/features/recipes/hooks";
import {Box, Button, Container, Divider, Typography} from "@mui/material";
import styles from "@/app/[slug]/style.module.css";
import Skeleton from "@/ui/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorBoundary from "@/components/ErrorBoundary";

// import {useRouter} from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}
const Recipe: React.FC<Props> = ({ params }) => {
    const { slug } = React.use(params);
    const { data, isLoading, isError, error } =  useRecipeBySlug(slug);
    const recipe = data?.recipe;
    console.log(recipe);

    const ingredientList = recipe.ingredients_flat?.map(ing => {
        // Проверяем, что ing - это объект
        if (!ing || typeof ing !== 'object') return null;

        // Формируем строку с примечанием в скобках, если оно есть
        const notesPart = ing.notes ? ` (${ing.notes})` : '';

        // Формируем строку с количеством и единицей измерения, если они есть
        const amountUnitPart = [ing.amount, ing.unit].filter(Boolean).join(' ');

        // Собираем все части в одну строку
        const ingredientText = `${ing.name || ''}${notesPart}${amountUnitPart ? ': ' + amountUnitPart : ''}`;

        // Возвращаем элемент списка. Используем комбинацию id и uid для ключа.
        return (
            <li key={`${ing.id || ''}_${ing.uid || ''}`}>
                {ingredientText}
            </li>
        );
// Фильтруем null значения на случай, если какой-то элемент массива был некорректным
    })?.filter(item => item !== null) || [];


    const createInstructionsList = (recipeData) => {
        // 1. Достаем массив инструкций из данных рецепта
        //    Проверяем все уровни вложенности, чтобы избежать ошибок
        const instructionsFlat = recipeData?.instructions_flat || [];

        // 2. Если массив пуст, возвращаем пустой массив или сообщение
        if (instructionsFlat.length === 0) {
            return []; // Или можно вернуть [<Box key="no-instructions">Нет инструкций</Box>]
        }

        // 3. Преобразуем каждый объект инструкции в компонент Box
        return instructionsFlat.map((step) => {
            // Для ключа используем uid, так как он уникален для каждой инструкции
            return (
                <Box key={step.uid}>
                    {/* Отрисовываем HTML-текст инструкции как есть */}
                    <div dangerouslySetInnerHTML={{ __html: step.text || '' }} />
                </Box>
            );
        });
    };

    return(
        <ErrorBoundary componentName={'Post'}>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 2 }} className={styles.Post}>
                    <Box className={styles.TitleBlock}>
                        <Box sx={{ typography: 'body1' }}>
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 1
                                }}
                            >
                                { isLoading ? <Skeleton width={320}/> : recipe?.name }
                            </Typography>
                        </Box>
                        {/*<Button*/}
                        {/*    className={styles.BackButton}*/}
                        {/*    startIcon={<ArrowBackIcon />}*/}
                        {/*    onClick={handleGoBack}*/}
                        {/*    variant="outlined"*/}
                        {/*>*/}
                        {/*    Назад*/}
                        {/*</Button>*/}
                    </Box>
                    <Divider sx={{ marginTop: '32px', marginBottom: '32px',  }} />

                    <Box sx={{ typography: 'body1' }}>
                        { isLoading ?
                            <>
                                <Skeleton width={200}/><br/>
                                <Skeleton width={350}/><br/>
                                <Skeleton width={200}/><br/>
                            </>
                            :
                            <>
                                <Typography
                                    variant="body1"
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: recipe?.summary }}
                                />
                                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                                <Typography variant={'h5'} sx={{mb: 2}}>
                                    Ингредиенты:
                                </Typography>
                                <ul>
                                    { ingredientList }
                                </ul>

                                <Typography variant={'h5'} sx={{mb: 2}}>
                                    Приготовление:
                                </Typography>
                                { createInstructionsList(recipe) }
                            </>
                        }
                    </Box>
                </Box>
            </Container>
        </ErrorBoundary>
    );
};

export default Recipe;