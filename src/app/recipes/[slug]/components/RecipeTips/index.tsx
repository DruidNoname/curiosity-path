'use client';

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTips } from '@/helpers/utils';

interface RecipeTipsProps {
    notes: string;
}

const RecipeTips: React.FC<RecipeTipsProps> = ({ notes }) => {
    // createTips использует getCleanEntry (sanitizeHtml + DOMParser) — мемоизируем по входу.
    const tipsHtml = React.useMemo(() => createTips(notes), [notes]);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4" sx={{ paddingBottom: 0 }}>Советы и&nbsp;хитрости</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography
                    variant="body1"
                    component="div"
                    dangerouslySetInnerHTML={{ __html: tipsHtml }}
                />
            </AccordionDetails>
        </Accordion>
    );
};

export default RecipeTips;
