'use client';

import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '../theme';
import { ThemeProviderProps } from '@/features/theme/model/types';

/**
 * Тема построена на нативных цветовых схемах MUI (см. theme.ts).
 *
 * - `defaultMode="system"` совпадает с `<InitColorSchemeScript defaultMode="system" />`
 *   в layout.tsx, поэтому начальная схема, выбранная блокирующим скриптом до отрисовки,
 *   совпадает с тем, что монтирует React → нет вспышки и нет рассинхронизации гидрации.
 * - Переключение схемы — через нативный хук `useColorScheme` (см. Header).
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
    <MuiThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        {children}
    </MuiThemeProvider>
);
