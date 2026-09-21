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
                    <p>Метроном для дыхания: сигнал раз в&nbsp;секунду, высокий тон&nbsp;&mdash; вдох, низкий&nbsp;&mdash; выдох, сухой щелчок&nbsp;&mdash; пауза. Задайте, сколько счётов держать каждую фазу (скажем, 2&nbsp;на&nbsp;вдох и&nbsp;4&nbsp;на&nbsp;выдох), и&nbsp;запустите&nbsp;&mdash; дальше можно смотреть в&nbsp;потолок и&nbsp;не&nbsp;считать. Если нужен не&nbsp;бесконечный метроном, а&nbsp;занятие с&nbsp;началом и&nbsp;концом&nbsp;&mdash; задайте количество повторений, а&nbsp;под ним и&nbsp;подходы с&nbsp;отдыхом.</p>
                </Box>
                <Breather/>
            </Box>
        </ErrorBoundary>
    );
};

export default BreatherPage;
