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
            square
            variant="outlined"
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
