import React from "react";
import {
    Container,
    Typography,
    Paper
} from '@mui/material';

type Props = {
    copyright: string
}

const Footer: React.FC<Props> = ({ copyright }) => {

    return(
        <Paper
            component="footer"
            variant={'contrast'}
            square
            // square снимает только класс скругления, а радиус Paper задан в теме напрямую.
            // Подвал прилегает к нижнему краю — скругляем только верх.
            sx={{
                py: 2,
                borderRadius: '8px 8px 0 0',
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    { copyright }
                </Typography>
            </Container>
        </Paper>
    );
};

export default Footer;
