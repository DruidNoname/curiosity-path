'use client';

import React from "react";
import {Typography} from "@mui/material";
import ErrorBoundary from "@/components/ErrorBoundary";

const TestSubject: React.FC = () => {

    return(
        <ErrorBoundary componentName={'TestSubject'}>
            <Typography variant={'h5'}>
                Территория самых бесчеловечных экспериментов.
            </Typography>
        </ErrorBoundary>
    );
};

export default TestSubject;