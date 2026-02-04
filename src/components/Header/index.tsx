import React from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {
    AppBar,
    Container,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import {useThemeContext} from "@/features/theme/context/context";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Menu from '../Nav';
import {TextSimilarLink} from '@/ui/Link';

type Props = {
    title: string
}

const Header: React.FC<Props> = ({ title }) => {
    const { mode, toggleTheme } = useThemeContext();

    return (
        <ErrorBoundary componentName={'Header'}>
            <AppBar position="static">
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <TextSimilarLink href="/">
                                {title}
                            </TextSimilarLink>
                        </Typography>
                        <Menu/>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
        </ErrorBoundary>
    );
};
export default Header;