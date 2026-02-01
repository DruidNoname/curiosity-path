'use client';

import React from "react";
import {Box, Typography} from "@mui/material";

const About: React.FC = () => {

    return(
        <Box sx={{px: '24px'}}>
            <Typography variant={'h3'} sx={{mt: '16px', mb: '24px'}}>
                Coffee.
            </Typography>
            <Typography variant={'h4'} sx={{mb: '24px'}}>
                Coding.
            </Typography>
            <Typography variant={'h5'}>
                Capoeira.
            </Typography>
        </Box>
    );
};

export default About;