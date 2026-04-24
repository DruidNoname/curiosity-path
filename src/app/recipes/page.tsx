'use client';

import React from "react";
import {Box, Typography} from "@mui/material";
import {useCourses, useKeywords} from "@/features/recipes/hooks";
import Loader from "@/ui/Loader";
import {Stack} from "@mui/system";
import Title from "../../components/Title";
import {CourseCard} from "@/app/recipes/components/CourseCard";


const Recipes: React.FC = () => {
    const { data, isLoading } = useCourses({hideEmpty: false});
    const categories = data || [];

    if (isLoading) return <Loader/>;

    return(
        <Box sx={{px: '24px'}}>
            <Title title={'Книга рецептов'} isLoading={isLoading}/>
            <Box sx={{ mb: '32px'}}>
                <p>
                    Справочник обкатанных рецептов на каждый день. Пополняется по мере появления фоточек/ресурса на размещение.
                </p>
                <p>
                    Наибольший интерес представляет работа с числами. Инструментарий позволяет "подбить" под количество одного из ингредиентов граммовку остального состава блюда. Или просто использовать один из предложенных множителей.
                </p>
                <p>
                    Больших красивых картинок нет. Зато все рецепты проверены временем.
                </p>
            </Box>
            <Typography
                variant="h4"
                component="h2"
                sx={{pb: '36px'}}> Категории: </Typography>
            <Stack
                direction="row"        // Элементы в ряд
                useFlexGap             // Обязательно! Позволяет Stack'у правильно обрабатывать gap при переносе
                spacing={3}            // Gap между элементами (2 = 16px)
                sx={{
                    flexWrap: 'wrap',    // Разрешаем перенос на новую строку
                    mb: '32px'
                }}
            >
                {categories.map(cat => {
                    const isContent = cat.count !== undefined && cat.count > 0;
                    if (!isContent) return null;
                    return (
                        <CourseCard key={cat.id} cat={cat}/>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default Recipes;