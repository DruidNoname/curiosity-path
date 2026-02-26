'use client';

import React from "react";
import {Box, Card, Link, Typography} from "@mui/material";
import {useCourses} from "@/features/recipes/hooks";
import Loader from "@/ui/Loader";
import {Stack} from "@mui/system";
import PageTitle from "@/components/SingleEntry/PageTitle";


const Recipes: React.FC = () => {
    const { data, isLoading } = useCourses({hideEmpty: false});

    const categories = data || [];

    if (isLoading) return <Loader/>;

    return(
        <Box sx={{px: '24px'}}>
            <PageTitle title={'Книга рецептов: категории'} isLoading={isLoading}/>
            <Stack
                direction="row"        // Элементы в ряд
                useFlexGap             // Обязательно! Позволяет Stack'у правильно обрабатывать gap при переносе
                spacing={2}            // Gap между элементами (2 = 16px)
                sx={{
                    flexWrap: 'wrap',    // Разрешаем перенос на новую строку
                }}
            >
                { categories.map(cat => {
                    const isContent = cat.count !== undefined && cat.count > 0;
                    return(
                        <Card key={cat.id} sx={{
                            width: {
                                xs: '100%',      // 1 колонка на мобилках
                                sm: 'calc(50% - 8px)', // 2 колонки (16px/2 = вычитаем 8px)
                                lg: 'calc(25% - 12px)' // 4 колонки (16px * 3/4 = вычитаем 12px)
                            },
                            padding: 2
                        }}>
                            { isContent ?
                                <Link
                                    href={`/recipes/categories/${cat.slug}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {`${cat.name} (${cat.count})`}
                                </Link>
                                :
                                <Typography variant={'body1'} color={'textDisabled'}>
                                    { cat.name } (0)
                                </Typography>
                            }
                        </Card>
                    );
                })
                }
            </Stack>
        </Box>
    );
};

export default Recipes;