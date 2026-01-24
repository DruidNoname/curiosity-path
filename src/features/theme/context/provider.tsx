'use client'

import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeContext } from './context';
import { darkTheme, lightTheme } from '../index';
import { ThemeContextType } from "@/features/theme/model/types";

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Начинаем с темной темы (и сервер и клиент)
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    // Выбираем текущую тему
    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    const value = useMemo<ThemeContextType>(() => ({
        isDarkMode,
        toggleTheme,
    }), [isDarkMode, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={currentTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};