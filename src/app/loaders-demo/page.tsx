'use client';

import React from "react";
import {Box, Typography} from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";
import Title from "@/components/Title";
import Atom from "@/ui/Loader/Atom";
import Bicycle from "@/ui/Loader/Bicycle";
import Crutches from "@/ui/Loader/Crutches";
import loaderStyles from "@/ui/Loader/style.module.css";

// Те же компоненты и стили, что в ui/Loader, — витрина показывает ровно то, что выпадает при загрузке
const LOADERS = [
    {name: 'Атом', Component: Atom},
    {name: 'Велосипед', Component: Bicycle},
    {name: 'Костыли', Component: Crutches},
];

const LoadersDemo: React.FC = () => (
    <ErrorBoundary componentName={'LoadersDemo'}>
        <Box sx={{px: '24px'}}>
            <Title title={'Три облика лоадера'} variant={'h2'} subtitle={'Пока грузится страница, выпадает один из них.'}/>
            <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px', mt: '32px', mb: '48px'}}>
                {LOADERS.map(({name, Component}) => (
                    <Box key={name} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
                        <Component className={loaderStyles.Image}/>
                        <Typography variant={'body1'}>{name}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    </ErrorBoundary>
);

export default LoadersDemo;
