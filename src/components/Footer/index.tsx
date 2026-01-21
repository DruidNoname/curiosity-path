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
            sx={{
                py: 2,
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    { copyright }
                </Typography>
            </Container>
        </Paper>
    )
};

export default Footer;
