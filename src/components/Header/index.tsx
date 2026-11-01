'use client';

import React from 'react';
import ErrorBoundary from "@/components/ErrorBoundary";
import {
    AppBar,
    Container,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Menu from '../Nav';
import {TextSimilarLink} from '@/ui/Link';
import {useIsClient} from '@/helpers/useIsClient';

type Props = {
    title: string
}

const Header: React.FC<Props> = ({ title }) => {
    const { mode, systemMode, setMode } = useColorScheme();

    // До монтирования cхема ещё неизвестна на клиенте — рендерим детерминированный
    // вариант, чтобы не вызвать рассинхронизацию гидрации (саму тему задаёт
    // InitColorSchemeScript до отрисовки, так что визуальной вспышки нет).
    const mounted = useIsClient();

    const resolvedMode = mode === 'system' ? systemMode : mode;
    const isDark = mounted && resolvedMode === 'dark';

    const toggleTheme = () => setMode(isDark ? 'light' : 'dark');

    return (
        <ErrorBoundary componentName={'Header'}>
            {/* AppBar — это Paper, а теме Paper задан радиус со всех сторон; шапка прилегает
                к верхнему краю окна, поэтому скругляем только низ. */}
            <AppBar position="static" sx={{ borderRadius: '0 0 8px 8px' }}>
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <TextSimilarLink href="/">
                                {title}
                            </TextSimilarLink>
                        </Typography>
                        <Menu/>
                        <IconButton onClick={toggleTheme} color="inherit" suppressHydrationWarning>
                            {isDark ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
        </ErrorBoundary>
    );
};
export default Header;