'use client';

import React from "react";
import {Link, Typography} from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";

const TestSubject: React.FC = () => {

    return(
        <ErrorBoundary componentName={'TestSubject'}>
            <Typography variant={'h4'} sx={{mt: '16px', mb: '24px'}}>
                Территория самых бесчеловечных экспериментов.
            </Typography>
            <Typography variant={'h5'} sx={{mb: '16px'}}>
                Join the <b>Dark Launching</b>.
            </Typography>
            <Typography variant={'body1'} sx={{mb: '32px'}}>
                Опасно. Бесплатно. Нелепо.
            </Typography>
            <Typography variant={'body1'} sx={{ mb: '32px'}}>
                Сейчас на столе: <Link href={'/breather'}><b>Бризер</b></Link> — дыхательный метроном: счёт на вдох и на выдох.
            </Typography>
        </ErrorBoundary>
    );
};

export default TestSubject;