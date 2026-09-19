'use client';

import React from "react";
import {Box} from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";
import Title from "@/components/Title";
import Breather from "./components/Breather";

const BreatherPage: React.FC = () => {
    return (
        <ErrorBoundary componentName={'BreatherPage'}>
            <Box sx={{px: '24px'}}>
                <Title
                    title={'Бризер'}
                    variant={'h2'}
                    subtitle={'Счёт на вдох, выдох и паузы'}
                />
                <Box sx={{mb: '24px'}}>
                    <p>Метроном для дыхания: сигнал раз в&nbsp;секунду, высокий&nbsp;&mdash; вдох, низкий&nbsp;&mdash; выдох, тихий средний&nbsp;&mdash; пауза. Задайте, сколько счётов держать каждую фазу (скажем, 2&nbsp;на&nbsp;вдох и&nbsp;4&nbsp;на&nbsp;выдох), и&nbsp;запустите&nbsp;&mdash; дальше можно смотреть в&nbsp;потолок и&nbsp;не&nbsp;считать.</p>
                </Box>
                <Breather/>
            </Box>
        </ErrorBoundary>
    );
};

export default BreatherPage;
