import React from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {
    AppBar,
    Container,
    IconButton,
    Link,
    Toolbar,
    Typography,
} from '@mui/material';
import {useThemeContext} from "@/features/theme/context/context";
import { Brightness4, Brightness7 } from '@mui/icons-material'



type Props = {
    title: string
}

const Header: React.FC<Props> = ({ title }) => {
    const { isDarkMode, toggleTheme } = useThemeContext();

    return (
        <ErrorBoundary componentName={'Header'}>
            <AppBar position="static">
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link href="/" underline="none" >  {/* или без underline */}
                                {title}
                            </Link>
                        </Typography>
                        <IconButton onClick={toggleTheme} color="inherit">
                            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
        </ErrorBoundary>
    );
};
export default Header;