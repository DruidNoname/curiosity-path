'use client';

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WpHtml from '@/ui/WpHtml';

interface RecipeTipsProps {
    notes: string;
}

const RecipeTips: React.FC<RecipeTipsProps> = ({ notes }) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4" sx={{ paddingBottom: 0 }}>Советы и&nbsp;хитрости</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* Советы — шорткоды [wprm-tip]; разбор и очистку делает WpHtml (createTips). */}
                <WpHtml html={notes} prepare="tips" variant="body1" />
            </AccordionDetails>
        </Accordion>
    );
};

export default RecipeTips;
